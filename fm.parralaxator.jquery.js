/*
 Parralaxator jQuery Plugin
 Parralaxator is a jQuery-based parralax plugin. It's simple, and amazingly easy to use.
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
	var refreshParralaxator = function () {
		var i = 0;
		var $window = $(window);
		$('.parralaxator').each(function () {
			var holder = this;
			i++;
			var windowHeight = $window.height();
			var holderBounding = holder.getBoundingClientRect();

			var topIsWithinWindow = holderBounding.top < windowHeight;
			var bottomIsWithinWindow = holderBounding.bottom > 0;

			if (topIsWithinWindow && bottomIsWithinWindow) {
				var $holder = $(holder);
				$holder.children('.parrachild').each(function () {
					var child = this;
					var $child = $(child);
					var childBounding = child.getBoundingClientRect();
					var height_difference = holderBounding.height - childBounding.height;
					var height_calc = windowHeight - holderBounding.height;
					var top_calc = (holderBounding.top - height_calc) * -1;
					var multiplier = top_calc / height_calc;
					$child.css('transform', 'translate3d(0, ' + ((height_difference * (multiplier * -1)) + height_difference) + 'px, 0)');
				});
				$holder.children('.parrachild_reverse').each(function () {
					var child = this;
					var $child = $(child);
					var childBounding = child.getBoundingClientRect();
					var height_difference = holderBounding.height - childBounding.height;
					var top_calc = (holderBounding.top - windowHeight) * -1;
					var height_calc = windowHeight + holderBounding.height;
					var multiplier = top_calc / height_calc;
					$child.css('transform', 'translate3d(0, ' + (height_difference * multiplier) + 'px, 0)');
				});
			}
		});
	};
	$(window).bind('scroll resize load ready', function () {
		refreshParralaxator();
	});
	$('.parralaxator').find('img').load(function () {
		refreshParralaxator();
	});
});