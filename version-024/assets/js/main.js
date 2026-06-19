(function () {
  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      const open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const hero = document.querySelector("[data-hero]");

  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    let index = 0;
    let timer = null;

    function show(next) {
      if (!slides.length) {
        return;
      }

      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });

    show(0);
    start();
  }

  const searchInput = document.querySelector("[data-search-input]");
  const list = document.querySelector("[data-filter-list]");
  const empty = document.querySelector("[data-empty-state]");

  if (searchInput && list) {
    const cards = Array.from(list.querySelectorAll(".movie-card"));

    function filter(value) {
      const words = value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = [
          card.dataset.title || "",
          card.dataset.tags || "",
          card.dataset.meta || ""
        ].join(" ").toLowerCase();
        const matched = words.every(function (word) {
          return haystack.indexOf(word) !== -1;
        });

        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      searchInput.value = q;
      filter(q);
    }

    searchInput.addEventListener("input", function () {
      filter(searchInput.value);
    });
  }
})();
