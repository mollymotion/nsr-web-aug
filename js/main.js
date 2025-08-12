import SliceTransition from './slice-animation.js';
import BandsInTown from './bandsintown.js';
import Nav from './sticky-nav.js';
import ParallaxController from './parallax.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize StickyNav
  const stickyNav = new Nav();
  
  // Detect if device is mobile
  const isMobile = window.innerWidth <= 768;
  
  // Initialize the appropriate positioning system
  if (isMobile) {
    // Use mobile positioning for silhouettes
    const mobilePositioner = new MobileSilhouettePositioner();
  } else {
    // Use parallax effect for desktop
    const parallax = new ParallaxController();
  }
  
  // Slideshow handling
  const sliceTransition = new SliceTransition();
  const heroImage = document.querySelector('.hero-image');
  let heroVideo = null; // Add video element reference
  
  if (!heroImage) {
    return;
  }
  
  // Define array of media with types - use mobile videos on mobile, full videos on desktop
  const media = isMobile ? [
    // { src: './images/hero/hero-1.png', type: 'image' },
    // { src: './images/hero/hero-2.png', type: 'image' },
    // { src: './images/hero/hero-3.png', type: 'image' },
    // { src: './images/hero/hero-4.png', type: 'image' },
    // { src: './images/hero/hero-5.png', type: 'image' },
    // { src: './images/hero/hero-6.png', type: 'image' },
    { src: './images/hero/mobile-clip-peter.gif', type: 'image' },
    { src: './images/hero/mobile-clip-stas.gif', type: 'image' },
    { src: './images/hero/mobile-clip-cesar.gif', type: 'image' },
    { src: './images/hero/mobile-clip-matt.gif', type: 'image' },
  ] : [
    { src: './images/hero/heroclip-peter.mp4', type: 'video' },
    { src: './images/hero/heroclip-stas.mp4', type: 'video' },
    { src: './images/hero/heroclip-cesar.mp4', type: 'video' },
    { src: './images/hero/heroclip-matt.mp4', type: 'video' },
  ];
  
  let currentImageIndex = 0;

  function updateMedia() {
    const currentMedia = media[currentImageIndex];
    
    if (currentMedia.type === 'video') {
      // Handle video
      heroImage.style.display = 'none';
      
      // Create video element if it doesn't exist
      if (!heroVideo) {
        heroVideo = document.createElement('video');
        heroVideo.className = 'hero-image'; // Use same styling as hero-image
        heroVideo.style.position = 'absolute';
        heroVideo.style.inset = '0';
        heroVideo.style.width = '100vw';
        heroVideo.style.height = '100%';
        heroVideo.style.objectFit = 'cover';
        heroVideo.muted = true;
        heroVideo.autoplay = true;
        heroVideo.loop = true;
        heroVideo.playsInline = true;
        
        // Insert video element after the image
        heroImage.parentNode.insertBefore(heroVideo, heroImage.nextSibling);
        
        // Apply the same mask to video
        heroVideo.style.maskImage = 'url(#slice-transition-mask)';
        heroVideo.style.webkitMaskImage = 'url(#slice-transition-mask)';
      }
      
      heroVideo.src = currentMedia.src;
      heroVideo.style.display = 'block';
      heroVideo.load(); // Reload the video with new source
      
    } else {
      // Handle image
      if (heroVideo) {
        heroVideo.style.display = 'none';
      }
      heroImage.style.display = 'block';
      heroImage.src = currentMedia.src;
    }
  }

  async function cycleImages() {
    try {
      await sliceTransition.animate(false); // Animate out
      
      currentImageIndex = (currentImageIndex + 1) % media.length;
      
      updateMedia();
      
      await sliceTransition.animate(true); // Animate in
      
      setTimeout(cycleImages, 3000);
    } catch (error) {
      // Silent error handling
    }
  }

  try {
    updateMedia();

    await new Promise((resolve, reject) => {
      const maxAttempts = 50;
      let attempts = 0;
      
      const checkInit = () => {
        if (sliceTransition.isInitialized()) {
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

    await sliceTransition.animate(true);
    setTimeout(cycleImages, 3000);
  } catch (error) {
    // Silent error handling
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