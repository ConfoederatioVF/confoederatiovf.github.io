//Initialise functions
{
  function loadMinistratScrollHandler () {
    ministrat.scroll_handler_loop = setInterval(function(){
      if (ministrat.main.game_open) {
      }
    }, 100);
    
    ministrat.main.map_elements.main_map_el.onwheel = function (e) {
      if (!ministrat.main.game_open) return;
      ministratMapWheelHandler(e);
    };
  }

  function ministratMapScrollHandler (e) {
    if (window.ministrat)
      if (ministrat.main.ignore_scroll) {
        ministrat.main.ignore_scroll = false;
        return;
      }

    if (ministrat.main.game_open) {
      //Make sure Ministrat is non-scrollable

      return true;
    }
  }
  
  function ministratMapWheelHandler(e) {
    e.preventDefault();
    
    var container_rect =
      ministrat.main.map_elements.main_map_el.getBoundingClientRect();
    
    // Cursor position relative to the container, NOT the viewport
    var cursor_x = e.clientX - container_rect.left;
    var cursor_y = e.clientY - container_rect.top;
    
    var old_zoom = ministrat.main.map.zoom;
    var new_zoom;
    
    if (e.deltaY > 0) {
      new_zoom = Math.max(1, old_zoom * 0.9);
    } else {
      new_zoom = Math.min(25, old_zoom * 1.1);
    }
    
    if (new_zoom === old_zoom) return;
    
    // Map-space point under cursor
    var map_x = (cursor_x - ministrat.main.map.x) / old_zoom;
    var map_y = (cursor_y - ministrat.main.map.y) / old_zoom;
    
    // Adjust pan so that same map-space point stays under cursor
    ministrat.main.map.x = cursor_x - map_x * new_zoom;
    ministrat.main.map.y = cursor_y - map_y * new_zoom;
    ministrat.main.map.zoom = new_zoom;
    
    updateMapCoords();
  }
}