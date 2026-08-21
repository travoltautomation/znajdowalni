/* Nawigacja mobilna i stan przyklejonego nagłówka.
   Panel jest ukrywany atrybutem [hidden], więc bez JS nie pojawia się wcale,
   a hamburger bez JS po prostu nic nie robi (menu desktopowe działa dalej). */
(function () {
  function boot() {
    var header = document.getElementById('top');
    var toggle = document.querySelector('.nav-toggle');
    var panel = document.getElementById('mobile-nav');

    /* --- cień nagłówka po odjechaniu od góry --- */
    if (header) {
      var stuck = false;
      var czeka = false;
      function stanNaglowka() {
        czeka = false;
        var teraz = window.scrollY > 8;
        if (teraz !== stuck) {
          stuck = teraz;
          header.classList.toggle('is-stuck', stuck);
        }
      }
      window.addEventListener('scroll', function () {
        // w ukrytej karcie requestAnimationFrame jest wstrzymany, a zatrzaśnięta
        // flaga zablokowałaby wszystkie kolejne przewinięcia — wtedy liczymy od razu
        if (document.hidden) { czeka = false; stanNaglowka(); return; }
        if (czeka) return;
        czeka = true;
        requestAnimationFrame(stanNaglowka);
      }, { passive: true });
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) { czeka = false; stanNaglowka(); }
      });
      stanNaglowka();
    }

    if (!toggle || !panel) return;

    var ostatniFokus = null;

    function otworz() {
      panel.hidden = false;
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Zamknij menu');
      ostatniFokus = document.activeElement;
      var pierwszy = panel.querySelector('a, button');
      if (pierwszy) pierwszy.focus();
    }

    function zamknij(wrocFokus) {
      panel.hidden = true;
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Otwórz menu');
      if (wrocFokus !== false && ostatniFokus && document.contains(ostatniFokus)) {
        ostatniFokus.focus();
      }
    }

    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') zamknij();
      else otworz();
    });

    // wybór pozycji zamyka panel; sam skok do sekcji obsługuje przeglądarka
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) zamknij(false);
    });

    document.addEventListener('keydown', function (e) {
      if (panel.hidden) return;
      if (e.key === 'Escape') { zamknij(); return; }
      if (e.key !== 'Tab') return;
      // fokus zostaje w panelu, dopóki jest otwarty
      var pola = panel.querySelectorAll('a, button');
      if (!pola.length) return;
      var pierwszy = pola[0];
      var ostatni = pola[pola.length - 1];
      if (e.shiftKey && document.activeElement === pierwszy) {
        e.preventDefault(); ostatni.focus();
      } else if (!e.shiftKey && document.activeElement === ostatni) {
        e.preventDefault(); pierwszy.focus();
      }
    });

    // powrót na szeroki ekran nie może zostawić zablokowanego przewijania
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760 && !panel.hidden) zamknij(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
