class ParallaxController {
  constructor() {
    this.silhouettes = document.querySelectorAll('.parallax-silhouette');
    
    // Check if mobile right away
    this.isMobile = window.innerWidth <= 768;
    
    // If mobile, don't interfere with CSS positioning at all
    if (!this.isMobile) {
      this.init();
    }
  }

  init() {
    if (!this.silhouettes.length) {
      return;
    }

    // Set dynamic positioning for desktop only
    this.updateSilhouettePositions();

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      
      // Skip everything if we're in mobile mode
      if (window.innerWidth <= 768) return;
      
      this.silhouettes.forEach((silhouette, index) => {
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
      // Only add parallax on desktop
      if (window.innerWidth > 768 && !ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });

    // Update positions when window resizes
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.updateSilhouettePositions();
      }
    });

    updateParallax();
  }

  updateSilhouettePositions() {
    // DESKTOP ONLY positioning - no mobile code at all
    const videosSection = document.getElementById('videos');
    const pressSection = document.getElementById('press');
    const contactSection = document.getElementById('contact');

    // Position Stas relative to videos section
    if (videosSection) {
      const videosOffset = videosSection.offsetTop;
      const stasSilhouette = document.querySelector('.parallax-silhouette-2');
      if (stasSilhouette) {
        stasSilhouette.style.top = `${videosOffset - 500}px`;
      }
    }
    
    // Position Cesar relative to press section
    if (pressSection) {
      const pressOffset = pressSection.offsetTop;
      const cesarSilhouette = document.querySelector('.parallax-silhouette-3');
      if (cesarSilhouette) {
        cesarSilhouette.style.top = `${pressOffset - 700}px`;
      }
    }
    
    // Position Matt relative to contact section
    if (contactSection) {
      const contactOffset = contactSection.offsetTop;
      const mattSilhouette = document.querySelector('.parallax-silhouette-4');
      if (mattSilhouette) {
        mattSilhouette.style.top = `${contactOffset - 1000}px`;
      }
    }
  }
}

export default ParallaxController;