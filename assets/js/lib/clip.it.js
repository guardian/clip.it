define(['jquery', 'guardian_idToolkit', 'ichbin'], function($, ID, ichbin) {
  var el
    , clippableElements
    , popout
    , highlightClassname = 'ci-highlight'
    , defaultData = {}
    , currentClip = {}
    , config = {
        container: 'body',
        allowedElements: 'p'
      }
    , clipping = false;

  // popout
  popout = {
    el: null,
    actionEl: null,
    defaultData: {},
    data: {},
    create: function() {
      // TODO: move to some form of templating
      this.el = $('<div class="clipit-popout">'+
        '<div class="clipit-arrow-left"></div>'+
        '<div class="clipit-menu">'+
          '<div class="clipit-header">Clip.it</div>'+
          '<div class="clipit-actions">'+
            '<div class="clipit-action" role="button" data-clipit-action="embed">Embed</div>'+
            '<div class="clipit-action" role="button" data-clipit-action="comment">Comment</div>'+
            '<div class="clipit-action" role="button" data-clipit-action="share-facebook">Facebook</div>'+
            '<div class="clipit-action" role="button" data-clipit-action="share-twitter">Twitter</div>'+
          '</div>'+
          '<div class="clipit-footer">'+ 
            '<div class="clipit-save">Save</div>'+
          '</div>'+
        '</div>'+
        '<div class="clipit-action-container"></div>'+
      '</div>');
      
      this.el.appendTo('body');
      this.actionEl = $('.clipit-action-container', this.el);
      $('[data-clipit-action]', this.el).on('click', $.proxy(this.showAction, this));
      $('.clipit-save', this.el).on('click', save);
    },

    show: function(options) {
      if (!this.el) { this.create(); }
      this.clip = options.clip;
      this.el.css(options.position).show();
    },

    showAction: function(e) {
      var action = e.currentTarget.getAttribute('data-clipit-action')
        , templateHtml = this.template(this.actions[action].template);
        
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
      var contentBit, bit
        , data = $.extend(this.defaultData, this.clip);
      
      for (bit in data) {
        contentBit = data[bit];
        content = content.replace('{{ ' + bit + ' }}', contentBit);
      }
      return content;
    }
  }

  function init() {
    insertCSS();
    ichbin.get('clip.it');
    
    $.fn.extend({
      getSelector: function(path) {
        if (typeof path == 'undefined') path = '';
        if (this.is('html')) { return 'html' + path; }

        var cur = this.get(0).nodeName.toLowerCase()
          , id= this.attr('id')
          , className = this.attr('class');

        if (typeof id != 'undefined') { cur += '#' + id; }
        if (typeof className != 'undefined') { cur += '.' + className.split(/[\s\n]+/).join('.'); }

        return this.parent().getSelector(' > ' + cur + path);
      }
    });
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
    clippableElements = $(config.allowedElements, el);
    clippableElements.on('mouseover', highlight);
    clippableElements.on('mouseout', unhighlight);
    clippableElements.on('click', showClipDialogue);
  }

  function stopClipping() {
    el = $(config.container).attr('data-clipping-it', false);
    clippableElements.unbind();
  }

  function highlight(e) {
    $(e.currentTarget).addClass(highlightClassname);
  }

  function unhighlight(e) {
    var elem = $(e.currentTarget);
    if (elem.attr('data-being-clipped') !== 'true') {
      elem.removeClass(highlightClassname);
    }
  }

  function showClipDialogue(e) {
    var elem = $(e.currentTarget);
    $('[data-being-clipped]', el).removeAttr('data-being-clipped').removeClass(highlightClassname);
    elem.attr('data-being-clipped', 'true');

    currentClip.content = elem.html();
    currentClip.selector = elem.getSelector();

    popout.show({
      position: { top: e.pageY-17, left: e.pageX+17 },
      clip: currentClip
    }); 
  }

  function save() {
    ichbin.save('clip.it', currentClip);
  }

  // helpers
  function insertCSS() {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = '/assets/css/clip.it.css';
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  // TODO - review if this is good
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
