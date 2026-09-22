if (!window.ic) window.ic = {};
if (!window.ic.cms) window.ic.cms = {};

//Initialise Classes
{
  /**
   * Represents an interactive tabbed navigation and page container.
   * 
   * @param {Object} arg0_page_obj
   * @param {Object} [arg1_options]
   *  @param {Object} [arg1_options.attributes]
   *  @param {string} [arg1_options.starting_page]
   * 
   * @type {ic.PageMenu}
   */
  ic.PageMenu = class {
    constructor (arg0_page_obj, arg1_options) {
      //Convert from parameters
      let page_obj = arg0_page_obj;
      let options = (arg1_options) ? arg1_options : {};

      //Initialise options
      options.attributes = (options.attributes) ? options.attributes : {};
      options.starting_page = (options.starting_page) ?
        options.starting_page : Object.keys(page_obj)[0];

      //Declare local instance variables
      let all_tabs;
      let all_tab_keys = Object.keys(page_obj);
      let element = document.createElement("div");
      let interface_el = document.createElement("div");
      let interfaces_obj = {};
      let navbar_el = document.createElement("nav");
      let underline_el = document.createElement("span");

      //Configure element
      element.setAttribute("component", "ve-page-menu");
      element.classList.add("ic-tabs-container");
      element.instance = this;

      //Apply custom attributes
      Object.keys(options.attributes).forEach((local_key) => {
        element.setAttribute(local_key, options.attributes[local_key].toString());
      });

      navbar_el.classList.add("navbar", "ic-tabs-nav");
      interface_el.classList.add("ic-tab-content");
      interface_el.id = "component-body";
      underline_el.classList.add("underline", "ic-tab-underline");

      //Iterate over all tabs to construct navigation and content panels
      for (let i = 0; i < all_tab_keys.length; i++) {
        let local_key = all_tab_keys[i];
        let local_name_el = document.createElement("div");
        let local_page_el = document.createElement("div");
        let local_value = page_obj[local_key];
        let local_name = (local_value.name) ? local_value.name : local_key;

        //Build tab item
        local_name_el.classList.add("tab", "ic-tab-btn");
        if (local_key === options.starting_page)
          local_name_el.classList.add("active");
        local_name_el.id = local_key;
        local_name_el.innerHTML = local_name;
        navbar_el.appendChild(local_name_el);

        //Build page content container
        local_page_el.classList.add("page", "ic-tab-panel");
        local_page_el.setAttribute("data-tab-key", local_key);

        if (local_value.element instanceof HTMLElement) {
          local_page_el.appendChild(local_value.element);
        } else if (typeof local_value.html === "string") {
          local_page_el.innerHTML = local_value.html;
        } else if (typeof local_value.content === "string") {
          local_page_el.innerHTML = ic.cms.formatContent(local_value.content);
        }

        interfaces_obj[local_key] = local_page_el;
        interface_el.appendChild(local_page_el);
      }

      navbar_el.appendChild(underline_el);
      element.append(navbar_el, interface_el);

      //Assign instance properties
      this.element = element;
      this.interface_el = interface_el;
      this.interfaces_obj = interfaces_obj;
      this.navbar_el = navbar_el;
      this.options = options;
      this.underline_el = underline_el;

      //Bind click listeners
      all_tabs = navbar_el.querySelectorAll(".tab");
      all_tabs.forEach((local_tab) => {
        local_tab.addEventListener("click", () => {
          this.v = local_tab.id;
          if (typeof this.onchange === "function")
            this.onchange(this.v);
        });
      });

      //Initialise starting page and underline indicator
      let initialise_underline_loop = setInterval(() => {
        if (!document.contains(this.element)) return;
        this.updateUnderline();
        clearInterval(initialise_underline_loop);
      }, 50);

      this.v = options.starting_page;
    }

    get v () {
      let active_tab = this.navbar_el.querySelector(".tab.active");
      //Return statement
      return (active_tab) ? active_tab.id : undefined;
    }

    set v (arg0_page_key) {
      //Convert from parameters
      let page_key = arg0_page_key;

      //Declare local instance variables
      let active_tab_el = this.navbar_el.querySelector(`.tab[id="${page_key}"]`);
      let all_page_keys = Object.keys(this.interfaces_obj);
      let all_tabs = this.navbar_el.querySelectorAll(".tab");

      //Guard clause
      if (!active_tab_el) {
        console.error(`active_tab_el could not be found for ${page_key}.`);
        return;
      }

      //Update tab classes
      all_tabs.forEach((local_tab) => local_tab.classList.remove("active"));
      active_tab_el.classList.add("active");

      //Toggle visibility of content panels
      for (let i = 0; i < all_page_keys.length; i++) {
        let local_key = all_page_keys[i];
        let local_panel = this.interfaces_obj[local_key];
        let is_selected = (local_key === page_key);

        local_panel.style.display = (is_selected) ? "block" : "none";
        if (is_selected) {
          local_panel.classList.add("active");
        } else {
          local_panel.classList.remove("active");
        }
      }

      setTimeout(() => {
        this.updateUnderline();
      }, 50);
    }

    updateUnderline () {
      //Declare local instance variables
      let active_tab = this.navbar_el.querySelector(".tab.active");
      let offset_left;
      let tab_width;
      let underline_computed_style;
      let underline_y;

      //Guard clause
      if (!active_tab) return;

      underline_computed_style = window.getComputedStyle(this.underline_el);
      offset_left = active_tab.offsetLeft;
      tab_width = active_tab.offsetWidth;
      underline_y = active_tab.offsetTop + active_tab.offsetHeight - parseFloat(underline_computed_style.height);

      this.underline_el.style.transition = "none";
      this.underline_el.style.top = `${underline_y}px`;

      requestAnimationFrame(() => {
        this.underline_el.style.left = `${offset_left}px`;
        this.underline_el.style.transition = "left 0.35s ease, width 0.35s ease";
        this.underline_el.style.width = `${tab_width}px`;
      });
    }
  };

  //Backwards compatibility for existing Vercengen namespace
  if (!window.ve) window.ve = {};
  window.ve.PageMenu = ic.PageMenu;

  /**
   * Base component class for Icoemi components.
   * 
   * @param {any} [arg0_value]
   * @param {Object} [arg1_options]
   * 
   * @type {ic.Component}
   */
  ic.Component = class {
    constructor (arg0_value, arg1_options) {
      //Convert from parameters
      let value = arg0_value;
      let options = (arg1_options) ? arg1_options : {};

      //Declare local instance variables
      this.element = document.createElement("div");
      this.element.instance = this;
      this.id = (options.id) ? options.id : `ic-comp-${Math.random().toString(36).substring(2, 9)}`;
      this.options = options;
      this.value = value;

      this.element.setAttribute("data-id", this.id);
      this.draw();
    }

    bind (arg0_element) {
      //Convert from parameters
      let element = (typeof arg0_element === "string") ?
        document.querySelector(arg0_element) : arg0_element;

      if (element)
        element.appendChild(this.element);
    }

    draw () {}

    remove () {
      if (this.element && this.element.parentNode)
        this.element.parentNode.removeChild(this.element);
    }
  };
}

