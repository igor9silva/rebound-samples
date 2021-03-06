"use strict";

(function () {
	/* Dependencies */
	var SpringSystem = rebound.SpringSystem;

	/* Variables */
	var balls = {};
	var springSystem = new SpringSystem();

	/* Methods */
	function random(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function scale(elem, amount) {
		var xfrm = 'scale3d(' + amount + ', ' + amount + ', 1) ';
		elem.style.webkitTransform = elem.style.transform = xfrm;
	}

	function translate(elem, x, y) {
		// x -= elem.getBoundingClientRect().left;
		// y -= elem.getBoundingClientRect().top;
		var xfrm = 'translate3d(' + x + 'px, ' + y + 'px, 0) ';
		elem.style.webkitTransform = elem.style.transform = xfrm;
	}

	function setEvents(elem) {
		elem.onmousedown 	= function() { balls[this.id].spring.setEndValue(0.5); };
		elem.onmouseover 	= function() { balls[this.id].spring.setEndValue(1.5); };
		elem.onmouseout 	= function() { balls[this.id].spring.setEndValue(1.0); };
		elem.onmouseup 		= function() { balls[this.id].spring.setEndValue(1.5); };
		//elem.onclick 		= function() { console.log(balls[this.id].spring.getCurrentValue()) };
	}


	/* Events */
	document.addEventListener('DOMContentLoaded', function() {
		var items = Array.prototype.slice.call(document.getElementById('main').children);
		items.forEach(function(item) { balls[item.id] = { elem: item }; });

		for (var id in balls) {
			var tension = random(10, 50);
			var friction = random(1, 10);
			console.log(id, tension, friction);

			balls[id].spring = springSystem.createSpring(tension, friction);
			setEvents(balls[id].elem);

			balls[id].spring.addListener({ id: id, onSpringUpdate: function(spring) {
				//scale(balls[this.id].elem, spring.getCurrentValue());
			}});

			// Start at 100%
			balls[id].spring.setEndValue(1);
		}

		var testXSpring = springSystem.createSpring(80, 5);
		var testYSpring = springSystem.createSpring(80, 5);
		var x = { onSpringUpdate: function(spring) {
			translate(balls.b0.elem, testXSpring.getCurrentValue(), testYSpring.getCurrentValue());
		}};

		testXSpring.addListener(x);
		testYSpring.addListener(x);
		// document.body.onmousemove= function(e) {
		// 	testXSpring.setEndValue(e.pageX);
		// 	testYSpring.setEndValue(e.pageY);
		// 	// console.log(e.pageX, e.pageY);
		// 	// translate(balls.b0.elem, e.pageX, e.pageY);
		// }

		var half = window.innerWidth / 2;
		var threshold = 180;
		var selected = document.getElementById('selected');
		function move(e) {
			if ((e.pageX > (half - threshold) && e.pageX < (half + threshold)) && (e.pageY > (window.innerHeight - threshold))) {
				testXSpring.setEndValue(half);
				testYSpring.setEndValue(window.innerHeight - 50);
				selected.style.opacity = 1;
				selected.style.transform = 'translate3d(-50%, -50%, 0) scale(1)';
			} else {
				testXSpring.setEndValue(e.pageX);
				testYSpring.setEndValue(e.pageY);
				selected.style.opacity = 0;
				selected.style.transform = 'translate3d(-50%, -50%, 0) scale(0)';
			}
		}

		balls.b0.elem.onmousedown = function(e) {
			document.body.addEventListener('mousemove', move);
		}

		document.body.onmouseup = function(e) {
			document.body.removeEventListener('mousemove', move);
			if ((e.pageX > (half - threshold) && e.pageX < (half + threshold)) && (e.pageY > (window.innerHeight - threshold))) {
				testXSpring.setEndValue(half);
				testYSpring.setEndValue(window.innerHeight - 50);
				selected.style.opacity = 1;
				selected.style.transform = 'translate3d(-50%, -50%, 0) scale(1)';
			} else if (testXSpring.getCurrentValue() > (window.innerWidth / 2)) {
				testXSpring.setEndValue(window.innerWidth);
			} else {
				testXSpring.setEndValue(0);
			}
		}
	});
})();