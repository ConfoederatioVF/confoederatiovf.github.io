//homepage_on_scroll.js
//Declare local element variables
var about_me_section = document.getElementById("about-me-section");
var homepage_banner_el = document.getElementById("homepage-banner");

var last_scroll_top = 0;

function initGlobalScrollEventHandler (e) {
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

window.onscroll = function (e) {
  initGlobalScrollEventHandler(e);
};
