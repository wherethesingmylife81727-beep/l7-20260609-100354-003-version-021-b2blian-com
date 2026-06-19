document.addEventListener('DOMContentLoaded', function () {
  var panel = document.querySelector('[data-filter-panel]');
  if (!panel) {
    return;
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
  var empty = document.querySelector('[data-empty]');
  var keyword = panel.querySelector('[name="keyword"]');
  var category = panel.querySelector('[name="category"]');
  var year = panel.querySelector('[name="year"]');
  var type = panel.querySelector('[name="type"]');
  var reset = panel.querySelector('[data-reset]');
  var params = new URLSearchParams(window.location.search);
  var preset = params.get('q');

  if (preset && keyword) {
    keyword.value = preset;
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilter() {
    var q = normalize(keyword && keyword.value);
    var c = normalize(category && category.value);
    var y = normalize(year && year.value);
    var t = normalize(type && type.value);
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags'));
      var cardCategory = normalize(card.getAttribute('data-category'));
      var cardYear = normalize(card.getAttribute('data-year'));
      var cardType = normalize(card.getAttribute('data-type'));
      var ok = true;

      if (q && text.indexOf(q) === -1) {
        ok = false;
      }

      if (c && cardCategory !== c) {
        ok = false;
      }

      if (y && cardYear !== y) {
        ok = false;
      }

      if (t && cardType !== t) {
        ok = false;
      }

      card.style.display = ok ? '' : 'none';
      if (ok) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  [keyword, category, year, type].forEach(function (field) {
    if (field) {
      field.addEventListener('input', applyFilter);
      field.addEventListener('change', applyFilter);
    }
  });

  if (reset) {
    reset.addEventListener('click', function () {
      if (keyword) {
        keyword.value = '';
      }
      if (category) {
        category.value = '';
      }
      if (year) {
        year.value = '';
      }
      if (type) {
        type.value = '';
      }
      applyFilter();
    });
  }

  applyFilter();
});
