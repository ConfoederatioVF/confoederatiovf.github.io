//Initialise functions
{
  function applySettingsButtonFunctionality () {
    //Increment click counter
    settings_btn_clicked++;
    
    //Toggle switch
    settings_window_open = (settings_window_open) ? false : true;
    
    //Open/close settings window
    updateSettingsPanel();
    
    settings_btn.onclick = function () {
      applySettingsButtonFunctionality();
    };
  }
  
  /*
    clearText() - Clears text from the main animation banner.
    options: {
      banner_el: (HTMLElement) - The HTML banner element to type in
      caret_spacer_el: (HTMLElement) - The HTML element that represents the typing caret
    }
  */
  function clearText (arg0_options) {
    //Convert from parameters
    var options = (arg0_options) ? arg0_options: {};
    
    //Declare local instance variables
    var banner_el = options.banner_el;
    var caret_spacer_el = options.caret_spacer_el;
    
    //Clear selected variables
    if (caret_spacer_el) {
      var caret_spacer_el_class = (caret_spacer_el.getAttribute("class")) ?
        caret_spacer_el.getAttribute("class") : "";
      
      if (caret_spacer_el_class.length > 0)
        caret_spacer_el.setAttribute("class", caret_spacer_el_class.replace("selected", ""));
    }
    
    //Clear text
    banner_el.innerHTML = "";
  }
  
  function fetchLavaLampTransformProperties (arg0_string) {
    //Convert from parameters
    var local_transform_string = arg0_string;
    
    //Declare instance variables
    var rotate_arg_one = "",
      rotate_arg_two = "",
      translate_arg = "";
    
    //Parse string
    local_transform_string = local_transform_string.replace(/rotate\(/gm, "");
    local_transform_string = local_transform_string.replace(/\) translate\(/gm, " ");
    local_transform_string = local_transform_string.replace(/\) rotate\(/gm, " ");
    local_transform_string = local_transform_string.replace(/\)/gm, "");
    
    return local_transform_string.split(" ");
  }
  
  function generateRaindropID () {
    //Declare instance variables
    var current_iteration = 0;
    var valid_id = "";
    
    while (true) {
      //Declare and initialise local instance variables
      var all_raindrop_elements = raindrop_container.querySelectorAll(".raindrop");
      var all_raindrop_ids = [];
      for (var i = 0; i < all_raindrop_elements.length; i++) all_raindrop_ids.push(all_raindrop_elements[i].getAttribute("id").replace("raindrop-", ""));
      
      //Try to fetch valid ID
      var new_id = randomNumber(0, 1000000000).toString();
      if (!all_raindrop_ids.includes(new_id)) {
        valid_id = new_id;
        break;
      }
      
      //Break it off after 15 iterations
      current_iteration++;
      if (current_iteration > 15) break;
    }
    
    return valid_id;
  }
  
  function homepageBannerAnimation () {
    //Begin playing video background
    main_video_bg.play();
    
    //Begin animation sequence; make sure animation isn't paused
    if (!banner_settings.paused_animation) {
      setTimeout(function(){
        typeText({ //Type 'NÉRMORNES'
          apply_class: "homepage-banner-text-subelement", //Applying this prevents noticeable index cropping
          banner_el: banner_title_text,
          text: "NÉRMORNES,"
        })
        .then(() => { //Select text; clear text
          return selectText({
            banner_el: banner_title_text,
            caret_el: banner_caret_element,
            caret_spacer_el: banner_caret_spacer_element
          });
        })
        .then(() => delay(400)) //400ms delay
        .then(() => { //Clear text
          clearText({
            banner_el: banner_title_text,
            caret_spacer_el: banner_caret_spacer_element
          });
        })
        .then(() => {
          homepageBannerResetFontSize(); //Reset font size after clearing
        })
        .then(() => delay(350)) //350ms delay
        .then(() => { //Type 'WE'RE CONFOEDERATIO'
          return typeText({
            apply_class: "homepage-banner-text-subelement",
            banner_el: banner_title_text,
            initial_typing_speed: 400,
            text: "WE'RE CONFOEDERATIO;"
          });
        })
        .then(() => delay(1250)) //1250ms delay
        .then(() => {
          return selectText({
            banner_el: banner_title_text,
            caret_el: banner_caret_element,
            caret_spacer_el: banner_caret_spacer_element,
            select_speed: 50
          });
        })
        .then(() => delay(450)) //450ms delay
        .then(() => { //Clear text
          clearText({
            banner_el: banner_title_text,
            caret_spacer_el: banner_caret_spacer_element
          });
        })
        .then(() => {
          homepageBannerResetFontSize(); //Reset font size after clearing
        })
        .then(() => delay(1500)) //1500ms delay
        .then(() => { //Add text 'WHEN'
          homepageBannerSetText(`WHEN`);
        })
        .then(() => delay(250)) //250ms delay
        .then(() => { //Add text ' WE BUILD'
          homepageBannerSetText(`WHEN WE BUILD`);
        })
        .then(() => delay(100)) //100ms delay
        .then(() => { //Expand font size
          homepageBannerChangeFontSize(30);
        })
        .then(() => delay(350)) //350ms delay
        .then(() => { //Blinking caret fades out now
          document.getElementById("homepage-caret-wrapper").setAttribute("class", "fade-out");
          
          //Display override
          document.getElementById("homepage-caret-wrapper").style.display = "none";
          caret_fadeout_finished = true;
        })
        .then(() => delay(3000)) //3000ms delay
        .then(() => { //Type '/'
          homepageBannerChangeRawFontSize(50);
          return homepageBannerSetText(`<span class = "enlarged-slash">/</span>`);
        })
        .then(() => delay(1000)) //1000ms delay
        .then(() => { //Set text 'LET US THINK'
          //Remove enlarged slash positioning
          title_element.setAttribute("class", title_element.getAttribute("class").replace(" slash-positioning", ""));
          
          //Set text
          homepageBannerChangeRawFontSize(24);
          homepageBannerSetText(`LET US THINK`);
        })
        .then(() => delay(1100)) //1100ms delay
        .then(() => { //Set text 'WE BUILD FOREVER'
          //Enlarge font temporarily
          homepageBannerSetText(`WE BUILD FOREVER`);
        })
        .then(() => delay(1200)) //1200ms delay
        .then(() => { //Bring back the caret; reset font size
          document.getElementById("homepage-caret-wrapper").setAttribute("class", "");
          document.getElementById("homepage-caret-wrapper").style.display = "inline";
          homepageBannerTitleAdjustPosition();
          homepageBannerResetFontSize();
          
          adjustFontSize(title_element, banner_title_text, { homepage_banner: true });
        })
        .then(() => delay(700)) //700ms delay
        .then(() => { //Select text
          return selectText({
            banner_el: banner_title_text,
            caret_el: banner_caret_element,
            caret_spacer_el: banner_caret_spacer_element,
            select_speed: 0
          });
        })
        .then(() => delay(250)) //250ms delay
        .then(() => {
          clearText({
            banner_el: banner_title_text,
            caret_spacer_el: banner_caret_spacer_element
          });
        })
        .then(() => delay(300)) //300ms delay
        .then(() => { //Normalise font sizing
          homepageBannerChangeRawFontSize(20);
          homepageBannerTitleAdjustPosition();
        })
        .then(() => delay(2000)) //2000ms delay
        .then(() => { //Type 'EDIT ME.'
          banner_title_text.setAttribute("contenteditable", "true");
          homepageBannerChangeAnimation();
          
          return typeText({
            apply_class: "homepage-banner-text-subelement",
            banner_el: banner_title_text,
            initial_typing_speed: 400,
            slowdown: -0.50, //Slowdown at 1/2 rate
            text: "EDIT ME."
          });
        })
        .then(() => delay(300)) //300ms delay
        .then(() => { //Select text
          return selectText({
            banner_el: banner_title_text,
            caret_el: banner_caret_element,
            caret_spacer_el: banner_caret_spacer_element,
            select_speed: 50
          });
        })
        .then(() => delay(200)) //200ms delay
        .then(() => { //Clear text
          clearText({
            banner_el: banner_title_text,
            caret_spacer_el: banner_caret_spacer_element
          });
        })
        .then(() => delay(100)) //100ms delay
        .then(() => { //Type 'TYPE ANYTHING'
          homepageBannerResetFontSize();
          
          return typeText({
            apply_class: "homepage-banner-text-subelement",
            banner_el: banner_title_text,
            initial_typing_speed: 350,
            text: "TYPE ANYTHING"
          });
        })
        .then(() => delay(500)) //500ms delay
        .then(() => { //Add break; begin custom 'HELLO' typing animation
          homepageBannerResetFontSize();
          homepageBannerTypeHello();
        });
      }, 1000);
    }
    
    //Begin playing misty_forest.mp4 after
    var switched_backgrounds = false;
    
    main_video_bg.onended = function () {
      //Make sure you can only switch backgrounds once when the page is loaded
      if (!switched_backgrounds) {
        switched_backgrounds = true;
        homepageBannerChangeBanner("misty_forest");
        
        //Set wait commands for changing the background. Transitions should be 'jarring' as specified
        setTimeout(function(){
          homepageBannerChangeBanner("cleveland_fog");
        }, 4000);
        setTimeout(function(){
          homepageBannerChangeBanner("triumph_and_tragedy");
        }, 8000);
        setTimeout(function(){
          homepageBannerChangeBanner("lava_lamp");
        }, 12000);
        setTimeout(function(){
          homepageBannerChangeBanner("rain");
          homepageBannerDisplayDots();
          lava_lamp_animation_paused = true;
          
          //Mark animation as finished
          title_element.setAttribute("class", title_element.getAttribute("class") + " finished-animation");
        }, 16000);
      }
      
      main_video_bg.loop = true;
      if (main_video_bg.ended)
        main_video_bg.play();
    };
    
    //Main loop logic
    setInterval(function(){
      //Check if text is selected or not
      banner_settings.text_selected = (document.activeElement.getAttribute("id") == banner_title_text.getAttribute("id"));
      
      //Pause all animations if text is selected, and increment time_since_selection
      if (banner_settings.text_selected) {
        if (!banner_selected_once) homepageBannerCentreAlign();
        banner_selected_once = true;
        banner_settings.paused_animation = true;
        time_since_selection = 0;
        
        //Strip formatting from all copy/pasted text
        if (!content_editable_evt_listeners_added) banner_title_text.addEventListener("paste", function (e) {
          e.preventDefault();
          var text = e.clipboardData.getData("text/plain");
          document.execCommand("insertHTML", false, text);
        });
      } else {
        //Make sure content is always able to be selected
        if (banner_settings.paused_animation) banner_title_text.innerHTML = (banner_title_text.innerText.replace(/\n/gm, "").length == 0) ? "HELLO;" : banner_title_text.innerHTML;
        //Increment time since selection so that we can keep track of when the animation should be unpaused again
        time_since_selection++;
      }
      
      //Unpause animation if time_since_selection exceeds animation_threshhold
      banner_settings.paused_animation =
        (time_since_selection > banner_settings.animation_threshhold) ? false : banner_settings.paused_animation;
    }, 100);
  }
  
  function homepageBannerCentreAlign () {
    title_element.setAttribute("alignment", "centre");
    
    //Update selected button in settings
    var all_alignments = document.querySelectorAll(".text-alignment-button");
    for (var i = 0; i < all_alignments.length; i++) all_alignments[i].setAttribute("class", "text-alignment-button");
    document.getElementById("change-centre-alignment").setAttribute("class", "text-alignment-button selected");
  }
  
  function homepageBannerChangeAnimation () {
    //Declare tracker variables
    window.homepage_banner = {
      change_speed: [],
      colour_index: 0,
      current_speed: 1500
    };
    
    for (var i = 0; i < banner_settings.overlay.default_splash_colours.length; i++) {
      //Decrement starting speed by random amount, make sure that people don't get seizures
      homepage_banner.current_speed -= Math.min(homepage_banner.current_speed*0.25*Math.random(), 100);
      homepage_banner.current_speed = (homepage_banner.current_speed < 100) ? 100 : homepage_banner.current_speed;
      homepage_banner.change_speed.push(homepage_banner.current_speed);
      
      //Fetch current_delay
      var current_delay = sumArray(homepage_banner.change_speed);
      
      //Set timeout animation for current colour
      setTimeout(function(){
        //Change current colour filter
        var current_colour = banner_settings.overlay.default_splash_colours[homepage_banner.colour_index];
        var current_opacity = randomElement([20, 25, 30]).toString();
        
        //Set opacity for final element if reached
        current_opacity = (current_colour == banner_settings.overlay.default_splash_colours[banner_settings.overlay.default_splash_colours.length-1]) ? 25 : current_opacity;
        
        homepageBannerChangeOpacity(current_opacity);
        homepageBannerChangeOverlay(current_colour);
        homepage_banner.colour_index++;
      }, current_delay);
    }
  }
  
  function homepageBannerChangeBanner (arg0_new_banner) {
    //Convert from parameters
    var new_banner = arg0_new_banner;
    
    //Set dot indicator to active
    homepageBannerClearAllDots();
    document.getElementById("change-banner-btn-" + new_banner).setAttribute("class", "homepage-banner-change-bg-btn active");
    
    //Update settings UI
    var all_bg_btn_elements = document.querySelectorAll(".change-bg-container .change-bg-select-option-container");
    for (var i = 0; i < all_bg_btn_elements.length; i++) all_bg_btn_elements[i].setAttribute("class", "change-bg-select-option-container");
    
    document.getElementById("change-bg-" + new_banner + "-container").setAttribute("class", "change-bg-select-option-container selected");
    
    //Switch to new banner
    current_banner = new_banner;
    switch (new_banner) {
      case "cleveland_fog":
        homepageBannerHideAllElements(cleveland_national_forest_bg);
        break;
      case "lava_lamp":
        homepageBannerHideAllElements(lava_lamp_bg);
        lava_lamp_animation_paused = false;
        break;
      case "main_video":
        homepageBannerHideAllElements(main_video_bg);
        //Play main_video_bg
        main_video_bg.currentTime = 0;
        main_video_bg.play();
        break;
      case "misty_forest":
        homepageBannerHideAllElements(misty_forest_bg);
        //Play misty_forest_bg
        misty_forest_bg.currentTime = 0;
        misty_forest_bg.play();
        break;
      case "rain":
        homepageBannerHideAllElements(raindrop_bg);
        raindrop_animation_paused = false; //Saves performance
        break;
      case "triumph_and_tragedy":
        homepageBannerHideAllElements(triumph_and_tragedy_bg);
        break;
    }
  }
  
  function homepageBannerChangeFont (arg0_new_font) {
    //Convert from parameters
    var new_font_family = arg0_new_font;
    
    //Declare instance variables
    var font_obj = banner_settings.fonts[new_font_family];
    
    //Apply font
    current_font = new_font_family;
    banner_title_text.style.fontFamily = font_obj.name;
    banner_caret_element.style.fontFamily = font_obj.name;
    banner_caret_spacer_element.style.fontFamily = font_obj.name;
    
    currently_selected_font.style.fontFamily = font_obj.name;
    
    //Update settings UI
    var new_font_weight_value = parseInt(banner_title_text.style.fontWeight);
    new_font_weight_value = new_font_weight_value/((font_obj.font_weight[1]-font_obj.font_weight[0])/100);
    
    document.getElementById("settings-change-font-weight").value = new_font_weight_value;
  }
  
  function homepageBannerChangeFontSize (arg0_font_size) {
    //Convert from parameters
    var font_size = arg0_font_size;
    
    //Declare local instance variables
    var new_font_size = (((banner_settings.font_size[1]-banner_settings.font_size[0])/100)*font_size)+banner_settings.font_size[0];
    var new_top = (100-new_font_size)/2;
    
    banner_title_text.style.fontSize = `${new_font_size}vh`;
    banner_caret_element.style.fontSize = `${new_font_size}vh`;
    banner_caret_spacer_element.style.fontSize = `${new_font_size}vh`;
    
    window.percentage_string = new_top;
    
    adjustFontSize(title_element, banner_title_text, { homepage_banner: true });
  }
  
  function homepageBannerChangeFontWeight (arg0_font_weight) {
    //Convert from parameters
    var font_weight = arg0_font_weight;
    
    //Declare instance variables
    var base_font_weight = banner_settings.fonts[current_font].font_weight[0];
    var new_font_weight = (((banner_settings.fonts[current_font].font_weight[1]-base_font_weight)/100)*font_weight)+base_font_weight;
    
    //Apply font weight
    banner_title_text.style.fontWeight = new_font_weight;
    current_font_weight = new_font_weight;
  }
  
  function homepageBannerChangeOpacity (arg0_opacity) {
    //Convert from parameters
    var new_opacity = arg0_opacity/100;
    var raw_opacity = arg0_opacity;
    
    //Change actual opacity
    homepage_banner_overlay.style.opacity = new_opacity.toString();
    
    //Update settings UI
    document.getElementById("settings-change-opacity").value = raw_opacity;
  }
  
  function homepageBannerChangeOverlay (arg0_colour) {
    //Convert from parameters
    var new_colour = arg0_colour;
    
    homepage_banner_overlay.style.filter = banner_settings.overlay.colours[new_colour].filter;
    current_overlay = new_colour;
    
    //Set settings indicator
    var all_overlay_elements = document.querySelectorAll(".change-overlay-container > .change-overlay-select-option-container");
    
    for (var i = 0; i < all_overlay_elements.length; i++) all_overlay_elements[i].setAttribute("class",
      all_overlay_elements[i].getAttribute("class").replace(" selected", "")
    );
    
    document.getElementById("change-overlay-" + new_colour + "-container").setAttribute("class", "change-overlay-select-option-container selected");
  }
  
  function homepageBannerChangeRawFontSize (arg0_font_size) {
    //Convert from parameters
    var font_size = arg0_font_size;
    
    //Declare instance variables
    var new_font_size = (font_size-banner_settings.font_size[0])/((banner_settings.font_size[1]-banner_settings.font_size[0])/100);
    
    //Apply new font size
    homepageBannerChangeFontSize(new_font_size);
    document.getElementById("settings-change-font-size").value = new_font_size;
  }
  
  function homepageBannerClearAllDots () {
    var all_dots = document.querySelectorAll(".homepage-banner-dots-container div");
    
    for (var i = 0; i < all_dots.length; i++) all_dots[i].setAttribute("class", "homepage-banner-change-bg-btn");
  }
  
  function homepageBannerDisplayDots () {
    //Declare local instance variables
    var background_keys = Object.keys(banner_settings.backgrounds);
    var total_time_taken = 0;
    
    for (var i = 0; i < background_keys.length; i++) {
      var local_background = background_keys[i];
      var local_id = "change-banner-btn-" + local_background;
      
      var local_el = document.getElementById(local_id);
      
      //Add animation
      local_el.style.transform = "translateY(100vh)";
      local_el.style.animation = "homepage-top-banner-btn-hop-up 1.5s forwards";
      local_el.style.animationDelay = `${i*(i*0.25)/4}s`;
      
      //Increment total_time_taken
      total_time_taken += i*(i*0.25)/4;
      
      //Add tooltip
      tippy("#" + local_id, {
        content: banner_settings.backgrounds[background_keys[i]].name
      });
    }
    
    //Display settings fade in animation
    setTimeout(function(){
      settings_btn.setAttribute("class",
        "settings-btn settings-btn-animated-fade-in"
      );
      resetAnimation(settings_btn);
      
      chevron_icon.setAttribute("class",
        chevron_icon.getAttribute("class").replace(" hidden", "")
      );
    }, total_time_taken*1000);
  }
  
  function homepageBannerHideAllElements (arg0_exception) {
    //Convert from parameters
    var exception_element = arg0_exception;
    var background_elements = [
      cleveland_national_forest_bg,
      lava_lamp_bg,
      main_video_bg,
      misty_forest_bg,
      raindrop_bg,
      triumph_and_tragedy_bg
    ];
    for (var i = 0; i < background_elements.length; i++) {
      if (exception_element.getAttribute("id") == background_elements[i].getAttribute("id")) {
        background_elements[i].setAttribute("class", background_elements[i].getAttribute("class").replace(" hidden", ""));
      } else {
        //Make sure hidden parameter isn't already included
        if (!background_elements[i].getAttribute("class").includes("hidden")) {
          background_elements[i].setAttribute("class", background_elements[i].getAttribute("class") + " hidden");
        }
      }
    }
    
    //Performance optimisations
    lava_lamp_animation_paused = true;
    raindrop_animation_paused = true;
  }
  
  function homepageBannerHideDots () {
    //Declare local instance variables
    var reversed_bg_array = Object.keys(banner_settings.backgrounds).reverse();
    
    //Settings fade out animation
    settings_btn.setAttribute("class",
      "settings-btn settings-btn-animated-fade-out"
    );
    resetAnimation(settings_btn);
    
    chevron_icon.setAttribute("class",
      chevron_icon.getAttribute("class") + " hidden"
    );
    
    //Hide buttons
    setTimeout(function(){
      for (var i = 0; i < reversed_bg_array.length; i++) {
        var local_background = reversed_bg_array[i];
        var local_id = "change-banner-btn-" + local_background;
        
        //Add animation
        document.getElementById(local_id).style.transform = "translateY(0vh)";
        document.getElementById(local_id).style.animation = "homepage-top-banner-btn-hop-down 1.5s forwards";
        document.getElementById(local_id).style.animationDelay = `${i*(i*0.25)/4}s`;
      }
    }, 1000);
  }
  
  function homepageBannerLeftAlign () {
    //Cache old style for future restoration
    title_element.setAttribute("alignment", "left");
    
    //Update selected button in settings
    var all_alignments = document.querySelectorAll(".text-alignment-button");
    for (var i = 0; i < all_alignments.length; i++) all_alignments[i].setAttribute("class", "text-alignment-button");
    document.getElementById("change-left-alignment").setAttribute("class", "text-alignment-button selected");
  }
  
  function homepageBannerResetFontSize () {
    banner_title_text.style.fontSize = "";
    banner_caret_element.style.fontSize = "";
    banner_caret_spacer_element.style.fontSize = "";
  }
  
  function homepageBannerRightAlign () {
    //Cache old style for future restoration
    title_element.setAttribute("alignment", "right");
    
    //Update selected button in settings
    var all_alignments = document.querySelectorAll(".text-alignment-button");
    for (var i = 0; i < all_alignments.length; i++) all_alignments[i].setAttribute("class", "text-alignment-button");
    document.getElementById("change-right-alignment").setAttribute("class", "text-alignment-button selected");
  }
  
  function homepageBannerSetText (arg0_text) {
    //Convert from parameters
    var text = arg0_text;
    
    //Set .innerHTML
    banner_title_text.innerHTML = text;
    homepageBannerTitleAdjustPosition();
    
    adjustFontSize(title_element, banner_title_text, { homepage_banner: true });
  }
  
  function homepageBannerTitleAdjustPosition () {
    //Set vertical offset
    var scroll_y = window.pageYOffset;
    
    //Fetch current percentage
    var current_class = title_element.getAttribute("class");
    
    //Set translateY
    /*title_element.style.top = `calc(${percentage_string}% + ${scroll_y*-1.0025}px)`;
    settings_container.style.bottom = `calc(8vh + ${scroll_y*0.7}px)`;
    document.getElementById("project-parallax-container").style.top = `calc(100% - ${scroll_y*0.25}px)`;
    document.getElementById("about-me-section").style.top = `calc(200% - ${scroll_y*0.25}px)`;*/
  }
  
  function homepageBannerToggleCaret () {
    //Declare local instance variables
    var caret_input = document.getElementById("settings-display-caret");
    var caret_wrapper = document.getElementById("homepage-caret-wrapper");
    
    //Apply new opacity
    caret_wrapper.style.opacity = (caret_input.checked) ? 1 : 0;
  }
  
  function homepageBannerTypeHello () {
    if (!banner_settings.paused_animation) {
      banner_title_text.innerHTML = "";
      homepageBannerLeftAlign();
      
      typeText({
        banner_el: banner_title_text,
        initial_typing_speed: 650,
        text: "AVREU"
      })
      .then(() => delay(1000)) //1000ms delay
      .then(() => { //Set Text: MOINE
        banner_title_text.innerHTML = `MOINE`;
      })
      .then(() => delay(800)) //800ms delay
      .then(() => { //Set Text: SALUT
        banner_title_text.innerHTML = `SALUT`;
      })
      .then(() => delay(500)) //500ms delay
      .then(() => { //Set text: HALLO
        banner_title_text.innerHTML = `HALLO`;
      })
      .then(() => delay(350)) //350ms delay
      .then(() => { //Set text: HELLO
        banner_title_text.innerHTML = `HELLO`;
        
        banner_settings.finished_animation = true;
      });
    }
  }
  
  function initLavaLampCycle () {
    //Reinitialise animations
    window.lava_lamp_cycling_animation = TweenMax.staggerFromTo(".lava-lamp-blob", 8, {
      cycle: {
        attr: function (i) {
          var r = i*90,
            r_limit = i*90+360;
          
          //Fetch blob properties and reset r if necessary
          var blob_properties = fetchLavaLampTransformProperties(document.querySelectorAll(".lava-lamp-blob")[i].getAttribute("transform"));
          
          //Check for r
          var actual_r = parseInt(blob_properties[0]);
          actual_r = (actual_r >= r_limit*0.9) ? actual_r-360 : actual_r;
          
          return {
            transform: `rotate(${actual_r}) translate(${blob_properties[1].split(",")[0]}, 0) rotate(${actual_r*-1})`
          }
        }
      }
    }, {
      cycle: {
        attr: function (i) {
          var r = i*90+360;
          return {
            transform: "rotate(" + r + ") translate(" + lava_lamp_bg_circuit + ", 0.1) rotate(" + r*-1 + ")"
          }
        }
      },
      ease: Linear.easeNone,
      repeat: -1
    });
  }
  
  function initialiseBackgroundSettings () {
    //Declare instance variables
    var all_backgrounds = Object.keys(banner_settings.backgrounds);
    
    //Initialise DOM elements
    for (var i = 0; i < all_backgrounds.length; i++) {
      var local_background = banner_settings.backgrounds[all_backgrounds[i]];
      settings_bg_container.innerHTML += `
        <div id = "change-bg-${all_backgrounds[i]}-container" class = "change-bg-select-option-container" onclick = 'if (current_banner != "${all_backgrounds[i]}") homepageBannerChangeBanner("${all_backgrounds[i]}");'>
          <div id = "change-bg-${all_backgrounds[i]}" class = "change-bg-select-option" style = 'background-image: url("gfx/interface/${all_backgrounds[i]}_bg.png");'></div>
          <center class = "image-container">
            <img src = "gfx/interface/icons/checkmark.png" class = "checkmark" draggable = "false"></img>
          </center>
          <center class = "text-container">
            <span class = "change-bg-desc">${local_background.name}</span>
          </center>
        </div>
      `;
    }
  }
  
  function initialiseFontSettings () {
    //Declare local instance variables
    var all_fonts = Object.keys(banner_settings.fonts);
    
    for (var i = 0; i < all_fonts.length; i++) settings_font_select.innerHTML += `
      <option style = "
        font-family: ${banner_settings.fonts[all_fonts[i]].name};
        text-transform: capitalize;
      " value = "${all_fonts[i]}">${banner_settings.fonts[all_fonts[i]].name}</option>
    `;
    
    //Initialise slim select
    var font_selection = new SlimSelect({
      select: "#settings-change-font-family",
      showSearch: false,
      onChange: (info) => {
        homepageBannerChangeFont(font_selection.selected());
      }
    });
    window.currently_selected_font = document.querySelector(".ss-main.font-family-dropdown > .ss-single-selected > .placeholder");
    currently_selected_font.style.fontFamily = banner_settings.fonts[current_font].name;
  }
  
  function initialiseHomepageBannerUI () {
    //Initialise DOM elements/buttons
    var all_backgrounds = Object.keys(banner_settings.backgrounds);
    
    for (var i = 0; i < all_backgrounds.length; i++) {
      var local_background = all_backgrounds[i];
      
      //Substantiate element
      dots_container.innerHTML += `
        <div id = "change-banner-btn-${local_background}" class = "homepage-banner-change-bg-btn"
          onclick = "homepageBannerChangeBanner('${local_background}');"
        ></div>
      `;
    }
  }
  
  function initialiseOverlaySettings () {
    //Declare instance variables
    var all_colours = Object.keys(banner_settings.overlay.colours);
    
    //Initialise DOM elements
    for (var i = 0; i < all_colours.length; i++) {
      var selected = (current_overlay == all_colours[i]) ? "selected" : "";
      var local_overlay = banner_settings.overlay.colours[all_colours[i]];
      settings_overlay_container.innerHTML += `
        <div id = "change-overlay-${all_colours[i]}-container" class = "change-overlay-select-option-container ${selected}" onclick = 'homepageBannerChangeOverlay("${all_colours[i]}");'>
          <div id = "change-overlay-${all_colours[i]}" class = "change-overlay-select-option">
            <div id = "change-overlay-${all_colours[i]}-background" class = "background" style = 'background-image: url("gfx/interface/vector_plexus_overlay_bg.png"); filter: ${local_overlay.filter};'>
            </div>
          </div>
          <center class = "image-container">
            <img src = "gfx/interface/icons/checkmark.png" class = "checkmark" draggable = "false"></img>
          </center>
          <center class = "text-container">
            <span class = "change-overlay-desc">${local_overlay.name}</span>
          </center>
        </div>
      `;
    }
  }
  
  function initialiseSettingsButton () {
    settings_btn_container.innerHTML = `<img id = "settings-btn" class = "settings-btn" src = "gfx/interface/icons/settings_btn.png" draggable = "false">`;
    
    //Update DOM tracker variable
    settings_btn = document.getElementById("settings-btn");
    if (!settings_window_open && settings_btn_clicked == 0) {
      tippy("#settings-btn", {
        content: "Open Settings"
      });
    }
  }
  
  function maximiseSettings () {
    settings_minimised = false;
    
    settings_window.style.height = "80vh";
    settings_minimise_btn.setAttribute("class", "settings-chevron-btn");
    
    window.minimise_btn_tooltip = tippy("#settings-adjust-size-btn", {
      content: "Minimise Settings",
      placement: "top"
    });
  }
  
  function minimiseSettings () {
    settings_minimised = true;
    
    settings_window.style.height = "30vh";
    settings_minimise_btn.setAttribute("class", "settings-chevron-btn minimised");
    
    window.minimise_btn_tooltip = tippy("#settings-adjust-size-btn", {
      content: "Maximise Settings",
      placement: "top"
    });
  }
  

  //Parallax effect for label, initialised in scroll scope
  function parallaxLabelOnScroll () {
    homepageBannerTitleAdjustPosition();
  }
  
  /*
    selectText() - Selects the text in the main animation banner.
    options: {
      banner_el: (HTMLElement) - The HTML banner to select text in
      caret_el: (HTMLElement) - The HTML element that represents the typing caret
      caret_spacer_el: (HTMLElement) - The HTML element that spaces the typing caret from the main banner
      select_limit: (Number) - Optional. The number of characters to select from the right. 0 by default, meaning select all
      select_speed: (Number) - Optional. The ms speed at which to select characters. 100 by default
    }

    Returns: Promise - This is returned once the animation is finished
  */
  function selectText (arg0_options) {
    //Convert from parameters
    var options = (arg0_options) ? arg0_options: {};
    
    //Declare local instance variables
    var banner_el = options.banner_el;
    var caret_el = options.caret_el;
    var caret_spacer_el = options.caret_spacer_el;
    var select_limit = (options.select_limit) ? options.select_limit : 0;
    var select_speed = (options.select_speed) ? options.select_speed : 100;
    
    var max_delay = 0;
    var span_amount = banner_el.querySelectorAll("span").length;
    var speed_array = [];
    
    //Select caret first
    var caret_spacer_el_class = (caret_spacer_el.getAttribute("class")) ?
      caret_spacer_el.getAttribute("class") : "";
    
    if (caret_spacer_el)
      caret_spacer_el.setAttribute("class", caret_spacer_el_class + " selected");
    
    //Iterate over <span> elements in the selected banner
    for (var i = 0; i < span_amount; i++) {
      speed_array.push(select_speed);
      
      //Fetch total_delay
      var total_delay = sumArray(speed_array);
      
      //Set max_delay
      max_delay = Math.max(max_delay, total_delay);
      
      //Set delay for selected string effect
      setTimeout(function(){
        if (!banner_settings.paused_animation) {
          //Fetch current index/other instance variables
          var all_spans = banner_el.querySelectorAll("span");
          var current_index = banner_el.querySelectorAll("span").length - 1 - banner_el.querySelectorAll("span[class*='selected']").length;
          
          //Apply selected class attribute to span
          if (current_index >= select_limit) {
            var current_el = all_spans[current_index];
            var current_class = (current_el.getAttribute("class")) ? current_el.getAttribute("class") : "";
            
            current_el.setAttribute("class", current_class + " selected");
          }
          
          //Increment anim_index when animation finishes playing
          var current_anim_index = (banner_el.getAttribute("anim-index")) ? parseInt(banner_el.getAttribute("anim-index")) : 0;
          
          if (current_index == select_limit)
            banner_el.setAttribute("anim-index", current_anim_index + 1);
        }
      }, total_delay);
    }
    
    //Return statement
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, max_delay);
    });
  }
  
  function triumphAndTragedyOnScroll () {
    //Set vertical offset
    var scroll_y = window.pageYOffset;
    var triumph_and_tragedy_bg_elements = document.querySelectorAll(".homepage-banner-triumph-and-tragedy-bg img");
    
    for (var i = 0; i < triumph_and_tragedy_bg_elements.length; i++) {
      var translate_y = scroll_y*triumph_and_tragedy_bg_offsets[i];
      triumph_and_tragedy_bg_elements[i].setAttribute("style", `
      transform: translateY(${translate_y}px);
    `);
    }
  }
  
  /*
    typeText() - Types text within the main animation banner.
    options: {
      apply_class: (String) - The class to add/apply to the banner element.
      banner_el: (HTMLElement) - The HTML banner to type in
      constant_typing_speed: (Boolean) - Optional. Whether the typing speed is constant. False by default
      slowdown: (Number) - Optional. Whether to slow text down as text is typed. 1 by default
      typing_speed: (Number) - Optional. The initial typing speed per character in ms. 750 by default
      typing_text: (String) - The text to type.
    }

    Returns: Promise - This is returned once the animation is finished
  */
  function typeText (arg0_options) {
    //Convert from parameters
    var options = (arg0_options) ? arg0_options: {};
    
    //Declare local instance variables
    var apply_class = (arg0_options.apply_class) ? `class = "${options.apply_class}"` : "";
    var banner_el = options.banner_el;
    var constant_typing_speed = options.constant_typing_speed;
    var slowdown = (options.slowdown) ? options.slowdown : 1;
    var typing_speed = (options.typing_speed) ? options.typing_speed : 750;
    var typing_text = options.text;
    
    var max_delay = 0;
    var speed_array = [];
    
    //Iterate over typing_text
    for (var i = 0; i < typing_text.length; i++) {
      //Reduce typing speed according to slowdown
      if (!constant_typing_speed)
        typing_speed -= typing_speed*0.35*Math.random()*slowdown;
      speed_array.push(typing_speed);
      
      //Fetch total delay
      var total_delay = sumArray(speed_array);
      
      //Set max_delay
      max_delay = Math.max(max_delay, total_delay);
      
      //Set delay for typed string
      setTimeout(function(){
        if (!banner_settings.paused_animation) {
          var current_index = banner_el.querySelectorAll("span").length;
          
          banner_el.innerHTML += `<span ${apply_class} id = "${banner_el.id}-${current_index}">${typing_text[current_index]}</span>`;
          
          //Increment anim-index if detected as done (this allows for asynchronous detection elsewhere)
          var current_anim_index = (banner_el.getAttribute("anim-index")) ?
            parseInt(banner_el.getAttribute("anim-index")) : 0;
          
          if (current_index + 1 == typing_text.length)
            banner_el.setAttribute("anim-index", current_anim_index + 1);
          
          //Set font size for banner to always fit
          adjustFontSize(title_element, banner_title_text, { homepage_banner: true });
        }
      }, total_delay);
    }
    
    //Return statement
    return new Promise((resolve, reject) => {
      setTimeout(function(){
        resolve();
      }, max_delay);
    });
  }
  
  function updateSettingsPanel () { 
    //Toggle visibility of actual window
    if (!settings_window_open) settings_window.setAttribute("class",
      settings_window.getAttribute("class").replace(" settings-animated-open", "").replace(" hidden", "") + " settings-animated-close"
    );
    setTimeout(function(){
      //Readjust visibility of window if window is currently open
      if (settings_window_open) settings_window.setAttribute("class",
        settings_window.getAttribute("class").replace(" settings-animated-close", "").replace(" hidden", "") + " settings-animated-open"
      );
      if (!settings_window_open) settings_btn_container.setAttribute("class", "settings-btn-container stationary");
      
      //Set tooltip
      var label_placement = (settings_window_open) ? "left" : "top";
      var open_close_label = (settings_window_open) ? "Close" : "Open";
      tippy("#settings-btn", {
        content: `${open_close_label} Settings`,
        placement: label_placement
      });
    }, 2000);
    
    //Apply button animation
    settings_btn_container.setAttribute("class", "settings-btn-container");
    settings_btn_animation = (!settings_window_open) ? "homepage-settings-btn-roll-back" : "homepage-settings-btn-roll";
    
    //Play animation
    initialiseSettingsButton();
    settings_btn.style.animation = `${settings_btn_animation} 2s forwards`;
    settings_btn.onclick = function () {
      applySettingsButtonFunctionality();
    };
  }
}

