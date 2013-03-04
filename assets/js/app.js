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

	clip.defaults({
		author_name: author.text(),
		author_url: author.attr('href'),
		content_title: $('[itemprop*="headline"]').text(),
		content_url: $('#printlink').attr('href').replace('/print', '')
	});

	var startClipping = $('<div class="clipit-start">Clip.it</div>').on('click', function() {
		clip.it('#article-wrapper');
		$(this).text('Stop yo\' clippin\'');
	}).prependTo('#article-wrapper').click();
	
	clip.widget.bits('.clip-bits');
	clip.widget.embed('.clip-embed');
});