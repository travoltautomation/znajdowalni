/* Wszystkie łatwo edytowalne treści strony. */
const SITE = {
  nav: [
    ["Dla kogo", "#dla-kogo"], ["Realizacje", "#realizacje"], ["Oferta", "#oferta"],
    ["Jak pracujemy", "#jak-pracujemy"], ["FAQ", "#faq"], ["Kontakt", "#kontakt"]
  ],
  branches: {
    gabinet: {
      key: "gabinet", tab: "Gabinet", name: "Gabinet Harmonia", brand: "HARMONIA", label: "Fizjoterapia · Poznań",
      headline: "Wracaj do ruchu bez bólu.", mobileHeadline: "Twój ruch. Nasza opieka.",
      cta: "Umów konsultację", color: "sage", services: ["Pierwsza konsultacja", "Terapia manualna", "Rehabilitacja"],
      price: "od 180 zł", note: "Dziś: 09:00–18:00", proof: "4,9 · 86 opinii"
    },
    beauty: {
      key: "beauty", tab: "Beauty", name: "Maja Atelier", brand: "MAJA / ATELIER", label: "Hair & beauty · Wrocław",
      headline: "Kolor, który wygląda jak Ty.", mobileHeadline: "Nowy kolor. Nadal Ty.",
      cta: "Zarezerwuj w Booksy", color: "rose", services: ["Koloryzacja premium", "Manicure", "Pielęgnacja twarzy"],
      price: "od 120 zł", note: "Najbliższy termin: jutro", proof: "4,8 · 124 opinie"
    },
    warsztat: {
      key: "warsztat", tab: "Warsztat", name: "Auto Serwis 21", brand: "AS21", label: "Serwis samochodowy · Gdynia",
      headline: "Serwis bez zgadywania.", mobileHeadline: "Auto gotowe. Bez niespodzianek.",
      cta: "Zadzwoń i umów termin", color: "blue", services: ["Diagnostyka komputerowa", "Serwis klimatyzacji", "Opony i geometria"],
      price: "Wycena przed naprawą", note: "Otwarte dziś do 17:00", proof: "4,9 · 211 opinii"
    }
  },
  sectors: [
    ["01", "Psycholog i gabinet terapeutyczny", "Kwalifikacje, zakres pomocy, konsultacje gabinetowe lub online i spokojna droga do umówienia spotkania.", "Kwalifikacje · FAQ · Rezerwacje"],
    ["02", "Salon beauty", "Usługi, galeria, cennik i Booksy bez zmuszania klienta do szukania linku.", "Booksy · Cennik · Galeria"],
    ["03", "Warsztat samochodowy", "Telefon, lokalizacja, konkretne usługi i szybkie zapytanie o termin.", "Telefon · Mapa · Terminy"],
    ["04", "Usługi domowe", "Obszar działania, opinie, zakres usług i prosty formularz wyceny.", "Wycena · Obszar · Kontakt"]
  ],
  process: [
    ["01", "Krótka diagnoza", "Poznajemy firmę, najważniejsze usługi, klientów i moment, w którym decydują się na kontakt."],
    ["02", "Materiały bez chaosu", "Dostajesz prostą listę. Przekazujesz ofertę, zdjęcia, dane i dostępne opinie — nie musisz pisać profesjonalnego briefu."],
    ["03", "Treść i projekt", "Porządkujemy przekaz, proponujemy hierarchię treści i tworzymy kierunek wizualny dopasowany do marki oraz branży."],
    ["04", "Korekty i publikacja", "Przechodzimy przez dwie rundy drobnych korekt, konfigurujemy domenę, SSL i publikujemy zaakceptowaną stronę."],
    ["05", "Opieka i rozwój", "Monitorujemy działanie, aktualizujemy drobne treści i przed każdą większą zmianą podajemy osobną wycenę."]
  ],
  faq: [
    ["Ile kosztuje strona i opieka?", "Wdrożenie standardowej strony kosztuje 1 990 zł netto. Opieka to 349 zł netto miesięcznie, rozliczana kwartalnie po 1 047 zł netto. Dodatki i prace spoza standardowego zakresu wyceniamy przed startem."],
    ["Ile trwa stworzenie strony?", "Standardową stronę zwykle uruchamiamy w 10–15 dni roboczych od otrzymania kompletu materiałów i informacji. Termin potwierdzamy przed startem."],
    ["Mam Instagram i klientów z polecenia — po co mi strona?", "To świetne źródła zainteresowania. Strona daje klientowi jedno wiarygodne miejsce, w którym może sprawdzić ofertę, opinie, lokalizację i od razu przejść do kontaktu lub rezerwacji."],
    ["Czy strona gwarantuje więcej klientów?", "Nie obiecujemy wyniku, którego nie da się uczciwie zagwarantować. Dobra strona ułatwia znalezienie firmy, buduje zaufanie i skraca drogę do kontaktu — a to wzmacnia działanie poleceń, Google oraz social mediów."],
    ["Czy zajmujecie się pozycjonowaniem?", "Wdrożenie obejmuje podstawy technicznego SEO, logiczną strukturę treści i podpięcie Google Search Console. Opcjonalnie pomagamy uporządkować Wizytówkę Google. Nie sprzedajemy gwarancji pierwszej pozycji ani stałego prowadzenia rozbudowanych kampanii SEO w cenie strony."],
    ["Nie mam jeszcze logo ani spójnego stylu. Czy możecie pomóc?", "Tak. Opcjonalny pakiet Start identyfikacji marki kosztuje od 1 490 zł netto i obejmuje logo, favicon, kolory, fonty, projekt wizytówki oraz mini-brandbook. Zakres zatwierdzamy przed rozpoczęciem."],
    ["Czy mogę dodać Booksy, Kalendarz Google lub Calendly?", "Tak. Istniejący system rezerwacji podpinamy w ramach standardowego wdrożenia. Konfigurację nowej strony rezerwacji w Kalendarzu Google oferujemy od 390 zł netto."],
    ["Czy mogę przyjmować płatności przy rezerwacji?", "Możemy podłączyć istniejący system, który to obsługuje. Jego abonament oraz opłaty operatora płatności pozostają po stronie klienta."],
    ["Czy stronę można później rozbudować?", "Tak. Nową podstronę, funkcjonalność, integrację, przebudowę lub wersję językową wyceniamy osobno przed rozpoczęciem pracy."],
    ["Czy opieka wiąże mnie umową na rok?", "Nie. Pierwszy kwartał opieki rozpoczyna się wraz z publikacją i jest rozliczany z góry. Później przedłużasz ją na kolejne kwartały. Rezygnujesz przed kolejnym okresem, bez rocznej umowy."],
    ["Co obejmuje stała opieka?", "Hosting, SSL, kopie zapasowe, monitoring działania, kontrolę formularza i linków, wsparcie mailowe w dni robocze, kwartalną kontrolę aktualności danych oraz do 60 minut drobnych zmian treści miesięcznie."],
    ["Co oznacza drobna zmiana?", "Na przykład aktualizację tekstu, ceny, zdjęcia, godzin otwarcia lub danych kontaktowych. Takie bieżące sprawy zwykle bez problemu mieszczą się w miesięcznym zakresie."],
    ["Czy niewykorzystane 60 minut przechodzi na kolejny miesiąc?", "Nie. Czas na drobne zmiany jest dostępny w danym miesiącu i nie przechodzi dalej."],
    ["Co się dzieje, gdy rezygnuję z opieki?", "Nie tracisz strony. Otrzymujesz jej aktualne pliki i możesz przenieść je na własny hosting. Samo przeniesienie lub dalsze zmiany po zakończeniu opieki możemy wycenić osobno."],
    ["Czy domena i strona należą do mnie?", "Domena jest rejestrowana na dane klienta. Po opłaceniu wdrożenia otrzymujesz aktualne pliki zaakceptowanej strony i zachowujesz dostęp do własnych kont Google oraz systemów rezerwacji."],
    ["Czy mogę skorzystać z usługi z dowolnego miasta?", "Tak. Pracujemy z firmami usługowymi w całej Polsce."],
    ["Czy muszę zmieniać Booksy lub inne systemy, których już używam?", "Nie. Strona ma uporządkować działające kanały i prowadzić do nich klientów, a nie je zastępować."]
  ]
};
