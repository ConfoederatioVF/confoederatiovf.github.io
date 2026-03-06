window.HomepageGallery = class extends window.WebComponent {
	constructor(arg0_value, arg1_options) {
		// Convert from parameters
		let value = arg0_value ? arg0_value : {};
		let options = arg1_options ? arg1_options : {};
		super(value, options);
		
		// Initialize gallery state object
		this.gallery = {
			bookmark_items: [],
			bookmark_selected: "",
			content_panel_update_paused: false,
			exempt_id_patterns: ["preview-", "btn-"],
			gallery_width: 500, // Default width for horizontal mapping
			parallax_pinned_items: [],
			parallax_scroll_x: 0,
			parallax_selected: [],
			parallax_settings: {},
		};
		
		this.zoom_states = {};
		
		this.draw();
		this.mountSelectors();
		this.init();
	}
	
	draw() {
		this.element.innerHTML = `
		<div id = "project-parallax-container" class = "project-parallax-container">
			<!--Parallax background divs-->
			<div id = "project-parallax-container-gradient-bg" class = "project-parallax-container-gradient-bg"></div>
			<div id = "project-parallax-container-room-bg" class = "project-parallax-container-room-bg"></div>

			<!--Parallax project gallery scene-->
			<section id = "scene" class="scene" data-pointer-events = "true" data-x-origin = "0.5" data-y-origin = "50.0" data-scalar-y = "50.0" data-scalar-x = "25.0" data-friction-x = "0.05" data-friction-y = "0.04">
				<div id = "project-parallax-scroll-container" class = "project-parallax-scroll-container">
					<div class = "layer main" data-depth = "1.0">
						<div id = "main-parallax-content-wrapper" class = "parallax-content-container">
							<div class = "project-listings">
								<span class = "parallax-header">PROJECT LISTINGS</span>
								<br><br>
								<hr class = "parallax-line">
							</div>

							<div class = "ctd-header">
								<span class = "parallax-subheader">Technical (CTD).</span>
							</div>

							<!--Research-->
							<div class = "crd-header">
								<span class = "parallax-subheader">Research (CRD).</span>
							</div>

							<!--Artistic-->
							<div class = "cad-header">
								<span class = "parallax-subheader">Artistic (CAD).</span>
							</div>

							<!--Preservés-->
							<div class = "preserves-header">
								<span class = "parallax-subheader">Preservés</span><br>
								<div class = "parallax-header small">des Confoederatio</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!--Parallax content panels-->
			<div id = "main-parallax-content-panel-wrapper" class = "parallax-panel-container">
				<div id = "main-parallax-content-panel-scroll-wrapper" class = "parallax-panel-scroll-container"></div>
			</div>

			<!--Bookmark overlay-->
			<div id = "project-parallax-bookmark-container" class = "parallax-bookmark-container minimised">
				<div id = "project-parallax-bookmark-labels-container" class = "project-parallax-text-container">
					<div id = "project-parallax-bookmark-label" class = "bookmarks-title">
						<img id = "project-parallax-bookmark-text-icon" class = "bookmark-text-icon" src = "gfx/interface/icons/bookmark_icon_filled.png" align = "left" draggable = "false"></img>
						<span id = "project-parallax-bookmark-label-text" class = "project-parallax-bookmark-label-text">Bookmarks</span>
						<img id = "project-parallax-bookmark-minimise-icon" class = "bookmark-minimise-icon minimised" src = "gfx/interface/icons/chevron_down.png" align = "right" draggable = "false">
					</div>
				</div>
				<div id = "project-parallax-no-bookmark-label" class = "project-parallax-no-bookmark-label-text">
					<center>
						You don't have any bookmarks currently!<br>
						Add some bookmarks to your collection by pressing on the
						<img id = "project-parallax-no-bookmark-label-image-icon" class = "no-bookmark-label-image-icon" src = "gfx/interface/icons/bookmark_icon_empty.png" draggable = "false"></img>
						icon.
					</center>
				</div>
				<div id = "project-parallax-preview-container" class = "project-parallax-preview-container"></div>
				<div id = "project-parallax-dots-container" class = "project-parallax-dots-container"></div>
			</div>

			<!--Scroll progress indicator-->
			<div id = "project-parallax-scroll-indicator" class = "project-parallax-scroll-indicator">
				<div id = "project-parallax-scroll-fill-indicator" class = "project-parallax-scroll-fill-indicator"></div>
			</div>
		</div>
		`;
		this.element.style.height = "100%";
		
	}
	
	mountSelectors() {
		this.scene = this.element.querySelector("#scene");
		this.parallax_body = this.element.querySelector("#project-parallax-container");
		this.parallax_container = this.element.querySelector("#project-parallax-scroll-container");
		this.content_panel_container = this.element.querySelector("#main-parallax-content-panel-wrapper");
		this.content_panel_scroll_container = this.element.querySelector("#main-parallax-content-panel-scroll-wrapper");
		this.bookmark_container = this.element.querySelector("#project-parallax-bookmark-container");
		this.bookmark_preview_container = this.element.querySelector("#project-parallax-preview-container");
		this.bookmark_minimise_btn = this.element.querySelector("#project-parallax-bookmark-minimise-icon");
		this.bookmark_no_label = this.element.querySelector("#project-parallax-no-bookmark-label");
		this.parallax_scroll_indicator = this.element.querySelector("#project-parallax-scroll-fill-indicator");
		this.parallax_buttons = this.element.querySelector("#project-parallax-dots-container");
	}
	
	init() {
		// Initialize Parallax engine if global Parallax exists
		if (window.Parallax) {
			this.parallax_engine = new Parallax(this.scene, {
				scalarX: 12.5,
				scalarY: 35,
			});
		}
		
		this.initGalleryTiles();
		this.initGalleryUI();
		
		// Add hover listener for interaction logic
		this.parallax_body.addEventListener("mousemove", (e) => this.onParallaxHover(e));
	}
	
	addBookmarkItem(arg0_element_id, arg1_no_animation) {
		let local_id = arg0_element_id;
		let no_animation = arg1_no_animation;
		
		let bookmark_btn = this.element.querySelector(`#bookmark-btn-${local_id}`);
		let local_element = this.element.querySelector(`#${local_id}`);
		
		if (!local_element) return;
		
		local_element.setAttribute("id", `preview-${local_id}`);
		if (bookmark_btn) {
			bookmark_btn.setAttribute(
				"class",
				bookmark_btn.getAttribute("class").replace("bookmark-empty", "bookmark-filled"),
			);
		}
		
		this.bookmark_preview_container.innerHTML += local_element.outerHTML;
		if (!this.gallery.bookmark_items.includes(local_id)) this.gallery.bookmark_items.push(local_id);
		
		local_element.setAttribute("id", local_id);
		
		let all_bookmarks = this.element.querySelectorAll(".parallax-item-preview");
		let bookmark_el = this.element.querySelector(`#preview-${local_id}`);
		
		bookmark_el.setAttribute(
			"class",
			bookmark_el.getAttribute("class").replace("parallax-item", "parallax-item-preview") +
			" show-animation",
		);
		bookmark_el.onclick = () => this.selectBookmarkItem(`preview-${local_id}`);
		
		for (let i = 0; i < all_bookmarks.length; i++) {
			all_bookmarks[i].style.left = `calc(50% - 12vh - ${i * 12}vh)`;
			all_bookmarks[i].style.zIndex = all_bookmarks.length - 1 - i;
		}
		
		const closeBtn = document.createElement("div");
		closeBtn.id = `btn-close-bookmark-${local_id}`;
		closeBtn.className = "parallax-icon close-btn";
		closeBtn.onclick = (e) => {
			e.stopPropagation();
			this.bookmarkInteraction(local_id);
		};
		bookmark_el.appendChild(closeBtn);
		
		bookmark_el.style.left = `calc(50% - 12vh - ${all_bookmarks.length * 12}vh)`;
		bookmark_el.style.zIndex = "-1";
		
		setTimeout(() => {
			bookmark_el.style.left = `calc(50% - 12vh - ${all_bookmarks.length * 12}vh)`;
			bookmark_el.style.zIndex = "-1";
			bookmark_el.classList.remove("show-animation");
		}, 1000);
		
		if (!this.element.querySelector(`#btn-bookmark-preview-${local_id}`)) {
			let local_class_name = !no_animation
				? "parallax-bookmark-dot fade-in"
				: "parallax-bookmark-dot";
			let dot = document.createElement("div");
			dot.id = `btn-bookmark-preview-${local_id}`;
			dot.className = local_class_name;
			dot.onclick = () => this.selectBookmarkItem(`preview-${local_id}`);
			this.parallax_buttons.appendChild(dot);
			
			setTimeout(() => {
				let dots = this.element.querySelectorAll(".parallax-bookmark-dot.fade-in");
				dots.forEach((d) => d.classList.remove("fade-in"));
			}, 1000);
		}
		
		if (this.gallery.bookmark_items.length == 1) {
			this.gallery.bookmark_selected = local_id;
		}
		this.gallery.bookmark_selected = this.gallery.bookmark_selected == "" ? local_id : this.gallery.bookmark_selected;
		if (!this.gallery.bookmark_selected.includes("preview-")) {
			this.gallery.bookmark_selected = "preview-" + this.gallery.bookmark_selected;
		}
		
		try {
			this.selectBookmarkItem(this.gallery.bookmark_selected, true, true);
		} catch (e) {}
		
		this.bookmark_no_label.classList.add("hidden");
		this.bookmark_container.classList.remove("no-bookmarks");
	}
	
	bookmarkInteraction(arg0_element_id) {
		let local_id = arg0_element_id;
		!this.gallery.bookmark_items.includes(local_id) && !this.element.querySelector(`#preview-${local_id}`)
			? this.addBookmarkItem(local_id)
			: this.removeBookmarkItem(local_id);
	}
	
	clearBookmarkDots() {
		let dots = this.element.querySelectorAll(".parallax-bookmark-dot");
		dots.forEach((d) => d.classList.remove("filled"));
	}
	
	closeContentPanel(arg0_element_id) {
		let local_el = this.element.querySelector(`#${arg0_element_id}-content-panel`);
		if (local_el) {
			local_el.classList.remove("shown");
			this.parallax_scroll_indicator.style.opacity = 1;
		}
	}
	
	createPanel(arg0_tile_id, arg1_options) {
		let tile_id = arg0_tile_id;
		let options = arg1_options ? arg1_options : {};
		
		if (!options.font_position) options.font_position = "bottom-right";
		if (!options.font_size) options.font_size = 1;
		if (!options.font_weight) options.font_weight = 300;
		if (!options.size) options.size = 1;
		if (!options.x) options.x = 0;
		if (!options.y) options.y = 0;
		if (!options.background_opacity) options.background_opacity = 0.3;
		if (!options.colour) options.colour = "copper";
		
		let font_size_dict = {
			1: "parallax-minor-project-text",
			2: "parallax-major-project-text",
			3: "parallax-group-text",
		};
		let size_dict = {
			1: "large-square",
			2: "sublarge-square",
			3: "medium-square",
			4: "submedium-square",
			5: "small-square",
			6: "tiny-square",
		};
		let size_vh_dict = {
			1: 32,
			2: 28,
			3: 24,
			4: 18,
			5: 16,
			6: 12,
		};
		
		let background_style = options.background_image
			? `style="background-image: url(${options.background_image}); opacity: ${options.background_opacity};"`
			: "";
		
		let tile_element = `
			<div id="${tile_id}" class="parallax-item ${size_dict[options.size]} ${options.colour}" style="position: absolute; top: calc(${options.y}vh + var(--parallax-offset-y)); left: calc(23vw + ${options.x}vh + var(--parallax-offset-x));">
				<div class="parallax-item-colour-bg"></div>
				<div class="parallax-item-bg" ${background_style}></div>
				<span class="${font_size_dict[options.font_size]} ${options.font_position}" style="font-weight: ${options.font_weight}">${options.name}</span>
			</div>
		`;
		
		this.element.querySelector("#main-parallax-content-wrapper").insertAdjacentHTML("beforeend", tile_element);
		
		const tile_dom = this.element.querySelector(`#${tile_id}`);
		tile_dom.onclick = () => {
			this.toggleContentPanel(tile_id);
			this.selectParallaxItem(tile_id);
		};
		
		if (options.content) {
			let panel_element = `
				<div id="${tile_id}-content-panel" class="parallax-item-content-panel ${options.animation}-panel" style="top: calc(${options.y}vh + var(--parallax-offset-y) + var(--content-panel-offset-y)); left: calc(23vw + ${options.x}vh + ${size_vh_dict[options.size]}vh + 8vh + var(--parallax-offset-x) + var(--content-panel-offset-x));">
					<div id="${tile_id}-content-wrapper" class="content-wrapper">
						<div id="${tile_id}-text-wrapper" class="text-wrapper">
							${options.content}
						</div>
					</div>
				</div>
			`;
			this.content_panel_scroll_container.insertAdjacentHTML("beforeend", panel_element);
		}
		
		let new_tile_obj = {};
		if (options.animation) new_tile_obj.animation = options.animation;
		if (options.dependencies) new_tile_obj.dependencies = options.dependencies;
		if (options.is_base_node) new_tile_obj.is_base_node = options.is_base_node;
		this.gallery.parallax_settings[tile_id] = new_tile_obj;
		
		if (options.default_bookmark) {
			if (!this.gallery.bookmark_items.includes(tile_id)) this.gallery.bookmark_items.push(tile_id);
		}
		if (options.default_pin) {
			if (!this.gallery.parallax_pinned_items.includes(tile_id)) this.gallery.parallax_pinned_items.push(tile_id);
		}
	}
	
	getCursorPosition(e, arg0_image) {
		e = e ? e : window.event;
		let img_bounds = arg0_image.getBoundingClientRect();
		return {
			x: e.clientX - img_bounds.left,
			y: e.clientY - img_bounds.top,
		};
	}
	
	getDescendants(arg0_element_id) {
		let descendants = [arg0_element_id];
		let current_iterations = 0;
		try {
			while (true) {
				let start_len = descendants.length;
				for (let i = 0; i < descendants.length; i++) {
					let local_obj = this.gallery.parallax_settings[descendants[i]];
					if (local_obj && local_obj.dependencies) {
						local_obj.dependencies.forEach((dep) => {
							if (!descendants.includes(dep)) descendants.push(dep);
						});
					}
				}
				if (descendants.length === start_len || current_iterations >= 15) break;
				current_iterations++;
			}
		} catch (e) {}
		return descendants.filter((id) => id !== arg0_element_id);
	}
	
	getMaximisedContentPanel() {
		let maximised = this.element.querySelector(".parallax-item-content-panel.shown.maximised");
		return maximised ? maximised.id.replace("-content-panel", "") : undefined;
	}
	
	hideAllContentPanels() {
		let shown = this.element.querySelectorAll(".parallax-item-content-panel.shown");
		shown.forEach((p) => p.classList.remove("shown"));
	}
	
	hideBookmarkUI() {
		this.bookmark_minimise_btn.classList.add("minimised");
		this.bookmark_container.classList.add("minimised");
	}
	
	getParent(arg0_element_id) {
		let potential_child = arg0_element_id;
		let keys = Object.keys(this.gallery.parallax_settings);
		let parents = [];
		keys.forEach((k) => {
			let obj = this.gallery.parallax_settings[k];
			if (obj.dependencies && obj.dependencies.includes(potential_child)) parents.push(k);
		});
		return [...new Set(parents)];
	}
	
	initGallery() {
		let hide_elements = [];
		let parallax_elements = this.element.querySelectorAll(".parallax-item");
		
		parallax_elements.forEach((el) => {
			this.initParallaxElement(el.id);
			if (this.getParent(el.id).length > 0 && !this.gallery.parallax_pinned_items.includes(el.id)) {
				hide_elements.push(el.id);
			}
		});
		
		hide_elements = [...new Set(hide_elements)];
		hide_elements.forEach((id) => {
			let el = this.element.querySelector(`#${id}`);
			el.classList.add("hidden");
			let obj = this.gallery.parallax_settings[id];
			if (obj && obj.animation) el.setAttribute("animation", obj.animation);
		});
		
		this.gallery.bookmark_items.forEach((id) => this.addBookmarkItem(id, true));
	}
	
	initGalleryDesktopEventHandlers() {
		this.parallax_body.addEventListener("mousemove", (e) => {
			let half_width = this.parallax_body.clientWidth / 2;
			let half_height = this.parallax_body.clientHeight / 2;
			let mouse_x = half_width + this.parallax_body.offsetLeft - e.pageX;
			let mouse_y = half_height + this.parallax_body.offsetTop - e.pageY;
			
			if (this.gallery.content_panel_update_paused) {
				mouse_x /= 32;
				mouse_y /= 32;
			}
			
			let max_deg = 1.25;
			this.perspective_deg_x = (mouse_y / half_height) * max_deg * -1 + max_deg / 2;
			this.perspective_deg_y = (mouse_x / half_width) * max_deg * -1 + 2;
			
			let p_string = `rotateX(${this.perspective_deg_x}deg) rotateY(${this.perspective_deg_y}deg)`;
			this.scene.style.transform = `perspective(20em) ${p_string}`;
		});
		
		window.addEventListener("scroll", () => {
			const track = document.getElementById("gallery-section") || this.element;
			const rect = track.getBoundingClientRect();
			const scrollable_dist = rect.height - window.innerHeight;
			
			let vertical_offset = 0;
			if (rect.top <= 0 && rect.bottom >= 0) {
				vertical_offset = Math.abs(rect.top);
			} else if (rect.bottom < 0) {
				vertical_offset = scrollable_dist;
			}
			
			const container = this.element.querySelector(".project-parallax-container");
			const siblings = container.children;
			for (let i = 0; i < siblings.length; i++) {
				let child = siblings[i];
				if (child.id === "project-parallax-bookmark-container") {
					child.style.top = vertical_offset + window.innerHeight / 2 + "px";
				} else if (child.id === "project-parallax-scroll-indicator") {
					child.style.top = vertical_offset + window.innerHeight - 5 + "px";
				} else {
					child.style.top = vertical_offset + "px";
				}
			}
			
			if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
				let progress = Math.abs(rect.top) / scrollable_dist;
				this.gallery.parallax_scroll_x = progress * this.gallery.gallery_width * -1;
				this.parallax_container.style.transform = `translateX(${this.gallery.parallax_scroll_x}vh)`;
				if (this.parallax_scroll_indicator) {
					this.parallax_scroll_indicator.style.width = `${progress * 100}vw`;
				}
			}
		});
		
		this.parallax_body.addEventListener(
			"wheel",
			(e) => {
				let panel = e.target.closest(".content-wrapper");
				if (panel) {
					let at_top = panel.scrollTop <= 0 && e.deltaY < 0;
					let at_bottom = panel.scrollTop + panel.offsetHeight >= panel.scrollHeight && e.deltaY > 0;
					if (!at_top && !at_bottom) e.stopPropagation();
				}
			},
			{ passive: false },
		);
	}
	
	initGalleryMobileEventHandlers() {
		this.parallax_body.addEventListener(
			"touchmove",
			(e) => {
				if (this.element.querySelectorAll(".maximised.shown").length !== 0) {
					if (!e.target.closest(".parallax-item-content-panel")) {
						e.preventDefault();
					}
				}
			},
			{ passive: false },
		);
	}
	
	initGalleryTiles() {
		// Assume config.homepage.gallery.tiles exists globally or via constructor
		let source = (window.config && config.homepage && config.homepage.gallery) ? config.homepage.gallery.tiles : {};
		Object.keys(source).forEach((k) => {
			try {
				this.createPanel(k, source[k]);
			} catch (e) {
				console.error(e);
			}
		});
	}
	
	initGalleryUI() {
		this.bookmark_minimise_btn.onclick = () => {
			this.bookmark_minimise_btn.classList.contains("minimised") ? this.showBookmarkUI() : this.hideBookmarkUI();
		};
		
		setTimeout(() => {
			let panels = this.element.querySelectorAll(".content-wrapper");
			panels.forEach((p) => {
				let title = p.querySelector(".parallax-item-content-panel-title");
				if (!title) return;
				let id = p.id.replace("-content-wrapper", "");
				let raw_id = id.replace("-content-panel", "");
				
				title.innerHTML = `
					${title.textContent}
					<img id="${raw_id}-close-btn" class="content-panel-close-btn" src="gfx/interface/icons/close_btn.png" draggable="false">
					<img id="${raw_id}-maximise-btn" class="content-panel-maximise-btn" src="gfx/interface/icons/maximise_icon.png" draggable="false">
				`;
				
				this.element.querySelector(`#${raw_id}-close-btn`).onclick = () => this.closeContentPanel(raw_id);
				this.element.querySelector(`#${raw_id}-maximise-btn`).onclick = () => this.maximiseContentPanel(raw_id);
			});
		}, 500);
		
		this.initGalleryDesktopEventHandlers();
		this.initGalleryMobileEventHandlers();
		
		setInterval(() => {
			this.gallery.parallax_selected.forEach((id) => {
				let obj = this.gallery.parallax_settings[id];
				if (obj && obj.dependencies) {
					obj.dependencies.forEach((dep_id) => {
						let el = this.element.querySelector(`#${dep_id}`);
						if (el && el.classList.contains("hidden")) {
							el.classList.remove("hidden");
							let dep_obj = this.gallery.parallax_settings[dep_id];
							if (dep_obj && dep_obj.show_function) dep_obj.show_function();
						}
					});
				}
			});
		}, 100);
		
		setInterval(() => this.updateContentPanelContainer(), 16);
		this.initGallery();
	}
	
	initParallaxElement(arg0_element_id) {
		let local_id = arg0_element_id;
		if (!this.gallery.parallax_settings[local_id]) this.gallery.parallax_settings[local_id] = {};
		let local_obj = this.gallery.parallax_settings[local_id];
		
		local_obj.animation_queue = local_obj.animation_queue || [];
		local_obj.id = local_id;
		
		local_obj.hide_function = () => {
			local_obj.animation_queue.push(local_obj.animation);
			local_obj.animation_queue = [...new Set(local_obj.animation_queue.reverse())].reverse();
		};
		
		local_obj.show_function = () => {
			local_obj.animation_queue.push(`${local_obj.animation}-shown`);
			local_obj.animation_queue = [...new Set(local_obj.animation_queue.reverse())].reverse();
		};
		
		let dependency_amount = this.getDescendants(local_id).length;
		local_obj.logic = setInterval(() => {
			let all_children_done = true;
			this.getDescendants(local_id).forEach((child_id) => {
				let c_obj = this.gallery.parallax_settings[child_id];
				if (c_obj && c_obj.animation_queue.length > 0) all_children_done = false;
			});
			
			if (all_children_done && local_obj.animation_queue.length > 0) {
				try {
					let el = this.element.querySelector(`#${local_id}`);
					let anim = local_obj.animation_queue[0];
					el.setAttribute("animation", anim);
					
					setTimeout(() => {
						if (anim.includes("-shown")) {
							el.classList.remove("hidden");
						} else {
							el.classList.add("hidden");
						}
						local_obj.animation_queue.splice(0, 1);
					}, 750);
				} catch (e) {}
			}
		}, 750 - dependency_amount);
		
		let local_el = this.element.querySelector(`#${local_id}`);
		local_el.setAttribute("animation", local_el.id + "-shown");
		local_el.onclick = () => {
			this.toggleContentPanel(local_id);
			this.selectParallaxItem(local_id);
		};
		
		if (local_obj.animation && !local_obj.is_base_node) {
			local_el.insertAdjacentHTML(
				"beforeend",
				`
				<div class="parallax-icon pin ${this.gallery.parallax_pinned_items.includes(local_id) ? "pin-filled" : "pin-empty"}"></div>
				<div id="bookmark-btn-${local_id}" class="parallax-icon bookmark bookmark-empty"></div>
				`,
			);
			local_el.querySelector(".pin").onclick = (e) => {
				e.stopPropagation();
				this.pinItem(local_id);
			};
			local_el.querySelector(".bookmark").onclick = (e) => {
				e.stopPropagation();
				this.bookmarkInteraction(local_id);
			};
		}
	}
	
	magnify (arg0_element, arg1_zoom) {
		//Convert from parameters
		var local_el = arg0_element;
		var zoom = arg1_zoom;
		
		//Declare global instance variables
		var element_id = local_el.id;
		
		window[element_id + "_zoom"] = zoom;
		var local_zoom = window[element_id + "_zoom"];
		
		//Create magnifying glass element
		var local_magnifier = document.createElement("DIV");
		local_magnifier.setAttribute("class", "image-magnifier-glass");
		local_magnifier.style.backgroundImage = `url('${local_el.src}')`;
		local_magnifier.style.backgroundRepeat = "no-repeat";
		
		local_el.parentElement.insertBefore(local_magnifier, local_el);
		
		//Dynamic movement events - PC
		local_el.addEventListener("mousemove", (e) => moveMagnifier(e, local_el, local_magnifier));
		
		//Dynamic movement events - Mobile
		local_el.addEventListener("touchmove", (e) => moveMagnifier(e, local_el, local_magnifier));
		
		//Dynamic zoom
		local_el.addEventListener("wheel", (e) => {
			local_zoom += e.deltaY*-0.0025;
			
			//Restrict zoom between 1.25-10
			local_zoom = Math.min(Math.max(1.25, local_zoom), 10);
			window[element_id + "_zoom"] = local_zoom;
			
			e.preventDefault();
		});
		
		//Hide magnifier if image is not hovered on
		setInterval(function(){
			local_magnifier.style.opacity = (document.querySelectorAll(`#${element_id}:hover`).length != 0 && window[element_id.replace(/-/gm, "_") + "_active_preview"] != false) ? 1 : 0;
		}, 0);
	}
	
	pinItem(arg0_element_id) {
		let local_el = this.element.querySelector(`#${arg0_element_id}`);
		let pin_btn = local_el.querySelector(".pin");
		if (this.gallery.parallax_pinned_items.includes(arg0_element_id)) {
			this.gallery.parallax_pinned_items = this.gallery.parallax_pinned_items.filter((i) => i !== arg0_element_id);
			pin_btn.classList.replace("pin-filled", "pin-empty");
		} else {
			this.gallery.parallax_pinned_items.push(arg0_element_id);
			pin_btn.classList.replace("pin-empty", "pin-filled");
		}
	}
	
	selectBookmarkItem(arg0_element_id, arg1_automatic_selection, arg2_no_scroll) {
		let actual_id = arg0_element_id.replace("preview-", "");
		let local_bookmark = this.element.querySelector(`#${arg0_element_id}`);
		let local_dot = this.element.querySelector(`#btn-bookmark-${arg0_element_id}`);
		let parallax_el = this.element.querySelector(`#${actual_id}`);
		
		let local_index = this.gallery.bookmark_items.indexOf(actual_id);
		if (local_index === -1) local_index = 0;
		
		if (!this.closing_bookmark || arg1_automatic_selection) {
			this.clearBookmarkDots();
			if (local_dot) local_dot.classList.add("filled");
			
			this.gallery.bookmark_selected = arg0_element_id;
			this.bookmark_preview_container.style.left = `${local_index * -12}vh`;
			
			let all_previews = this.element.querySelectorAll(".parallax-item-preview:not([item-state*='hidden'])");
			all_previews.forEach((p, i) => {
				p.style.left = `calc(50% - 12vh - ${i * 12}vh)`;
				p.style.zIndex = i < local_index ? i : all_previews.length - i;
				p.classList.remove("selected");
			});
			
			if (local_bookmark) {
				local_bookmark.style.zIndex = 99;
				local_bookmark.classList.add("selected");
			}
			
			if (!arg2_no_scroll && parallax_el) {
				let maximised = this.getMaximisedContentPanel();
				if (maximised) this.minimiseContentPanel(maximised);
				
				let vh = window.innerHeight / 100;
				let vw = window.innerWidth / 100;
				let local_width = parseInt(getComputedStyle(parallax_el).width) / vh;
				let offset_x = (vw * 50) / vh;
				let pan_x = parseInt(getComputedStyle(parallax_el).left) / vh;
				
				this.gallery.parallax_scroll_x = pan_x * -1 + offset_x - local_width / 2;
				this.parallax_container.classList.remove("fast-scroll");
				this.parallax_container.classList.add("slow-scroll");
				this.parallax_container.style.transform = `translateX(${this.gallery.parallax_scroll_x}vh)`;
			}
			
			if (parallax_el && !parallax_el.getAttribute("animation").includes("shown")) {
				parallax_el.setAttribute("animation", actual_id + "-shown");
				parallax_el.classList.remove("hidden");
			}
		}
	}
	
	removeBookmarkItem(arg0_element_id) {
		let local_id = arg0_element_id;
		let bookmark_btn = this.element.querySelector(`#bookmark-btn-${local_id}`);
		let local_index = this.gallery.bookmark_items.indexOf(local_id);
		
		if (bookmark_btn) bookmark_btn.classList.replace("bookmark-filled", "bookmark-empty");
		this.gallery.bookmark_items = this.gallery.bookmark_items.filter((i) => i !== local_id);
		
		this.closing_bookmark = true;
		setTimeout(() => (this.closing_bookmark = false), 100);
		
		let dot = this.element.querySelector(`#btn-bookmark-preview-${local_id}`);
		let preview = this.element.querySelector(`#preview-${local_id}`);
		
		preview.setAttribute("item-state", "hidden");
		if (dot) dot.classList.add("fade-out");
		
		let new_selected = this.gallery.bookmark_selected;
		if (!this.gallery.bookmark_items.includes(new_selected.replace("preview-", ""))) {
			let next = this.gallery.bookmark_items[local_index] || this.gallery.bookmark_items[local_index - 1];
			new_selected = next ? "preview-" + next : "";
		}
		
		if (new_selected) {
			this.selectBookmarkItem(new_selected, true, true);
		}
		
		setTimeout(() => {
			if (preview) preview.remove();
			if (dot) dot.remove();
			if (this.gallery.bookmark_items.length === 0) {
				this.bookmark_no_label.classList.remove("hidden");
				this.bookmark_container.classList.add("no-bookmarks");
			}
		}, 500);
	}
	
	selectParallaxItem(arg0_element_id) {
		let id = arg0_element_id;
		if (!this.gallery.parallax_selected.includes(id)) {
			this.gallery.parallax_selected.push(id);
		} else {
			this.gallery.parallax_selected = this.gallery.parallax_selected.filter((i) => i !== id);
		}
	}
	
	showBookmarkUI() {
		this.bookmark_minimise_btn.classList.remove("minimised");
		this.bookmark_container.classList.remove("minimised");
	}
	
	toggleContentPanel(arg0_element_id) {
		let local_el = this.element.querySelector(`#${arg0_element_id}-content-panel`);
		if (!local_el) return;
		
		let pre_check = local_el.classList.contains("shown");
		let was_maximized = local_el.classList.contains("maximised");
		
		this.hideAllContentPanels();
		if (!pre_check) {
			let main_scene = this.element.querySelector(".layer.main");
			this.content_panel_container.style.transform = main_scene.style.transform;
			
			local_el.classList.add("shown");
			if (was_maximized) this.maximiseContentPanel(arg0_element_id);
		}
		
		let maximised_id = this.getMaximisedContentPanel();
		if (maximised_id && maximised_id !== arg0_element_id) {
			this.minimiseContentPanel(maximised_id, true);
		}
	}
	
	maximiseContentPanel(arg0_element_id) {
		let panel = this.element.querySelector(`#${arg0_element_id}-content-panel`);
		let btn = this.element.querySelector(`#${arg0_element_id}-maximise-btn`);
		
		this.gallery.content_panel_update_paused = true;
		this.content_panel_container.style.cssText = `
			transform-style: preserve-3d;
			backface-visibility: hidden;
			position: relative;
			display: block;
			left: 0vh;
			top: 0px;
			transition: all 1s ease;
		`;
		panel.classList.add("maximised");
		btn.onclick = () => this.minimiseContentPanel(arg0_element_id);
		this.parallax_scroll_indicator.style.opacity = 0;
	}
	
	minimiseContentPanel(arg0_element_id, arg1_instant) {
		let panel = this.element.querySelector(`#${arg0_element_id}-content-panel`);
		let btn = this.element.querySelector(`#${arg0_element_id}-maximise-btn`);
		
		this.gallery.content_panel_update_paused = false;
		panel.classList.remove("maximised");
		panel.classList.add(arg1_instant ? "instant-minimisation" : "being-minimised");
		
		setTimeout(() => {
			panel.classList.remove("being-minimised", "instant-minimisation");
		}, arg1_instant ? 100 : 1000);
		
		btn.onclick = () => this.maximiseContentPanel(arg0_element_id);
		this.parallax_scroll_indicator.style.opacity = 1;
	}
	
	updateContentPanelContainer() {
		let main_scene = this.element.querySelector(".layer.main");
		if (!this.gallery.content_panel_update_paused && main_scene) {
			this.content_panel_container.style.transform = main_scene.style.transform;
			this.content_panel_scroll_container.style.transform = `perspective(40em) rotateX(${
				(this.perspective_deg_y || 0) * 0.5
			}deg) translateX(${this.gallery.parallax_scroll_x}vh)`;
		}
	}
	
	onParallaxHover(e) {
		let target = e.target.closest(".parallax-item") || e.target.closest(".parallax-item-preview");
		if (!target) return;
		
		let hover_time = parseInt(target.getAttribute("hover-time") || 0);
		hover_time += 16; // Approx interval
		target.setAttribute("hover-time", hover_time);
		
		if (hover_time > 500) {
			let id = target.id.replace("preview-", "");
			if (this.gallery.parallax_settings[id]) {
				if (!this.gallery.parallax_selected.includes(id)) {
					this.gallery.parallax_selected.push(id);
					this.updateHiddenElements();
				}
			}
		}
	}
	
	updateHiddenElements() {
		let all_items = this.element.querySelectorAll(".parallax-item");
		let visible = new Set(this.gallery.parallax_selected);
		
		this.gallery.parallax_selected.forEach((id) => {
			let obj = this.gallery.parallax_settings[id];
			if (obj && obj.dependencies) obj.dependencies.forEach((d) => visible.add(d));
		});
		
		// Add base nodes
		Object.keys(this.gallery.parallax_settings).forEach((k) => {
			if (this.getParent(k).length === 0) visible.add(k);
		});
		
		all_items.forEach((el) => {
			let id = el.id;
			if (!visible.has(id) && !this.gallery.parallax_pinned_items.includes(id)) {
				let obj = this.gallery.parallax_settings[id];
				if (obj && obj.hide_function) obj.hide_function();
			}
		});
	}
};

function initHomepageGallery () {
	let initialisation_loop = setInterval(() => {
		try {
			window.viewport_two = new window.HomepageGallery();
			window.viewport_two.bind(document.getElementById("gallery-section"));
			clearInterval(initialisation_loop);
		} catch (e) { console.warn(e); }
	});
}
initHomepageGallery();