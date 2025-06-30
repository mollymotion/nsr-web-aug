class ParallaxController {
  constructor() {
    this.silhouette = document.querySelector('.parallax-silhouette');
    this.init();
  }

  init() {
    if (!this.silhouette) {
      console.error('Parallax silhouette element not found');
      return;
    }

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 1.5; // 150% of scroll speed (faster than normal content)
      const yPos = -(scrolled * parallaxSpeed);
      
      this.silhouette.style.transform = `translate3d(0, ${yPos}px, 0)`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });

    updateParallax();
  }
}

export default ParallaxController;
