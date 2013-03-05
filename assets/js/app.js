// requirejs.config({
// 	paths: {
// 		'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
// 		'guardian_idToolkit': 'http://id.guim.co.uk/static/cs/js/guardian.identity.clientside-toolkit'
// 	}
// });
requirejs.config({
	paths: {
		'guardian_idToolkit': 'https://id.guardian.co.uk/static/180/cs/js/guardian.identity.clientside-toolkit',
		'lib/clip.it': '//gnm41087.int.gnl/p/clip.it/assets/js/lib/clip.it',
		'lib/ichbin': '//gnm41087.int.gnl/p/clip.it/assets/js/lib/ichbin'
	}
});

requirejs(['jquery', 'lib/clip.it'], function($, clip) {
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