class StickyNav {
  // Initialize class properties and DOM elements
  constructor() {
    // Get reference to hero section (full height)
    this.heroSection = document.querySelector('.hero');
    // Get reference to navigation bar
    this.navBar = document.querySelector('.navbar-nav');
    // Get reference to logo container (using ID selector)
    this.logoContainer = document.querySelector('#logo-container');


    // Check if all required elements exist
    if (!this.heroSection || !this.navBar) {
      // console.error('Required DOM elements not found. StickyNav initialization aborted.');
      return;
    }

    // Set scroll threshold to 50% of hero section height
    this.threshold = this.heroSection.offsetHeight * 0.75;

    // Set logo threshold to 50% of hero section height
    this.logoThreshold = this.heroSection.offsetHeight * 0;

    // Track if nav is currently stuck
    this.isStuck = false;
    
    // Track if logo is currently stuck
    this.isLogoStuck = false;

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

    // Handle logo container positioning - keep it always fixed when scrolling
    if (scrollPosition > this.logoThreshold && !this.isLogoStuck) {
      this.stickLogo();
    } else if (scrollPosition === 0 && this.isLogoStuck) {
      this.unstickLogo();
    }
  }

  // Make nav sticky at top of viewport
  stickNav() {
    this.isStuck = true;
    // These classes control the sticky positioning:
    this.navBar.classList.add('fixed');  // Increased from 100px to 200px
    this.navBar.classList.remove('absolute', 'bottom-0');

    console.log('stickNav called');
  }
  
  // Return nav to original position
  unstickNav() {
    this.isStuck = false;
    // These classes control the default positioning:
    this.navBar.classList.remove('fixed');  // Updated to match
    this.navBar.classList.add('absolute', 'bottom-0');
    
    console.log('unstickNav called');
  }

  // Make logo sticky
  stickLogo() {
    if (!this.logoContainer) {
      console.warn('Logo container not found, cannot make sticky');
      return;
    }
    this.isLogoStuck = true;

    this.logoContainer.classList.add('fixed');

    console.log('stickLogo called');
  }

  // Return logo to original position
  unstickLogo() {
    if (!this.logoContainer) {
      console.warn('Logo container not found, cannot unstick');
      return;
    }
    this.isLogoStuck = false;
    this.logoContainer.classList.remove('fixed');

    console.log('unstickLogo called');
  }
}

// Export class for use in other files
export default StickyNav;
