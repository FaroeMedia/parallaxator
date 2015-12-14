/*
 Parallaxator jQuery Plugin
 Parallaxator is a jQuery-based parallax plugin. It's simple, and amazingly easy to use.
 version 1.0, Dec 11th, 2015
 by Ingi P. Jacobsen

 The MIT License (MIT)

 Copyright (c) 2015 Faroe Media

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

$(function () {
	// Code still has a lot of deebug info going on, I'll remove it later on, 
	// when it's been tested properly and all bugs have been removed
	var DEBUG = false;
	
	var refreshParallaxator = function () {
		var $window = $(window);
		var i = 0;
		$('.parallaxator').each(function () {
			i++;
			var holder = this;
			var window_height = $window.height();
			var holder_bounding = holder.getBoundingClientRect();

			var HOLDER_IS_WITHIN_WINDOW = holder_bounding.top < window_height && holder_bounding.bottom > 0;
			
			if (HOLDER_IS_WITHIN_WINDOW) {
				var $holder = $(holder);
				$holder.children('.parallax_child').each(function () {
					var child = this;
					var $child = $(child);
					var x = $child.prop('tagName');
					var child_bounding = child.getBoundingClientRect();
					var height_difference = holder_bounding.height - child_bounding.height;
					var height_calc, top_calc, multiplier_inside, multiplier_outside, offset;
					var velocity = typeof $child.attr('data-parallaxator-velocity') != 'undefined' ? parseFloat($child.attr('data-parallaxator-velocity')) : 1.0;

					// Not all of these constants are used, but might be used later, 
					// so I'll just leave them for now
					var CHILD_IS_SMALLER_THAN_HOLDER  = child_bounding.height < holder_bounding.height;
					var CHILD_IS_LARGER_THAN_HOLDER   = child_bounding.height >= holder_bounding.height;
					var CHILD_IS_SMALLER_THAN_WINDOW  = child_bounding.height < window_height;
					var CHILD_IS_LARGER_THAN_WINDOW   = child_bounding.height >= window_height;
					var HOLDER_IS_SMALLER_THAN_CHILD  = holder_bounding.height < child_bounding.height;
					var HOLDER_IS_LARGER_THAN_CHILD   = holder_bounding.height >= child_bounding.height;
					var HOLDER_IS_SMALLER_THAN_WINDOW = holder_bounding.height < window_height;
					var HOLDER_IS_LARGER_THAN_WINDOW  = holder_bounding.height >= window_height;
					var WINDOW_IS_SMALLER_THAN_CHILD  = window_height < child_bounding.height;
					var WINDOW_IS_LARGER_THAN_CHILD   = window_height >= child_bounding.height;
					var WINDOW_IS_SMALLER_THAN_HOLDER = window_height < holder_bounding.height;
					var WINDOW_IS_LARGER_THAN_HOLDER  = window_height >= holder_bounding.height;

					var child_size = child_bounding.height > window_height ? 3 : (child_bounding.height > holder_bounding.height ? 2 : 1);
					
					// Inside multiplier calculation
					height_calc = window_height - holder_bounding.height;
					top_calc = (holder_bounding.top - height_calc) * -1;
					multiplier_inside = (((top_calc / height_calc) - 0.5) * velocity) + 0.5;
					// Outside multiplier calculation
					height_calc = window_height + holder_bounding.height;
					top_calc = (holder_bounding.top - window_height) * -1;
					multiplier_outside = (((top_calc / height_calc) - 0.5) * velocity) + 0.5;

					// Not reverse
					if ($child.attr('data-parallaxator-reverse') != 'true') {
						if (CHILD_IS_SMALLER_THAN_HOLDER && CHILD_IS_SMALLER_THAN_WINDOW) {
							if (HOLDER_IS_SMALLER_THAN_WINDOW) {
								DEBUG && console.log(i, x, '1.1.1, Inside down');
								offset = (height_difference * (multiplier_inside * -1)) + height_difference;
							} else {
								DEBUG && console.log(i, x, '1.1.2, Outside down');
								offset = (height_difference * (multiplier_inside * -1)) + height_difference;
								offset = height_difference * multiplier_inside;
							}
						} else if (CHILD_IS_LARGER_THAN_HOLDER && CHILD_IS_SMALLER_THAN_WINDOW) {
							DEBUG && console.log(i, x, '1.2.1, Inside down');
							offset = (height_difference * (multiplier_inside * -1)) + height_difference;
						} else if (CHILD_IS_LARGER_THAN_HOLDER && CHILD_IS_LARGER_THAN_WINDOW) {
							DEBUG && console.log(i, x, '1.3.1, Outside down');
							offset = ((child_bounding.height + holder_bounding.height) * multiplier_outside) - child_bounding.height;
						} else if (CHILD_IS_SMALLER_THAN_HOLDER && CHILD_IS_LARGER_THAN_WINDOW) {
							DEBUG && console.log(i, x, '1.4.1, Outside down');
							offset = ((child_bounding.height + holder_bounding.height) * multiplier_outside) - child_bounding.height;
						} else {
							DEBUG && console.log(i, x, '1.uncaught');
						}
					// Reverse
					} else {
						if (CHILD_IS_SMALLER_THAN_HOLDER && CHILD_IS_SMALLER_THAN_WINDOW) {
							if (HOLDER_IS_SMALLER_THAN_WINDOW) {
								DEBUG && console.log(i, x, '2.1.1, Inside up');
								offset = height_difference * multiplier_inside;
							} else {
								DEBUG && console.log(i, x, '2.1.2, Outside up');
								offset = ((child_bounding.height + holder_bounding.height) * multiplier_outside) - child_bounding.height;
							}
						} else if (CHILD_IS_LARGER_THAN_HOLDER && CHILD_IS_SMALLER_THAN_WINDOW) {
							DEBUG && console.log(i, x, '2.2.1, Outside up');
							offset = height_difference * multiplier_outside;
						} else if (CHILD_IS_LARGER_THAN_HOLDER && CHILD_IS_LARGER_THAN_WINDOW) {
							DEBUG && console.log(i, x, '2.3.1, Outside up');
							offset = height_difference * multiplier_outside;
						} else if (CHILD_IS_SMALLER_THAN_HOLDER && CHILD_IS_LARGER_THAN_WINDOW) {
							DEBUG && console.log(i, x, '2.4.1, Outside up');
							offset = height_difference * multiplier_outside;
						} else {
							DEBUG && console.log(i, x, '2.uncaught');
						}
					}
					$child.css('transform', 'translate3d(0, ' + offset + 'px, 0)');
					DEBUG && console.log(i, x, multiplier_inside, multiplier_outside, offset, window_height, holder_bounding.height, child_bounding.height);
					
				});
			}
		});
	};
	$(window).bind('scroll resize load ready', function () {
		refreshParallaxator();
	});
	$('.parallaxator').find('img').load(function () {
		refreshParallaxator();
	});
});