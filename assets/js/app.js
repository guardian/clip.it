requirejs.config({
    baseUrl: 'http://localhost:8000/',
    paths: {
        'guardian_idToolkit': 'https://id.guardian.co.uk/static/180/cs/js/guardian.identity.clientside-toolkit',
        'jquery': '//pasteup.guim.co.uk/js/lib/jquery/1.8.1/jquery.min',
        'clip.it': 'assets/js/lib/clip.it.v0',
        'ichbin': 'assets/js/lib/ichbin'
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

    clip.it();
});
