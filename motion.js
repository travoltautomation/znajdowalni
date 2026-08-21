/* Animowane FAQ i wejścia sekcji przy scrollu.
   Stan początkowy wejść ustawia JS, więc bez JS strona pokazuje całą treść.
   Przy prefers-reduced-motion nic się nie dzieje — FAQ wraca do natywnego <details>. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- FAQ: płynne rozwijanie ---------- */
  function slide(details, body, opening) {
    if (details.dataset.moBusy === '1') return;
    details.dataset.moBusy = '1';

    // treść musi być wyrenderowana, zanim ją zmierzymy
    if (opening) details.open = true;

    body.style.transition = 'none';
    body.style.height = 'auto';
    var full = body.getBoundingClientRect().height;

    body.style.height = (opening ? 0 : full) + 'px';
    void body.offsetHeight; // wymuszony reflow — bez tego przejście nie wystartuje
    body.style.transition = 'height .26s cubic-bezier(.22,.61,.36,1)';
    body.style.height = (opening ? full : 0) + 'px';

    function done(ev) {
      if (ev && ev.propertyName !== 'height') return;
      body.removeEventListener('transitionend', done);
      clearTimeout(details._moFallback);
      body.style.transition = '';
      body.style.height = '';
      if (!opening) details.open = false;
      details.dataset.moBusy = '0';
    }
    body.addEventListener('transitionend', done);
    // gdyby transitionend nie przyszedł (np. karta w tle), i tak posprzątaj
    details._moFallback = setTimeout(done, 420);
  }

  function initFaq() {
    var list = document.querySelectorAll('.faq-grid details');
    for (var i = 0; i < list.length; i++) {
      (function (details) {
        var body = details.querySelector('.faq-body');
        var summary = details.querySelector('summary');
        if (!body || !summary) return;
        summary.addEventListener('click', function (e) {
          if (reduce) return; // natywne zachowanie
          e.preventDefault();
          slide(details, body, !details.open);
        });
      })(list[i]);
    }
  }

  /* ---------- Wejścia sekcji ---------- */
  var GROUPS = [
    '.benefit-grid', '.scenario-grid', '.steps', '.plans',
    '.included-grid', '.compare-grid', '.choose-grid', '.detail-grid'
  ];

  function initReveal() {
    if (reduce || !('IntersectionObserver' in window)) return;

    var items = [];
    GROUPS.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (group) {
        var kids = group.children, shown = 0;
        for (var i = 0; i < kids.length; i++) {
          var el = kids[i];
          // to, co widać już przy załadowaniu, zostaje widoczne — zero mignięcia
          if (el.getBoundingClientRect().top < window.innerHeight * 0.92) continue;
          el.classList.add('mo-reveal');
          el.style.transitionDelay = Math.min(shown, 4) * 70 + 'ms';
          shown++;
          items.push(el);
        }
      });
    });
    if (!items.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    items.forEach(function (el) { io.observe(el); });

    function reveal(el) {
      if (el.classList.contains('mo-in')) return;
      el.classList.add('mo-in');
      io.unobserve(el);
      setTimeout(function () {
        el.classList.add('mo-done');
        el.style.transitionDelay = '';
      }, 900);
    }

    /* Siatka bezpieczeństwa. Przy szybkim przewinięciu — machnięciu palcem na
       telefonie albo skoku z menu do sekcji — IntersectionObserver potrafi
       pominąć element, który przeleciał przez kadr między klatkami. Bez tego
       treść zostałaby trwale niewidoczna, więc przy scrollu domiatamy resztę. */
    var ticking = false;

    function sweep() {
      ticking = false;
      var limit = window.innerHeight * 0.95;
      var rest = [];
      for (var i = 0; i < items.length; i++) {
        var el = items[i];
        if (el.classList.contains('mo-in')) continue;
        if (el.getBoundingClientRect().top < limit) reveal(el);
        else rest.push(el);
      }
      items = rest;
      if (!items.length) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }

    function onScroll() {
      // W ukrytej karcie requestAnimationFrame jest wstrzymany, więc treść
      // zostałaby niewidoczna. Wtedy omiatamy od razu, bez czekania na klatkę.
      if (document.hidden) { sweep(); return; }
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sweep);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // Powrót do karty: cokolwiek jest w kadrze, ma być widoczne.
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) { ticking = false; sweep(); }
    });
    sweep();
  }

  function boot() { initFaq(); initReveal(); }

  // app.js renderuje treść na DOMContentLoaded i rejestruje się wcześniej,
  // więc nasz listener zawsze zadziała po wyrenderowaniu strony.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
