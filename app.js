const $ = (selector) => document.querySelector(selector);
const link = (text, href, cls = "") => `<a class="${cls}" href="${href}">${text}</a>`;
const CONTACT_EMAIL = "travoltautomation@gmail.com";

function browserBar(domain, dark = false) {
  return `<div class="browser-bar${dark ? " browser-bar--dark" : ""}"><div class="dots"><i></i><i></i><i></i></div><span>${domain}</span><i class="browser-lock" aria-hidden="true"></i></div>`;
}

function gabinetDemo(branch, compact) {
  const desktop = `<div class="browser business-site demo-gabinet">${browserBar("gabinet-harmonia.pl")}<div class="gabinet-nav"><b><i></i>${branch.brand}</b><span>O terapii&nbsp;&nbsp;&nbsp; Oferta&nbsp;&nbsp;&nbsp; Kontakt</span><em>Umów wizytę</em></div><div class="gabinet-layout"><div class="gabinet-copy"><small>${branch.label}</small><div class="mock-headline">${branch.headline}</div><p>Indywidualna fizjoterapia, która pomaga odzyskać swobodę i pewność ruchu.</p><span class="mock-button">${branch.cta}<i>↗</i></span><div class="mock-proof"><b>★★★★★</b><span>${branch.proof}</span></div></div><div class="gabinet-photo"><span class="availability"><i></i><b>Wolny termin</b><small>jutro · 10:30</small></span></div></div></div>`;
  if (compact) return desktop;
  const phone = `<div class="phone phone--gabinet"><div class="phone-notch"></div><div class="phone-screen"><div class="m-gabinet-head"><b>H.</b><span>MENU</span></div><div class="m-gabinet-photo"></div><small>${branch.label}</small><div class="mobile-headline">${branch.mobileHeadline}</div><div class="m-slot"><i></i><span><b>Najbliższy termin</b>jutro · 10:30</span></div><div class="mobile-button">Umów konsultację</div></div></div>`;
  return desktop + phone;
}

function beautyDemo(branch, compact) {
  const desktop = `<div class="browser business-site demo-beauty">${browserBar("maja-atelier.pl")}<div class="beauty-canvas"><div class="beauty-nav"><b>${branch.brand}</b><span>USŁUGI&nbsp;&nbsp;&nbsp; GALERIA&nbsp;&nbsp;&nbsp; KONTAKT</span></div><div class="beauty-photo"><span class="beauty-stamp">WROCŁAW<br>EST. 2019</span></div><div class="beauty-copy"><small>HAIR · COLOR · CARE</small><div class="mock-headline">${branch.headline}</div><p>Koloryzacja i pielęgnacja zaprojektowane wokół Ciebie.</p><span class="mock-button">Zobacz usługi <i>→</i></span><div class="beauty-booking"><span>${branch.note}</span><b>BOOKSY ↗</b></div></div><div class="beauty-index">01&nbsp;&nbsp; / &nbsp;&nbsp;03</div></div></div>`;
  if (compact) return desktop;
  const phone = `<div class="phone phone--beauty"><div class="phone-notch"></div><div class="phone-screen"><div class="m-beauty-head"><b>MAJA</b><span>ATELIER</span></div><div class="m-beauty-photo"><i>NEW<br>COLOR</i></div><small>HAIR & BEAUTY · WROCŁAW</small><div class="mobile-headline">${branch.mobileHeadline}</div><div class="m-beauty-services"><span>Koloryzacja <b>od 240</b></span><span>Care <b>od 120</b></span></div><div class="mobile-button">Rezerwuj w Booksy</div></div></div>`;
  return desktop + phone;
}

