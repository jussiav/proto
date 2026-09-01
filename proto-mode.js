/**
 * Proto mode — decides whether the prototype's own tooling is visible.
 *
 * The proto is used far more often by the team than in user tests, so it
 * DEFAULTS TO DEV: scenario switchers, variant switchers and the prototype
 * instructions link are all on unless explicitly turned off.
 *
 *   (no param)              dev  — panels visible. The default.
 *   ?mode=test              test — all proto tooling hidden. Sticks.
 *   ?mode=dev  /  ?dev=1    dev  — clears a stored test mode.
 *
 * Test mode persists in localStorage, not the URL, so a moderator hands over
 * ONE link and the participant keeps the clean view across every page and any
 * new tab they open. sessionStorage would have been lost the moment a link
 * opened in a new tab, which is exactly when dev chrome must not reappear.
 *
 * The trade-off is that test mode outlives the study, so exiting has to be
 * obvious: any page with ?mode=dev restores it, and while in test mode we log
 * the exit instruction to the console — invisible to a participant, findable
 * by whoever picks the machine up next.
 *
 * Exposes:
 *   window.protoMode  'dev' | 'test'
 *   window.protoDev   boolean — true in dev mode
 *   window.protoVariant(name, fallback)  — the active arm of an initiative
 *   window.protoVariantStored(name)      — the remembered arm, without setting one
 *   window.protoVariantSet(name, value)  — remember (or forget) an arm
 *   window.protoInitiatives              — the initiative registry
 *   window.protoInitiative(slug)         — one registry entry
 *
 * ── Initiative arms ────────────────────────────────────────────────────────
 * An initiative (a named set of proposed changes, e.g. "Review/No review")
 * usually spans several funnel pages, and funnel navigation is a plain
 * `window.location = 'contact.html'`, so a URL-only arm param would die at
 * every step boundary — useless for walking the funnel in one arm. protoVariant
 * therefore does for an arm exactly what the block above does for the mode:
 * a param sets it, localStorage remembers it, the page's own default fills in.
 *
 * It lives here rather than in proto-bar.js because the bar is dev-only, while
 * arm links have to keep working in test mode — that is how a moderator pins a
 * participant to one arm.
 *
 * Adding new proto-only UI? Mark its root with data-proto-dev (hidden by CSS
 * in test mode) AND, if it is built in JS, skip building it when !protoDev.
 * The CSS is the safety net; not building it is the actual fix.
 */
