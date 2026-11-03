// Day / night.
(function () {
  const root = document.documentElement;

  function loadTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (error) {
      return null; //Storage can be blocked (private window)
    }
  }

  function saveTheme(value) {
    try {
      localStorage.setItem("theme", value);
    } catch (error) {
      //Sad
    }
  }

  //Day adds data-theme="day" on <html>
  if (loadTheme() === "day") {
    root.dataset.theme = "day";
  }

  //Button exists once page is read
  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("theme-toggle");
    if (!button) {
      return;
    }

    button.hidden = false; //hidden in HTML

    function showLabel() {
      button.textContent = root.dataset.theme === "day" ? "Switch to night" : "Switch to day";
    }

    button.addEventListener("click", () => {
      if (root.dataset.theme === "day") {
        root.removeAttribute("data-theme");
        saveTheme("night");
      } else {
        root.dataset.theme = "day";
        saveTheme("day");
      }
      showLabel();
      // rain.js listens to change the drops color
      window.dispatchEvent(new Event("themechange"));
    });

    showLabel();
  });
})();