//Initialise core functions
{
  /**
   * Animates a given set of elements relative to a scroll scope.
   * 
   * @param {HTMLElement|string} arg0_scope_element
   * @param {HTMLElement[]|string[]} arg1_elements
   * @param {Object} [arg2_options]
   *  @param {string} [arg2_options.direction="top"] - Direction: 'bottom'/'left'/'top'/'right'.
   *  @param {boolean} [arg2_options.disable_fade=false] - Whether to disable fade.
   *  @param {number} [arg2_options.distance=100] - Distance elements travel in px.
   */
  ic.animate = function (arg0_scope_element, arg1_elements, arg2_options) {
    //Convert from parameters
    let scope_el = ic.getElement(arg0_scope_element);
    let elements = ic.getElements(arg1_elements);
    let options = (arg2_options) ? arg2_options : {};

    //Initialise options
    let direction = (options.direction) ? options.direction : "top";
    let disable_fade = (options.disable_fade) ? options.disable_fade : false;
    let distance = (options.distance) ? parseFloat(options.distance) : 100;

    //Declare local instance variables
    let observer;
    let scroll_handler;
    let ticking = false;

    //Guard clause
    if (!scope_el || elements.length === 0) return;

    let updatePositions = () => {
      let current = scope_el.getBoundingClientRect().top;
      let end = 0;
      let offset;
      let progress;
      let start = window.innerHeight;

      progress = (start - current)/(start - end);
      progress = Math.max(0, Math.min(1, progress));
      offset = distance*(1 - progress);

      elements.forEach((item) => {
        let transform_obj = {
          bottom: `translateY(${offset}px)`,
          left: `translateX(${-offset}px)`,
          right: `translateX(${offset}px)`,
          top: `translateY(${-offset}px)`
        };
        let transform_string = (transform_obj[direction]) ?
          transform_obj[direction] : `translateY(${-offset}px)`;

        item.style.transform = transform_string;
        if (!disable_fade)
          item.style.opacity = progress;
      });

      ticking = false;
    };

    scroll_handler = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePositions);
        ticking = true;
      }
    };

    elements.forEach((item) => {
      item.style.willChange = "transform, opacity";
    });

    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", scroll_handler, { passive: true });
        updatePositions();
      } else {
        window.removeEventListener("scroll", scroll_handler);
      }
    }, { threshold: 0 });

    observer.observe(scope_el);
  };


  /**
   * Re-evaluates scripts contained inside dynamically loaded components.
   * 
   * @param {HTMLElement|string} arg0_element
   */
  ic.executeComponentScripts = function (arg0_element) {
    //Convert from parameters
    let element = ic.getElement(arg0_element);

    //Declare local instance variables
    let all_scripts;
    let context_id = `ic-${Math.random().toString(36).substring(2, 9)}`;

    //Guard clause
    if (!element) return;

    all_scripts = element.querySelectorAll("script");
    element.setAttribute("eval-context", context_id);

    for (let i = 0; i < all_scripts.length; i++) {
      let local_old_script = all_scripts[i];
      let local_new_script = document.createElement("script");

      Array.from(local_old_script.attributes).forEach((local_attribute) => {
        local_new_script.setAttribute(local_attribute.name, local_attribute.value);
      });

      if (!local_old_script.src) {
        local_new_script.textContent = `(function() { let element = document.querySelector('[eval-context="${context_id}"]'); ${local_old_script.innerHTML} })();`;
      }

      if (local_old_script.parentNode)
        local_old_script.parentNode.replaceChild(local_new_script, local_old_script);
    }
  };


  /**
   * Resolves a query selector or HTMLElement to an element.
   * 
   * @param {HTMLElement|string} arg0_element
   * 
   * @returns {HTMLElement|null}
   */
  ic.getElement = function (arg0_element) {
    //Convert from parameters
    let element = (typeof arg0_element !== "string") ?
      arg0_element : document.querySelector(arg0_element);

    //Return statement
    return element;
  };


  /**
   * Normalizes selectors, collections, or elements into an array of HTMLElements.
   * 
   * @param {HTMLElement|HTMLElement[]|string|string[]|NodeList} arg0_selector
   * 
   * @returns {HTMLElement[]}
   */
  ic.getElements = function (arg0_selector) {
    //Convert from parameters
    let selector = arg0_selector;

    //Guard clause
    if (!selector) return [];

    //Declare local instance variables
    let all_elements = [];
    let selector_array = selector;

    if (
      !Array.isArray(selector_array) &&
      !(selector_array instanceof NodeList) &&
      !(selector_array instanceof HTMLCollection)
    ) {
      selector_array = [selector_array];
    }

    for (let i = 0; i < selector_array.length; i++) {
      let local_item = selector_array[i];

      if (typeof local_item === "string") {
        all_elements.push(...document.querySelectorAll(local_item));
      } else if (local_item instanceof HTMLElement || local_item instanceof Node) {
        all_elements.push(local_item);
      } else if (local_item instanceof NodeList || local_item instanceof HTMLCollection) {
        all_elements.push(...local_item);
      }
    }

    //Return statement
    return all_elements;
  };


  /**
   * Alias for ic.startup for backwards compatibility.
   * 
   * @param {Object} [arg0_options]
   */
  ic.initialise = function (arg0_options) {
    //Convert from parameters
    let options = (arg0_options) ? arg0_options : {};

    //Return statement
    return ic.startup(options);
  };


  /**
   * Checks whether a given element is vertically scrollable.
   * 
   * @param {HTMLElement|string} arg0_element
   * 
   * @returns {boolean}
   */
  ic.isElementScrollable = function (arg0_element) {
    //Convert from parameters
    let element = ic.getElement(arg0_element);

    //Guard clause
    if (!element || element === document.body || element === document.documentElement)
      return false;

    //Declare local instance variables
    let can_scroll = (element.scrollHeight - element.clientHeight > 1);
    let style = window.getComputedStyle(element);
    let overflow_y = style.getPropertyValue("overflow-y");
    let is_scrollable_type = (overflow_y === "auto" || overflow_y === "scroll");

    //Return statement
    return (is_scrollable_type && can_scroll);
  };


  /**
   * Fetches and embeds an HTML component into a container element.
   * 
   * @param {HTMLElement|string} arg0_element
   * @param {string} arg1_url
   * @param {Object} [arg2_options]
   *  @param {boolean} [arg2_options.no_js=false]
   *  @param {boolean} [arg2_options.no_metadata=false]
   */
  ic.loadComponent = async function (arg0_element, arg1_url, arg2_options) {
    //Convert from parameters
    let element = ic.getElement(arg0_element);
    let url = arg1_url;
    let options = (arg2_options) ? arg2_options : {};

    //Guard clause
    if (!element || !url) return;

    //Declare local instance variables
    let base_tags = document.querySelectorAll("base");
    let has_base = (base_tags.length > 0);
    let is_subfolder = (window.location.pathname.includes("/pages/") || window.location.pathname.includes("/archives/"));
    let target_url = url;

    //Resolve relative paths for pages in subdirectories without base tag
    if (is_subfolder && !has_base && !target_url.startsWith("http") && !target_url.startsWith("/")) {
      target_url = `../${target_url}`;
    }

    try {
      let response = await fetch(target_url);

      if (!response.ok) {
        console.error(`Icoemi loadComponent HTTP error: ${response.status} for ${target_url}`);
      } else {
        element.innerHTML = await response.text();

        if (!options.no_metadata)
          element.setAttribute("html-initialised", "true");
        if (!options.no_js)
          ic.executeComponentScripts(element);

        //Auto-anchor footer component to bottom
        if (target_url.includes("footer.html")) {
          element.style.boxSizing = "border-box";
          element.style.display = "block";
          element.style.marginTop = "auto";
          element.style.paddingTop = "3.5rem";
          element.style.width = "100%";
        }

        //Recursively update any child components
        if (element.querySelector("ic-component[src]") || element.querySelector("ic-tabs") || element.querySelector("ic-page"))
          await ic.updateDOM();
      }
    } catch (e) {
      console.error(`Icoemi failed loading component ${target_url}:`, e);
      element.innerHTML = "<!-- Error loading component -->";
    }
  };


  /**
   * Central startup function for the Confoederatio website and pages.
   * 
   * @param {Object} [arg0_options]
   *  @param {number} [arg0_options.mobile_scroll_sensitivity=2]
   *  @param {Function} [arg0_options.onready]
   *  @param {Function} [arg0_options.onscroll]
   *  @param {boolean} [arg0_options.smooth_scroll=false]
   */
  ic.startup = function (arg0_options) {
    //Convert from parameters
    let options = (arg0_options) ? arg0_options : {};

    //Initialise options
    let mobile_scroll_sensitivity = (options.mobile_scroll_sensitivity) ?
      options.mobile_scroll_sensitivity : 2;
    let onready = (options.onready) ? options.onready : null;
    let onscroll = (options.onscroll) ? options.onscroll : null;
    let smooth_scroll = (options.smooth_scroll) ? options.smooth_scroll : false;

    //Declare local instance variables
    let animate_smooth;
    let observer;
    let scroll_obj;
    let should_ignore_event;
    let update_target;

    //Initialise smooth scroll if requested
    if (smooth_scroll && !ic._smooth_scroll) {
      ic._smooth_scroll = {
        is_animating: false,
        last_touch_y: 0,
        lerp_amount: 0.15,
        scroll_current: window.scrollY,
        scroll_target: window.scrollY,
        update_functions: [],

        addUpdateListener: function (fn) {
          if (typeof fn === "function")
            this.update_functions.push(fn);
        }
      };

      scroll_obj = ic._smooth_scroll;

      animate_smooth = () => {
        let diff = scroll_obj.scroll_target - scroll_obj.scroll_current;
        scroll_obj.scroll_current += diff*scroll_obj.lerp_amount;

        window.scrollTo({
          top: scroll_obj.scroll_current,
          behavior: "instant"
        });

        for (let i = 0; i < scroll_obj.update_functions.length; i++)
          scroll_obj.update_functions[i](scroll_obj.scroll_current);

        if (typeof onscroll === "function")
          onscroll(scroll_obj.scroll_current);

        if (Math.abs(diff) > 0.1) {
          requestAnimationFrame(animate_smooth);
        } else {
          scroll_obj.scroll_current = scroll_obj.scroll_target;
          scroll_obj.is_animating = false;
        }
      };

      should_ignore_event = (target, delta_y) => {
        let curr = target;
        while (curr && curr !== document.body) {
          if (ic.isElementScrollable(curr)) {
            if (delta_y === undefined) return true;
            if (delta_y < 0 && curr.scrollTop > 1) return true;

            let max_sub_scroll = curr.scrollHeight - curr.scrollTop - curr.clientHeight;
            if (delta_y > 0 && max_sub_scroll > 1) return true;
          }
          curr = curr.parentElement;
        }
        return false;
      };

      update_target = (delta) => {
        scroll_obj.scroll_target += delta;
        let max_scroll = document.documentElement.scrollHeight - window.innerHeight;
        scroll_obj.scroll_target = Math.max(0, Math.min(scroll_obj.scroll_target, max_scroll));

        if (!scroll_obj.is_animating) {
          scroll_obj.is_animating = true;
          requestAnimationFrame(animate_smooth);
        }
      };

      window.addEventListener("wheel", (e) => {
        if (should_ignore_event(e.target, e.deltaY)) return;
        e.preventDefault();
        update_target(e.deltaY);
      }, { passive: false });

      window.addEventListener("touchstart", (e) => {
        if (should_ignore_event(e.target)) return;
        if (e.touches && e.touches[0])
          scroll_obj.last_touch_y = e.touches[0].clientY;
      }, { passive: true });

      window.addEventListener("touchmove", (e) => {
        if (!e.touches || !e.touches[0]) return;
        let current_y = e.touches[0].clientY;
        let movement = scroll_obj.last_touch_y - current_y;

        if (should_ignore_event(e.target, movement)) {
          scroll_obj.last_touch_y = current_y;
          return;
        }

        e.preventDefault();
        update_target(movement*mobile_scroll_sensitivity);
        scroll_obj.last_touch_y = current_y;
      }, { passive: false });
    }

    //Initial DOM hydration
    ic.updateDOM().then(() => {
      if (typeof onready === "function")
        onready();
    });

    //Watch for dynamically inserted components using MutationObserver
    if (!ic._observer_initialised && window.MutationObserver) {
      observer = new MutationObserver((mutations) => {
        let has_new_component = false;

        for (let i = 0; i < mutations.length; i++) {
          let local_nodes = mutations[i].addedNodes;
          for (let x = 0; x < local_nodes.length; x++) {
            let local_node = local_nodes[x];
            if (local_node.nodeType === 1) {
              if (
                local_node.matches?.("ic-component:not([html-initialised='true']), ic-tabs, ic-page, ic-hero") ||
                local_node.querySelector?.("ic-component:not([html-initialised='true']), ic-tabs, ic-page, ic-hero")
              ) {
                has_new_component = true;
                break;
              }
            }
          }
          if (has_new_component) break;
        }

        if (has_new_component)
          ic.updateDOM();
      });

      observer.observe(document.body, { childList: true, subtree: true });
      ic._observer_initialised = true;
    }

    ic._initialised = true;
  };


  /**
   * Scans and updates all pending components in the DOM.
   */
  ic.updateDOM = async function () {
    //Declare local instance variables
    let all_ic_components = document.querySelectorAll(`ic-component:not([html-initialised="true"])`);
    let load_promises;

    //Parse any declarative CMS markup first
    ic.cms.parseDeclarativeMarkup(document.body);

    load_promises = Array.from(all_ic_components).map((el) => {
      let data_src = el.getAttribute("src");
      if (data_src)
        return ic.loadComponent(el, data_src);
      return Promise.resolve();
    });

    await Promise.all(load_promises);
  };
}

