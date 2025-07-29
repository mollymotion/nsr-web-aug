class ParallaxController {
  constructor() {
    this.silhouettes = document.querySelectorAll('.parallax-silhouette');
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

    // ...existing code...
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const isMobile = window.innerWidth <= 768;

      this.silhouettes.forEach((silhouette, index) => {
        let parallaxSpeed;
        let initialOffset = 0;

        // Keep Peter at his current speed (index 0)
        if (index === 0) {
          parallaxSpeed = isMobile ? 0.2 : 1.2; // Much slower on mobile
        }
        // Give Stas, Cesar and Matt slower speeds and account for their positioning
        else {
          if (index === 1) {
            parallaxSpeed = isMobile ? 0.1 : 1.4; // Much slower on mobile for Stas
          } else {
            parallaxSpeed = isMobile ? 0.1 : 1.2 + ((index - 2) * 0.1); // Much slower on mobile for Cesar/Matt
          }

          // Get their initial top position set by updateSilhouettePositions
          const currentTop = parseFloat(silhouette.style.top) || 0;
          initialOffset = currentTop;
        }

        const yPos = Math.round(initialOffset - (scrolled * parallaxSpeed));
        silhouette.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });

      ticking = false;
    };
    // ...existing code...

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
    const pressSection = document.getElementById('press');
    const videosSection = document.getElementById('videos');
    
    if (pressSection) {
      const pressOffset = pressSection.offsetTop;
      
      // Check if mobile (768px or less)
      const isMobile = window.innerWidth <= 768;
      
      // Position Cesar slightly below the press header
      const cesarSilhouette = document.querySelector('.parallax-silhouette-3');
      if (cesarSilhouette) {
        if (isMobile) {
          cesarSilhouette.style.top = `${pressOffset - 700}px`; // Closer to press header on mobile
        } else {
          cesarSilhouette.style.top = `${pressOffset - 900}px`; // Original desktop position
        }
      }
      
      // Position Matt below Cesar
      const mattSilhouette = document.querySelector('.parallax-silhouette-4');
      if (mattSilhouette) {
        if (isMobile) {
          mattSilhouette.style.top = `${pressOffset - 450}px`; // Closer to press header on mobile
        } else {
          mattSilhouette.style.top = `${pressOffset - 650}px`; // Original desktop position
        }
      }
    }
    
    // Position Stas relative to videos section
    if (videosSection) {
      const videosOffset = videosSection.offsetTop;
      const stasSilhouette = document.querySelector('.parallax-silhouette-2');
      if (stasSilhouette) {
        // Check if mobile (768px or less)
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
          // Position Stas slightly higher on mobile
          stasSilhouette.style.top = `${videosOffset - 600}px`; // 600px above videos header on mobile
        } else {
          // Desktop positioning for Stas (original)
          stasSilhouette.style.top = `${videosOffset - 300}px`; // 300px above videos header on desktop
        }
      }
    }
  }
}

export default ParallaxController;