define([
    'jquery',
    'guardian_idToolkit',
    'ichbin'
    ], function($, ID, ichbin) {
        var el,
            popout,
            defaultData = {},
            currentClip = {},
            config = {
                container: 'body'
            },
            clipping = false;

    // popout
    popout = {
        el: null,
        actionEl: null,
        defaultData: {},
        data: {},
        create: function() {
            // TODO: move to some form of templating
            this.el = $('<div class="clipit-popout">' +
                            '<div class="clipit-arrow-left"></div>' +
                            '<div class="clipit-menu">' +
                                '<div class="clipit-header">Clip.it</div>' +
                                '<div class="clipit-actions">' +
                                    '<div class="clipit-action" role="button" data-clipit-action="embed">Embed</div>' +
                                    '<div class="clipit-action" role="button" data-clipit-action="comment">Comment</div>' +
                                    '<div class="clipit-action" role="button" data-clipit-action="share-facebook">Facebook</div>' +
                                    '<div class="clipit-action" role="button" data-clipit-action="share-twitter">Twitter</div>' +
                                '</div>' +
                                '<div class="clipit-footer">' +
                                    '<div class="clipit-save">Save</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="clipit-action-container"></div>' +
                        '</div>');

            this.el.appendTo('body');
            this.actionEl = $('.clipit-action-container', this.el);
            $('[data-clipit-action]', this.el).on('click', $.proxy(this.showAction, this));
            $('.clipit-save', this.el).on('click', save);
        },

        clean: function() {
            if (this.el) {
                this.actionEl.empty().hide();
            };
        },

        hide: function() {
            if (this.el) {
                this.el.hide();
            };
        },

        show: function(options) {
            if (!this.el) {
                this.create();
            } else {
                this.clean();
            }
            this.clip = options.clip;
            this.el.css(options.position).show();
        },

        showAction: function(e) {
            var action = e.currentTarget.getAttribute('data-clipit-action'),
                templateHtml = this.template(this.actions[action].template);

            this.actionEl.empty().append(templateHtml);
            this.actionEl.show();
            this.actions[action].func();
        },

        actions: {
            embed: {
                func: function() {
                    $('.clipit-embed-data').select();
                },
                template:
                '<p>Add this clip to your website by copying the code below.</p>'+
                '<textarea class="clipit-embed-data">'+
                    '<blockquote class="clipit-embed">'+
                        '{{ content }}'+
                    '<footer>- <a href="{{ authorUrl }}">{{ authorName }}</a> on <cite><a href="{{ contentUrl }}">{{ contentTitle }}</a></footer>'+
                    '</blockquote>'+
                '</textarea>'
            },

            comment: {
                func: function() {
                    $('.clipit-post-comment-box').focus();
                },
                template:
                '<p>Post your comment below.</p>'+
                '<blockquote class="clipit-comment-quote">{{ content }}</blockquote>'+
                    '<textarea class="clipit-post-comment-box"></textarea>'+
                '<button class="clipit-post-comment">Post it</button>'
            }
        },

        template: function(content) {
            var contentBit,
                bit,
                data = $.extend(this.defaultData, this.clip);

            for (bit in data) {
                contentBit = data[bit];
                content = content.replace('{{ ' + bit + ' }}', contentBit);
            }
            return content;
        }
    }

    function init() {
        insertCSS();
        // ichbin.get('clip.it');
    }

    function values(data) {
        currentClip = $.extend(defaultData, data);
        popout.defaultData = currentClip;
    }

    function setConfig(options) {
        config = $.extend(config, options);
    }

    function toggle() {
        if (clipping === true) {
            stopClipping();
        } else {
            startClipping();
        }
    }

    function startClipping() {
        el = $(config.container).attr('data-clipping-it', true);
        el.bind('mouseup', checkSelection);
        $('body').bind('mousedown', hidePopout);
        clipping = true;
    }

    function stopClipping() {
        el = $(config.container).attr('data-clipping-it', false);
        el.unbind('mouseup', checkSelection);
        $('body').unbind('mousedown', hidePopout);
        hidePopout();
        clipping = false;
    }

    function checkSelection(e) {
        var selection = getSelectionObject(),
            startNode = $(selection.range.startContainer.parentNode),
            endNode = $(selection.range.endContainer.parentNode),

            // Check range stars and ends within element
            inElem = el.has(startNode).length && el.has(endNode).length;

        // Trim whitespace
        selection.text = selection && selection.text.replace(/^\s+|\s+$/g,'');

        if (selection.text && inElem) {
            showPopout(selection.text, e.pageX + 10, e.pageY - 20);
        } else {
            hidePopout();
        }
    }

    function getSelectionObject() {
        var obj = {};
        if (window.getSelection) {
            obj.selection = window.getSelection();
        }
        else if (document.getSelection) {
            obj.selection = document.getSelection();
        }
        else {
            obj.selection = document.selection;
            obj.range = obj.selection.createRange();
            obj.text = obj.range.text;
        }
        if (!obj.text) obj.text = obj.selection.toString();
        if (!obj.range) obj.range = getRangeObject(obj.selection);
        return obj;
    }

    function getRangeObject(selection) {
        if (selection.getRangeAt) {
            return selection.getRangeAt(0);
        }
        else {
            var range = document.createRange();
            range.setStart(selection.anchorNode, selection.anchorOffset);
            range.setEnd(selection.focusNode, selection.focusOffset);
            return range;
        }
    }

    function clearSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) {
                window.getSelection().empty();
            }
            else if (window.getSelection().removeAllRanges) {
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {
            document.selection.empty();
        }
    }

    function showPopout(selection, x, y) {
        if (currentClip.content != selection) {
            currentClip.content = selection;

            // Position based on range not event
            popout.show({
                position: { top: y, left: x },
                clip: currentClip
            });
        }
    }

    function hidePopout(e) {
        // clearSelection();
        popout.clean();
        popout.hide();
    }

    function save() {
        // ichbin.save('clip.it', currentClip);
    }

    function insertCSS() {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = '/assets/css/clip.it.css';
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    init();

    return {
        it: startClipping,
        stop: stopClipping,
        toggle: toggle,
        values: values,
        config: setConfig,

        // TODO
        widget: {
            bits: function(el) {},
            embed: function() {}
        }
    }
});
