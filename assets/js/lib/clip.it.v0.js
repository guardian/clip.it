define([
    'jquery',
    'guardian_idToolkit',
    'ichbin',
    'require'
    ], function($, ID, ichbin, req) {
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
        defaultData: {},
        create: function() {
            // TODO: move to some form of templating
            this.el = $('<div class="clipit-popout">' +
                            '<div class="clipit-arrow-left"></div>' +
                            '<div class="clipit-menu">' +
                                '<div class="clipit-header">Clip.it</div>' +
                                '<div class="clipit-actions">' +
                                    '<div class="clipit-action" role="button" data-clipit-action="comment">Comment</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>');

            this.el.appendTo('body');
            $('[data-clipit-action]', this.el).on('mousedown', $.proxy(this.showAction, this));
        },

        hide: function() {
            if (this.el) {
                this.el.hide();
            };
        },

        show: function(options) {
            if (!this.el) {
                this.create();
            }
            this.clip = options.clip;
            this.el.css(options.position).show();
        },

        showAction: function(e) {
            e.stopPropagation();
            var action = e.currentTarget.getAttribute('data-clipit-action'),
                templateHTML = this.template(this.actions[action].template);

            this.actions[action].func(templateHTML);
        },

        actions: {
            comment: {
                func: function(template) {
                    if (ID.isLoggedIn()) {
                        var commentPreview = $('#discussion-preview-comment'),
                            commentBody = $('#comment-body'),
                            overlayDelay = 400;

                        commentBody.val(template);
                        commentPreview.trigger('mousedown').click();
                        setTimeout(function() {
                            commentBody.focus();
                            commentBody.val(template);
                        }, overlayDelay);
                    }
                    else {
                        ID.showLoginIfNotLoggedIn();
                    }
                    hidePopout();
                },
                template: '<blockquote>{{ content }}</blockquote>\n\n'
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
        $(window).bind('mousedown', hidePopout);
        clipping = true;
    }

    function stopClipping() {
        el = $(config.container).attr('data-clipping-it', false);
        el.unbind('mouseup', checkSelection);
        $(window).unbind('mousedown', hidePopout);
        hidePopout();
        clipping = false;
    }

    function checkSelection(e) {
        var selection = getSelectionObject(),
            inScope = isRangeInScope(selection.range);

        // Trim whitespace
        selection.text = selection && selection.text.replace(/^\s+|\s+$/g, '');

        if (selection.text && inScope) {
            showPopout(selection.text, e.pageX + 10, e.pageY - 20);
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
            if (!selection.isCollapsed) {
                return selection.getRangeAt(0);
            }
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

    function isRangeInScope(range) {
        if (!range) return;

        var startNode = $(range.startContainer.parentNode),
            endNode = $(range.endContainer.parentNode);

        return el.has(startNode).length && el.has(endNode).length;
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
        var selection = getSelectionObject();
        if (selection && isRangeInScope(selection.range)) {
            clearSelection();
        }

        currentClip.content = '';
        popout.hide();
    }

    function save() {
        // ichbin.save('clip.it', currentClip);
    }

    function insertCSS() {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = req.toUrl('./assets/css/') + 'clip.it.css';
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
