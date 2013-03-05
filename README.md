# Clip.it

See it, clip it, keep it


## What's this all about?

A simple system to store all the bits of articles you find interesting, or worth keeping to reference at a later date


## Usage

	requirejs(['clip.it'], function(clip) {
		// These are the elements you can clip
		clip.config({
			container: '#article-wrapper',
			allowedElements: 'a, p, [itemprop="image"]'
		});

		// These will be the values stored against every clip made after this is set
		// It's handy for things like clipping one artle, not a list of articles
		clip.values({
			authorName: $('.author').text(),
			authorUrl: $('.author').attr('href'),
			contentTitle: $('.headline').text(),
			contentUrl: $('.short-url').attr('href')
		});

		var clipButton = $('<button>Clip</button>').on('click', function() {
			clip.toggle(); // alternatively you can use clip.it() and clip.stop()
		}).appendTo('body');
	});


## TODO

* D2 integration
* Social sharing
* Widgets

		// Listing the clips from around the site allowing cross site pollination
		clip.widget.bits('.clip-bits');

		// This will be something external users can use.
		// Similar to https://dev.twitter.com/docs/embedded-tweets
		clip.widget.embed('.clip-embed');

* Ich bin complete setup
