config.homepage.gallery.tiles = {
  //CRD
  CRD: {
    name: "CRD",
    
    animation: "crd",
    font_position: "centre",
    font_size: 3,
    font_weight: 700,
    is_base_node: true,
    size: 1,
    x: 0,
    y: 28,
    
    colour: "light-blue",
    dependencies: ["datasets"]
  },
  
  datasets: {
    name: "Datasets",
    
    animation: "datasets",
    default_pin: true,
    font_position: "bottom-right",
    font_size: 2,
    font_weight: 500,
    size: 1,
    x: 32,
    y: 32,
    
    colour: "light-grey",
    dependencies: ["histmap", "livemap_collation"]
  },
  histmap: {
    name: "Histmap",
    
    animation: "histmap",
    default_pin: true,
    font_position: "centre",
    font_size: 2,
    font_weight: 300,
    size: 2,
    x: 64,
    y: 32,
    
    colour: "transparent-sepia",
    dependencies: ["atlas", "eoscala", "stadester", "velkscala"]
  },
  
  livemap_collation: {
    name: "Livemap/Collation",
    
    animation: "livemap-collation",
    default_bookmark: true,
    default_pin: true,
    font_position: "bottom-left",
    font_size: 2,
    font_weight: 100,
    size: 2,
    x: 32,
    y: 64,
    
    colour: "midnight-blue"
  },
  
  software_and_tooling_crd: {
    name: "Software & Tooling",
    
    animation: "crd-software-and-tooling",
    font_position: "bottom-right",
    font_size: 2,
    font_weight: 700,
    is_base_node: true,
    size: 1,
    x: 64,
    y: 64,
    
    colour: "copper",
    dependencies: ["naissance"]
  },
  naissance: {
    name: "Naissance<br>HGIS",
    
    animation: "naissance",
    font_position: "centre",
    font_size: 2,
    font_weight: 500,
    default_bookmark: true,
    default_pin: true,
    size: 2,
    x: 96,
    y: 68,
    
    colour: "bright-yellow"
  },
  eoscala: {
    name: "Eoscala",
    
    animation: "eoscala",
    font_position: "bottom-right",
    font_size: 1,
    font_weight: 500,
    size: 5,
    x: 92,
    y: 32,
    
    colour: "dark-grey"
  },
  atlas: {
    name: "Atlas",
    
    animation: "atlas",
    font_position: "bottom-left",
    font_size: 1,
    font_weight: 300,
    size: 5,
    x: 92,
    y: 48,
    
    colour: "gold"
  },
  velkscala: {
    name: "Velkscala",
    
    animation: "velkscala",
    font_position: "centre",
    font_size: 1,
    font_weight: 300,
    size: 5,
    x: 76,
    y: 16,
    
    colour: "salmon"
  },
  stadester: {
    name: "Stadestér",
    
    animation: "stadester",
    font_position: "centre",
    font_size: 1,
    font_weight: 100,
    size: 6,
    x: 64,
    y: 20,
    
    colour: "forest-green"
  },
  
  ctd: {
    name: "CTD",
    
    animation: "ctd",
    font_position: "centre",
    font_size: 3,
    font_weight: 700,
    is_base_node: true,
    size: 1,
    x: 140,
    y: 28,
    
    colour: "forest-green"
  },
  ctd_games: {
    name: "CTD<br>Games",
    
    animation: "ctd-games",
    font_position: "bottom-left",
    font_size: 2,
    font_weight: 900,
    is_base_node: true,
    size: 3,
    x: 216,
    y: 28,
    
    colour: "blurple",
    dependencies: ["triumph_and_tragedy_one", "analytical_engine", "triumph_and_tragedy_two"]
  },
  analytical_engine: {
    name: "Analytical Engine",
    
    animation: "analytical-engine",
    default_pin: true,
    font_position: "bottom-right",
    font_size: 1,
    font_weight: 700,
    size: 4,
    x: 240,
    y: 34,
    
    colour: "dark-grey",
    dependencies: ["eleven_fiftynine"]
  },
  triumph_and_tragedy_one: {
    name: "Triumph &<br>Tragedy I",
    
    animation: "triumph-and-tragedy-one",
    font_position: "centre",
    font_size: 1,
    font_weight: 500,
    size: 4,
    x: 222,
    y: 52,
    
    background_image: `gfx/interface/tiles/triumph_and_tragedy_icon_no_text.png`,
    background_opacity: 0.4,
    colour: "mauve",
    dependencies: ["triumph_and_tragedy_two"]
  },
  triumph_and_tragedy_two: {
    name: "Triumph & Tragedy II",
    
    animation: "triumph-and-tragedy-two",
    default_pin: true,
    font_position: "bottom-right",
    font_size: 2,
    font_weight: 700,
    size: 1,
    x: 240,
    y: 52,
    
    dependencies: ["system_dynamics", "into_modernity", "proxy_cables", "last_man_standing"],
    background_image: `gfx/interface/tiles/battle_of_the_leyte_gulf.png`,
    colour: "salmon",
    background_opacity: 0.4,
  },
  system_dynamics: {
    name: "System Dynamics",
    
    animation: "system-dynamics",
    font_position: "bottom-right",
    font_size: 1,
    font_weight: 300,
    size: 5,
    x: 240,
    y: 84,
    
    colour: "yellow"
  },
  into_modernity: {
    name: "Into Modernity",
    
    animation: "into-modernity",
    font_position: "centre",
    font_size: 1,
    font_weight: 300,
    size: 5,
    x: 256,
    y: 84,
    
    colour: "orange"
  },
  proxy_cables: {
    name: "Proxy Cables",
    
    animation: "proxy-cables",
    font_position: "top-left",
    font_size: 1,
    font_weight: 300,
    size: 5,
    x: 272,
    y: 68,
    
    colour: "blue"
  },
  last_man_standing: {
    name: "Last Man Standing",
    
    animation: "last-man-standing",
    font_position: "bottom-right",
    font_size: 1,
    font_weight: 300,
    size: 5,
    x: 272,
    y: 52,
    
    colour: "dark-grey"
  },
  
  software_and_tooling_ctd: {
    name: "Software &<br>Tooling",
    
    animation: "software-and-tooling-ctd",
    font_position: "bottom-left",
    font_size: 2,
    font_weight: 700,
    is_base_node: true,
    size: 1,
    x: 178,
    y: 28,
    
    colour: "dark-blurple"
  },
  vercengen: {
    name: "Vercengen",
    
    animation: "vercengen",
    default_bookmark: true,
    default_pin: true,
    font_position: "centre",
    font_size: 2,
    font_weight: 900,
    size: 2,
    x: 178,
    y: 60,
    
    colour: "blurple",
    dependencies: ["blacktraffic", "geospatiale", "forse_scriptly_ide", "universal_framework"]
  },
  eleven_fiftynine: {
    name: "11:59",
    
    animation: "elevan-fifty-nine",
    font_position: "centre",
    font_size: 1,
    font_weight: 300,
    size: 6,
    x: 258,
    y: 34,
    
    colour: "red"
  },
  blacktraffic: {
    name: "Blacktraffic",
    
    animation: "blacktraffic",
    font_position: "centre",
    font_size: 1,
    font_weight: 100,
    size: 6,
    x: 166,
    y: 60,
    
    colour: "dark-grey"
  },
  geospatiale: {
    name: "Geospatiale",
    
    animation: "geospatiale",
    font_position: "centre",
    font_size: 1,
    font_weight: 100,
    size: 6,
    x: 166,
    y: 72,
    
    colour: "yellow"
  },
  universal_framework: {
    name: "UF",
    
    animation: "universal-framework",
    font_position: "bottom-left",
    font_size: 2,
    font_weight: 600,
    size: 6,
    x: 194,
    y: 88,
    
    colour: "copper"
  },
  forse_scriptly_ide: {
    name: "Forse/<br>Scriptly IDE",
    
    animation: "forse-scriptly-ide",
    font_position: "centre",
    font_size: 1,
    font_weight: 100,
    size: 6,
    x: 182,
    y: 88,
    
    colour: "light-purple"
  },
  
  cad: {
    name: "CAD",
    
    animation: "cad",
    font_position: "centre",
    font_size: 3,
    font_weight: 700,
    is_base_node: true,
    size: 1,
    x: 320,
    y: 28,
    
    colour: "orange",
    dependencies: ["art_gallery", "preserves", "gearth_mc"]
  },
  art_gallery: {
    name: "Art Gallery",
    
    animation: "art-gallery",
    font_position: "bottom-right",
    font_size: 2,
    font_weight: 300,
    size: 3,
    x: 328,
    y: 60,
    
    colour: "cream-white"
  },
  preserves: {
    name: "Preservés",
    
    animation: "preserves",
    default_pin: true,
    font_position: "bottom-left",
    font_size: 2,
    font_weight: 500,
    size: 3,
    x: 352,
    y: 60,
    
    colour: "sepia",
    dependencies: ["digital_holdings", "physical_holdings"]
  },
  gearth_mc: {
    name: "G-Earth/MC",
    
    animation: "gearth-mc",
    font_position: "bottom-right",
    font_size: 2,
    font_weight: 400,
    size: 3,
    x: 352,
    y: 36,
    
    colour: "blue"
  },
  physical_holdings: {
    name: "Physical<br>Holdings",
    
    animation: "physical-holdings",
    font_position: "centre",
    font_size: 1,
    font_weight: 300,
    size: 5,
    x: 376,
    y: 76,
    
    colour: "yellow"
  },
  digital_holdings: {
    name: "Digital Holdings",
    
    animation: "digital-holdings",
    font_position: "bottom-left",
    font_size: 1,
    font_weight: 500,
    size: 5,
    x: 376,
    y: 60,
    
    colour: "light-grey"
  },
  socials_and_web_infrastructure: {
    name: "Socials &<br>Web Infra.",
    
    animation: "socials_and_web_infrastructure",
    font_position: "bottom-right",
    font_size: 2,
    font_weight: 700,
    is_base_node: true,
    size: 2,
    x: 384,
    y: 32,
    
    colour: "salmon",
    dependencies: ["blogs", "personnel"]
  },
  personnel: {
    name: "Personnel",
    
    animation: "personnel",
    font_position: "bottom-right",
    font_size: 2,
    font_weight: 200,
    size: 2,
    x: 412,
    y: 60,
    
    colour: "forest-green"
  },
  blogs: {
    name: "Blogs",
    
    animation: "blogs",
    font_position: "top-left",
    font_size: 1,
    font_weight: 600,
    size: 6,
    x: 412,
    y: 48,
    
    colour: "dark-blurple"
  },
  other_projects: {
    name: "Other Projects",
    
    animation: "other_projects",
    font_position: "bottom-left",
    font_size: 2,
    font_weight: 200,
    is_base_node: true,
    size: 3,
    x: 446,
    y: 32,
    
    colour: "gold"
  },
  re_verenfedern: {
    name: "Ré Vérenfedern",
    
    animation: "re_verenfedern",
    font_position: "bottom-left",
    font_size: 1,
    font_weight: 200,
    is_base_node: true,
    size: 5,
    x: 355,
    y: 17,
    
    background_image: `gfx/interface/tiles/re_verenfedern_square.png`,
    background_opacity: 0.4,
    colour: "light-blue"
  }
};
