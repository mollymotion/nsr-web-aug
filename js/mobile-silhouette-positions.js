document.addEventListener('DOMContentLoaded', function() {
  // Only run on mobile
  if (window.innerWidth <= 768) {
    console.log("Mobile detected - positioning silhouettes next to h2 headings");
    updateHeaderPositions();
    
    // Update when scrolling or resizing
    window.addEventListener('resize', updateHeaderPositions);
    window.addEventListener('scroll', debounceEvent(updateHeaderPositions, 100));
  }
  
  function updateHeaderPositions() {
    const root = document.documentElement;
    
    // Find h2 elements in each section
    const videosHeader = document.querySelector('#videos h2');
    const pressHeader = document.querySelector('#press h2');
    const contactHeader = document.querySelector('#contact h2');
    
    // Set variables based on h2 positions
    if (videosHeader) {
      const top = videosHeader.getBoundingClientRect().top + window.scrollY;
      root.style.setProperty('--videos-section-top', top + 'px');
    }
    
    if (pressHeader) {
      const top = pressHeader.getBoundingClientRect().top + window.scrollY;
      root.style.setProperty('--press-section-top', top + 'px');
    }
    
    if (contactHeader) {
      const top = contactHeader.getBoundingClientRect().top + window.scrollY;
      root.style.setProperty('--contact-section-top', top + 'px');
    }
  }
  
  function debounceEvent(func, wait) {
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }
});