/* AutoVex prototype — page-level FI/EN switching for pages that hardcode their copy.
 *
 * WHY THIS EXISTS AND WHY IT IS NOT `data-i18n`
 * --------------------------------------------
 * `i18n.js` translates nodes that carry a `data-i18n` key, which works on the
 * funnel and the marketing pages because their copy lives in `translations.js`.
 * `decision.html` does not work that way: it builds nearly all of its markup in
 * JS with the Finnish written inline, and that is deliberate — the page is a
 * transcription of production and the Finnish has to stay readable in the source
 * so it can be diffed against a prod dump. Extracting ~75 strings into keys
 * would break that, and naming them is where the work actually is.
 *
 * So this translates the RENDERED TEXT instead: a page registers a plain
 * `{ finnish: english }` dictionary, and a DOM pass swaps text nodes and the
 * three translatable attributes. Nothing about the page's own rendering changes,
 * and deleting the registration removes the feature completely.
 *
 * IT IS A PROTOTYPE TOOL, NOT AN i18n LAYER. Production translates through
 * Laravel and vue-i18n; this exists so the team can read the page in English
 * while ideating, instead of pasting it into a translator. Do not grow it into
 * the funnel's translation path.
 *
 * MIGRATING ANOTHER PAGE is one file and one script tag: write its dictionary,
 * call `protoI18n.register(...)`, and the bar's Language row appears there too.
 * A page that registers nothing renders no control and pays nothing.
 */
(function () {
  /* Finnish is what the markup contains, so it is the identity direction: a
     page with no dictionary is already "translated" into fi. */
  var DEFAULT = 'fi';

  var exact    = null;   // { fi: en }
  var reverse  = null;   // { en: fi }, built from `exact`
  var patterns = [];     // [{ re, en }] for strings with a number in them

  /* The original Finnish, per text node. Translation is destructive, so
     switching back needs the source — and a re-render replaces the nodes, which
     is why this is a WeakMap rather than an attribute: the entries die with the
     nodes they describe. */
  var sources = new WeakMap();

  var scheduled = false;
  var observer  = null;

  function lang() {
    return (typeof window.getLang === 'function') ? window.getLang() : DEFAULT;
  }

  function available() {
    return !!exact;
  }

  /* `data-i18n` nodes belong to i18n.js and are already bilingual; the proto bar
     is chrome and never reads as page copy. Both would otherwise be translated
     twice, and the bar's own labels are English already. */
  function skip(el) {
    if (!el) return true;
    if (!el.closest) return false;
    return !!el.closest('#proto-bar, script, style, svg, [data-i18n], [data-i18n-html]');
  }

  function translate(fi) {
    if (exact && Object.prototype.hasOwnProperty.call(exact, fi)) return exact[fi];
    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i].re.test(fi)) return fi.replace(patterns[i].re, patterns[i].en);
    }
    return null;
  }

  function apply(root) {
    if (!exact) return;
    var toEn = lang() === 'en';
    var scope = (root && root.nodeType === 1) ? root : document.body;
    if (!scope) return;

    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (skip(node.parentElement)) continue;
      var current = node.nodeValue;
      if (!current || !/\S/.test(current)) continue;

      /* The stash is what makes this reversible AND idempotent: once a node is
         known, every later pass reads the Finnish rather than whatever is on
         screen, so running twice cannot double-translate and switching back
         cannot guess. */
      var fi = sources.get(node);
      if (fi === undefined) {
        fi = current;
        /* Only remember nodes the dictionary actually covers — otherwise every
           euro amount and timestamp on the page earns an entry. */
        if (translate(fi.trim()) === null) continue;
        sources.set(node, fi);
      }

      var want = fi;
      if (toEn) {
        var en = translate(fi.trim());
        /* Leading and trailing whitespace is layout, not copy: the markup puts
           it there and removing it can close a gap between inline elements. */
        if (en !== null) want = fi.replace(fi.trim(), en);
      }
      if (node.nodeValue !== want) node.nodeValue = want;
    }

    ['title', 'aria-label', 'placeholder'].forEach(function (attr) {
      var els = scope.querySelectorAll('[' + attr + ']');
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (skip(el)) continue;
        var key = '__protoI18n_' + attr;
        var srcVal = el[key];
        if (srcVal === undefined) {
          srcVal = el.getAttribute(attr);
          if (!srcVal || translate(srcVal.trim()) === null) continue;
          el[key] = srcVal;
        }
        var next = srcVal;
        if (toEn) {
          var t = translate(srcVal.trim());
          if (t !== null) next = t;
        }
        if (el.getAttribute(attr) !== next) el.setAttribute(attr, next);
      }
    });

    document.documentElement.lang = lang();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      apply();
    });
  }

  /* The decision page rebuilds whole sections on almost every interaction —
     opening a modal, sending a counter offer, switching a triage branch — so a
     one-shot pass would translate the page and then lose it. Observing is
     cheaper than finding every render site, and safe because the pass is
     idempotent: our own mutations produce text the dictionary does not match. */
  function watch() {
    if (observer || !document.body) return;
    observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function register(dict) {
    exact = {};
    reverse = {};
    patterns = (dict && dict.patterns) || [];
    var pairs = (dict && dict.strings) || {};
    Object.keys(pairs).forEach(function (fi) {
      exact[fi] = pairs[fi];
      reverse[pairs[fi]] = fi;
    });
    watch();
    apply();
  }

  /* THE URL PARAM OUTRANKS THE STORED VALUE in i18n.js's `getLang`, which is
     right for handing someone a pinned link and wrong for a control on the
     page: loaded with `?lang=en`, every later `setLang` was overruled on the
     next read and the selector snapped back. Dropping the param hands the
     decision to the store, where the control can reach it.

     `replaceState`, not a reload: the page keeps its scroll position, its open
     modal and its simulated negotiation, which is the whole point of switching
     language while reading something. */
  function set(next) {
    try {
      var url = new URL(window.location.href);
      if (url.searchParams.has('lang')) {
        url.searchParams.delete('lang');
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
    } catch (e) {}
    if (typeof window.setLang === 'function') window.setLang(next);
    apply();
  }

  window.protoI18n = {
    register: register,
    apply: apply,
    available: available,
    set: set,
    /* The bar reads this to label its own control; the page never does. */
    langs: [['fi', 'Suomi'], ['en', 'English']]
  };

  /* i18n.js fires this from setLang, so the bar only has to call setLang and
     both translation paths follow. */
  document.addEventListener('av:langchange', function () { apply(); });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { watch(); apply(); });
  } else {
    watch();
    apply();
  }
})();
