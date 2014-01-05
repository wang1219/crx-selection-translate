/**
 * popup.js 在浏览器按钮弹出页里运行的脚本，依赖 com.js
 */

var _gaq = _gaq || [];
_gaq.push( ['_setAccount', 'UA-43276752-1'] );
_gaq.push( ['_trackPageview'] );

(function ( $ ) {
    "use strict";
    var doc = document,

        c = $.inherit( $.Controller , {
            ui : ['from', 'to', 'tran', 'query', 'tip', 'result'] ,
            init : function () {

                // 保存所有的 ui 节点
                this.ui.forEach( function ( v ) {
                    this[v] = doc.getElementById( v );
                } , this );

                // 保存目标语言的所有 options 节点
                this.toOptions = this.to.options;

                // 删除不必要的属性
                delete this.ui;
                delete this.init;
                return this;
            }
        }.init() ),

        v = $.inherit( $.View , {

            /**
             * 弹出页中只有一个 show 方法，
             * 因为模板已经在页面上写好了
             * @param obj
             * @param api
             * @returns {v}
             */
            show : function ( obj , api ) {
                var s = '<dt class="word">' + obj.query + '</dt>';
                if ( obj.error ) {
                    s += '<dt>出错啦！</dt><dd>' + api.errorMsg[ obj.error] + '</dd>';
                } else {

                    // 详细释义
                    if ( obj.detailed ) {
                        s += '<dt>详细释义</dt>';
                        obj.detailed.forEach( function ( v ) {
                            s += '<dd>' + v + '</dd>';
                        } );
                    }

                    // 翻译结果
                    if ( obj.result ) {
                        s += '<dt>翻译结果</dt><dd>' + obj.result + '</dd>';
                    }

                    // 相关内容暂不考虑

                    // 链接
                    s += '<dd class="via"><span class="play">阅读</span><a target="_blank" href="' + api.viaLink.replace( '{{query}}' , obj.query ).replace( '{{from}}' , obj.from ).replace( '{{to}}' , obj.to ) + '">via ' + api.viaName + '</a></dd>';
                }
                c.result.innerHTML = s;
                //                c.result.style.display = 'block';
                return this;
            }
        } );

    // 回车快捷键
    doc.addEventListener( 'keydown' , function ( e ) {
        if ( e.keyCode === 13 && e.ctrlKey ) {
            c.tran.click();
        }
    } );

    // 点击按钮时翻译
    c.tran.addEventListener( 'click' , function () {
        var word = c.query.value.trim(), from, to;
        if ( word ) {
            from = c.from.value;
            to = c.to.value;
            //            c.tip.style.display = 'block';

            // 如果源语言是英文且目标语言设为了中文，就使用有道翻译
            // 否则使用百度的多语言来翻译
            if ( from === 'en' && to === 'zh' ) {
                $.yd.query( word );
            } else {
                $.bd.query( word , {
                    from : from ,
                    to : to
                } );
            }
        }
    } );

    c.result.addEventListener( 'click' , function ( e ) {
        var t = e.target;
        if ( t.className === 'play' ) {
            $.play( c.query.value , c.from.value );
        }
    } );

    // 注册查询事件
    $.sub( 'query' , v.show.bind( v ) ).i18nForHtml();

    // 选择语言事件
    c.from.addEventListener( 'change' , function ( e ) {
        var to = this.selectedOptions[0].dataset.to,
            options = c.toOptions,

        // 跳过“自动选择”选项
            o = Array.prototype.slice.call( options ),
            ct = c.to;

        if ( to ) {
            to = to.split( ',' );
            o.forEach( function ( v ) {
                v.disabled = to.indexOf( v.value ) < 0;
            } );
        } else {
            o.forEach( function ( v ) {
                v.disabled = false;
            } );
        }

        // 如果目标语言不在可选列表内
        if ( to.indexOf( ct.value ) < 0 ) {

            // 选中第一个开启的选项
            ct.querySelector( ':enabled' ).selected = true;
        }
    } );

    // 捐赠
    doc.getElementsByTagName( 'footer' )[0].addEventListener( 'click' , function () {
        chrome.tabs.create( { url : "https://me.alipay.com/lmk123" } );
    } );
}( $ ) );
