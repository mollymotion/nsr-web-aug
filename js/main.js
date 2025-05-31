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
  const template = document.getElementById("tpl_shows");
  
  if (!container || !template) {
    console.error("Required DOM elements not found");
    return;
  }

  // Show data loading and rendering
  async function loadShows() {
    // Add loading state
    container.innerHTML = '<div class="text-center">Loading shows...</div>';

    try {
      const response = await fetch('https://rest.bandsintown.com/artists/None%20Shall%20Remain/events?app_id=6284b825fee359c4a992c4533a3499f5');
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No events found');
      }

      console.dir( data); // Log the entire data structure for debugging
      // Clear loading state
      container.innerHTML = '';

      data.forEach((event) => {
        const fragment = template.content.cloneNode(true);
        const datetime = new Date(event.datetime);

        // Helper function to capitalize each word in a sentence after line breaks
        const toSentenceCase = (str) => {
          return str.split('\n')
                   .map(line => line
                     .split(' ')
                     .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                     .join(' ')
                   )
                   .map((line, idx, arr) => idx < arr.length - 1 ? line + ' &bullet; ' : line)
                   .join('');
        };

        const __newdata = {
          date: datetime.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit'}),
          time: datetime.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true}).toUpperCase(),
          desc: toSentenceCase(event.description || 'No description available'),
          venueName: event.venue.name,
          venueCity: event.venue.city,
          url: event.url,
          artistImage: event.artist.image_url || 'https://placehold.co/400'
        };

        console.log('Template HTML:', fragment.firstElementChild.innerHTML);
        console.log('Data:', __newdata);

        const html = fragment.firstElementChild.innerHTML
          .replace('${date}', __newdata.date)
          .replace('${time}', __newdata.time)
          .replace('${desc}', __newdata.desc) 
          .replace('${venueName}', __newdata.venueName)
          .replace('${venueCity}', __newdata.venueCity)
          .replace('${artistImage}', __newdata.artistImage )
          .replace('${url}', __newdata.url);

        fragment.firstElementChild.innerHTML = html;
        container.appendChild(fragment);
      });
    } catch (error) {
      console.error('Error:', error);
      container.innerHTML = `<p class="text-white/60 col-span-full">
        ${error.message === 'No events found' ? 'No upcoming shows listed.' : 'Error loading shows. Try again later.'}
      </p>`;
    }
  }

  loadShows();
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

// Improved navbar sticky behavior
const navbar = document.querySelector('.navbar-nav');
let lastScroll = 0;

function handleScroll() {
  const currentScroll = window.pageYOffset;
  
  // Add/remove fixed class based on scroll direction
  if (currentScroll > lastScroll && currentScroll > 100) {
    navbar.classList.add('fixed');
  } else if (currentScroll < lastScroll && currentScroll < 100) {
    navbar.classList.remove('fixed'); 
  }

  lastScroll = currentScroll;
}

// Throttle scroll handler for better performance
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});
