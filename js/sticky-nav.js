class StickyNav {
  constructor() {
    this.heroSection = document.querySelector('.h-screen');
    this.navBar = document.querySelector('.navbar-nav');
    this.logoContainer = document.getElementById('logo-container');
    this.logo = document.getElementById('Layer_1');
    this.threshold = this.heroSection.offsetHeight * 0.75; // Calculate 75% threshold
    this.isStuck = false;
    this.init();
  }

  init() {
    this.checkScroll();
    window.addEventListener('scroll', () => this.checkScroll());
  }

  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition > this.threshold && !this.isStuck) {
      this.stickNav();
    } else if (scrollPosition <= this.threshold && this.isStuck) {
      this.unstickNav();
    }
  }

  stickNav() {
    this.isStuck = true;
    this.navBar.classList.add('fixed', 'top-0');
    this.navBar.classList.remove('absolute', 'bottom-5');

    gsap.to(this.logo, {
      opacity: 1,
      duration: 0.3,
      y: 0, // Adjust as needed
      ease: "power2.out"
    });

    console.log('stickNav called');
  }

  unstickNav() {
    this.isStuck = false;
    this.navBar.classList.remove('fixed', 'top-0');
    this.navBar.classList.add('absolute', 'bottom-5');

    gsap.to(this.logo, {
      opacity: 0,
      duration: 0.3,
      y: -20, // Adjust as needed
      ease: "power2.out"
    });

    console.log('unstickNav called');
  }
}

export default StickyNav;
