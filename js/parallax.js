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

      this.silhouettes.forEach((silhouette, index) => {
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
    const pressSection = document.getElementById('press');
    const videosSection = document.getElementById('videos');
    const contactSection = document.getElementById('contact');
    
    
    // Position Stas relative to videos section
    if (videosSection) {
      const videosOffset = videosSection.offsetTop;
      const stasSilhouette = document.querySelector('.parallax-silhouette-2');
      
      if (stasSilhouette) {
        // Check if mobile (768px or less)
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
          // ADJUST HEIGHT HERE for mobile: Increase to move higher, decrease to move lower
          const newTop = videosOffset - 1000;
          stasSilhouette.style.top = `${newTop}px`;
        } else {
          // ADJUST HEIGHT HERE for desktop: Increase to move higher, decrease to move lower
          const newTop = videosOffset - 500; 
          stasSilhouette.style.top = `${newTop}px`;
        }
      } else {
        console.error('Stas silhouette element not found!');
      }
    } else {
      console.error('Videos section not found!');
    }
    
    // Position Cesar relative to press section
    if (pressSection) {
      const pressOffset = pressSection.offsetTop;
      const isMobile = window.innerWidth <= 768;
      
      // Position Cesar lower than before
      const cesarSilhouette = document.querySelector('.parallax-silhouette-3');
      if (cesarSilhouette) {
        if (isMobile) {
          // Move Cesar lower (decrease the negative offset)
          cesarSilhouette.style.top = `${pressOffset - 500}px`; // 500px lower than before
        } else {
          // Move Cesar lower (decrease the negative offset)
          cesarSilhouette.style.top = `${pressOffset - 700}px`; // 500px lower than before
        }
      }
    }
    
    // Position Matt relative to contact section (not press section)
    if (contactSection) {
      const contactOffset = contactSection.offsetTop;
      const isMobile = window.innerWidth <= 768;
      
      console.log('Contact section found, offset:', contactOffset, 'isMobile:', isMobile);
      
      // --- DEBUG: Check if Matt element exists ---
      const mattSilhouette = document.querySelector('.parallax-silhouette-4');
      console.log('MATT DEBUG: Element found?', mattSilhouette !== null);
      
      if (mattSilhouette) {
        
        if (!isMobile) {
          // Position Matt much lower relative to contact section
          mattSilhouette.style.top = `${contactOffset + 100}px`; // Try 100px (much lower)
        } else {
          // Position Matt much lower relative to contact section
          mattSilhouette.style.top = `${contactOffset + 1600}px`; // Try 1600px (much lower)
        }
        
        // --- DEBUG: Verify if our style was applied ---
        console.log('MATT DEBUG: Style after setting:', mattSilhouette.style.top);
        
        // --- DEBUG: Check computed style after a small delay ---
        setTimeout(() => {
          const computed = window.getComputedStyle(mattSilhouette);
          console.log('MATT DEBUG: Computed top after delay:', computed.top);
          console.log('MATT DEBUG: Computed position:', computed.position);
          console.log('MATT DEBUG: Computed transform:', computed.transform);
        }, 100);
      }
    }
    

  }
}

export default ParallaxController;