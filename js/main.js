import BandsInTown from './bandsintown.js';
import Nav from './sticky-nav.js';
import ParallaxController from './parallax.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize StickyNav
  const stickyNav = new Nav();
  
  // Detect if device is mobile
  const isMobile = window.innerWidth <= 768;
  
  // Initialize positioning system - DESKTOP ONLY now
  if (!isMobile) {
    // Use parallax effect for desktop
    const parallax = new ParallaxController();
  }
  // Mobile positioning is now handled entirely by CSS
  
  // Static hero image — src already set in HTML
});

// Bandsintown Integration
document.addEventListener("DOMContentLoaded", () => {
  const bandsInTown = new BandsInTown();
  bandsInTown.init();
});

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});