// homepage_gallery_ui.js
{
  function initGalleryDesktopEventHandlers() {
    var gallery_obj = main.gallery;
    
    // 1. Perspective tracking (3D Mouse Effect)
    gallery_obj.parallax_body.addEventListener("mousemove", (e) => {
      var half_width = gallery_obj.parallax_body.clientWidth / 2,
        half_height = gallery_obj.parallax_body.clientHeight / 2,
        mouse_x = half_width + gallery_obj.parallax_body.offsetLeft - e.pageX,
        mouse_y = half_height + gallery_obj.parallax_body.offsetTop - e.pageY;
      
      if (gallery_obj.content_panel_update_paused) {
        mouse_x /= 32;
        mouse_y /= 32;
      }
      
      var max_deg = 1.25;
      window.perspective_deg_x =
        (mouse_y / half_height) * max_deg * -1 + max_deg / 2 + "deg";
      window.perspective_deg_y =
        (mouse_x / half_width) * max_deg * -1 + 2 + "deg";
      
      window.perspective_string = `rotateX(${perspective_deg_x}) rotateY(${perspective_deg_y})`;
      gallery_obj.scene.style.transform = `perspective(20em) ${perspective_string}`;
    });
    
    // 2. Global Scroll Mapper (Horizontal Move + Manual Vertical Anchoring)
    window.addEventListener("scroll", () => {
      var track = document.getElementById("gallery-section");
      var sticky_container = document.querySelector(
        ".project-parallax-container"
      );
      
      if (!track || !sticky_container) return;
      
      var rect = track.getBoundingClientRect();
      var scrollable_dist = rect.height - window.innerHeight;
      
      // Calculate Vertical Offset to "lock" all siblings to the viewport
      var vertical_offset = 0;
      if (rect.top <= 0 && rect.bottom >= 0) {
        vertical_offset = Math.abs(rect.top);
      } else if (rect.bottom < 0) {
        vertical_offset = scrollable_dist;
      }
      
      /* -- ANCHOR ALL SIBLINGS MANUALLY -- */
      var siblings = sticky_container.children;
      for (var i = 0; i < siblings.length; i++) {
        var child = siblings[i];
        
        if (child.id === "project-parallax-bookmark-container") {
          // Keep centered in the manually moved viewport
          child.style.top = vertical_offset + window.innerHeight / 2 + "px";
        } else if (child.id === "project-parallax-scroll-indicator") {
          // Keep pinned to the bottom of the manually moved viewport
          child.style.top = vertical_offset + window.innerHeight - 5 + "px";
        } else {
          // Keep backgrounds and scene pinned to the top
          child.style.top = vertical_offset + "px";
        }
      }
      
      /* -- HORIZONTAL MAPPING -- */
      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        var progress = Math.abs(rect.top) / scrollable_dist;
        gallery_obj.parallax_scroll_x =
          progress * gallery_obj.gallery_width * -1;
        
        // Apply horizontal translation
        gallery_obj.parallax_container.style.transform = `translateX(${gallery_obj.parallax_scroll_x}vh)`;
        
        // Update progress UI
        window.parallax_scroll_progress = progress * 100;
        if (gallery_obj.parallax_scroll_indicator) {
          gallery_obj.parallax_scroll_indicator.style.width = `${window.parallax_scroll_progress}vw`;
        }
      }
    });
    
    // 3. Handle Content Panel wheel specifically
    gallery_obj.parallax_body.addEventListener(
      "wheel",
      (e) => {
        var panel = e.target.closest(".content-wrapper");
        if (panel) {
          var is_at_top = panel.scrollTop <= 0 && e.deltaY < 0;
          var is_at_bottom =
            panel.scrollTop + panel.offsetHeight >= panel.scrollHeight &&
            e.deltaY > 0;
          
          if (!is_at_top && !is_at_bottom) {
            e.stopPropagation();
          }
        }
      },
      { passive: false }
    );
  }
  
  function initGalleryMobileEventHandlers() {
    var gallery_obj = main.gallery;
    
    // On mobile, the vertical scroll triggers the window 'scroll' event.
    // This handler manages UI state blocking (e.g. stopping scroll when panel is open).
    gallery_obj.parallax_body.addEventListener(
      "touchmove",
      (e) => {
        if (document.querySelectorAll(".maximised.shown").length != 0) {
          var is_over_content_panel =
            e.target.closest(".parallax-item-content-panel") !== null;
          // Prevent the whole page from scrolling if we're interacting with a panel background
          if (!is_over_content_panel) {
            e.preventDefault();
          }
        }
      },
      { passive: false }
    );
  }
  
  function initGallery() {
    var gallery_obj = main.gallery;
    var hide_elements = [];
    var parallax_elements = document.querySelectorAll(".parallax-item");
    
    for (var i = 0; i < parallax_elements.length; i++) {
      initParallaxElement(parallax_elements[i].id);
      if (
        getParent(parallax_elements[i].id).length > 0 &&
        !gallery_obj.parallax_pinned_items.includes(parallax_elements[i].id)
      )
        hide_elements.push(parallax_elements[i].id);
    }
    hide_elements = [...new Set(hide_elements)];
    
    for (var i = 0; i < hide_elements.length; i++) {
      var local_el = document.getElementById(hide_elements[i]);
      local_el.classList.add("hidden");
      var local_obj = gallery_obj.parallax_settings[local_el.id];
      if (local_obj && local_obj.animation)
        local_el.setAttribute("animation", `${local_obj.animation}`);
    }
    
    for (var i = 0; i < gallery_obj.bookmark_items.length; i++)
      addBookmarkItem(gallery_obj.bookmark_items[i], true);
  }
  
  function initGalleryUI() {
    var gallery_obj = main.gallery;
    
    gallery_obj.parallax.scalar(12.5, 35);
    
    gallery_obj.bookmark_minimise_btn.onclick = function () {
      !gallery_obj.bookmark_minimise_btn.classList.contains("minimised")
        ? hideBookmarkUI()
        : showBookmarkUI();
    };
    
    setTimeout(function () {
      var all_panels = document.querySelectorAll(
        `#main-parallax-content-panel-wrapper .content-wrapper`
      );
      for (var i = 0; i < all_panels.length; i++) {
        var title = all_panels[i].querySelector(
          `div.parallax-item-content-panel-title`
        );
        var id = all_panels[i].id
        .replace("-content-panel", "")
        .replace("-content-wrapper", "");
        
        title.innerHTML = `${title.textContent}
            <img id="${id}-close-btn" class="content-panel-close-btn" src="gfx/interface/icons/close_btn.png" draggable="false" onclick="closeContentPanel('${id}');">
            <img id="${id}-maximise-btn" class="content-panel-maximise-btn" src="gfx/interface/icons/maximise_icon.png" draggable="false" onclick="maximiseContentPanel('${id}');">
            ${
          document.getElementById(id + "-preview")
            ? `<img id="${id}-preview-btn" class="content-panel-preview-btn active" src="gfx/interface/icons/preview_icon.png" draggable="false" onclick="togglePreview('${id}', this);">`
            : ""
        }
          `;
      }
    }, 500);
    
    initGalleryDesktopEventHandlers();
    initGalleryMobileEventHandlers();
    
    // Check for visibility dependencies
    setInterval(function () {
      for (var i = 0; i < gallery_obj.parallax_selected.length; i++) {
        var item_id = gallery_obj.parallax_selected[i];
        var item_obj = gallery_obj.parallax_settings[item_id];
        if (item_obj && item_obj.dependencies) {
          item_obj.dependencies.forEach((dep_id) => {
            var el = document.getElementById(dep_id);
            if (el && el.classList.contains("hidden")) {
              el.classList.remove("hidden");
              var dep_obj = gallery_obj.parallax_settings[dep_id];
              if (dep_obj && dep_obj.show_function) dep_obj.show_function();
            }
          });
        }
      }
    }, 100);
    
    // Sync content panel overlays
    setInterval(updateContentPanelContainer, 16);
    
    initGallery();
  }
  
  function updateContentPanelContainer() {
    var gallery_obj = main.gallery;
    var main_scene = document.querySelector(".layer.main");
    
    try {
      if (!gallery_obj.content_panel_update_paused && main_scene) {
        // Sync 3D perspective
        gallery_obj.content_panel_container.style.transform =
          main_scene.style.transform;
        
        // Sync manual vertical anchoring for content panels
        var track = document.getElementById("gallery-section");
        var rect = track.getBoundingClientRect();
        if (rect.top <= 0) {
          gallery_obj.content_panel_container.style.top =
            Math.abs(rect.top) + "px";
        }
        
        // Sync horizontal scroll position
        gallery_obj.content_panel_scroll_container.style.transform = `perspective(40em) rotateX(${
          parseInt(window.perspective_deg_y.replace("deg", "")) * 0.5
        }deg) translateX(${gallery_obj.parallax_scroll_x}vh)`;
        
        gallery_obj.content_panel_container.style.left = `0vh`;
      }
    } catch (err) {}
  }
}