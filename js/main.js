import SliceTransition from './slice-animation.js';
import Gradient from './gradient.js';

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

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar-nav');

  if (window.scrollY > 600) {
    navbar.classList.add('fixed');
  } else {
    navbar.classList.remove('fixed');
  }

});



// Bandsintown API integration
// Pulls upcoming shows for None Shall Remain and injects them into #shows-grid

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("shows-grid");
  if (!container) return;

  fetch("https://rest.bandsintown.com/artists/None%20Shall%20Remain/events?app_id=6284b825fee359c4a992c4533a3499f5")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((event) => {
          const div = document.createElement("div");
          div.className = "p-4 rounded-xl text-gray-100";
          div.style =
            "background-color: #0d1f2d; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.8);";

          const date = new Date(event.datetime);
          const formattedDate = date.toLocaleDateString(undefined, {
            month: "2-digit",
            day: "2-digit",
          });

          div.innerHTML = `
            ${formattedDate} – ${event.venue.name}, ${event.venue.city}
            <br><a href="${event.url}" class="text-red-400 underline text-sm" target="_blank">Get Tickets</a>
          `;

          container.appendChild(div);
        });
      } else {
        container.innerHTML = `<p class="text-white/60 col-span-full">No upcoming shows listed.</p>`;
      }
    })
    .catch(() => {
      container.innerHTML = `<p class="text-white/60 col-span-full">Error loading shows. Try again later.</p>`;
    });
});
