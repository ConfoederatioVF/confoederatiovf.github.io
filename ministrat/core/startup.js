//Initialise startup process
window.ministrat_initialisation_loop = setInterval(() => {
  try {
    //Load Ministrat
    loadMapElements();
    loadMinistratPanHandler();
    loadMinistratScrollHandler();
    loadMinistratTerrain();
    loadMinistratTopbar();
    
    loadMinistratUIDrawLoop();
    
    //Ministrat event handlers
    ministrat.main.map_elements.main_map_el.onclick = function (e) {
      ministratMapClickHandler(e);
    };
    ministrat.main.map_elements.ministrat_svg_map_el.onclick = function (e) {
      ministratMainMapClickHandler(e);
    };
    clearInterval(window.ministrat_initialisation_loop);
  } catch (e) {}
});