function workshopDemo(branch, compact) {
  const desktop = `<div class="browser business-site demo-workshop">${browserBar("autoserwis21.pl", true)}<div class="workshop-nav"><b><i>21</i>AUTO SERWIS</b><span>USŁUGI&nbsp;&nbsp;&nbsp; CENNIK&nbsp;&nbsp;&nbsp; DOJAZD</span><em><i></i>OTWARTE DO 17:00</em></div><div class="workshop-layout"><div class="workshop-photo"><div class="diagnostic"><span>STATUS ZLECENIA</span><b>Diagnostyka zakończona</b><i><u></u></i></div></div><div class="workshop-copy"><small>${branch.label}</small><div class="mock-headline">${branch.headline}</div><p>Najpierw diagnoza i wycena. Dopiero potem naprawa.</p><div class="workshop-actions"><span class="mock-button">Zadzwoń teraz</span><b>58 721 21 21</b></div><div class="workshop-services">${branch.services.map((item, index) => `<span><i>0${index + 1}</i>${item}</span>`).join("")}</div></div></div></div>`;
  if (compact) return desktop;
  const phone = `<div class="phone phone--workshop"><div class="phone-notch"></div><div class="phone-screen"><div class="m-workshop-head"><b>AS<span>21</span></b><i></i><small>OTWARTE</small></div><div class="m-workshop-photo"></div><small>${branch.label}</small><div class="mobile-headline">${branch.mobileHeadline}</div><div class="m-workshop-status"><span>DIAGNOZA</span><b>Wycena przed naprawą</b></div><div class="mobile-button">Zadzwoń · 58 721 21 21</div></div></div>`;
  return desktop + phone;
}

function demo(branch, compact = false) {
  if (branch.key === "beauty") return beautyDemo(branch, compact);
  if (branch.key === "warsztat") return workshopDemo(branch, compact);
  return gabinetDemo(branch, compact);
}

function header() {
  return `<nav class="nav" aria-label="Główna nawigacja"><a class="wordmark brand-lockup" href="#top" aria-label="Znajdowalni — strona główna"><img src="assets/brand/znajdowalni-kadr-final.svg" alt="Znajdowalni"></a><button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Otwórz menu">☰</button><div class="nav-links" id="main-nav">${SITE.nav.filter(([, href]) => href !== "#kontakt").map(([text, href]) => link(text, href)).join("")}${link("Porozmawiajmy", "#kontakt", "nav-cta")}</div></nav>`;
}

function hero() {
  const tabs = Object.entries(SITE.branches).map(([key, branch], index) => `<button data-branch="${key}" class="${index === 0 ? "active" : ""}" aria-pressed="${index === 0}">${branch.tab}</button>`).join("");
  return `<section class="hero hero--showcase" aria-labelledby="hero-title"><div class="hero-copy"><div class="eyebrow">STRONY WWW DLA LOKALNYCH FIRM</div><h1 id="hero-title">Klient powinien od razu wiedzieć, że trafił dobrze.</h1><p>Porządkujemy ofertę, projektujemy stronę i łączymy ją z Google, kontaktem oraz rezerwacjami. Żeby dobra firma nie znikała wśród przypadkowych wyborów.</p><p class="price-line">Wdrożenie 1 990 zł netto · opieka 349 zł netto / mies.</p><div class="hero-actions">${link("Porozmawiajmy o Twojej stronie", "#kontakt", "button")}</div></div><div class="hero-visual" aria-label="Trzy różne projekty stron dla lokalnych firm"><div class="showcase-label"><span>3 branże</span><b>3 różne kierunki</b></div><div class="switcher" role="group" aria-label="Wybierz branżę">${tabs}</div><div class="site-stage" id="stage" data-branch="gabinet" role="img" aria-label="Podgląd strony: Gabinet Harmonia">${demo(SITE.branches.gabinet, true)}</div></div></section><div class="trust" aria-label="Najważniejsze informacje"><span>Projekt i uporządkowanie treści</span><span>Google, kontakt i rezerwacje</span><span>Publikacja zwykle w 10–15 dni</span><span>Opieka bez umowy na rok</span></div>`;
}

