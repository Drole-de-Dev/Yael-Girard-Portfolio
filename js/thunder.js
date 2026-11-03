/* Distant thunder every 40 to 90 seconds
To test : browser console: thunderNow() */ 

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const button = document.getElementById("thunder-toggle");

  let enabled = true;
  let timer = null;

  function flash() {
    const isNight = document.documentElement.dataset.theme !== "day";
    if (!isNight || document.hidden) {
      return;
    }

    document.body.classList.remove("flash");
    void document.body.offsetWidth; // forces animation restart
    document.body.classList.add("flash");
    setTimeout(() => document.body.classList.remove("flash"), 1700);
  }

  function scheduleNext() {
    clearTimeout(timer);
    if (!enabled) {
      return;
    }
    const wait = 40000 + Math.random() * 50000; // between 40 and 90 seconds
    timer = setTimeout(() => {
      flash();
      scheduleNext();
    }, wait);
  }

  if (!reduceMotion) {
    window.thunderNow = flash;

    try {
      enabled = localStorage.getItem("thunder") !== "off";
    } catch (error) {
      //well, fuck it
    }

    if (button) {
      button.hidden = false; //hidden in HTML
      button.setAttribute("aria-pressed", String(enabled));

      button.addEventListener("click", () => {
        enabled = !enabled;
        button.setAttribute("aria-pressed", String(enabled));
        try {
          localStorage.setItem("thunder", enabled ? "on" : "off");
        } catch (error) {
          //again, too bad
        }
        scheduleNext();
      });
    }

    scheduleNext();
  }
})();
