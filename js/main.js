import SliceTransition from './slice-animation.js';
import BandsInTown from './bandsintown.js';
import Nav from './sticky-nav.js';
import ParallaxController from './parallax.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM Content Loaded');
  
  // Initialize StickyNav
  const stickyNav = new Nav();
  
  // Initialize Parallax
  const parallax = new ParallaxController();
  
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
