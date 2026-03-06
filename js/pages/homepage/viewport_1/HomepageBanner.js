window.HomepageBanner = class extends window.WebComponent {
	constructor (arg0_value, arg1_options) {
		//Convert from parameters
		let value = (arg0_value) ? arg0_value : {};
		let options = (arg1_options) ? arg1_options : {};
			super(value, options);
		
		//Declare local instance variables
		this.banner_settings = {
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
		
		this.banner_selected_once = false;
		this.content_editable_evt_listeners_added = false;
		this.current_banner = "main_video";
		this.current_font = "bahnschrift";
		this.current_font_weight = 700;
		this.current_overlay = "grey";
		this.settings_btn_clicked = 0;
		this.settings_minimised = true;
		this.settings_window_open = false;
		this.time_since_selection = 0;
		this.typing_speed = 750;
			
		//Draw call for mounting; then mount selectors
		this.draw();
		this.mountSelectors();
	}
	
	draw () {
		//Draw HTML first
		this.element.innerHTML = `
		<!--Default video animation-->
		<video id = "homepage-banner-video-bg" class = "homepage-banner-video-bg" preload muted>
			<source src = "gfx/videos/homepage_banner_bg.mp4" type = "video/mp4">
		</video>
		<!--Misty forest background-->
		<video id = "homepage-banner-video-bg-misty-forest" class = "homepage-banner-video-bg-misty-forest hidden" preload muted loop>
			<source src = "gfx/videos/misty_forest_bg.mp4" type = "video/mp4">
		</video>
		<!--Cleveland National Forest background -->
		<div id = "homepage-banner-cleveland-national-forest-bg" class = "homepage-banner-cleveland-national-forest-bg hidden"></div>
		<!--WW1 Parallax background-->
		<div id = "homepage-banner-triumph-and-tragedy-bg" class = "homepage-banner-triumph-and-tragedy-bg hidden">
			<img src = "gfx/interface/ww1_bg/layer_01.png" draggable = "false">
			<img src = "gfx/interface/ww1_bg/layer_02.png" draggable = "false">
			<img src = "gfx/interface/ww1_bg/layer_03.png" draggable = "false">
			<img src = "gfx/interface/ww1_bg/layer_04.png" draggable = "false">
			<img src = "gfx/interface/ww1_bg/layer_05.png" draggable = "false">
			<img src = "gfx/interface/ww1_bg/layer_06.png" draggable = "false">
			<img src = "gfx/interface/ww1_bg/layer_07.png" draggable = "false">
			<img src = "gfx/interface/ww1_bg/layer_08.png" draggable = "false">
		</div>
		<!--Lava lamp background-->
		<div id = "homepage-banner-lava-lamp-bg" class = "homepage-banner-lava-lamp-bg hidden">
			<svg version = "1.1" xmlns = "http://www.w3.org/2000/svg" id = "lava-lamp-loader">
				<defs>
					<filter id = "goo">
						<feGaussianBlur in = "SourceGraphic" result = "blur" stdDeviation = "10" />
						<feColorMatrix in = "blur" mode = "matrix" values = "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result = "goo" />
						<feBlend in2 = "goo" in = "SourceGraphic" result = "mix" />
					</filter>
					<linearGradient id = "lava-lamp-gradient">
							<stop offset = "2%"  stop-color = "#40204c"/>
							<stop offset = "10%" stop-color = "#a3225c"/>
							<stop offset = "15%" stop-color = "#f06f51"/>
							<stop offset = "50%" stop-color = "#ed691c"/>
							<stop offset = "65%" stop-color = "#e24926"/>
					</linearGradient>
				</defs>
				<mask id="lava-lamp-mask-container">
					<g class = "lava-lamp-blob-container">
						<!--Big old circle in the top left to just look cool!-->
						<circle class = "lava-lamp-blob" cx = "0%" cy = "0%" r = "20%" transform = "rotate(0) translate(0, 0) rotate(0)"/>
						<circle class = "lava-lamp-blob" cx = "20%" cy = "15%" r = "3%" transform = "rotate(0) translate(0, 0) rotate(0)"/>
						<circle class = "lava-lamp-blob" cx = "44%" cy = "25%" r = "3%" transform = "rotate(0) translate(0, 0) rotate(0)"/>
						<circle class = "lava-lamp-blob" cx = "50%" cy = "32%" r = "7%" transform = "rotate(0) translate(0, 0) rotate(0)"/>
						<circle class = "lava-lamp-blob" cx = "54%" cy = "22%" r = "5%" transform = "rotate(0) translate(0, 0) rotate(0)"/>
						<circle class = "lava-lamp-blob" cx = "30%" cy = "39%" r = "4%" transform = "rotate(0) translate(0, 0) rotate(0)"/>
						<circle class = "lava-lamp-blob" cx = "35%" cy = "45%" r = "6%" transform = "rotate(0) translate(0, 0) rotate(0)"/>
						<circle class = "lava-lamp-blob" cx = "24%" cy = "67%" r = "2.5%" transform = "rotate(0) translate(0, 0) rotate(0)"/>
						<circle class = "lava-lamp-blob" cx = "67%" cy = "62%" r = "8%" transform = "rotate(0) translate(0, 0) rotate(0)"/>
						<circle class = "lava-lamp-blob" cx = "47%" cy = "45%" r = "2%" transform = "rotate(0) translate(0, 0) rotate(0)"/>
						<circle class = "lava-lamp-blob" cx = "57%" cy = "45%" r = "4%" transform = "rotate(0) translate(0, 0) rotate(0)"/>
						<circle class = "lava-lamp-blob" cx = "72%" cy = "45%" r = "6%" transform = "rotate(0) translate(0, 0) rotate(0)"/>
						<circle class = "lava-lamp-blob" cx = "87%" cy = "85%" r = "8%" transform = "rotate(0) translate(0, 0) rotate(0)"/>
					</g>
				</mask>
				<rect x="0" y="0"  mask="url(#lava-lamp-mask-container)" fill="url(#lava-lamp-gradient)" width="100vw" height="100vh">
			</svg>
		</div>
		<!--Rain background, raindrops container contains dynamically generated raindrops-->
		<div id = "homepage-banner-rain-bg-container" class = "homepage-banner-rain-bg-container hidden">
			<div id = "homepage-banner-rain-bg" class = "homepage-banner-rain-bg">
			</div>
			<div id = "homepage-banner-raindrops-container" class = "homepage-banner-raindrops-container">
			</div>
		</div>

		<!--Plexus overlay, keep all this stuff at hte bottom of the homepage banner container-->
		<img id = "homepage-banner-plexus-overlay-bg" class = "homepage-banner-plexus-overlay-bg" src = "gfx/interface/vector_plexus_overlay_bg.png" draggable = "false">

		<div id = "homepage-banner-main-title" class = "homepage-banner-main-title">
			<span id = "homepage-banner-main-title-text" class = "homepage-banner-main-title-text"></span>
			<span id = "homepage-caret-wrapper" class = "homepage-caret-container">
				<span id = "homepage-banner-caret-spacer" class = "homepage-caret-spacer">.</span>
				<span id = "homepage-banner-caret-element" class = "homepage-banner-blinking-caret"></span>
			</span>
		</div>

		<!--Homepage banner settings container-->
		<div id = "homepage-banner-footer-container" class = "homepage-banner-footer-container">
			<div id = "settings-btn-container" class = "settings-btn-container stationary">
				<img id = "settings-btn" class = "settings-btn hidden" src = "gfx/interface/icons/settings_btn.png" draggable = "false">
			</div>
			<div id = "homepage-banner-dots-container" class = "homepage-banner-dots-container">
			</div>
			<div id = "homepage-banner-chevron-down" class = "homepage-banner-chevron-down hidden">
				<img id = "homepage-banner-chevron-down-image" class = "homepage-banner-chevron-down-icon" src = "gfx/interface/icons/chevron.png" draggable = "false">
			</div>
		</div>

		<!--Main settings UI-->
		<div id = "homepage-banner-settings-container" class = "homepage-banner-settings-container hidden">
			<div id = "homepage-banner-settings-title-container" class = "homepage-banner-settings-title-container">
				<span id = "homepage-banner-settings-title-text" class = "homepage-banner-settings-title-text">Settings</span>
				<img id = "settings-adjust-size-btn" class = "settings-chevron-btn minimised" src = "gfx/interface/icons/chevron_down.png" draggable = "false">
				<img id = "settings-close-btn" class = "settings-close-btn" src = "gfx/interface/icons/close_btn.png" draggable = "false">
			</div>
			<div id = "homepage-banner-settings-body-container" class = "homepage-banner-settings-body-container scroll-container">
				<div id = "homepage-banner-settings-change-bg-title" class = "settings-subtitle">Change Background:</div>
				<hr class = "settings-ruler">
				<div id = "homepage-banner-settings-change-bg-container" class = "change-bg-container">
				</div>
				<div id = "homepage-banner-settings-change-overlay-title" class = "settings-subtitle">Change Overlay:</div>
				<hr class = "settings-ruler">
				<div id = "homepage-banner-settings-change-overlay-container" class = "change-overlay-container scroll-container">
				</div>

				<div id = "homepage-banner-settings-padded-footer" class = "homepage-banner-settings-padded-margin"></div>
				<div id = "other-settings-wrapper" class = "other-settings-container">
					<div id = "homepage-banner-settings-change-opacity-title" class = "settings-subtitle">Change Overlay Opacity:</div>
					<hr class = "settings-ruler">
					<br>
					<input type = "range" id = "settings-change-opacity" class = "settings-change-opacity range-input" value = "15" min = "0" max = "100" onmousemove = "homepageBannerChangeOpacity(this.value);">
					<br>
					<br>
					<div id = "homepage-banner-settings-text-options-title" class = "settings-subtitle">Text Options:</div>
					<hr class = "settings-ruler">
					<div id = "homepage-banner-settings-change-font-size-label" class = "settings-label">
						Change Font Size:
						<input type = "range" id = "settings-change-font-size" class = "settings-change-font-size range-input added-margin" value = "100" min = "0" max = "100" onmousemove = "homepageBannerChangeFontSize(this.value);">
					</div>
					<div id = "homepage-banner-settings-change-font-weight-label" class = "settings-label">
						Change Font Weight:
						<input type = "range" id = "settings-change-font-weight" class = "settings-change-font-weight range-input added-margin" value = "100" min = "0" max = "100" onmousemove = "homepageBannerChangeFontWeight(this.value);">
					</div>
					<div id = "homepage-banner-settings-display-caret-label" class = "settings-label">
						Display Caret:
						<label class = "form-switch">
							<input type = "checkbox" id = "settings-display-caret" checked onclick = "homepageBannerToggleCaret();">
							<i></i>
						</label>
					</div>
					<div id = "homepage-banner-settings-change-font-family-label" class = "settings-label">
						Font Family:
						<select id = "settings-change-font-family" class = "font-family-dropdown">
						</select>
					</div>
					<div id = "homepage-banner-settings-change-text-alignment-label" class = "settings-label">
						Text Alignment:
						<button id = "change-left-alignment" class = "text-alignment-button added-margin" onclick = "homepageBannerLeftAlign();">
							&lt; &nbsp; Left
						</button>
						<button id = "change-centre-alignment" class = "text-alignment-button added-margin" onclick = "homepageBannerCentreAlign();">
							= &nbsp; Centre
						</button>
						<button id = "change-right-alignment" class = "text-alignment-button added-margin" onclick = "homepageBannerRightAlign();">
							&gt; &nbsp; Right
						</button>
					</div>
				</div>
				<div id = "homepage-banner-settings-padded-footer" class = "homepage-banner-settings-padded-footer"></div>
			</div>
		</div>
		`;
	}
	
	init () {
		
	}
	
	mountSelectors () { //[WIP] - Finish function body
		this.banner_caret_element = this.element.querySelector(`#homepage-banner-caret-element`);
		this.banner_caret_spacer_element = this.element.querySelector(`#homepage-banner-caret-spacer`);
		this.banner_title_text = this.element.querySelector(`#homepage-banner-main-title-text`);
		this.cleveland_national_forest_bg = this.element.querySelector(`#homepage-banner-cleveland-national-forest-bg`);
		this.homepage_banner_overlay = this.element.querySelector(`#homepage-banner-plexus-overlay-bg`);
		this.lava_lamp_bg = this.element.querySelector(`#homepage-banner-lava-lamp-bg`);
		this.main_video_bg = this.element.querySelector(`#homepage-banner-video-bg`);
		this.misty_forest_bg = this.element.querySelector(`#homepage-banner-video-bg-misty-forest`);
		this.raindrop_bg = this.element.querySelector(`#homepage-banner-rain-bg-container`);
		this.settings_container = this.element.querySelector(`#homepage-banner-settings-container`);
		this.title_element = this.element.querySelector(`#homepage-banner-main-title`);
		this.triumph_and_tragedy_bg = this.element.querySelector(`#homepage-banner-triumph-and-tragedy-bg`);
		
		this.settings_bg_container = this.element.querySelector(`#homepage-banner-settings-change-bg-container`);
		this.settings_btn_container = this.element.querySelector(`#settings-btn-container`);
		this.settings_close_btn = this.element.querySelector(`#settings-close-btn`);
		this.settings_font_select = this.element.querySelector(`#settings-change-font-family`);
		this.settings_minimise_btn = this.element.querySelector(`#settings-adjust-size-btn`);
		this.settings_overlay_container = this.element.querySelector(`#homepage-banner-settings-change-overlay-container`);
		this.settings_window = this.element.querySelector(`#homepage-banner-settings-container`);
		
		this.chevron_icon = this.element.querySelector(`#homepage-banner-chevron-down`);
		this.dots_container = this.element.querySelector(`#homepage-banner-dots-container`);
		this.raindrop_container = this.element.querySelector(`#homepage-banner-raindrops-container`);
	}
	
	//Working scripts
	applySettingsButtonFunctionality () {
		//Increment click counter
		this.settings_btn_clicked++;
		
		//Toggle switch
		this.settings_window_open = (!this.settings_window_open);
		
		//Open/close settings window
		updateSettingsPanel();
		
		this.settings_btn.onclick = function () {
			applySettingsButtonFunctionality();
		};
	}
	
	clearText (arg0_options) {
		//Convert from parameters
		let options = (arg0_options) ? arg0_options: {};
		
		//Declare local instance variables
		let banner_el = options.banner_el;
		let caret_spacer_el = options.caret_spacer_el;
		
		//Clear selected variables
		if (caret_spacer_el) {
			let caret_spacer_el_class = (caret_spacer_el.getAttribute("class")) ?
				caret_spacer_el.getAttribute("class") : "";
			
			if (caret_spacer_el_class.length > 0)
				caret_spacer_el.setAttribute("class", caret_spacer_el_class.replace("selected", ""));
		}
		
		//Clear text
		banner_el.innerHTML = "";
	}
	
	fetchLavaLampTransformProperties (arg0_string) {
		//Convert from parameters
		let local_transform_string = arg0_string;
		
		//Declare instance variables
		let rotate_arg_one = "",
			rotate_arg_two = "",
			translate_arg = "";
		
		//Parse string
		local_transform_string = local_transform_string.replace(/rotate\(/gm, "");
		local_transform_string = local_transform_string.replace(/\) translate\(/gm, " ");
		local_transform_string = local_transform_string.replace(/\) rotate\(/gm, " ");
		local_transform_string = local_transform_string.replace(/\)/gm, "");
		
		//Return statement
		return local_transform_string.split(" ");
	}
	
	generateRaindropID () {
		//Declare instance variables
		let current_iteration = 0;
		let valid_id = "";
		
		while (true) {
			//Declare and initialise local instance variables
			let all_raindrop_elements = this.raindrop_container.querySelectorAll(".raindrop");
			let all_raindrop_ids = [];
			for (let i = 0; i < all_raindrop_elements.length; i++) all_raindrop_ids.push(all_raindrop_elements[i].getAttribute("id").replace("raindrop-", ""));
			
			//Try to fetch valid ID
			let new_id = randomNumber(0, 1000000000).toString();
			if (!all_raindrop_ids.includes(new_id)) {
				valid_id = new_id;
				break;
			}
			
			//Break it off after 15 iterations
			current_iteration++;
			if (current_iteration > 15) break;
		}
		
		//Return statement
		return valid_id;
	}
	
	
};