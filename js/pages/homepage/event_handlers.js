function initEventHandlers () {
	var hover_loop;
	var hover_throttle = [];
	
	window.onscroll = function (e) {
		//Declare local instance variables
		var delta_y = window.pageYOffset || document.documentElement.scrollTop;
		var vh_scroll = (window.scrollY/window.innerHeight)*100;
		
		//Event handler functions
		fixMobileVh();
		viewport_one.homepageBannerTitleAdjustPosition();
		viewport_one.triumphAndTragedyOnScroll();
		
		//Parallax scrolling for other labels
		homepageAboutOnScroll();
		if (ministratMapScrollHandler(e)) return;
	}
}
initEventHandlers();