(() => {
  const storageKey = "znajdowalni-cookie-consent";
  const consent = (() => {
    try { return JSON.parse(localStorage.getItem(storageKey)); } catch { return null; }
  })();

  function setConsent(analytics, advertising) {
    const value = { necessary: true, analytics: !!analytics, advertising: !!advertising, updatedAt: new Date().toISOString() };
    localStorage.setItem(storageKey, JSON.stringify(value));
    document.dispatchEvent(new CustomEvent("znajdowalni:consent", { detail: value }));
  }

  function closeBanner() { document.querySelector(".cookie-banner")?.remove(); document.body.classList.remove("cookie-open"); }

  function showBanner() {
    if (document.querySelector(".cookie-banner")) return;
    const banner = document.createElement("aside");
    banner.className = "cookie-banner";
    banner.setAttribute("aria-label", "Ustawienia plików cookie");
    banner.innerHTML = `<div><b>Twoja prywatność</b><p>Możesz osobno wybrać analizę ruchu i przyszłe pomiary reklamowe.</p><div class="cookie-choices"><label><input type="checkbox" data-choice="analytics"> Analityka</label><label><input type="checkbox" data-choice="advertising"> Reklamy</label></div><a href="pliki-cookie.html">Dowiedz się więcej</a></div><div class="cookie-banner-actions"><button class="button secondary" type="button" data-consent="necessary">Tylko niezbędne</button><button class="button" type="button" data-consent="save">Zapisz wybór</button></div>`;
    document.body.append(banner);
    document.body.classList.add("cookie-open");
    banner.querySelectorAll("[data-consent]").forEach((button) => button.addEventListener("click", () => {
      const save = button.dataset.consent === "save";
      setConsent(save && banner.querySelector('[data-choice="analytics"]').checked, save && banner.querySelector('[data-choice="advertising"]').checked);
      closeBanner();
    }));
  }

  if (!consent) {
    // Na małym ekranie nie przykrywamy pierwszego CTA. Brak zgody nadal oznacza brak analityki.
    if (window.matchMedia("(max-width: 760px)").matches && window.scrollY === 0) {
      window.addEventListener("scroll", showBanner, { once: true, passive: true });
    } else {
      showBanner();
    }
  }
  document.addEventListener("click", (event) => {
    if (event.target.closest(".cookie-settings")) {
      localStorage.removeItem(storageKey);
      showBanner();
    }
  });
})();
