if (!window.ic) window.ic = {};

//Initialise functions
{
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