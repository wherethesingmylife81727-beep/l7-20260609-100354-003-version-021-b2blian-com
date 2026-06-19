(function () {
    const menuButton = document.querySelector("[data-menu-toggle]");
    const mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    const scrollTop = document.querySelector("[data-scroll-top]");

    if (scrollTop) {
        scrollTop.addEventListener("click", function (event) {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    const hero = document.querySelector("[data-hero]");

    if (hero) {
        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const prev = hero.querySelector("[data-hero-prev]");
        const next = hero.querySelector("[data-hero-next]");
        const dots = hero.querySelector("[data-hero-dots]");
        let current = 0;
        let timer = null;

        function renderDots() {
            if (!dots) {
                return;
            }

            dots.innerHTML = "";
            slides.forEach(function (slide, index) {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.setAttribute("aria-label", "切换到第" + (index + 1) + "部");
                if (index === current) {
                    dot.classList.add("is-active");
                }
                dot.addEventListener("click", function () {
                    showSlide(index);
                    restartTimer();
                });
                dots.appendChild(dot);
            });
        }

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            renderDots();
        }

        function restartTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(current - 1);
                restartTimer();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(current + 1);
                restartTimer();
            });
        }

        showSlide(0);
        restartTimer();
    }

    const filterPanel = document.querySelector("[data-filter-panel]");
    const cards = Array.from(document.querySelectorAll("[data-movie-card]"));

    if (filterPanel && cards.length) {
        const searchInput = filterPanel.querySelector("[data-search-input]");
        const yearSelect = filterPanel.querySelector("[data-filter-year]");
        const regionSelect = filterPanel.querySelector("[data-filter-region]");
        const typeSelect = filterPanel.querySelector("[data-filter-type]");
        const resetButton = filterPanel.querySelector("[data-filter-reset]");
        const countBox = document.querySelector("[data-filter-count]");
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q");

        if (query && searchInput) {
            searchInput.value = query;
        }

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function applyFilters() {
            const keyword = normalize(searchInput ? searchInput.value : "");
            const year = normalize(yearSelect ? yearSelect.value : "");
            const region = normalize(regionSelect ? regionSelect.value : "");
            const type = normalize(typeSelect ? typeSelect.value : "");
            let visible = 0;

            cards.forEach(function (card) {
                const haystack = [
                    card.dataset.title,
                    card.dataset.year,
                    card.dataset.type,
                    card.dataset.region,
                    card.dataset.genre,
                    card.dataset.tags
                ].map(normalize).join(" ");

                const matched = (!keyword || haystack.includes(keyword)) &&
                    (!year || normalize(card.dataset.year) === year) &&
                    (!region || normalize(card.dataset.region) === region) &&
                    (!type || normalize(card.dataset.type) === type);

                card.classList.toggle("is-hidden", !matched);

                if (matched) {
                    visible += 1;
                }
            });

            if (countBox) {
                countBox.textContent = "共找到 " + visible + " 部作品";
            }
        }

        [searchInput, yearSelect, regionSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });

        if (resetButton) {
            resetButton.addEventListener("click", function () {
                if (searchInput) {
                    searchInput.value = "";
                }
                if (yearSelect) {
                    yearSelect.value = "";
                }
                if (regionSelect) {
                    regionSelect.value = "";
                }
                if (typeSelect) {
                    typeSelect.value = "";
                }
                applyFilters();
            });
        }

        applyFilters();
    }
}());
