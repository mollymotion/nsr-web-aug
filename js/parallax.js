class ParallaxController {
  constructor() {
    this.silhouettes = document.querySelectorAll('.parallax-silhouette');
    console.log('ParallaxController initialized, found silhouettes:', this.silhouettes.length);
    
    // Debug: Log each silhouette
    this.silhouettes.forEach((s, i) => {
      console.log(`Silhouette ${i} classes:`, s.className);
    });
    
    this.init();
  }

  init() {
    if (!this.silhouettes.length) {
      console.error('Parallax silhouette elements not found');
      return;
    }

    // Set dynamic positioning for silhouettes based on their respective sections
    this.updateSilhouettePositions();

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const isMobile = window.innerWidth <= 768;

      this.silhouettes.forEach((silhouette, index) => {
        // Skip parallax effect entirely on mobile devices
        if (isMobile) {
          // Remove any transform to let silhouettes scroll naturally with the page
          silhouette.style.transform = 'none';
          return;
        }
        
        // Desktop - apply normal parallax effect
        let parallaxSpeed;
        let initialOffset = 0;
        
        // Keep Peter at his current speed (index 0)
        if (index === 0) {
          parallaxSpeed = 1.2; // 1.2x (unchanged)
        }
        // Give Stas, Cesar and Matt slower speeds and account for their positioning
        else {
          if (index === 1) {
            parallaxSpeed = 1.4; // 1.4x for Stas
          } else {
            parallaxSpeed = 1.2 + ((index - 2) * 0.1); // 1.2x for Cesar, 1.3x for Matt
          }

          // Get their initial top position set by updateSilhouettePositions
          const currentTop = parseInt(silhouette.style.top) || 0;
          initialOffset = currentTop;
        }

        const yPos = initialOffset - (scrolled * parallaxSpeed);
        silhouette.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });

    // Update positions when window resizes (in case content changes)
    window.addEventListener('resize', () => {
      this.updateSilhouettePositions();
    });

    updateParallax();
  }

  updateSilhouettePositions() {
    const videosSection = document.getElementById('videos'); // Stas silhouette
    const pressSection = document.getElementById('press'); // Cesar silhouette
    const contactSection = document.getElementById('contact'); // Matt silhouette
    const isMobile = window.innerWidth <= 768;

    // Position Stas relative to videos section
    if (videosSection) {
      const stasSilhouette = document.querySelector('.parallax-silhouette-2');
      
      if (stasSilhouette) {
        if (isMobile) {
          // Find the h2 within the videos section
          const videosHeader = videosSection.querySelector('h2');
          if (videosHeader) {
            // Position silhouette next to the h2
            const headerTop = videosHeader.getBoundingClientRect().top + window.pageYOffset;
            stasSilhouette.style.top = `${headerTop}px`;
          } else {
            // Fallback if h2 not found
            const videosOffset = videosSection.offsetTop;
            stasSilhouette.style.top = `${videosOffset - 1000}px`;
          }
        } else {
          // Desktop positioning unchanged
          const videosOffset = videosSection.offsetTop;
          stasSilhouette.style.top = `${videosOffset - 500}px`;
        }
      } else {
        console.error('Stas silhouette element not found!');
      }
    }
    
    // Position Cesar relative to press section
    if (pressSection) {
      const cesarSilhouette = document.querySelector('.parallax-silhouette-3');
      
      if (cesarSilhouette) {
        if (isMobile) {
          // Find the h2 within the press section
          const pressHeader = pressSection.querySelector('h2');
          if (pressHeader) {
            // Position silhouette next to the h2
            const headerTop = pressHeader.getBoundingClientRect().top + window.pageYOffset;
            cesarSilhouette.style.top = `${headerTop}px`;
          } else {
            // Fallback if h2 not found
            const pressOffset = pressSection.offsetTop;
            cesarSilhouette.style.top = `${pressOffset - 500}px`;
          }
        } else {
          // Desktop positioning unchanged
          const pressOffset = pressSection.offsetTop;
          cesarSilhouette.style.top = `${pressOffset - 700}px`;
        }
      }
    }
    
    // Position Matt relative to contact section
    if (contactSection) {
      const mattSilhouette = document.querySelector('.parallax-silhouette-4');
      
      if (mattSilhouette) {
        if (isMobile) {
          // Find the h2 within the contact section
          const contactHeader = contactSection.querySelector('h2');
          if (contactHeader) {
            // Position silhouette next to the h2
            const headerTop = contactHeader.getBoundingClientRect().top + window.pageYOffset;
            mattSilhouette.style.top = `${headerTop}px`;
          } else {
            // Fallback if h2 not found
            const contactOffset = contactSection.offsetTop;
            mattSilhouette.style.top = `${contactOffset - 500}px`;
          }
        } else {
          // Desktop positioning unchanged
          const contactOffset = contactSection.offsetTop;
          mattSilhouette.style.top = `${contactOffset - 1000}px`;
        }
      }
    }
  }
}

export default ParallaxController;