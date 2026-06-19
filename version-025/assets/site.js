(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function setupMobileMenu() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;
        function activate(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }
        function start() {
            timer = window.setInterval(function () {
                activate(current + 1);
            }, 5200);
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                window.clearInterval(timer);
                activate(index);
                start();
            });
        });
        activate(0);
        start();
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var input = scope.querySelector("[data-filter-input]");
            var typeSelect = scope.querySelector("[data-type-filter]");
            var sortSelect = scope.querySelector("[data-sort-select]");
            var status = scope.querySelector("[data-filter-status]");
            var empty = scope.querySelector("[data-empty-state]");
            var grid = scope.querySelector("[data-card-grid]");
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card, .rank-row"));
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q") || "";
            if (input && query) {
                input.value = query;
            }
            function apply() {
                var keyword = normalize(input ? input.value : "");
                var typeValue = normalize(typeSelect ? typeSelect.value : "");
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-genre"),
                        card.textContent
                    ].join(" "));
                    var typeMatch = !typeValue || normalize(card.getAttribute("data-type")) === typeValue;
                    var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
                    var show = typeMatch && keywordMatch;
                    card.style.display = show ? "" : "none";
                    if (show) {
                        visible += 1;
                    }
                });
                if (status) {
                    status.textContent = "当前显示 " + visible + " 部影片";
                }
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }
            function sortCards() {
                if (!sortSelect) {
                    return;
                }
                var value = sortSelect.value;
                var sorted = cards.slice().sort(function (a, b) {
                    if (value === "year-asc") {
                        return Number(a.getAttribute("data-year")) - Number(b.getAttribute("data-year"));
                    }
                    if (value === "rank") {
                        return Number(b.getAttribute("data-rank")) - Number(a.getAttribute("data-rank"));
                    }
                    if (value === "title") {
                        return normalize(a.getAttribute("data-title")).localeCompare(normalize(b.getAttribute("data-title")), "zh-Hans-CN");
                    }
                    return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
                });
                sorted.forEach(function (card) {
                    grid.appendChild(card);
                });
                cards = sorted;
            }
            if (input) {
                input.addEventListener("input", apply);
            }
            if (typeSelect) {
                typeSelect.addEventListener("change", apply);
            }
            if (sortSelect) {
                sortSelect.addEventListener("change", function () {
                    sortCards();
                    apply();
                });
            }
            sortCards();
            apply();
        });
    }

    ready(function () {
        setupMobileMenu();
        setupHero();
        setupFilters();
    });
})();