function decisionSection() {
  return `<section class="decision-section" aria-labelledby="decision-title"><div class="decision-head"><div><div class="kicker">Nie chodzi tylko o stronę</div><h2 id="decision-title">Polecenie daje Ci uwagę. Strona ma zamienić ją w zaufanie.</h2></div><p class="section-copy">Klient może trafić do Ciebie z Instagrama, polecenia albo mapy Google. Zanim zadzwoni, chce potwierdzić, że jesteś właściwą osobą: sprawdza ofertę, opinie, lokalizację, ceny i sposób kontaktu. Dajemy mu jedno uporządkowane miejsce do podjęcia decyzji.</p></div><div class="evidence-strip" aria-label="Wnioski z badania klientów lokalnych"><div><strong>75%</strong><span>korzystało z więcej niż jednego kanału podczas lokalnego wyszukiwania</span></div><div><strong>73%</strong><span>zaczynało takie wyszukiwanie na telefonie</span></div><div><strong>6%</strong><span>po prostu wybrało pierwszy wynik bez dalszego porównania</span></div><p>Badanie BrightLocal 2026 na panelu 1 227 aktywnych konsumentów w USA — kierunek projektowy, nie obietnica wyniku. Źródła: <a href="https://www.brightlocal.com/research/consumer-search-behavior-channels/" target="_blank" rel="noopener noreferrer">kanały wyszukiwania</a> i <a href="https://www.brightlocal.com/research/consumer-search-behavior-decisions/" target="_blank" rel="noopener noreferrer">kryteria decyzji</a>.</p></div><div class="decision-path"><article><span>01</span><h3>Polecenie</h3><p>Ktoś wysyła nazwę lub numer. Klient sprawdza, czy firma wygląda profesjonalnie i czy robi dokładnie to, czego potrzebuje.</p></article><article><span>02</span><h3>Social media</h3><p>Post lub rolka przyciąga uwagę. Strona pozwala przejść od „ciekawe” do konkretnej usługi, ceny i kontaktu.</p></article><article><span>03</span><h3>Google i mapa</h3><p>Klient porównuje kilka firm. Wygrywa nie sam wynik, lecz komplet informacji, opinie i łatwy następny krok.</p></article></div><div class="decision-check"><div><span class="kicker">W 15 sekund</span><h3>Twoja strona powinna odpowiedzieć na pięć pytań.</h3></div><ol><li>Co dokładnie robisz?</li><li>Dla kogo i gdzie działasz?</li><li>Dlaczego warto Ci zaufać?</li><li>Ile to kosztuje lub jak wygląda współpraca?</li><li>Jak mogę skontaktować się teraz?</li></ol></div><p class="decision-note">Bez tych odpowiedzi klient zwykle nie wysyła informacji zwrotnej. Po prostu wraca do porównania i wybiera firmę, która ułatwiła mu decyzję.</p></section>`;
}

function fitSection() {
  return `<section class="fit-section" aria-labelledby="fit-title"><div class="fit-intro"><div><div class="kicker">Czy to dla Ciebie?</div><h2 id="fit-title">Dla firm, które są dobre w tym, co robią — i nie chcą zajmować się stroną.</h2></div><p class="section-copy">To oferta dla lokalnych biznesów usługowych: gabinetów, salonów, warsztatów, ekip i małych zespołów. Masz już klientów z poleceń, social mediów albo Google, lecz Twoja obecność online jest niepełna, przestarzała lub rozrzucona po kilku profilach.</p></div><div class="fit-grid"><article><h3>DOBRY WYBÓR, JEŚLI</h3><ul><li>klienci wciąż pytają o usługi, ceny, adres lub wolne terminy</li><li>nie masz strony albo obecna nie buduje zaufania na telefonie</li><li>chcesz połączyć Google, opinie, mapę i rezerwacje</li><li>potrzebujesz jednej osoby odpowiedzialnej za stronę po publikacji</li></ul></article><article class="fit-no"><h3>TO NIE JEST OFERTA, JEŚLI</h3><ul><li>szukasz sklepu internetowego, rozbudowanego portalu lub aplikacji</li><li>oczekujesz skopiowania gotowego szablonu za najniższą cenę</li><li>ktoś ma zagwarantować pierwszą pozycję w Google</li><li>nie chcesz pokazać rzetelnej oferty ani umożliwić klientom kontaktu</li></ul></article></div></section>`;
}

