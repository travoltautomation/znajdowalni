/* Google Analytics 4 uruchamiany wyłącznie po zgodzie na analitykę.
   Dopóki MEASUREMENT_ID jest pusty, plik nic nie robi — żaden skrypt Google
   nie jest pobierany i żadne ciasteczko nie powstaje. */
(function () {
  var MEASUREMENT_ID = "G-R88CM79RJV"; // np. "G-XXXXXXXXXX"
  var storageKey = "znajdowalni-cookie-consent";
  var zaladowany = false;

  function zgodaNaAnalityke() {
    try {
      var z = JSON.parse(localStorage.getItem(storageKey));
      return !!(z && z.analytics);
    } catch (e) {
      return false;
    }
  }

  function uruchomGA() {
    if (zaladowany || !MEASUREMENT_ID) return;
    zaladowany = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    // Domyślnie odmowa — ustawiana zanim GA cokolwiek wyśle.
    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied"
    });
    gtag("consent", "update", { analytics_storage: "granted" });

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(s);

    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID, { anonymize_ip: true });
  }

  if (zgodaNaAnalityke()) uruchomGA();

  // consent.js rozgłasza to zdarzenie po kliknięciu w banerze
  document.addEventListener("znajdowalni:consent", function (e) {
    if (e.detail && e.detail.marketing) uruchomGA();
  });
})();
