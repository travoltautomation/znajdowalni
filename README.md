# Znajdowalni — strona sprzedażowa

Lekki, statyczny frontend marki Znajdowalni dla lokalnych firm usługowych w Polsce.

## Najważniejsze pliki

- `index.html` — metadane, canonical, schema.org oraz wejście strony głównej.
- `app.js` — komponenty strony, formularz preview i interakcje.
- `content.js` — centralne dane: pakiety, FAQ, branże, dodatki i kontakt.
- `redesign.css` — aktualny system wizualny oraz responsywność.
- `api/preview-request.js` — adapter endpointu Vercel dla webhooka lub Resend.
- `.env.example` — wymagane zmienne środowiskowe dla wysyłki formularza.
- `assets/brand/` — zatwierdzony brandbook i logo; źródło prawdy dla identyfikacji.

## Oferta na stronie głównej

- Standard: **349 zł netto / miesiąc**.
- Pro: **599 zł netto / miesiąc**.
- Przygotowanie i uruchomienie: **2499 zł netto**, albo **0 zł przy umowie na minimum 12 miesięcy**.

Pierwszy bezpłatny preview to jeden prywatny kierunek: hero, pierwsza sekcja i widok mobilny. Nie jest to gotowa, kompletna strona.

## Formularz

W produkcji ustaw na Vercel jedną z metod:

- `PREVIEW_WEBHOOK_URL`, lub
- `RESEND_API_KEY` i `PREVIEW_RECIPIENT_EMAIL` (opcjonalnie `RESEND_FROM_EMAIL`).

Bez tych zmiennych endpoint nie zapisuje ani nie przekazuje danych, a interfejs wyświetla stan demonstracyjny. Nie dodawaj kluczy do repozytorium.

## Przed publikacją

1. Uzupełnij produkcyjny adres e-mail i konfigurację formularza.
2. Dodaj prawdziwe zdjęcie oraz imię osoby stojącej za marką.
3. Zatwierdź regulamin, szczególnie zasady po 12 miesiącach i wcześniejszego rozwiązania umowy; oznaczone miejsca `TODO` nie są poradą prawną.
4. Dodaj obraz OpenGraph i sprawdź domenę w Google Search Console.
