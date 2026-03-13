if (!window.ic) window.ic = {};

//Initialise functions
{
	/**
	 * Animates a given set of elements relative to a scope.
	 * 
	 * @param {HTMLElement|string} arg0_scope_element
	 * @param {HTMLElement[]|string[]} arg1_elements
	 * @param {Object} [arg2_options]
	 *  @param {string} [arg2_options.direction="top"] - Either 'bottom'/'left'/'top'/'right'.
	 *  @param {boolean} [arg2_options.disable_fade=false] - Whether to disable fade.
	 *  @param {number} [arg2_options.distance] - The px distance that elements should travel during transition.
	 */
	ic.animate = function (arg0_scope_element, arg1_elements, arg2_options) {
		//Convert from parameters
		let scope_el = ic.getElement(arg0_scope_element);
		let elements = ic.getElements(arg1_elements);
		let options = (arg2_options) ? arg2_options : {};
		
		//Declare local instance variables
		let updatePositions = () => {
			let rect = scope_el.getBoundingClientRect();
			let viewport_height = window.innerHeight;
			
			//Calculate progress percentage
			let current = rect.top;
			let end = 0;
			let start = viewport_height;
			
			//Progress is a value from 0 to 1
			let progress = (start - current)/(start - end);
				progress = Math.max(0, Math.min(1, progress));
			
			elements.forEach((item) => {
				//Get settings from data attributes
				let direction = (options.direction) ? options.direction : "top";
				let distance = (options.distance) ? parseFloat(options.distance) : 100;
				
				//Calculate the remaining offset. When progress is 1, offset is 0.
				let offset = distance*(1 - progress);
				let transform = "";
				
				switch (direction) {
					case "bottom":
						transform = `translateY(${offset}px)`;
						break;
					case "left":
						transform = `translateX(${-offset}px)`;
						break;
					case "top":
						transform = `translateY(${-offset}px)`;
						break;
					case "right":
						transform = `translateX(${offset}px)`;
						break;
				}
				
				item.style.transform = transform;
				if (!options.disable_fade)
					item.style.opacity = progress;
			});
		};
		
		let observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				window.addEventListener("scroll", updatePositions);
				updatePositions();
			} else {
				window.removeEventListener("scroll", updatePositions);
			}
		},
		{ threshold: 0 });
		
		observer.observe(scope_el);
	};
	
	ic.executeComponentScripts = function (arg0_element) {
		//Convert from parameters
		let element = ic.getElement(arg0_element);
		
		//Declare local instance variables
		let all_scripts = element.querySelectorAll("script");
		let context_id = `ic-${Math.random().toString(36).substring(2, 9)}`;
			element.setAttribute("eval-context", context_id);
		
		for (let i = 0; i < all_scripts.length; i++) {
			let old_script = all_scripts[i];
			let new_script = document.createElement("script");
			
			//Copy all attributes from old script to new script
			Array.from(old_script.attributes).forEach((local_attribute) => 
				new_script.setAttribute(local_attribute.name, local_attribute.value));
			
			//Evaluate script
			if (!old_script.src) 
				new_script.textContent = `(function() { let element = document.querySelector('[eval-context="${context_id}"]'); ${old_script.innerHTML} })();`;
			if (old_script.parentNode)
				old_script.parentNode.replaceChild(new_script, old_script);
		}
	}
	
	ic.getElement = function (arg0_element) {
		//Convert from parameters
		let element = (typeof arg0_element !== "string") ?
			arg0_element : document.querySelector(arg0_element);
		
		//Return statement
		return element;
	};
	
	ic.getElements = function (arg0_selector) {
		// Return early if input is null or undefined
		if (!arg0_selector) return [];
		
		let selector = arg0_selector;
		
		// Convert single string or single element into an iterable array
		if (
			!Array.isArray(selector) &&
			!(selector instanceof NodeList) &&
			!(selector instanceof HTMLCollection)
		) {
			selector = [selector];
		}
		
		let all_elements = [];
		
		// Iterate over all elements in the normalized selector array/list
		for (let i = 0; i < selector.length; i++) {
			const item = selector[i];
			
			if (typeof item === "string") {
				// Use spread operator to turn the NodeList into individual array elements
				all_elements.push(...document.querySelectorAll(item));
			} else if (item instanceof HTMLElement || item instanceof Node) {
				// Only push if it's an actual DOM node/element
				all_elements.push(item);
			} else if (item instanceof NodeList || item instanceof HTMLCollection) {
				// Handle cases where a NodeList might be nested inside the input array
				all_elements.push(...item);
			}
		}
		
		return all_elements;
	};
	
	ic.loadComponent = async function (arg0_element, arg1_url, arg2_options) {
		//Convert from parameters
		let element = ic.getElement(arg0_element);
		let url = arg1_url;
		let options = (arg2_options) ? arg2_options : {};
		
		//Declare local instance variables
		try {
			let response = await fetch(url);
			if (!response.ok) {
				console.error(`HTTP Error, status: ${response.status}`);
			} else {
				element.innerHTML = await response.text();
				
				if (!options.no_metadata)
					element.setAttribute("html-initialised", "true");
				if (!options.no_js)
					ic.executeComponentScripts(element);
				if (element.querySelector("ic-component[src]")) //Recursively load components
					await ic.updateDOM();
			}
		} catch (e) {
			console.error(e);
			element.innerHTML = "Error loading content.";
		}
	};
	
	ic.updateDOM = async function () {
		//Declare local instance variables
		let all_ic_components = document.querySelectorAll(`ic-component:not([html-initialised="true"])`);
		
		//Iterate over all_ic_components and fetch them
		let load_promises = Array.from(all_ic_components).map((el) => {
			let data_src = el.getAttribute("src");
			if (data_src) 
				return ic.loadComponent(el, data_src);
			return Promise.resolve(); //Skip if no src
		});
		await Promise.all(load_promises);
	}
}

//Initialisation script
{
	ic.initialise = function () {
		ic.logic_loop = setInterval(() => {
			ic.updateDOM();
		}, 100);
	};
}

ic.initialise();