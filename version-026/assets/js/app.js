(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var typeSelect = document.querySelector('[data-filter-type]');
  var cardContainer = document.querySelector('[data-card-container]');
  var emptyState = document.querySelector('[data-empty-state]');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilter() {
    if (!cardContainer) {
      return;
    }

    var keyword = normalize(filterInput ? filterInput.value : '');
    var selectedType = normalize(typeSelect ? typeSelect.value : '');
    var cards = Array.prototype.slice.call(cardContainer.querySelectorAll('[data-card]'));
    var visibleCount = 0;

    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-search'));
      var typeText = normalize(card.querySelector('.type-badge') ? card.querySelector('.type-badge').textContent : '');
      var keywordMatched = !keyword || haystack.indexOf(keyword) !== -1;
      var typeMatched = !selectedType || haystack.indexOf(selectedType) !== -1 || typeText.indexOf(selectedType) !== -1;
      var visible = keywordMatched && typeMatched;
      card.style.display = visible ? '' : 'none';
      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visibleCount === 0);
    }
  }

  if (filterInput) {
    var query = new URLSearchParams(window.location.search).get('q');
    if (query) {
      filterInput.value = query;
    }
    filterInput.addEventListener('input', applyFilter);
  }

  if (typeSelect) {
    typeSelect.addEventListener('change', applyFilter);
  }

  applyFilter();
})();
