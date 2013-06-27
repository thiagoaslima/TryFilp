(function ($) {

	$.widget("ui.flipGallery", {
		options: {},

		_create: function () {
			var that = this;

			// find all the images for the gallery
			that.images = that.element.find('img');

			// stop if there is only one image
			if (that.images.length <= 1) {
				return;
			}

			that.currentImageIndex = 0;

			// get image dimensions
			that.height = that.images.first().height();
			that.witdh = that.images.first().width();

			// make sure the gallery element remains the size
			that.element.width(that.width).height(that.height);

			// sub elements should be absolute positioned
			that.element.css('position', 'relative');

			// setup the element to support perspective
			that.element.css({
				'-webkit-perspective': 1100,
				'-webkit-perspective-origin': '50% 50%'
			})

			// create an element to show the left hand slide of image on top (A)
			that.imageLeftA = $('<div />', {
				'class': 'imageLeftA'
			}).css({
				width: '100%',
				height: '100%',
				position: 'relative'
			});

			// create an element to show the right hand side of image on below (B)
			that.imageRightB = $('<div />', {
				'class': 'imageRightB'
			}).css({ 
				// full height, half width
				width: '50%',
				height: '100%',

				// cover the right hand part of imageLeftA
				position: 'absolute',
				top: 0,
				right: 0,

				// right align the background
				backgroundPosition: 'right top'
			}).appendTo(this.imageLeftA);

			// add the DOM
			that.imageLeftA.appendTo(that.element);


			// now create the 'page' that will flip over
			that.page = $('<div />', {
				'class': 'page'
			}).css({
				//full height, half width
				width: '50%',
				height: '100%',

				// cover the right hand part of the images
				position: 'absolute',
				top: 0,
				right: 0,

				// keep the orientation of subelements
				'-webkit-transform-style': 'preserve-3d'
			});

			// create the part of image A inside the .page element
			that.imageRightA = $('<div />', {
				'class': 'imageRightA'
			}).css({
				// fill the container (.page)
				width: '100%',
				height: '100%',

				// right align the background image
				backgroundPosition: 'right top',

				// place the element on the left side of .page
				position: 'absolute',
				top: 0,
				left: 0,

				// hide the other side (when the element is facing away)
				'-webkit-backface-visibility': 'hidden'
			}).appendTo(that.page);

			// create the part of image B inside the .page element
			that.imageLeftB = $('<div />', {
				'class': 'imageLeftB'
			}).css({
				// fill the container (.page)
				width: '100%',
				height: '100%',

				// place the element on the left side of .page
				position: 'absolute',
				top: 0,
				left: 0,

				// starts the element turned (back facing out of the screen)
				'-webkit-transform': 'rotateY(180deg)',

				// hide the other side (when the element is facing away)
				'-webkit-backface-visibility': 'hidden'
			}).appendTo(that.page);

			that.page.appendTo(that.element);


			// Remove the images from the DOM
			that.images.remove();
			that._setupImages();
		},

		_setupImages: function() {
			var that = this,
				nextImageIndex = that.currentImageIndex + 1,
				bgA, bgB;

			// stop at the last image
			if (nextImageIndex >= this.images.length) {
				nextImageIndex = 0;
			}

			//setup the placeholders with the correct background
			bgA = $(that.images.get(that.currentImageIndex)).attr('src');
			bgB = $(that.images.get(that.nextImageIndex)).attr('src');
			that.element.
				add(that.imageLeftA).
				add(that.imageRightA).
				css('background-image', 'url(' + bgA + ')');
			that.imageRightB.
				add(that.imageLeftB).
				css('background-image', 'url(' + bgB + ')');
		},

		turn: function() {
			var that = this;

			// Setup a function to trigger when the transition has finished
			var transitionEnd = function(event) {
				var elements;

				// Stop listening for transition events
				that.page.unbind('webkitTransitionEnd', transitionEnd);
				that.currentImageIndex++;

				// Range check the new image index
				if(that.currentImageIndex >= that.images.length) {
					nextImageIndex = 0;
				}

				// Set the background of the gallery to the new image
				that.element.css('background-image', that.imageLeftB.css('background-image'));
				
				// Hide the created DOM elements to reveal the gallery background
				elements = that.imageLeftA.add(that.page).hide();

				// Stop changes to the page from being animated
				that.page.css({
					'-webkit-transition-property': 'none'
				});

				setTimeout( function() {
					// Reset the elements for the next turn
					that.page.css('-webkit-transform', 'none');
					that._setupImages();
					elements.show();
				}, 50);
			}
				
			// Listen for when the transition has finished
			that.page.bind('webkitTransitionEnd', transitionEnd);
		}
	})
}(this.jQuery));