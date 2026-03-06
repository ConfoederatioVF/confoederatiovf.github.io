//Script
{
  function initHomepageBanner () {
    let initialisation_loop = setInterval(() => {
      try {
        window.viewport_one = new window.HomepageBanner();
        window.viewport_one.bind(document.getElementById("homepage-banner"));
        clearInterval(initialisation_loop);
      } catch (e) { console.warn(e); }
    });
  }
  initHomepageBanner();
}