(function () {
  var KEY = 'autovex_proto_mode';

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function store(v) {
    try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch (e) {}
  }

  var params = new URLSearchParams(window.location.search);
  var asked = params.get('mode');
  var mode;

  if (asked === 'test') {
    mode = 'test';
    store('test');
  } else if (asked === 'dev' || params.get('dev') === '1') {
    mode = 'dev';
    store(null);
  } else {
    mode = stored() === 'test' ? 'test' : 'dev';
  }

  window.protoMode = mode;
  window.protoDev = mode === 'dev';

  /* ── Initiative arms ──────────────────────────────────────────────────────
     protoVariant('review-no-review', 'control') → the arm this page should
     render. Same precedence as the mode above: an explicit param wins and is
     remembered, otherwise the remembered arm, otherwise the page's default.

     The param name IS the initiative slug, matching its design-spec filename
     and its proto-bar row label, so one grep finds every trace of an
     initiative. Values are arm ids the page declares ('control', 'v1', …). */
  var VARIANT_KEY_PREFIX = 'autovex_proto_variant_';

  /* ── The initiative registry ───────────────────────────────────────────────
     Every initiative the prototype knows, declared ONCE. The slug is the whole
     identity: it is the URL param, the design-spec filename, and what a page
     names when it declares arms — so a page never repeats the initiative's name
     or spec path, and one grep finds every trace of it.

     `prodArm` is the arm that matches production today. It is not necessarily
     what the proto renders by default (the delivery test deliberately defaults
     to v2), which is exactly why the two are recorded separately: the bar can
     then tell the reader whether "no selection" means production or not.

     Registered here, not per page, for two reasons. An arm param has to be
     remembered the moment it appears in ANY url — otherwise a link to the
     funnel's first step could not pin an arm for a change that lands three steps
     later, since nothing would have stored it and the param would die at the
     first `window.location = 'services.html'`. And selecting one variant has to
     be able to clear the others, including initiatives that live on pages you
     are not currently looking at.

     Add an entry when an initiative is created; remove it when its winning arm
     is promoted. See CLAUDE.md, "Initiatives". */
  var INITIATIVES = [
    {
      slug: 'delivery',
      name: 'Delivery distance A/B test',
      spec: 'design-specs/delivery-distance.html',
      prodArm: 'control'
    },
    {
      slug: 'review-no-review',
      name: 'Review/No review',
      spec: 'design-specs/review-no-review.html',
      prodArm: 'control'
    },
    {
      slug: 'enhanced-negotiations',
      name: 'Enhanced negotiations',
      spec: 'design-specs/enhanced-negotiations.html',
      prodArm: 'control'
    },
    {
      slug: 'seller-file-upload',
      name: 'Seller file upload',
      spec: 'design-specs/seller-file-upload.html',
      prodArm: 'control'
    },
    {
      slug: 'seller-intent',
      name: 'Seller intent A/B',
      spec: 'design-specs/seller-intent.html',
      prodArm: 'control'
    }
  ];

  window.protoInitiatives = INITIATIVES;

  window.protoInitiative = function (slug) {
    for (var i = 0; i < INITIATIVES.length; i++) {
      if (INITIATIVES[i].slug === slug) return INITIATIVES[i];
    }
    return null;
  };

  INITIATIVES.forEach(function (ini) {
    var asked = params.get(ini.slug);
    if (!asked) return;
    try { localStorage.setItem(VARIANT_KEY_PREFIX + ini.slug, asked); } catch (e) {}
  });

  var stuckArms = [];

  window.protoVariant = function (name, fallback) {
    var key = VARIANT_KEY_PREFIX + name;
    var askedArm = params.get(name);

    if (askedArm) {
      try { localStorage.setItem(key, askedArm); } catch (e) {}
      if (askedArm !== fallback) stuckArms.push(name + '=' + askedArm);
      return askedArm;
    }

    var rememberedArm = null;
    try { rememberedArm = localStorage.getItem(key); } catch (e) {}
    if (rememberedArm) {
      if (rememberedArm !== fallback) stuckArms.push(name + '=' + rememberedArm);
      return rememberedArm;
    }

    return fallback;
  };

  /* The remembered arm, without asking for one. proto-bar.js reads this to show
     what is actually active: going through protoVariant would both write and
     count the arm as "stuck", neither of which is true of merely rendering a row.
     Keeping the storage key in one file also stops the bar from hardcoding it. */
  window.protoVariantStored = function (name) {
    try { return localStorage.getItem(VARIANT_KEY_PREFIX + name); } catch (e) { return null; }
  };

  /* Record (or forget) an arm that no URL param asked for. Pages use it to
     normalise what gets remembered: a legacy alias or a typo'd value would
     otherwise stick in localStorage and leave the bar showing "— none —" while
     the page renders something else. */
  window.protoVariantSet = function (name, value) {
    try {
      if (value) localStorage.setItem(VARIANT_KEY_PREFIX + name, value);
      else localStorage.removeItem(VARIANT_KEY_PREFIX + name);
    } catch (e) {}
  };

  /* A remembered arm outlives the session that set it, same trap as test mode,
     so log the exit route. Deferred to window load, not a microtask: pages ask
     for their arm from inline script or from DOMContentLoaded, both of which
     run long after this file, so anything earlier would report an empty list.
     One line covers every initiative the page asked about. */
  window.addEventListener('load', function () {
    if (!stuckArms.length || !window.console || !console.info) return;
    console.info(
      '[proto] Non-default initiative arm active and remembered across pages: ' +
      stuckArms.join(', ') + '\n' +
      '        Add ?<initiative>=<arm> to any URL to change it, or use the proto bar.'
    );
    stuckArms = [];
  });

  if (mode === 'test') {
    /* Safety net for anything that forgets the !protoDev check. Injected into
       <head> before body parsing so panels never flash into view. */
    var style = document.createElement('style');
    style.id = 'proto-mode-style';
    style.textContent = '[data-proto-dev]{display:none !important}';
    document.head.appendChild(style);

    if (window.console && console.info) {
      console.info(
        '[proto] Test mode: prototype tooling is hidden and this sticks across pages.\n' +
        '        Add ?mode=dev to any URL to restore it.'
      );
    }
  }
}());
