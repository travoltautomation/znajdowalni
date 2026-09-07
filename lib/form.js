module.exports = () => `<form class="lead-form" id="lead-form" novalidate>
<p class="form-intro">Wystarczy link i e-mail. Resztę sprawdzimy sami.</p>
<label for="lead-source">Link do firmy <span>Google, Booksy, Facebook, Instagram lub strona</span></label>
<input id="lead-source" name="source" type="text" inputmode="url" autocomplete="url" maxlength="1500" placeholder="Wklej link do dowolnego profilu firmy" aria-describedby="source-help">
<p id="source-help" class="field-hint">Nie musisz mieć własnej strony. Link może być też bez „https://”.</p>
<button type="button" class="link-like identity-toggle" aria-expanded="false" aria-controls="business-fields">Nie mam linku — podam nazwę firmy</button>
<fieldset id="business-fields" hidden disabled><legend>Jak znaleźć Twoją firmę?</legend><div class="lead-grid"><label>Nazwa firmy *<input name="company" autocomplete="organization" maxlength="150" required></label><label>Miejscowość *<input name="city" autocomplete="address-level2" maxlength="100" required></label></div></fieldset>
<label for="lead-email">Twój e-mail *</label><input id="lead-email" name="email" type="email" autocomplete="email" maxlength="254" required placeholder="twoj@email.pl"><p class="field-hint">Tutaj wyślemy dalsze informacje i prywatny podgląd.</p>
<details class="optional-details"><summary>Chcę coś dodać (opcjonalnie)</summary><label for="lead-message">Co powinniśmy wiedzieć?</label><textarea id="lead-message" name="message" maxlength="3000" rows="3" placeholder="Np. zależy mi przede wszystkim na rezerwacjach."></textarea></details>
<div class="spam-field" aria-hidden="true"><label>Nie wypełniaj tego pola<input name="website" tabindex="-1" autocomplete="off"></label></div>
<div class="lead-consent"><input id="lead-consent" name="consent" type="checkbox" required><label for="lead-consent">Proszę o kontakt w sprawie bezpłatnego kierunku mojej strony. *</label></div>
<p class="field-hint">Dane wykorzystamy do obsługi tego zapytania. <a href="/polityka-prywatnosci">Polityka prywatności</a>.</p>
<div class="lead-status" role="status" aria-live="polite" tabindex="-1"></div>
<button class="button ink lead-submit" type="submit">Poproś o bezpłatny kierunek <span aria-hidden="true">→</span></button>
<p class="field-hint">Bez opłat i zobowiązań. Niczego nie publikujemy bez Twojej akceptacji.</p>
</form>`;
