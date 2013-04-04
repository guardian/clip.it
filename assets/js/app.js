requirejs.config({
    baseUrl: 'http://localhost:8000/',
    paths: {
        'guardian_idToolkit': 'https://id.guardian.co.uk/static/180/cs/js/guardian.identity.clientside-toolkit',
        'jquery': '//pasteup.guim.co.uk/js/lib/jquery/1.8.1/jquery.min',
        'clip.it': 'assets/js/lib/clip.it.v0',
        'ichbin': 'assets/js/lib/ichbin',
        'overlay': 'assets/js/lib/overlay'
    }
});

requirejs([
    'jquery',
    'clip.it'
], function($, clip) {
	var author = $('[rel="author"]');

	clip.config({
		container: '#article-wrapper'
	});

	clip.values({
		authorName: author.text(),
		authorUrl: author.attr('href'),
		contentTitle: $('[itemprop*="headline"]').text(),
		contentUrl: $('#printlink').attr('href').replace('/print', '')
	});

    // Only show clip.it if comments are open, eventually this will only apply to comment action
    $(function() {
        var discussion_id = $('#d2-root').attr('data-discussion-id'),
            discussion_url = 'http://localhost:8900/discussion/' + discussion_id;

        $.ajax({
            'url': discussion_url,
            'timeout': 10000,
            'dataType': 'jsonp',
            'type': 'GET',
            'context': this,
            'success': function(res) {
                var error = (res.status === 'error') ? res.errorCode : null;
                if (!error) {
                    var comments_closed = res.discussion.isClosedForComments;
                    if (!comments_closed) {
                        clip.it();
                    }
                }
            }
        });
    });
});
