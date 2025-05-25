import polygonsMobile from './polygons-mobile.js';

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
      console.log('SliceTransition init started');
      await this.createMask();
      this.isReady = true;
      console.log('SliceTransition initialized', this.triangles);
    } catch (error) {
      console.error('SliceTransition init error:', error);
    }
  }

  createMask() {
    console.log('createMask started');
    const svg = document.createElementNS(this.svgNS, "svg");
    console.log('Initial viewBox removed');

    const defs = document.createElementNS(this.svgNS, "defs");
    const style = document.createElementNS(this.svgNS, "style");
    style.textContent = `.tri { fill: rgba(255,255,255,0.5); }`;
    defs.appendChild(style);

    const mask = document.createElementNS(this.svgNS, "mask");
    mask.setAttribute("id", "slice-transition-mask");

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const mobilePolygons = polygonsMobile(viewportWidth, viewportHeight);

    mobilePolygons.forEach(points => {
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

    // Function to update the mask size
    const updateMaskSize = () => {
      console.log('updateMaskSize called');
      const width = heroImage.offsetWidth;
      const height = heroImage.offsetHeight;

      console.log('heroImage dimensions:', width, height);

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      console.log('viewBox updated to:', `0 0 ${width} ${height}`);
    };

    // Delay initial call to updateMaskSize
    setTimeout(() => {
      updateMaskSize();
      console.log('updateMaskSize called initially (delayed)');
    }, 100);

    // Call it on window resize
    window.addEventListener('resize', updateMaskSize);
    console.log('resize listener added');
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
        duration: 0.4,
        x: () => (show ? 0 : (Math.random() - 0.5) * 200), // Random x offset
        y: () => (show ? 0 : (Math.random() - 0.5) * 200), // Random y offset
        rotation: () => (show ? 0 : (Math.random() - 0.5) * 360), // Random rotation
        stagger: {
          each: 0.008,
          from: "random"
        },
        ease: "power2.inOut",
        onComplete: () => {
          this.isAnimating = false;
          resolve();

          // Add breathing animation
          if (show) {
            gsap.to(this.triangles, {
              scale: () => 1 + (Math.random() - 0.5) * 0.5, // More scale variation
              duration: 2,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
              stagger: {
                each: 0.1,
                from: "random"
              }
            });
          }
        }
      });
    });
  }
}

export default SliceTransition;