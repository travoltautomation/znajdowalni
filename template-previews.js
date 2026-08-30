document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.szablon').forEach((card) => {
    const href = card.getAttribute('href') || '';
    const slug = href.includes('warsztat') ? 'warsztat' : href.includes('barber') ? 'barber' : 'fizjoterapia';
    const plotno = card.querySelector('.szablon-plotno');
    if (!plotno) return;
    const alt = slug === 'warsztat' ? 'Podgląd hero strony Serwis Zamkowa z przyciskiem umówienia terminu' : slug === 'barber' ? 'Podgląd hero strony Barber Kuźnia z cennikiem i rezerwacją' : 'Podgląd hero strony Gabinet Ruchu z przyciskiem umówienia wizyty';
    plotno.innerHTML = `<picture><source type="image/webp" srcset="assets/previews/${slug}-hero-720.webp 720w, assets/previews/${slug}-hero-1440.webp 1440w" sizes="(min-width:1040px) 320px, (min-width:700px) 30vw, 88vw"><img src="assets/previews/${slug}-hero-720.jpg" width="1280" height="800" loading="lazy" decoding="async" alt="${alt}"></picture>`;
    card.classList.add('szablon--screen');
    const link = card.querySelector('.szablon-link');
    if (link) link.innerHTML = 'Otwórz pełne demo w nowej karcie <span aria-hidden="true">↗</span>';
  });
});
