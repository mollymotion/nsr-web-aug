// Pure JavaScript smooth scroll for all browsers
// This script makes mouse wheel, keyboard, and touchpad scrolling smooth
// It does NOT change any site appearance or features

(function() {
  if ('scrollBehavior' in document.documentElement.style) {
    // Native support exists, do nothing (CSS handles it)
    return;
  }

  var SCROLL_TIME = 468;
  var originalScrollTo = window.scrollTo;

  function smoothScrollTo(x, y) {
    var startX = window.scrollX || window.pageXOffset;
    var startY = window.scrollY || window.pageYOffset;
    var startTime = performance.now();

    function scroll() {
      var now = performance.now();
      var time = Math.min(1, ((now - startTime) / SCROLL_TIME));
      var timeFunction = 0.5 * (1 - Math.cos(Math.PI * time));
      window.scrollTo(
        startX + (x - startX) * timeFunction,
        startY + (y - startY) * timeFunction
      );
      if (time < 1) {
        requestAnimationFrame(scroll);
      }
    }
    scroll();
  }

  window.scrollTo = function(x, y) {
    if (typeof x === 'object') {
      if (x.behavior === 'smooth') {
        smoothScrollTo(
          typeof x.left === 'number' ? x.left : window.scrollX || window.pageXOffset,
          typeof x.top === 'number' ? x.top : window.scrollY || window.pageYOffset
        );
      } else {
        originalScrollTo.apply(window, arguments);
      }
    } else {
      smoothScrollTo(x, y);
    }
  };
})(); 