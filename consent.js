(() => {
  const storageKey = "znajdowalni-cookie-consent";
  const consent = (() => {
    try { return JSON.parse(localStorage.getItem(storageKey)); } catch { return null; }
  })();

  function setConsent(marketing) {
    localStorage.setItem(storageKey, JSON.stringify({ necessary: true, analytics: marketing, marketing, updatedAt: new Date().toISOString() }));
    document.dispatchEvent(new CustomEvent("znajdowalni:consent", { detail: { marketing } }));
  }

  function closeBanner() { document.querySelector(".cookie-banner")?.remove(); }

  function showBanner() {
    if (document.querySelector(".cookie-banner")) return;
    const banner = document.createElement("aside");
    banner.className = "cookie-banner";
    banner.setAttribute("aria-label", "Ustawienia plików cookie");
    banner.innerHTML = `<div><b>Twoja prywatność</b><p>Używamy niezbędnych plików cookie. Za Twoją zgodą uruchamiamy też Google Analytics, żeby wiedzieć, które treści są przydatne.</p><a href="pliki-cookie.html">Dowiedz się więcej</a></div><div class="cookie-banner-actions"><button class="button secondary" type="button" data-consent="necessary">Tylko niezbędne</button><button class="button" type="button" data-consent="all">Zgadzam się na analitykę</button></div>`;
    document.body.append(banner);
    banner.querySelectorAll("[data-consent]").forEach((button) => button.addEventListener("click", () => {
      setConsent(button.dataset.consent === "all");
      closeBanner();
    }));
  }

  if (!consent) showBanner();
  document.addEventListener("click", (event) => {
    if (event.target.closest(".cookie-settings")) {
      localStorage.removeItem(storageKey);
      showBanner();
    }
  });
})();