function offer() {
  return `<section class="offer offer-v2" id="oferta"><div class="offer-v2-head"><div><div class="kicker">Jedna rekomendowana oferta</div><h2>Najpierw uruchamiamy stronę. Potem dbamy, żeby nie została sama.</h2></div><p>Bez trzech pakietów, pozornych rabatów i ukrytych kosztów. Płacisz za wdrożenie oraz za opiekę, której zakres znasz przed startem.</p></div><div class="pricing-flow"><article class="price-panel"><span class="price-label">01 · Wdrożenie</span><div class="price-main">1 990 zł <small>netto · jednorazowo</small></div><h3>Gotowa strona firmy</h3><ul><li>cel, struktura i uporządkowanie treści</li><li>indywidualny kierunek wizualny</li><li>responsywna strona do 6 standardowych sekcji</li><li>formularz, mapa, rezerwacje, SEO, konfiguracja domeny i SSL</li></ul></article><div class="price-plus" aria-hidden="true">+</div><article class="price-panel care-panel"><span class="price-label">02 · Opieka</span><div class="price-main">349 zł <small>netto / mies.</small></div><h3>Spokój po publikacji</h3><ul><li>hosting, SSL, kopie i monitoring</li><li>kontrola formularza oraz rezerwacji</li><li>60 minut drobnych zmian miesięcznie</li><li>wsparcie i kwartalna kontrola danych</li></ul><p>Rozliczenie kwartalne: 1 047 zł netto</p></article></div><div class="launch-details"><ul><li>10–15 dni roboczych</li><li>2 rundy korekt</li><li>bez umowy na rok</li><li>zachowujesz pliki strony</li></ul>${link("Chcę omówić swoją stronę", "#kontakt", "button")}</div><div class="extras-line"><span>Opcjonalnie:</span><b>Wizytówka Google od 490 zł</b><b>Kalendarz Google od 390 zł</b><b>Identyfikacja od 1 490 zł</b><b>QR do opinii od 190 zł</b></div><a class="offer-details-link" href="oferta.html">Zobacz pełny zakres, dodatki i zasady współpracy →</a></section>`;
}

