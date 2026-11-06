// Screenshot carousel
(function () {
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(".slides");
    const nav = carousel.querySelector(".carousel-nav");
    if (!track || !nav) {
      return;
    }

    const slides = track.children;
    const prev = nav.querySelector("[data-dir='prev']");
    const next = nav.querySelector("[data-dir='next']");
    const counter = nav.querySelector(".carousel-count");

    // one screenshot = one "page"
    function current() {
      return Math.round(track.scrollLeft / track.clientWidth);
    }

    function update() {
      const index = current();
      counter.textContent = (index + 1) + " / " + slides.length;
      prev.disabled = index <= 0;
      next.disabled = index >= slides.length - 1;
    }

    function go(step) {
      const target = Math.min(Math.max(current() + step, 0), slides.length - 1);
      track.scrollTo({ left: target * track.clientWidth });
    }

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    //nothing to browse (single screenshot)
    if (slides.length > 1) {
      nav.hidden = false;
      update();
    }
  });
})();
