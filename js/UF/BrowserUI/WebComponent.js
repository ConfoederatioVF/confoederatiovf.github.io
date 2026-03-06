/**
 * ##### Constructor:
 * - `arg0_value`: {@link any}
 * - `arg1_options`: {@link Object}
 *   - `.css`: {@link Array}<{@link string}>|{@link string}
 *   - `.css_files`: {@link Array}<{@link string}>|{@link string}
 *   - `.element`: {@link HTMLElement}
 *   - `.id`: {@link string}
 *   
 * ##### Fields:
 * - `.css`: {@link Array}<{@link string}>|{@link string}
 * - `.css_files`: {@link Array}<{@link string}> - Any CSS files to import on behalf of the present WebComponent.
 * 
 * ##### Static Methods:
 * 
 * @type {Window.WebComponent}
 */
window.WebComponent = class {
	static instances = [];
	
	constructor (arg0_value, arg1_options) {
		//Convert from parameters
		let value = arg0_value;
		let options = (arg1_options) ? arg1_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("div");
		this.element.instance = this;
			this.draw();
		this.id = (options.id) ? options.id : Class.generateRandomID(WebComponent);
		this.options = options;
		this.value = value;
		
		//Draw generics
		this.element.setAttribute("data-id", this.id);
		if (this.options.css) this.css = this.options.css;
		if (this.options.css_files) this.css_files = this.options.css_files; 
	}
	
	get css () {
		//Return statement
		if (!this.style_el) return "";
		return this.style_el.textContent;
	}
	
	set css (arg0_value) {
		//Convert from parameters
		let value = (arg0_value) ? arg0_value : "";
		
		//Declare local instance variables
		if (!this.style_el) {
			this.style_el = document.createElement("style");
			document.head.appendChild(this.style_el);
		}
		
		this.style_el.textContent = value;
	}
	
	get css_files () {
		//Return statement
		if (!this.style_els) return [];
		return this.style_els;
	}
	
	set css_files (arg0_value) {
		//Convert from parameters
		let value = (arg0_value) ? arg0_value : [];
		if (!Array.isArray(value)) value = [value];
		
		//Declare local instance variables
		if (!this.style_els) this.style_els = [];
		
		//Iterate over all value strings 
		for (let i = 0; i < value.length; i++) {
			let local_link_el = document.createElement("link");
				local_link_el.href = value[i].toString();
				local_link_el.rel = "stylesheet";
				local_link_el.type = "text/css";
			document.head.appendChild(local_link_el);
			this.style_els.push(local_link_el);
		}
	}
	
	bind (arg0_element) {
		//Convert from parameters
		let element = (typeof arg0_element === "string") ?
			document.querySelector(arg0_element) : arg0_element;
		
		//Append this.element to target
		element.appendChild(this.element);
	}
	
	draw () {}
	
	remove () {
		//Iterate over all WebComponent.instances and remove it
		for (let i = 0; i < WebComponent.instances.length; i++)
			if (WebComponent.instances[i].id === this.id)
				WebComponent.instances.splice(i, 1);
		//Remove style_el
		this.style_el.remove();
	}
};