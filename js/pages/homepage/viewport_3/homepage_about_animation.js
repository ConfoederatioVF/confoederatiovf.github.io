//Initialise banner namespace
{
  //Event handler function
  function homepageAboutOnScroll () { //[WIP] - Move this to a general parallax framework
    try {
      if (ministrat.main.game_open) return; //Disable parallax when Ministrat is open
      
      //Set main.vh
      main.vh = window.innerHeight/100;

      //Declare local instance variables
      var scroll_vh = window.scrollY/main.vh;
      var banner_obj = main.banner;
      
      initParallax(document.getElementById("about-me-section"), "#about-me-overlay-title");
      initParallax(document.getElementById("about-me-section"), "#about-me-overlay", {
        direction: "right",
        distance: 250
      });

      /*
      //16vh offset
      banner_obj.about_me_overlay_title.style.transform = `translateY(${(18/200)*scroll_vh - (24 - 24*(scroll_vh/main.about.y))}vh)`;

      //24vh offset
      banner_obj.about_me_overlay_subtitle.style.opacity = (1/80)*(scroll_vh - 80);
      banner_obj.about_me_overlay_subtitle.style.transform = `translateY(${(44.5/200)*scroll_vh}vh)`;
      banner_obj.biography_overlay_subtitle.style.opacity = (1/80)*(scroll_vh - 80);
      banner_obj.biography_overlay_subtitle.style.transform = `translateY(${(44.5/200)*scroll_vh}vh)`;

      //20vh offset
      banner_obj.about_body_container.style.opacity = (1/80)*(scroll_vh - 80);
      banner_obj.about_body_container.style.transform = `translateY(${((50)/200)*scroll_vh}vh)`;
       */
    } catch (e) {
      console.log(e);
    }
  }
  
  /**
   * Applies a parallax effect to elements within a specific scope.
   * The elements align to their natural DOM position as the scope
   * scrolls through the viewport.
   *
   * @param {HTMLElement} scope - The container tracking the scroll progress.
   * @param {string} selector - CSS selector for parallax items.
   */
  function initParallax(scope, selector, arg2_options) {
    const items = scope.querySelectorAll(selector);
    let options = (arg2_options) ? arg2_options : {};
    
    const updatePositions = () => {
      const rect = scope.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate progress: 0 when scope top enters bottom of viewport,
      // 1 when scope top reaches top of viewport (or passes it).
      // Adjust logic if you want 1 to be when the scope bottom leaves.
      const start = viewportHeight;
      const end = 0;
      const current = rect.top;
      
      // Progress is a value from 0 to 1
      let progress = (start - current) / (start - end);
      progress = Math.max(0, Math.min(1, progress));
      
      items.forEach((item) => {
        // Get settings from data attributes
        const direction = options.direction || "top";
        const distance = parseFloat(options.distance) || 100;
        const opacityEnabled = options.fade;
        
        // Calculate the remaining offset
        // When progress is 1, offset is 0.
        const offset = distance * (1 - progress);
        
        let transform = "";
        switch (direction) {
          case "top":
            transform = `translateY(${-offset}px)`;
            break;
          case "bottom":
            transform = `translateY(${offset}px)`;
            break;
          case "left":
            transform = `translateX(${-offset}px)`;
            break;
          case "right":
            transform = `translateX(${offset}px)`;
            break;
        }
        
        item.style.transform = transform;
        item.style.opacity = progress;
      });
    };
    
    // Use IntersectionObserver to optimize: only listen to scroll when scope is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", updatePositions);
          updatePositions();
        } else {
          window.removeEventListener("scroll", updatePositions);
        }
      },
      { threshold: 0 },
    );
    
    observer.observe(scope);
  }
}