//Initialise CMS namespace functions
{
  /**
   * Creates an interactive responsive card grid element.
   * 
   * @param {Object[]} arg0_cards
   * @param {Object} [arg1_options]
   * 
   * @returns {HTMLElement}
   */
  ic.cms.createCardGrid = function (arg0_cards, arg1_options) {
    //Convert from parameters
    let cards = (Array.isArray(arg0_cards)) ? arg0_cards : [];
    let options = (arg1_options) ? arg1_options : {};

    //Declare local instance variables
    let grid_el = document.createElement("div");

    grid_el.classList.add("ic-card-grid");

    for (let i = 0; i < cards.length; i++) {
      let local_card = cards[i];
      let local_card_el = document.createElement((local_card.url || local_card.href) ? "a" : "div");
      let local_desc_html = (local_card.description) ?
        `<p class="ic-card-desc">${local_card.description}</p>` : "";
      let local_footer_html = "";
      let local_header_html = "";
      let local_icon_html = (local_card.icon) ?
        `<img src="${local_card.icon}" alt="${local_card.title || ''}" class="ic-card-icon">` : "";

      local_card_el.classList.add("ic-card");
      if (local_card.url || local_card.href) {
        local_card_el.href = local_card.url || local_card.href;
        if (local_card.target)
          local_card_el.target = local_card.target;
      }

      if (local_card.tippy || local_card.tooltip) {
        local_card_el.setAttribute("data-tippy-content", local_card.tippy || local_card.tooltip);
      }

      local_header_html = `
        <div class="ic-card-header">
          ${local_icon_html}
          <div>
            <h4 class="ic-card-title">${local_card.title || ""}</h4>
            ${(local_card.badge) ? `<span class="ic-badge">${local_card.badge}</span>` : ""}
          </div>
        </div>
      `;

      if (local_card.footer_text || (local_card.url || local_card.href)) {
        local_footer_html = `
          <div class="ic-card-footer">
            <span>${local_card.footer_text || ""}</span>
            <span class="ic-card-link-text">${(local_card.url || local_card.href) ? "View &rarr;" : ""}</span>
          </div>
        `;
      }

      local_card_el.innerHTML = `${local_header_html}${local_desc_html}${local_footer_html}`;
      grid_el.appendChild(local_card_el);
    }

    //Return statement
    return grid_el;
  };


  /**
   * Generates a hero banner header element for information pages.
   * 
   * @param {Object} arg0_hero_obj
   * @param {Object} [arg1_options]
   * 
   * @returns {HTMLElement}
   */
  ic.cms.createHero = function (arg0_hero_obj, arg1_options) {
    //Convert from parameters
    let hero_obj = (arg0_hero_obj) ? arg0_hero_obj : {};
    let options = (arg1_options) ? arg1_options : {};

    //Declare local instance variables
    let actions_html = "";
    let badge_html = (hero_obj.badge) ?
      `<span class="ic-badge accent">${hero_obj.badge}</span>` : "";
    let category_html = (hero_obj.category) ?
      `<span class="ic-badge">${hero_obj.category}</span>` : "";
    let hero_el = document.createElement("header");

    hero_el.classList.add("ic-hero");

    if (Array.isArray(hero_obj.actions)) {
      let action_buttons = hero_obj.actions.map((act) => {
        let btn_class = (act.primary) ? "ic-btn ic-btn-primary" : "ic-btn ic-btn-secondary";
        let target = (act.target) ? `target="${act.target}"` : "";
        return `<a href="${act.href || '#'}" class="${btn_class}" ${target}>${act.label || act.title}</a>`;
      });
      actions_html = `<div class="ic-hero-actions">${action_buttons.join("")}</div>`;
    }

    hero_el.innerHTML = `
      <div class="ic-hero-inner">
        <div class="ic-hero-topline">
          ${category_html}
          ${badge_html}
        </div>
        <h1 class="ic-hero-title">${hero_obj.title || ""}</h1>
        ${(hero_obj.subtitle) ? `<p class="ic-hero-subtitle">${hero_obj.subtitle}</p>` : ""}
        ${actions_html}
      </div>
    `;

    //Return statement
    return hero_el;
  };


  /**
   * Generates a metadata key-value list element.
   * 
   * @param {Object[]} arg0_metadata
   * @param {Object} [arg1_options]
   * 
   * @returns {HTMLElement}
   */
  ic.cms.createMetadataPanel = function (arg0_metadata, arg1_options) {
    //Convert from parameters
    let metadata = (Array.isArray(arg0_metadata)) ? arg0_metadata : [];
    let options = (arg1_options) ? arg1_options : {};

    //Declare local instance variables
    let panel_el = document.createElement("div");
    let rows_html = "";
    let title_text = (options.title) ? options.title : "Project Information";

    panel_el.classList.add("ic-meta-panel");

    for (let i = 0; i < metadata.length; i++) {
      let local_item = metadata[i];
      let local_val_html = (local_item.url) ?
        `<a href="${local_item.url}" target="_blank">${local_item.value}</a>` : local_item.value;

      rows_html += `
        <div class="ic-meta-row">
          <span class="ic-meta-label">${local_item.label}</span>
          <span class="ic-meta-value">${local_val_html}</span>
        </div>
      `;
    }

    panel_el.innerHTML = `
      <h3 class="ic-meta-panel-title">${title_text}</h3>
      <div class="ic-meta-list">${rows_html}</div>
    `;

    //Return statement
    return panel_el;
  };


  /**
   * Programmatically creates a complete information page container.
   * 
   * @param {Object} arg0_page_obj
   * @param {Object} [arg1_options]
   * 
   * @returns {HTMLElement}
   */
  ic.cms.createPage = function (arg0_page_obj, arg1_options) {
    //Convert from parameters
    let page_obj = (arg0_page_obj) ? arg0_page_obj : {};
    let options = (arg1_options) ? arg1_options : {};

    //Declare local instance variables
    let body_container = document.createElement("div");
    let content_wrapper = document.createElement("div");
    let page_el = document.createElement("div");

    page_el.classList.add("ic-page-container");

    //1. Hero section
    if (page_obj.hero || page_obj.title) {
      let hero_data = page_obj.hero || {
        actions: page_obj.actions,
        badge: page_obj.badge,
        category: page_obj.category,
        subtitle: page_obj.subtitle,
        title: page_obj.title
      };
      page_el.appendChild(ic.cms.createHero(hero_data));
    }

    //2. Main body container
    body_container.classList.add("ic-container");

    //Check if sidebar layout is required
    if (page_obj.sidebar || page_obj.metadata) {
      let split_el = document.createElement("div");
      let main_col = document.createElement("div");
      let sidebar_col = document.createElement("aside");

      split_el.classList.add("ic-layout-split");
      main_col.classList.add("ic-layout-main");
      sidebar_col.classList.add("ic-layout-sidebar");

      //Populate main column
      if (page_obj.tabs) {
        let tabs_instance = ic.cms.createTabs(page_obj.tabs, options);
        main_col.appendChild(tabs_instance.element);
      } else if (page_obj.cards) {
        main_col.appendChild(ic.cms.createCardGrid(page_obj.cards));
      } else if (page_obj.content) {
        let prose_el = document.createElement("div");
        prose_el.classList.add("ic-content");
        prose_el.innerHTML = ic.cms.formatContent(page_obj.content);
        main_col.appendChild(prose_el);
      }

      //Populate sidebar column
      if (page_obj.metadata || page_obj.sidebar?.metadata) {
        let meta_data = page_obj.metadata || page_obj.sidebar.metadata;
        sidebar_col.appendChild(ic.cms.createMetadataPanel(meta_data, {
          title: page_obj.sidebar?.title
        }));
      }

      split_el.append(main_col, sidebar_col);
      body_container.appendChild(split_el);
    } else {
      //Single column layout
      if (page_obj.tabs) {
        let tabs_instance = ic.cms.createTabs(page_obj.tabs, options);
        body_container.appendChild(tabs_instance.element);
      } else if (page_obj.cards) {
        body_container.appendChild(ic.cms.createCardGrid(page_obj.cards));
      } else if (page_obj.content) {
        let prose_el = document.createElement("div");
        prose_el.classList.add("ic-content");
        prose_el.innerHTML = ic.cms.formatContent(page_obj.content);
        body_container.appendChild(prose_el);
      }
    }

    page_el.appendChild(body_container);

    //3. Append footer component if not explicitly disabled
    if (!options.no_footer) {
      let footer_el = document.createElement("ic-component");
      footer_el.setAttribute("src", "components/footer.html");
      page_el.appendChild(footer_el);
    }

    //Return statement
    return page_el;
  };


  /**
   * Instantiates an ic.PageMenu tab controller.
   * 
   * @param {Object} arg0_tabs_obj
   * @param {Object} [arg1_options]
   * 
   * @returns {ic.PageMenu}
   */
  ic.cms.createTabs = function (arg0_tabs_obj, arg1_options) {
    //Convert from parameters
    let tabs_obj = (arg0_tabs_obj) ? arg0_tabs_obj : {};
    let options = (arg1_options) ? arg1_options : {};

    //Return statement
    return new ic.PageMenu(tabs_obj, options);
  };


  /**
   * Formats markdown-like text and content for CMS presentation.
   * 
   * @param {string} arg0_content
   * 
   * @returns {string}
   */
  ic.cms.formatContent = function (arg0_content) {
    //Convert from parameters
    let content = (typeof arg0_content === "string") ? arg0_content : "";

    //Declare local instance variables
    let formatted = content;

    //Guard clause
    if (!content) return "";

    //Basic formatting transformations
    formatted = formatted.replace(/\n\n/g, "<br><br>");

    //Return statement
    return formatted;
  };


  /**
   * Parses declarative CMS tags inside the DOM.
   * 
   * @param {HTMLElement|string} arg0_scope_element
   */
  ic.cms.parseDeclarativeMarkup = function (arg0_scope_element) {
    //Convert from parameters
    let scope_el = (arg0_scope_element) ?
      ic.getElement(arg0_scope_element) : document.body;

    //Guard clause
    if (!scope_el) return;

    //Declare local instance variables
    let all_ic_details = scope_el.querySelectorAll("ic-details:not([hydrated='true'])");
    let all_ic_heroes = scope_el.querySelectorAll("ic-hero:not([hydrated='true'])");
    let all_ic_tabs = scope_el.querySelectorAll("ic-tabs:not([hydrated='true'])");

    //1. Hydrate <ic-hero> elements
    for (let i = 0; i < all_ic_heroes.length; i++) {
      let local_hero = all_ic_heroes[i];
      let hero_component = ic.cms.createHero({
        badge: local_hero.getAttribute("badge"),
        category: local_hero.getAttribute("category"),
        subtitle: local_hero.getAttribute("subtitle"),
        title: local_hero.getAttribute("title") || local_hero.innerText
      });

      local_hero.setAttribute("hydrated", "true");
      local_hero.replaceWith(hero_component);
    }

    //2. Hydrate <ic-tabs> elements
    for (let i = 0; i < all_ic_tabs.length; i++) {
      let local_tab_container = all_ic_tabs[i];
      let local_tabs = local_tab_container.querySelectorAll("ic-tab");
      let starting_page = local_tab_container.getAttribute("starting-page");
      let tabs_obj = {};

      for (let x = 0; x < local_tabs.length; x++) {
        let local_tab = local_tabs[x];
        let local_id = local_tab.getAttribute("id") || `tab-${x}`;
        let local_name = local_tab.getAttribute("name") || local_id;

        tabs_obj[local_id] = {
          html: local_tab.innerHTML,
          name: local_name
        };
      }

      let page_menu = new ic.PageMenu(tabs_obj, {
        starting_page: starting_page
      });

      local_tab_container.setAttribute("hydrated", "true");
      local_tab_container.replaceWith(page_menu.element);
    }

    //3. Hydrate <ic-details> elements
    for (let i = 0; i < all_ic_details.length; i++) {
      let local_details = all_ic_details[i];
      let local_summary = local_details.getAttribute("summary") || "Details";
      let details_el = document.createElement("details");

      details_el.classList.add("ic-details");
      details_el.innerHTML = `
        <summary class="ic-summary">${local_summary}</summary>
        <div class="ic-details-content">${local_details.innerHTML}</div>
      `;

      local_details.setAttribute("hydrated", "true");
      local_details.replaceWith(details_el);
    }
  };


  /**
   * Mounts a page object into a target DOM element.
   * 
   * @param {HTMLElement|string} arg0_target_element
   * @param {Object} arg1_page_obj
   * @param {Object} [arg2_options]
   */
  ic.cms.render = function (arg0_target_element, arg1_page_obj, arg2_options) {
    //Convert from parameters
    let target_el = ic.getElement(arg0_target_element);
    let page_obj = arg1_page_obj;
    let options = (arg2_options) ? arg2_options : {};

    //Guard clause
    if (!target_el) return;

    //Declare local instance variables
    let page_component = ic.cms.createPage(page_obj, options);

    target_el.innerHTML = "";
    target_el.appendChild(page_component);
  };
}

//Auto-run startup on DOMContentLoaded if not explicitly launched
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!ic._initialised)
      ic.startup();
  });
} else {
  if (!ic._initialised)
    ic.startup();
}