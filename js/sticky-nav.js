class StickyNav {
  // Initialize class properties and DOM elements
  constructor() {
    // Get reference to hero section (full height)
    this.heroSection = document.querySelector('.h-screen');
    // Get reference to navigation bar
    this.navBar = document.querySelector('.navbar-nav');
    // Set scroll threshold to 75% of hero section height
    this.threshold = this.heroSection.offsetHeight * 0.75;
    // Track if nav is currently stuck
    this.isStuck = false;
    // Start listening for scroll events
    this.init();
  }

  // Set up scroll event listener
  init() {
    // Check initial scroll position
    this.checkScroll();
    // Add scroll event listener with arrow function to maintain 'this' context
    window.addEventListener('scroll', () => this.checkScroll());
  }

  // Check scroll position and update nav accordingly
  checkScroll() {
    // Get current scroll position with cross-browser support
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // If scrolled past threshold and nav isn't stuck, stick it
    if (scrollPosition > this.threshold && !this.isStuck) {
      this.stickNav();
    } 
    // If scrolled above threshold and nav is stuck, unstick it
    else if (scrollPosition <= this.threshold && this.isStuck) {
      this.unstickNav();
    }
  }

  // Make nav sticky at top of viewport
  stickNav() {
    this.isStuck = true;
    // These classes control the sticky positioning:
    this.navBar.classList.add('fixed', 'top-[100px]');  // Adjust this value to match your logo height
    this.navBar.classList.remove('absolute', 'bottom-0');

    

    console.log('stickNav called');
  }

  // Return nav to original position
  unstickNav() {
    this.isStuck = false;
    // These classes control the default positioning:
    this.navBar.classList.remove('fixed', 'top-[100px]');  // Make sure to update here too
    this.navBar.classList.add('absolute', 'bottom-0');  // Places nav at bottom

   
    console.log('unstickNav called');
  }
}

// Export class for use in other files
export default StickyNav;
