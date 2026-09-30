(function () {
  'use strict';

  var key = 'bbznop.site-language';
  var root = document.documentElement;
  var supported = ['zh-CN', 'en'];
  var selected;
  try {
    selected = localStorage.getItem(key);
  } catch (_) {
    // Language links still work if storage is unavailable.
  }

  if (root.dataset.languageAuto === 'true') {
    var explicit = location.pathname.match(/^\/(en|zh-CN)(?:\/|$)/);
    var browser = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    var preferred = explicit ? explicit[1] :
      supported.indexOf(selected) !== -1 ? selected :
      /^en(?:-|$)/i.test(browser) ? 'en' : 'zh-CN';
    if (preferred !== root.lang) {
      var alternate = document.querySelector('head link[rel="alternate"][hreflang="' + preferred + '"]');
      if (alternate) {
        var target = new URL(alternate.href);
        // Retain the current origin so this also works in local previews.
        location.replace(target.pathname + location.search + location.hash);
      }
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[data-site-language]');
    if (!link || supported.indexOf(link.dataset.siteLanguage) === -1) return;
    try {
      localStorage.setItem(key, link.dataset.siteLanguage);
    } catch (_) {
      // Explicit language URLs do not require browser storage.
    }
  });
}());
