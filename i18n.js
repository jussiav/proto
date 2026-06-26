/* AutoVex / Wheelaway — i18n runtime
   - Reads ?lang=en|fi from URL (takes priority, saves to localStorage)
   - Falls back to localStorage key "av_lang"
   - Falls back to "fi" (default)
   - Applies translations to all data-i18n* attributes in the DOM
   - Exposes: t(key), setLang(lang), getLang()
*/
(function () {
  var DEFAULT = 'fi';
  var SUPPORTED = ['fi', 'en'];

  function getLang() {
    var params = new URLSearchParams(window.location.search);
    var urlLang = params.get('lang');
    if (SUPPORTED.indexOf(urlLang) !== -1) {
      try { localStorage.setItem('av_lang', urlLang); } catch (e) {}
      return urlLang;
    }
    try {
      var stored = localStorage.getItem('av_lang');
      if (SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) {}
    return DEFAULT;
  }

  function resolve(key) {
    var lang = getLang();
    var tr = window.TRANSLATIONS;
    if (!tr) return key;

    function lookup(obj, parts) {
      for (var i = 0; i < parts.length; i++) {
        if (obj == null) return undefined;
        obj = obj[parts[i]];
      }
      return obj;
    }

    var parts = key.split('.');
    var val = lookup(tr[lang], parts);
    if (val == null && lang !== DEFAULT) val = lookup(tr[DEFAULT], parts);
    return (val != null) ? val : key;
  }

  function applyTranslations() {
    // Text content
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var v = resolve(nodes[i].getAttribute('data-i18n'));
      if (v) nodes[i].textContent = v;
    }
    // innerHTML (for nodes containing links)
    var htmlNodes = document.querySelectorAll('[data-i18n-html]');
    for (var i = 0; i < htmlNodes.length; i++) {
      var v = resolve(htmlNodes[i].getAttribute('data-i18n-html'));
      if (v) htmlNodes[i].innerHTML = v;
    }
    // placeholder attributes
    var phNodes = document.querySelectorAll('[data-i18n-placeholder]');
    for (var i = 0; i < phNodes.length; i++) {
      var v = resolve(phNodes[i].getAttribute('data-i18n-placeholder'));
      if (v) phNodes[i].placeholder = v;
    }
    // aria-label attributes
    var ariaNodes = document.querySelectorAll('[data-i18n-aria]');
    for (var i = 0; i < ariaNodes.length; i++) {
      var v = resolve(ariaNodes[i].getAttribute('data-i18n-aria'));
      if (v) ariaNodes[i].setAttribute('aria-label', v);
    }
    // html lang attribute
    document.documentElement.lang = getLang();
    // sync language selector
    var sel = document.getElementById('lang-selector');
    if (sel) sel.value = getLang();
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try { localStorage.setItem('av_lang', lang); } catch (e) {}
    applyTranslations();
  }

  // Public API
  window.t = resolve;
  window.setLang = setLang;
  window.getLang = getLang;

  // Run after DOM + translations are ready
  function init() {
    if (window.TRANSLATIONS) {
      applyTranslations();
    } else {
      // translations.js not yet loaded — wait one tick
      setTimeout(applyTranslations, 0);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
