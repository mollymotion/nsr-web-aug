import SliceTransition from './slice-animation.js';
import Gradient from './gradient.js';
import BandsInTown from './bandsintown.js';
import Nav from './sticky-nav.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM Content Loaded');
  
  // Initialize StickyNav
  const stickyNav = new Nav();
  
  // Logo animation handling
  const video = document.getElementById('logo-video');
  const svg = document.getElementById('logo-svg');
  
  if (video && svg) {
    // Fade in video on page load
    video.style.transition = 'opacity 1s ease';
    requestAnimationFrame(() => {
      video.style.opacity = 1;
    });

    // Convert 6:07 @30fps to seconds
    const fadeOutTime = (6 * 30 + 7) / 30; // ≈ 6.233 seconds

    // At 6.233s, fade out video and fade in SVG
    setTimeout(() => {
      video.style.opacity = 0;
      svg.classList.remove('opacity-0');
      svg.classList.add('opacity-100');
    }, fadeOutTime * 1000);
  }

  // Slideshow handling
  const sliceTransition = new SliceTransition();
  const heroImage = document.querySelector('.hero-image');
  
  if (!heroImage) {
    console.error('Hero image element not found!');
    return;
  }
  
  // Define array of image paths
  const images = [
    './images/hero/hero-1.png',
    './images/hero/hero-2.png',
    './images/hero/hero-3.png',
    './images/hero/hero-4.png',
    './images/hero/hero-5.png',  
  ];
  
  let currentImageIndex = 0;

  function updateImage() {
    // console.log('Updating image to:', images[currentImageIndex]);
    heroImage.onerror = () => console.error('Failed to load image:', images[currentImageIndex]);
    heroImage.onload = () => console.log('Image loaded successfully');
    heroImage.src = images[currentImageIndex];
  }

  async function cycleImages() {
    try {
      await sliceTransition.animate(false); // Animate out
      
      currentImageIndex = (currentImageIndex + 1) % images.length;
      
      updateImage();
      
      await sliceTransition.animate(true); // Animate in
      
      setTimeout(cycleImages, 3000);

    } catch (error) {
        console.error('Animation error:', error);
    }
  }

  // Gradient handling
  const gradient = new Gradient();
  gradient.freqX = 7e-5;
  gradient.freqY = 14e-5;
  gradient.activeColors = [
      1.0,    // First color (purple) - full presence
      0.8,    // Second color (red) - reduced presence
      1.0,    // Third color (dark purple) - strong presence
      1.0     // Fourth color (burgundy) - medium presence
  ];
  await gradient.initGradient('#gradient-canvas');

  try {
    console.log('Starting initialization...');
    updateImage();

    await new Promise((resolve, reject) => {
      const maxAttempts = 50;
      let attempts = 0;
      
      const checkInit = () => {
        console.log('Checking init, attempt:', attempts);
        if (sliceTransition.isInitialized()) {
          console.log('Initialization successful');
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('SliceTransition initialization timeout'));
        } else {
          attempts++;
          setTimeout(checkInit, 100);
        }
      };
      
      checkInit();
    });

    console.log('Starting animations...');
    await sliceTransition.animate(true);
    setTimeout(cycleImages, 3000);
  } catch (error) {
    console.error('Initialization error:', error);
  }
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