function main() {
  const faqIndexes = [0, 1, 2, 3, 6, 9, 13];
  const faq = faqIndexes.map((index) => SITE.faq[index]).map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join("");
  return `<div class="page">${hero()}<section class="compact-value" id="dla-kogo"><div class="compact-value-head"><div><div class="kicker">Co klient musi zobaczyć</div><h2>Nie wystarczy być polecanym. Trzeba jeszcze wyglądać jak bezpieczny wybór.</h2></div><p>Strona zbiera w jednym miejscu to, czego klient szuka przed kontaktem: konkretną ofertę, dowody zaufania, lokalizację i prosty następny krok.</p></div><div class="outcome-grid"><article><span>01</span><h3>Zaufanie</h3><p>Kwalifikacje, opinie, zdjęcia i profesjonalna prezentacja.</p></article><article><span>02</span><h3>Konkret</h3><p>Usługi, obszar działania oraz cena lub jasny sposób wyceny.</p></article><article><span>03</span><h3>Działanie</h3><p>Telefon, formularz, mapa albo rezerwacja bez szukania linku.</p></article></div><p class="research-note">75% badanych korzystało z więcej niż jednego kanału podczas lokalnego wyszukiwania. <a href="https://www.brightlocal.com/research/consumer-search-behavior-channels/" target="_blank" rel="noopener noreferrer">BrightLocal 2026, badanie USA</a>.</p></section><section class="case-v2" id="realizacje"><div class="case-copy"><span class="case-label">Psychoterapia · realizacja</span><div class="kicker">Pani Terapia</div><h2>Spokojny design. Konkretna droga do konsultacji.</h2><p>Strona porządkuje zakres pomocy, doświadczenie i sposób umówienia konsultacji. Każda sekcja prowadzi do jednego celu: bezpiecznego pierwszego kontaktu.</p><ul><li>gabinet i konsultacje online</li><li>zakres pomocy i doświadczenie</li><li>czytelna droga do rozmowy</li></ul><a class="button secondary" href="assets/pani-terapia-current.png" target="_blank" rel="noopener noreferrer">Zobacz podgląd realizacji</a></div><div class="case-visual"><img src="assets/pani-terapia-current.png" alt="Aktualny widok strony Pani Terapia" loading="lazy"></div></section>${offer()}<section class="process-v2" id="jak-pracujemy"><div class="process-v2-head"><div><div class="kicker">Prosty proces</div><h2>Nie musisz przygotowywać profesjonalnego briefu.</h2></div><p>Potrzebujemy wiedzieć, czym zajmuje się firma, kogo obsługuje i jak klient ma się z Tobą skontaktować. Resztę porządkujemy razem.</p></div><div class="process-v2-grid"><article><span>01</span><h3>Rozmowa i materiały</h3><p>Oferta, zdjęcia, logo i linki do obecnych profili.</p></article><article><span>02</span><h3>Treść i projekt</h3><p>Przygotowujemy strukturę, wygląd i dwie rundy korekt.</p></article><article><span>03</span><h3>Publikacja i opieka</h3><p>Uruchamiamy stronę, a potem pilnujemy jej działania.</p></article></div></section><section class="audience-v2"><div><div class="kicker">Najlepsze dopasowanie</div><h2>Małe i średnie firmy usługowe.</h2></div><div class="audience-chips"><span>gabinet i klinika</span><span>psycholog i terapeuta</span><span>beauty i wellness</span><span>fryzjer i barber</span><span>dentysta i ortodonta</span><span>fizjoterapia</span><span>warsztat i serwis</span><span>usługi domowe</span><span>remonty i wykończenia</span><span>architekt wnętrz</span><span>prawo i księgowość</span><span>biuro nieruchomości</span><span>fotograf i filmowiec</span><span>szkoła językowa</span><span>trener i studio ruchu</span><span>weterynarz</span><span>catering i eventy</span><span>zespoły specjalistów</span></div><p>Pakiet standardowy obejmuje jeden serwis do 6 sekcji. Wiele lokalizacji, podstrony i szersze integracje wyceniamy indywidualnie.</p></section><section class="faq-v2" id="faq"><div><div class="kicker">Najważniejsze pytania</div><h2>Bez drobnego druku.</h2><a href="oferta.html#faq">Pełne FAQ i zasady →</a></div><div class="faq-list">${faq}</div></section><section class="contact-v2" id="kontakt"><div class="contact-v2-copy"><div class="kicker">Pierwszy krok</div><h2>Pokaż nam, jak dziś wygląda Twoja firma online.</h2><p>Wystarczy nazwa firmy, branża i e-mail. Jeśli masz stronę, profil Google albo Instagram — wklej link. Nie potrzebujesz gotowego briefu.</p><div class="contact-promise"><b>Co dostaniesz w odpowiedzi?</b><span>Krótką ocenę, rekomendowany zakres i informację, czy możemy sensownie pomóc.</span></div></div><form class="form compact-form" id="contact-form"><p class="form-intro"><b>Cztery krótkie pola.</b> Bez rejestracji i bez rozmowy sprzedażowej na siłę.</p><a class="direct-email" href="mailto:${CONTACT_EMAIL}">Wolisz e-mail? ${CONTACT_EMAIL}</a><div class="form-grid"><label class="field">Imię i nazwisko<input required autocomplete="name" spellcheck="false" name="name"></label><label class="field">E-mail<input required autocomplete="email" spellcheck="false" type="email" name="email"></label><label class="field full">Firma i branża<input required autocomplete="organization" name="company"></label><label class="field full">Link lub krótko: czego potrzebujesz? <span>(opcjonalnie)</span><textarea name="message"></textarea></label></div><div class="form-actions"><button class="button" type="submit">Przejdź do e-maila</button></div><p class="form-note">Kliknięcie otworzy Twój program pocztowy z gotową wiadomością. Strona nie zapisuje wpisanych danych.</p><div class="success" role="status" aria-live="polite"></div></form></section></div>`;
}

