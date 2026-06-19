(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === active);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === active);
        });
    }

    function restartHero() {
        if (timer) {
            window.clearInterval(timer);
        }
        if (slides.length > 1) {
            timer = window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        }
    }

    if (slides.length) {
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showSlide(i);
                restartHero();
            });
        });
        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(active - 1);
                restartHero();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                showSlide(active + 1);
                restartHero();
            });
        }
        restartHero();
    }

    function normalize(value) {
        return (value || '').toString().toLowerCase().trim();
    }

    function setupFilter(scope) {
        var input = scope.querySelector('[data-search-input]');
        var year = scope.querySelector('[data-filter-year]');
        var genre = scope.querySelector('[data-filter-genre]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-title]'));

        if (!cards.length) {
            var nextSection = scope.nextElementSibling;
            if (nextSection) {
                cards = Array.prototype.slice.call(nextSection.querySelectorAll('[data-title]'));
            }
        }

        if (!cards.length && scope.classList.contains('home-search')) {
            cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
        }

        function apply() {
            var query = normalize(input && input.value);
            var yearValue = normalize(year && year.value);
            var genreValue = normalize(genre && genre.value);

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-channel')
                ].join(' '));
                var ok = true;
                if (query && haystack.indexOf(query) === -1) {
                    ok = false;
                }
                if (yearValue && normalize(card.getAttribute('data-year')).indexOf(yearValue) === -1) {
                    ok = false;
                }
                if (genreValue && normalize(card.getAttribute('data-genre')).indexOf(genreValue) === -1 && normalize(card.getAttribute('data-tags')).indexOf(genreValue) === -1) {
                    ok = false;
                }
                card.classList.toggle('is-hidden', !ok);
            });
        }

        [input, year, genre].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]')).forEach(setupFilter);
})();
