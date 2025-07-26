// Initialize Lenis smooth scroll
// This script only affects scroll behavior, not appearance

import('js/lenis.min.js').then(() => {
  const lenis = new window.Lenis({
    duration: 2.2, // Increased for more smoothness
    smooth: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothTouch: true, // Enable smooth on touch devices
    touchMultiplier: 2.0, // Slightly higher for more glide
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}); 