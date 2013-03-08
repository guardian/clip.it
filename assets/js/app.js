requirejs.config({
    paths: {
        'guardian_idToolkit': 'https://id.guardian.co.uk/static/180/cs/js/guardian.identity.clientside-toolkit',
        'jquery': '//pasteup.guim.co.uk/js/lib/jquery/1.8.1/jquery.min',
        'clip.it': 'lib/clip.it',
        'ichbin': 'lib/ichbin'
    }
});

requirejs(['jquery', 'clip.it'], function($, clip) {
	var author = $('[rel="author"]');

	clip.config({
		container: '#article-wrapper',
		allowedElements: 'a, p, [itemprop="image"]'
	});

	clip.values({
		authorName: author.text(),
		authorUrl: author.attr('href'),
		contentTitle: $('[itemprop*="headline"]').text(),
		contentUrl: $('#printlink').attr('href').replace('/print', '')
	});

	var startClipping = $('<div class="clipit-start">Clip.it</div>').on('click', function() {
		clip.toggle();
	}).prependTo('#article-wrapper');

});
