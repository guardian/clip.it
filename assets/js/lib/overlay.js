define([
    'jquery'
    ], function($) {

    var overlay = (function() {
        var visible = false,
            options = {
                animate: true,
                animationTime: 200,
                ajaxTimeout: 2000,
                height: '380px',
                width: '640px'
            },
            isLtIE9 = (function()
            {
                var div = document.createElement('div');
                div.innerHTML = '<!--[if lt IE 9]><i></i><![endif]-->';
                return (div.getElementsByTagName('i').length === 1);
            }()),
            blackout, overlay, jQ;

        var closeOverlayCallback = function(e) {
            if (27 === e.keyCode) { close(); }
        };

        /**
         * Close the overlay and remove any contents.
         */
        var close = function() {
            if (visible) {
                if (options.animate) {
                    blackout.fadeOut(options.animationTime);
                    overlay.fadeOut(options.animationTime, function() {
                        jQ(this).find('.identity-overlay-inner').empty();
                    });
                }
                else {
                    blackout.hide();
                    overlay.hide().empty();
                }

                jQ(window).unbind("keyup", closeOverlayCallback);
                jQ(window).trigger('identity.overlay.closed');
            }
            visible = false;
        };

        /**
         * Show the identity login overlay
         */
        var open = function(returnUrl, targetHref) {
            returnUrl = encodeURIComponent(returnUrl || document.location.href);
            overlay.find('.identity-overlay-inner').html('<iframe height="100%" width="100%" src="' + targetHref + '"></iframe>');
            showOverlay();
        };

        /**
         * Open inline html content
         */
        var openInline = function(selector) {
        	var html = $(selector)[0].outerHTML;
            overlay.find('.identity-overlay-inner').html(html);
            showOverlay();
        };

        /**
         * Show overlay and content
         */
        var showOverlay = function() {
            if (options.animate) {
                blackout.fadeIn(options.animationTime);
                overlay.fadeIn(options.animationTime);
            }
            else {
                blackout.show();
                overlay.show();
            }
            overlay.css({ 'margin-left': -(overlay.width() / 2) });

            jQ(window).bind("keyup", closeOverlayCallback);
            jQ(window).trigger('identity.overlay.launched');
            visible = true;
        };

        /**
         * Creates the unpopulated overlay elements in the DOM ready for use.
         */
        var createOverlay = function() {
            if (!blackout) {
                blackout = jQ('<div class="identity-overlay-blackout" />')
                        .attr('tabindex', -1)
                        .click(close);
                if(isLtIE9) {
                    blackout.addClass("lt-ie9");
                }
                jQ('body').prepend(blackout);
            }

            if (!overlay) {
                overlay = jQ('<div class="identity-overlay" />');

                var closeElem = jQ('<span class="identity-overlay-close">Close</span>')
                        .click(close);

                overlay
                        .append(closeElem)
                        .append('<div class="identity-overlay-inner" />')
                        .height(options.height)
                        .width(options.width)
                        .appendTo(jQ('body'));
            }

            jQ(window).trigger('identity.overlay.created');
        };

        /**
         * Set up the dom framework
         */
        var init = function(domFramework){
            if (domFramework === undefined) {
                // check for supported DOM frameworks
                if (typeof window.jQuery === "function") {
                    jQ = jQuery;
                } else if (typeof window.Zepto === "function") {
                    (function(zepto){
                        zepto.extend(zepto.fn, {
                            fadeIn: function(duration, complete){
                                complete = complete || empty;
                                this.css({"opacity": 0}).show();
                                return this.animate({'opacity': 1}, duration, complete);
                            },
                            fadeOut: function(duration, complete){
                                complete = complete || empty;
                                return this.animate({'opacity': 0}, duration, function(){
                                    this.hide();
                                    complete.apply(this, arguments);
                                });
                            }
                        });
                    }(window.Zepto));
                    jQ = window.Zepto;
                } else {
                    throw new Error("No DOM framework detected");
                }
            } else {
                jQ = domFramework;
            }
                jQ('<style>.identity-overlay-blackout {\n    background-color: rgba(0,0,0,.6);\n    cursor: pointer;\n    display: none;\n    position: fixed;\n    top: 0; right: 0; bottom: 0; left: 0;\n    z-index: 2001;\n}\n\n.identity-overlay {\n    background-color: #fff;\n    -webkit-box-shadow: 0 0 20px rgba(0,0,0,.5);\n    -moz-box-shadow: 0 0 20px rgba(0,0,0,.5);\n    box-shadow: 0 0 20px rgba(0,0,0,.5);\n    display: none;\n    overflow: hidden;\n    position: fixed;\n    left: 50%; top: 100px;\n    z-index: 2002;\n}\n\n.identity-overlay-inner {\n    height: 100%;\n}\n\n.identity-overlay-close {\n    background: transparent url(http:\/\/id.gulocal.co.uk\/static\/DEV\/cs\/images\/close.png) top left no-repeat;\n    cursor: pointer;\n    display: block;\n    height: 32px;\n    overflow: hidden;\n    position: absolute;\n    top: 0; right: 16px;\n    text-indent: 100%;\n    white-space: nowrap;\n    width: 32px;\n}\n\n.identity-overlay iframe {\n    border: 0;\n}\n\n.identity-overlay-blackout.lt-ie9 {\n    background: transparent;\n    -ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000,endColorstr=#99000000)\";\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000,endColorstr=#99000000);\n    zoom: 1;\n}</style>').appendTo('head');
            createOverlay();
        };

        return {
            init: init,
            open: function(returnUrl, targetHref){
                init();
                open(returnUrl, targetHref);
            },
            openInline: function(selector){
                init();
                openInline(selector);
            },
            close: function(){
                init();
                close();
            }
        };
    }());

    return overlay
});