//Script
{
  window.banner_settings = {
    animation_threshhold: 100,
    backgrounds: {
      main_video: {
        name: "Confoederatio26"
      },
      cleveland_fog: {
        name: "Sunset"
      },
      lava_lamp: {
        name: "Lava Lamp"
      },
      misty_forest: {
        name: "Misty Forest"
      },
      rain: {
        name: "Rain"
      },
      triumph_and_tragedy: {
        name: "Triumph & Tragedy"
      }
    },
    fonts: {
      bahnschrift: {
        name: "Bahnschrift",
        font_weight: [300, 700]
      },
      barlow: {
        name: "Barlow",
        font_weight: [100, 900]
      },
      fira_sans: {
        name: "Fira Sans",
        font_weight: [100, 900]
      },
      josefin_sans: {
        name: "Josefin Sans",
        font_weight: [100, 700]
      },
      quicksand: {
        name: "Quicksand",
        font_weight: [300, 700]
      },
      raleway: {
        name: "Raleway",
        font_weight: [100, 900]
      }
    },
    font_size: [10, 50],
    overlay: {
      colours: {
        azure: {
          name: "Azure",
          filter: "grayscale(0) hue-rotate(180deg)"
        },
        black: {
          name: "Black",
          filter: "brightness(0.2) grayscale(1)"
        },
        blue: {
          name: "Blue",
          filter: "grayscale(0) hue-rotate(225deg)"
        },
        copper: {
          name: "Copper",
          filter: "grayscale(0.6) hue-rotate(50deg)"
        },
        forest_green: {
          name: "Forest Green",
          filter: "grayscale(0.6) hue-rotate(100deg)"
        },
        grey: {
          name: "Grey",
          filter: "grayscale(1)"
        },
        light_blue: {
          name: "Light Blue",
          filter: "grayscale(0.5) hue-rotate(225deg)"
        },
        lime_green: {
          name: "Lime Green",
          filter: "grayscale(0) hue-rotate(90deg)"
        },
        magenta: {
          name: "Magenta",
          filter: "grayscale(0) hue-rotate(310deg)"
        },
        negative: {
          name: "Negative",
          filter: "grayscale(0) invert(1)"
        },
        orange: {
          name: "Orange",
          filter: "grayscale(0) hue-rotate(45deg)"
        },
        pink: {
          name: "Pink",
          filter: "grayscale(0) hue-rotate(340deg)"
        },
        red: {
          name: "Red",
          filter: "grayscale(0)"
        },
        salmon: {
          name: "Salmon",
          filter: "grayscale(0.3)"
        },
        soft_green: {
          name: "Soft Green",
          filter: "grayscale(0.7) hue-rotate(160deg)"
        },
        verdant_green: {
          name: "Verdant Green",
          filter: "grayscale(0) hue-rotate(160deg)"
        },
        violet: {
          name: "Violet",
          filter: "grayscale(0) hue-rotate(260deg)"
        },
        white: {
          name: "White",
          filter: "grayscale(1) brightness(2)"
        }
      },
      opacity_settings: [15, 20, 30, 40],
      default_opacity: 20,
      default_splash_colours: ["red", "azure", "copper", "forest_green", "orange", "blue", "negative", "violet", "salmon", "lime_green", "magenta", "black", "verdant_green", "pink", "red", "azure", "copper", "forest_green", "orange", "blue", "negative", "violet", "salmon", "lime_green", "magenta", "black",  "light_blue"]
    },
    paused_animation: false,
    paused_backgrounds: false,
    text_selected: false
  };
  
  //Begin initial typing animation
  window.banner_caret_element = document.getElementById("homepage-banner-caret-element");
  window.banner_caret_spacer_element = document.getElementById("homepage-banner-caret-spacer");
  window.banner_selected_once = false;
  window.banner_title_text = document.getElementById("homepage-banner-main-title-text");
  window.cleveland_national_forest_bg = document.getElementById("homepage-banner-cleveland-national-forest-bg");
  window.content_editable_evt_listeners_added = false;
  window.current_banner = "main_video";
  window.current_font = "bahnschrift";
  window.current_font_weight = 700;
  window.current_overlay = "grey";
  window.homepage_banner_overlay = document.getElementById("homepage-banner-plexus-overlay-bg");
  window.lava_lamp_bg = document.getElementById("homepage-banner-lava-lamp-bg");
  window.main_video_bg = document.getElementById("homepage-banner-video-bg");
  window.misty_forest_bg = document.getElementById("homepage-banner-video-bg-misty-forest");
  window.raindrop_bg = document.getElementById("homepage-banner-rain-bg-container");
  window.settings_container = document.getElementById("homepage-banner-settings-container");
  window.time_since_selection = 0;
  window.title_element = document.getElementById("homepage-banner-main-title");
  window.triumph_and_tragedy_bg = document.getElementById("homepage-banner-triumph-and-tragedy-bg");
  window.typing_speed = 750;
  
  window.settings_bg_container = document.getElementById("homepage-banner-settings-change-bg-container");
  window.settings_btn;
  window.settings_btn_clicked = 0;
  window.settings_btn_container = document.getElementById("settings-btn-container");
  window.settings_close_btn = document.getElementById("settings-close-btn");
  window.settings_font_select = document.getElementById("settings-change-font-family");
  window.settings_minimised = true;
  window.settings_minimise_btn = document.getElementById("settings-adjust-size-btn");
  window.settings_overlay_container = document.getElementById("homepage-banner-settings-change-overlay-container");
  window.settings_window = document.getElementById("homepage-banner-settings-container");
  window.settings_window_open = false;

  //Temp for debugging [WIP]
  //homepageBannerDisplayDots();
  
  //Add settings_btn to DOM, initialise DOM
  homepageBannerChangeRawFontSize(20);
  homepageBannerCentreAlign();
  initialiseBackgroundSettings();
  initialiseFontSettings();
  initialiseOverlaySettings();
  initialiseSettingsButton();
  maximiseSettings(); //Change to minimise in future [WIP]
  tippy("#settings-close-btn", {
    content: "Close Settings",
    placement: "top"
  });

  //Local event listeners for when settings is hovered over
  settings_btn.onclick = function () {
    applySettingsButtonFunctionality();
  };

  //Settings UI button functionality
  settings_close_btn.onclick = function () {
    settings_window_open = false;
    updateSettingsPanel();
  };
  settings_minimise_btn.onclick = function () {
    minimise_btn_tooltip[0].destroy();
    
    if (settings_minimised) {
      maximiseSettings();
    } else {
      minimiseSettings();
    }
  }

  //Declare local variables
  window.chevron_icon = document.getElementById("homepage-banner-chevron-down");
  window.dots_container = document.getElementById("homepage-banner-dots-container");

  //Declare animation instance variables
  window.lava_lamp_animation_paused = true;
  window.lava_lamp_bg_circuit = 8; //Determines how 'wide' the circuit the orb travels is
  
  initLavaLampCycle();
  window.lava_lamp_circuit_logic = setInterval(function(){
    if (!lava_lamp_animation_paused) {
      //Change speed of lava lamp
      lava_lamp_bg_circuit += randomElement([
        Math.random()*-1*randomNumber(0, 4),
        Math.random()*randomNumber(0, 5) //Slightly biased towards speeding up
      ]);
      //Set limits for how wide or small the circuit can be
      lava_lamp_bg_circuit = Math.min(lava_lamp_bg_circuit, 64);
      lava_lamp_bg_circuit = (lava_lamp_bg_circuit < 8) ? 8 : lava_lamp_bg_circuit;
      
      //Kill all tweens
      TweenMax.killAll();
      initLavaLampCycle();
    }
  }, 500);

  //Global animation instance variables
  window.max_number_of_raindrops = 100; //Cap off the number of particles in order to reduce lag
  window.raindrop_animation_paused = true;
  window.raindrop_array = [];
  window.raindrop_container = document.getElementById("homepage-banner-raindrops-container");
  window.raindrop_iterations = 0;

  //A class would be easier for substantiating raindrops
  window.Raindrop = class {
    constructor (arg0_x, arg1_y, arg2_width, arg3_height, arg4_opacity, arg5_duration) {
      //Set parameters
      this.x = arg0_x;
      this.y = arg1_y;
      this.width = arg2_width;
      this.height = arg3_height;
      
      //Other generated parameters
      this.duration = (arg5_duration) ? arg5_duration : randomNumber(20000, 30000); //How many ms should the raindrop appear on screen for before disappearing?
      this.id = `raindrop-${generateRaindropID()}`;
      this.opacity = (arg4_opacity) ? arg4_opacity : 0.15; //How transparent should the raindrop be?
      
      //Initialise element in DOM and local styling
      raindrop_container.innerHTML += `
      <div id = "${this.id}" class = "raindrop" style = "
        background-color: rgb(255, 255, 255);
        opacity: ${this.opacity};

        position: absolute;
        width: ${this.width}px;
        height: ${this.height}px;
        top: ${this.y}%;
        left: ${this.x}%;
        border-radius: 50%;
      "></div>
    `;
      
      //Set timeout to remove raindrop
      var local_id = this.id; //Set to local_id to pass argument
      setTimeout(function(){
        document.getElementById(local_id).remove();
      }, this.duration);
    }
    
    //Fetch methods
    fetchID () {
      return this.id;
    }
    isDestroyed () {
      return (!document.getElementById(this.id));
    }
  }

  //Generate raindrops
  window.raindrop_logic = setInterval(function(){
    //Make sure raindrop animation isn't paused
    if (!raindrop_animation_paused) {
      //Remove all destroyed raindrops from array
      var raindrops_to_remove = [];
      for (var i = 0; i < raindrop_array.length; i++) if (raindrop_array[i].isDestroyed()) raindrops_to_remove.push(raindrop_array[i]);
      for (var i = 0; i < raindrops_to_remove.length; i++) {
        for (var x = 0; x < raindrop_array.length; x++) if (raindrop_array[x] == raindrops_to_remove[i]) raindrop_array.splice(x, 1);
      }
      
      //Add raindrop if valid
      var all_raindrops = raindrop_container.querySelectorAll(".raindrop");
      var random_tick = randomNumber(9, 11);
      
      //Declare substantiation variables
      var raindrop_size = randomNumber(15, 48);
      if (raindrop_iterations % random_tick == 0 && all_raindrops.length < max_number_of_raindrops) raindrop_array.push(new Raindrop(
        randomNumber(0, 100),
        randomNumber(0, 100),
        raindrop_size,
        raindrop_size,
        randomElement([
          0.3,
          0.4,
          0.5,
          0.7
        ]),
        raindrop_size*750
      ));
    }
  }, 500);

  //Declare global scroll offsets
  window.triumph_and_tragedy_bg_offsets = [
    0,
    1,
    1.025,
    1.05,
    1.075,
    1.1,
    1.125,
    1.15,
    1.175
  ];
  
  
}