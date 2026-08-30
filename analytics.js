/* Google Analytics 4 uruchamiany wyłącznie po zgodzie na analitykę.
   Dopóki MEASUREMENT_ID jest pusty, plik nic nie robi  -  żaden skrypt Google
   nie jest pobierany i żadne ciasteczko nie powstaje. */
(function () {
  var MEASUREMENT_ID = "G-R88CM79RJV"; // np. "G-XXXXXXXXXX"
  // Uzupełnij dopiero po otrzymaniu danych z Google Ads. Puste wartości niczego nie ładują.
  var GOOGLE_ADS_ID = ""; // np. "AW-123456789"
  var GOOGLE_ADS_CONVERSION_LABEL = "";
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

    // Domyślnie odmowa  -  ustawiana zanim GA cokolwiek wyśle.
    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied"
    });
    gtag("consent", "update", { analytics_storage: "granted" });
    if (zgodaNaReklamy()) gtag("consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(s);

    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID, { anonymize_ip: true });
  }

  function track(name, params) {
    if (typeof window.gtag === "function") window.gtag("event", name, params || {});
  }

  function zgodaNaReklamy() {
    try { var z = JSON.parse(localStorage.getItem(storageKey)); return !!(z && z.advertising); } catch (e) { return false; }
  }

  document.addEventListener("click", function (event) {
    var el = event.target.closest && event.target.closest("a,button");
    if (!el) return;
    if (el.matches("[data-next]")) track("preview_start", { source: "existing_site" });
    if (el.matches("[data-no-site]")) track("preview_start", { source: "no_site" });
    if (el.matches("[data-scroll-contact], .nav-cta, .mobile-cta")) track("contact_cta_click", { industry: pageIndustry(), location: el.className || "cta" });
    if (el.matches(".case-link, .case-visual")) track("case_study_click", { case_name: "Pani Terapia" });
    if (el.closest(".szablon")) track("template_click", { template: el.closest(".szablon").getAttribute("href") || "demo" });
    if (el.closest(".plan") || el.closest(".plans")) track("pricing_cta_click", { page: location.pathname });
  });

  document.addEventListener("submit", function (event) {
    if (event.target.matches("form")) track("form_submit_attempt", { form_id: event.target.id || "form" });
  });

  document.addEventListener("znajdowalni:lead", function (event) {
    var detail = event.detail || {};
    track("generate_lead", { form_id: detail.formId || "form", lead_type: detail.type || "contact", industry: detail.industry || "not_set" });
    if (GOOGLE_ADS_ID && GOOGLE_ADS_CONVERSION_LABEL && typeof window.gtag === "function") window.gtag("event", "conversion", { send_to: GOOGLE_ADS_ID + "/" + GOOGLE_ADS_CONVERSION_LABEL });
  });

  document.addEventListener("znajdowalni:cta", function (event) {
    var detail = event.detail || {};
    track("contact_cta_click", { industry: detail.industry || "home", cta_label: detail.label || "cta", location: detail.location || "page" });
  });

  function pageIndustry() {
    var path = window.location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
    var industries = {
      "/strony-dla-fizjoterapeutow": "fizjoterapia",
      "/strony-dla-gabinetow": "gabinety",
      "/strony-dla-beauty": "beauty",
      "/strony-dla-warsztatow": "warsztaty",
      "/cennik": "cennik"
    };
    return industries[path] || "home";
  }

  if (zgodaNaAnalityke()) uruchomGA();

  // consent.js rozgłasza to zdarzenie po kliknięciu w banerze
  document.addEventListener("znajdowalni:consent", function (e) {
    if (e.detail && e.detail.analytics) uruchomGA();
  });
})();
