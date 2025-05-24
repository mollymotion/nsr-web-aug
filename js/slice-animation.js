import polygons from './polygons.js';

class SliceTransition {
  constructor() {
    this.svgNS = "http://www.w3.org/2000/svg";
    this.maskContainer = document.getElementById('slice-mask');
    this.isAnimating = false;
    this.isReady = false;
    this.init();
  }

  async init() {
    try {
      await this.createMask();
      this.isReady = true;
      console.log('SliceTransition initialized', this.triangles); // Add this line
    } catch (error) {
      console.error('SliceTransition init error:', error);
    }
  }

  createMask() {
    const svg = document.createElementNS(this.svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 2548 1701.8");
    
    const defs = document.createElementNS(this.svgNS, "defs");
    const style = document.createElementNS(this.svgNS, "style");
    style.textContent = `.tri { fill: white; }`;
    defs.appendChild(style);

    const mask = document.createElementNS(this.svgNS, "mask");
    mask.setAttribute("id", "slice-transition-mask");

    polygons.forEach(points => {
      const polygon = document.createElementNS(this.svgNS, "polygon");
      polygon.setAttribute("class", "tri");
      polygon.setAttribute("points", points);
      mask.appendChild(polygon);
    });

    svg.appendChild(defs);
    svg.appendChild(mask);
    this.maskContainer.appendChild(svg);

    // Store triangle references
    this.triangles = Array.from(mask.querySelectorAll('.tri'));

    // Apply mask to hero image
    const heroImage = document.querySelector('.hero-image');
    heroImage.style.maskImage = 'url(#slice-transition-mask)';
    heroImage.style.webkitMaskImage = 'url(#slice-transition-mask)';

    // Set initial state
    gsap.set(this.triangles, { opacity: 0 });
  }

 isInitialized() {
    return this.isReady && this.triangles && this.triangles.length > 0;
  }

  async animate(show = true) {
    if (!this.isInitialized()) {
      throw new Error('SliceTransition not initialized');
    }
    
    if (this.isAnimating) return new Promise(resolve => resolve());
    this.isAnimating = true;

    return new Promise(resolve => {
      gsap.to(this.triangles, {
        opacity: show ? 1 : 0,
        duration: 0.2,
        stagger: {
          each: 0.008,
          from: "random"
        },
        ease: "none",
        onComplete: () => {
          this.isAnimating = false;
          resolve();
        }
      });
    });
  }
}

export default SliceTransition;