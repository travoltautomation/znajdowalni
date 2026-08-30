document.addEventListener('DOMContentLoaded', () => {
  const ribbon = document.createElement('aside');
  ribbon.className = 'znajdowalni-demo-ribbon';
  ribbon.innerHTML = 'To przykładowy kierunek strony. <a href="../index.html#kontakt">Taką stronę zrobimy dla Twojej firmy →</a>';
  document.body.append(ribbon);
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => link.hidden = true);
  const style = document.createElement('style');
  style.textContent = '.znajdowalni-demo-ribbon{position:fixed;z-index:999;right:16px;bottom:16px;max-width:330px;padding:12px 15px;background:#121416;color:#fff;border:1px solid #b9f24a;box-shadow:4px 4px 0 #121416;font:600 13px Arial,sans-serif}.znajdowalni-demo-ribbon a{color:#b9f24a;text-decoration:none}@media(max-width:600px){.znajdowalni-demo-ribbon{left:10px;right:10px;bottom:10px;max-width:none}}';
  document.head.append(style);
});
