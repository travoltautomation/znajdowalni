(() => {
  const heroSection = document.querySelector("#hero-section");
  const heroVideo = document.querySelector("#hero-video");
  const heroVisual = document.querySelector(".hero-motion-visual");
  const reducedHeroMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (heroSection && heroVisual && !reducedHeroMotion) {
    let ticking = false;
    const updateHeroMotion = () => {
      const rect = heroSection.getBoundingClientRect();
      const range = Math.max(rect.height, window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / range));
      heroSection.style.setProperty("--hero-stage-y", `${Math.round(progress * -24)}px`);
      heroSection.style.setProperty("--hero-copy-y", `${Math.round(progress * -14)}px`);
      heroSection.style.setProperty("--hero-fade", Math.max(0, (progress - .62) * 1.4).toFixed(3));
      ticking = false;
    };
    const requestHeroUpdate = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(updateHeroMotion); }
    };
    window.addEventListener("scroll", requestHeroUpdate, { passive: true });
    window.addEventListener("resize", requestHeroUpdate);
    requestHeroUpdate();
  }

  // A generated MP4 can be attached later without changing the interaction layer.
  if (heroVideo) heroVideo.addEventListener("loadeddata", () => heroVideo.play().catch(() => {}), { once: true });

  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  if (navLinks.length && "IntersectionObserver" in window) {
    const navSections = navLinks.map((anchor) => document.querySelector(anchor.getAttribute("href"))).filter(Boolean);
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((anchor) => {
          const current = anchor.getAttribute("href") === `#${entry.target.id}`;
          anchor.classList.toggle("is-current", current);
          if (current) anchor.setAttribute("aria-current", "location");
          else anchor.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-28% 0px -64% 0px", threshold: 0 });
    navSections.forEach((section) => navObserver.observe(section));
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) return;

  const groups = [
    ".compact-value-head",
    ".outcome-grid article",
    ".case-v2 > *",
    ".offer-v2-head > *",
    ".pricing-flow .price-panel",
    ".first-payment",
    ".process-v2-head > *",
    ".process-v2-grid article",
    ".audience-v2 > *",
    ".faq-v2 > *",
    ".contact-v2 > *",
    ".offer-page-pricing .price-panel",
    ".offer-page-pricing .first-payment",
    ".scope-head",
    ".scope-grid article",
    ".add-ons-page > .kicker, .add-ons-page > h2",
    ".add-ons-page-grid article",
    ".terms-section > *",
    ".offer-page-faq > *",
    ".offer-final-cta > *"
  ];

  const targets = [];
  groups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (targets.includes(element)) return;
      element.classList.add("reveal-item");
      element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 210)}ms`);
      targets.push(element);
    });
  });

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("reveal-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -7% 0px", threshold: 0.08 });

  document.documentElement.classList.add("reveal-enabled");
  requestAnimationFrame(() => targets.forEach((target) => observer.observe(target)));
})();
