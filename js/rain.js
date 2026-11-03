// A tiny rain effect, on the <canvas id="rain"> behind the page
//Fun fact, I forgot to ^put it behind at first

(function () {
  const canvas = document.getElementById("rain");
  const ctx = canvas.getContext("2d");

  //One still frame
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Three kinds of weather.
  // area  = screen pixels per drop (smaller = more)
  // speed = how fast drops fall
  // slant = leans to the left (0 = straight)
  const LEVELS = {
    calm:   { area: 20000, speed: 0.75, slant: 0.12 },
    steady: { area: 9000,  speed: 1,    slant: 0.2 },
    storm:  { area: 3500,  speed: 1.5,  slant: 0.32 },
  };

  let level = LEVELS.steady;
  let drops = [];
  let dropColor = "rgba(160, 200, 255, 0.32)";

  //The color comes from CSS (--rain-drop), 
  //Night and day have their own
  function readDropColor() {
    const value = getComputedStyle(document.documentElement).getPropertyValue("--rain-drop").trim();
    if (value) {
      dropColor = value;
    }
  }

  function newDrop(anywhere) {
    return {
      //Wider than the screen to reaches the edge
      x: Math.random() * (canvas.width + 300),
      //At start drops are everywhere
      //They restart above screen
      y: anywhere ? Math.random() * canvas.height : -30,
      length: 10 + Math.random() * 18,
      speed: 7 + Math.random() * 7,
    };
  }

  function makeDrops() {
    const count = Math.round((canvas.width * canvas.height) / level.area);
    drops = [];
    for (let i = 0; i < count; i++) {
      drops.push(newDrop(true));
    }

    if (reduceMotion) {
      draw();
    }
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    makeDrops();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = dropColor;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (const drop of drops) {
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - drop.length * level.slant, drop.y + drop.length);

      if (!reduceMotion) {
        drop.y += drop.speed * level.speed;
        drop.x -= drop.speed * level.speed * level.slant;
        if (drop.y > canvas.height) {
          Object.assign(drop, newDrop(false)); //back to the top
        }
      }
    }

    ctx.stroke();

    if (!reduceMotion) {
      requestAnimationFrame(draw);
    }
  }


  // Rain level buttons

  function setLevel(name) {
    if (!LEVELS[name]) {
      return;
    }
    level = LEVELS[name];
    makeDrops();
  }

  const levelBox = document.getElementById("rain-levels");

  if (levelBox) {
    levelBox.hidden = false; //HTML in the hidden
    const buttons = levelBox.querySelectorAll("button");

    function choose(name) {
      setLevel(name);
      for (const button of buttons) {
        button.setAttribute("aria-pressed", String(button.dataset.level === name));
      }
      try {
        localStorage.setItem("rain-level", name);
      } catch (error) {
        //Guess what ?
      }
    }

    for (const button of buttons) {
      button.addEventListener("click", () => choose(button.dataset.level));
    }

    let saved = null;
    try {
      saved = localStorage.getItem("rain-level");
    } catch (error) {
      //Don't care
    }
    level = LEVELS[saved] || LEVELS.steady;
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(LEVELS[button.dataset.level] === level));
    }
  }


  // Start
  window.addEventListener("resize", resize);

  // theme.js sends this event when you switch between day and night
  window.addEventListener("themechange", () => {
    readDropColor();
    if (reduceMotion) {
      draw();
    }
  });

  readDropColor();
  resize();
  if (!reduceMotion) {
    draw();
  }
})();
