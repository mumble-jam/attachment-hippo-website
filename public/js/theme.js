/*
 * Applies the chosen colour theme before the page paints (no flash).
 * Order: ?theme=… in the URL (shareable), then the visitor's last choice.
 * Plain file, loaded synchronously in <head>: the site's CSP blocks inline scripts.
 */
(function () {
  try {
    var q = new URLSearchParams(location.search).get('theme');
    var t = q || localStorage.getItem('ah-theme');
    if (t && /^[a-z-]+$/.test(t)) document.documentElement.setAttribute('data-theme', t);
    if (q) localStorage.setItem('ah-theme', q);
  } catch (e) {}
})();