function footer() {
  return `<div class="footer-brand"><a class="wordmark brand-lockup footer-lockup" href="#top" aria-label="Znajdowalni — strona główna"><img src="assets/brand/znajdowalni-kadr-final-reverse.svg" alt="Znajdowalni"></a><p>Strony WWW i stała opieka dla lokalnych firm.</p><a class="footer-email" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></div><nav class="footer-column" aria-label="Znajdowalni"><span>Znajdowalni</span>${SITE.nav.filter(([text]) => ["Jak pracujemy", "Oferta", "FAQ", "Kontakt"].includes(text)).map(([text, href]) => link(text, href)).join("")}</nav><nav class="footer-column" aria-label="Informacje"><span>Informacje</span>${link("Dla kogo", "#dla-kogo")}${link("Realizacje", "#realizacje")}${link("Polityka prywatności", "polityka-prywatnosci.html")}${link("Pliki cookie", "pliki-cookie.html")}<button class="cookie-settings" type="button">Ustawienia cookies</button></nav>`;
}

$(".header").innerHTML = header();
$("main").innerHTML = main();
$("footer").className = "footer";
$("footer").innerHTML = footer();

if (window.location.hash) {
  const syncHashPosition = () => document.querySelector(window.location.hash)?.scrollIntoView({ block: "start", behavior: "instant" });
  requestAnimationFrame(syncHashPosition);
  window.addEventListener("load", syncHashPosition, { once: true });
  document.fonts?.ready.then(syncHashPosition);
}

$(".menu-toggle").addEventListener("click", (event) => {
  const nav = $(".nav-links");
  const open = nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", open);
  event.currentTarget.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
  event.currentTarget.textContent = open ? "×" : "☰";
});
document.querySelectorAll(".nav-links a").forEach((anchor) => anchor.addEventListener("click", () => {
  $(".nav-links").classList.remove("open");
  $(".menu-toggle").setAttribute("aria-expanded", "false");
  $(".menu-toggle").setAttribute("aria-label", "Otwórz menu");
  $(".menu-toggle").textContent = "☰";
}));
document.querySelectorAll("button[data-branch]").forEach((button) => button.addEventListener("click", () => {
  const key = button.dataset.branch;
  const stage = $("#stage");
  if (stage.dataset.branch === key) return;
  stage.classList.add("stage-enter");
  stage.dataset.branch = key;
  stage.innerHTML = demo(SITE.branches[key], true);
  stage.setAttribute("aria-label", `Podgląd strony: ${SITE.branches[key].name}`);
  requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove("stage-enter")));
  document.querySelectorAll("button[data-branch]").forEach((candidate) => {
    const active = candidate === button;
    candidate.classList.toggle("active", active);
    candidate.setAttribute("aria-pressed", active);
  });
}));
$("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Zapytanie ze strony Znajdowalni — ${formData.get("company") || "lokalna firma"}`);
  const message = [
    `Imię i nazwisko: ${formData.get("name") || ""}`,
    `Firma: ${formData.get("company") || ""}`,
    `E-mail: ${formData.get("email") || ""}`,
    "",
    `${formData.get("message") || ""}`
  ].join("\n");
  $(".success").textContent = "Otwieramy Twoją pocztę z przygotowaną wiadomością. Sprawdź treść i kliknij Wyślij.";
  $(".success").classList.add("show");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(message)}`;
});
