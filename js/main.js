import Gradient from './gradient.js';
import SliceTransition from './slice-animation.js';
import StickyNav from './sticky-nav.js';

class App {
  constructor() {
    this.gradient = new Gradient();
    this.sliceTransition = new SliceTransition();
    this.stickyNav = new StickyNav();
    this.heroImage = document.querySelector('.hero-image');
    this.transitioning = false;
    this.imageCount = 5; // Update image count
    this.init();
  }

  async init() {
    this.setHeroImage();
    // Initial transition-in animation
    const gradientCanvas = document.getElementById('gradient-canvas');
    if (gradientCanvas && gradientCanvas.dataset.transitionIn !== undefined) {
      await this.gradient.animate(true);
      await this.sliceTransition.animate(true);
    }

    // Set up transition interval
    setInterval(() => {
      this.transition();
    }, 5000);
  }

  async transition() {
    if (this.transitioning) return;
    this.transitioning = true;

    try {
      await this.sliceTransition.animate(false);
      this.setHeroImage();
      await this.sliceTransition.animate(true);
    } catch (error) {
      console.error('Transition error:', error);
    } finally {
      this.transitioning = false;
    }
  }

  setHeroImage() {
    const imageIndex = Math.floor(Math.random() * this.imageCount) + 1;
    this.heroImage.src = `images/hero-${imageIndex}.png`; // Update image extension
  }
}

new App();