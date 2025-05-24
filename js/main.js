document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM Content Loaded');
  
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
    'images/hero/hero-1.webp',
    'images/hero/hero-2.webp',
    'images/hero/hero-3.webp',
    'images/hero/hero-4.webp',
    'images/hero/hero-5.webp',
    'images/hero/hero-6.webp'
  ];
  
  let currentImageIndex = 0;

  function updateImage() {
    console.log('Updating image to:', images[currentImageIndex]);
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