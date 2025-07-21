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

    // Set dynamic positioning for Cesar and Matt based on press section
    this.updatePressPositions();

    let ticking = false;

    // ...existing code...
    const updateParallax = () => {
      const scrolled = window.pageYOffset;

      this.silhouettes.forEach((silhouette, index) => {
        let parallaxSpeed;
        let initialOffset = 0;

        // Keep Peter and Stas at their current speeds
        if (index === 0 || index === 1) {
          parallaxSpeed = 1.2 + (index * 0.2); // 1.2x, 1.4x (unchanged)
        }
        // Give Cesar and Matt slower speeds and account for their positioning
        else {
          parallaxSpeed = 1.2 + ((index - 2) * 0.1); // 1.2x for Cesar, 1.3x for Matt

          // Get their initial top position set by updatePressPositions
          const currentTop = parseInt(silhouette.style.top) || 0;
          initialOffset = currentTop;
        }

        const yPos = initialOffset - (scrolled * parallaxSpeed);
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
      this.updatePressPositions();
    });

    updateParallax();
  }

  updatePressPositions() {
    const pressSection = document.getElementById('press');
    if (pressSection) {
      const pressOffset = pressSection.offsetTop;

      // Position Cesar slightly below the press header
      const cesarSilhouette = document.querySelector('.parallax-silhouette-3');
      if (cesarSilhouette) {
        cesarSilhouette.style.top = `${pressOffset + -900}px`;
      }

      // Position Matt below Cesar
      const mattSilhouette = document.querySelector('.parallax-silhouette-4');
      if (mattSilhouette) {
        mattSilhouette.style.top = `${pressOffset + -650}px`;
      }
    }
  }
}

export default ParallaxController;