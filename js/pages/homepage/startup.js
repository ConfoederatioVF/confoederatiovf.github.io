//Initialise main variable
window.main = {
  banner: {},
  gallery: {
    //Viewport dimensions
    viewport_height: document.documentElement.clientHeight/100,
    viewport_width: document.documentElement.clientWidth/100,

    //UI Patterns
    exempt_id_patterns: [
      "body-text",
      "btn",
      "content-panel", 
      "development-date",
      "divider",
      "indicator",
      "preview",
      "project-parallax-bookmark-label",
      "project-parallax-bookmark-minimise-icon",
      "project-parallax-bookmark-text-icon",
      "status",
      "text-wrapper",
      "title"
    ],
    panel_id_patterns: [
      "body-text",
      "content-panel",
      "development-date", 
      "divider",
      "indicator",
      "preview",
      "project-parallax-bookmark-label",
      "project-parallax-bookmark-minimise-icon",
      "project-parallax-bookmark-text-icon",
      "status",
      "text-wrapper",
      "title"
    ],

    //State variables
    can_scroll_further: false,
    closing_bookmark: false,

    //Parallax settings configuration
    parallax: new Parallax(document.getElementById("scene")),
    parallax_settings: {}
  },
  about: {
    y: 200 //scrollY in vh
  }
};

//[QUARANTINE]
window.loadScript = function (src, options = {}) {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded to avoid duplicates
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    
    const script = document.createElement("script");
    script.src = src;
    script.async = options.async !== false;
    
    // Handle additional attributes (e.g., type="module")
    if (options.type) {
      script.type = options.type;
    }
    
    // Success event
    script.onload = () => {
      resolve(script);
    };
    
    // Error event
    script.onerror = () => {
      reject(new Error(`Script load error: ${src}`));
    };
    
    // Append to head (or body)
    document.head.appendChild(script);
  });
}

window.initGlobal = function () {
  //Declare local instance variables
  let config_obj = config.homepage;
  
  document.querySelectorAll("body")[0].remove();
  
  for (let i = 0; i < config_obj.head_js_files.length; i++)
    loadScript(config_obj.head_js_files[i]);
  for (let i = 0; i < config_obj.body_js_files.length; i++)
    loadScript(config_obj.body_js_files[i]);
  
  window.initialisation_loop = setInterval(() => {
    try {
      //Reset main.gallery.parallax
      setTimeout(function(){
        main.gallery.parallax = new Parallax(document.getElementById("scene"));
        console.log(main.gallery.parallax.scalarX, main.gallery.parallax.scalarY);
      }, 1000);
      
      //Initialise main
      let common_selectors = config.homepage.defines.common.selectors;
      
      //Add common_selectors to main
      let all_viewport_one_selectors = Object.keys(common_selectors.viewport_one);
      let all_viewport_two_selectors = Object.keys(common_selectors.viewport_two);
      
      //Iterate over all viewport one selectors
      for (let i = 0; i < all_viewport_one_selectors.length; i++)
        main.banner[all_viewport_one_selectors[i]] = common_selectors.viewport_one[all_viewport_one_selectors[i]];
      //Iterate over all viewport two selectors
      for (let i = 0; i < all_viewport_two_selectors.length; i++)
        main.gallery[all_viewport_two_selectors[i]] = common_selectors.viewport_two[all_viewport_two_selectors[i]];
      
      //Hack fix for glitched elements
      setTimeout(function () {
        //Viewport 1
        //Start top-banner animation for homepage
        homepageBannerAnimation();
        
        settings_btn.setAttribute("class", "settings-btn hidden");
        
        //Viewport 2
        //Gallery
        initGalleryTiles();
        initGalleryUI();
        
        homepageAboutOnScroll();
      }, 1);
      
      setTimeout(function () {
        //General fix
        fixMobileVh();
        
        //Viewport 2
        //Initialise magnifiers for all .preview-image elements
        let all_art_preview_imgs = document.querySelectorAll(".preview-image-container");
        initialiseHomepageBannerUI();
        
        for (let i = 0; i < all_art_preview_imgs.length; i++)
          magnify(all_art_preview_imgs[i].querySelector("img"), 3);
        
        //Viewport 3 scroll handling
        setInterval(function () {
          var title_offset_y = document.getElementById("about-me-overlay").scrollTop*-1;
          main.banner.about_me_overlay_title.style.top = `calc(-14dvh + ${title_offset_y}px)`;
        }, 0);
      }, 650);
      
      clearInterval(window.initialisation_loop);
    } catch (e) { console.error(e); }
  }, 100);
};
initGlobal();

