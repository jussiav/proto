/**
 * Proto bar — the single control surface for the prototype's own tooling.
 *
 * Replaces the per-page scenario drawers, the delivery-variant switcher and the
 * footer "Prototype instructions" link. Those were inconsistent between pages,
 * and on photos.html the drawer was the only reason that funnel page had a
 * footer at all.
 *
 * Deliberately styled like a browser/OS chrome bar — grey, system font, native
 * <select> controls — so it reads as tooling wrapped AROUND the prototype and
 * never as part of the AutoVex UI. Native selects also mean no custom dropdown
 * code, and they stay keyboard accessible for free.
 *
 * Visible in dev mode only. In test mode nothing renders at all.
 * Present on EVERY page, including ones with no scenarios, so the current mode
 * is always legible.
 *
 * ── A page declares what it offers ──────────────────────────────────────────
 * Set window.protoPage before DOMContentLoaded. All fields optional:
 *
 *   window.protoPage = {
 *     scenarios: [ { group: 'Drafts', items: [ { id, label } ] } ],  // or flat
 *     scenarioParam: 'scenario',   // default
 *     initiatives: [ { slug, default, variants: [ { id, label } ] } ],
 *     fields:    [ { key, label, placeholder, width, keepEmpty } ],  // URL overrides
 *     actions:   [ { label, title, run } ],                          // state mutations
 *     fieldsLabel: 'Auction — dealerships', actionsLabel: 'Dealer response',
 *   };
 *
 * ── The bar's fixed slots ──────────────────────────────────────────────────
 * Prototype · Mode · Scenario · Variants · Seed car · Events · Reset · Go to.
 * No page adds a button of its own: its fields and actions become sections of
 * the Events popover, headed by fieldsLabel / actionsLabel. Events = what
 * happened to the ad since the seller submitted it (AutoVex review, the
 * auction, dealer responses, market data, system events); Seed car = what the
 * seller entered. A closed popover says when something is set: the button
 * takes the dark chip styling and a count, with the values in its tooltip.
 *
 * Scenario = which state of the world (a real seller could be in it).
 * Variant   = which design candidate (exists only because we are proposing it).
 * Keeping them on separate rows keeps that distinction visible.
 *
 * ── Variants: one select per initiative ───────────────────────────────────
 * Each initiative remembers its own arm (proto-mode.js), so several can be in
 * force at once. The Variants popover lists this page's initiatives, each with
 * its own select, then any initiative in force on another page (switchable back
 * to production from here), then "All to production". Changing one initiative
 * leaves the others alone; choosing the page's default forgets the arm.
 *
 * A page declares only what is ITS business — which initiative, which arms, and
 * what it renders unasked:
 *
 *   initiatives: [{
 *     slug:    'seller-intent', // the identity; name + spec come from the registry
 *     default: 'v2',         // what this page renders with no param
 *     variants: [ { id: 'control', label: 'Control — current design' }, … ]
 *   }]
 *
 * The name, the spec path and which arm equals production live once, in
 * proto-mode.js's INITIATIVES registry. See CLAUDE.md, "Initiatives".
 *
 * When an arm is promoted to the default, delete the losing arms AND the page's
 * declaration; the option group disappears and the spec page is marked
 * completed. See CLAUDE.md, "Initiative lifecycle".
 */
(function () {
  if (!window.protoDev) return;   // test mode: no tooling at all

  /* Resolve the proto root from this script's own URL rather than guessing from
     the path. A bare "index.html" link would otherwise resolve relative to the
     current directory and break on design-specs/ pages, and assuming "/" would
     break wherever the proto is served under a subpath (GitHub Pages project
     sites). currentScript is only readable during initial execution. */
  var ROOT = (function () {
    var el = document.currentScript;
    var src = el && el.src;
    return src ? src.replace(/[^/]*$/, '') : '';
  }());

  var BAR_H = 30;

  var PAGES = [
    { href: 'index.html',     label: 'Front page' },
    { href: 'details.html',   label: 'Funnel · Details' },
    { href: 'services.html',  label: 'Funnel · Services' },
    { href: 'photos.html',    label: 'Funnel · Photos' },
    { href: 'price.html',     label: 'Funnel · Price' },
    { href: 'contact.html',   label: 'Funnel · Contact' },
    { href: 'success.html',   label: 'Funnel · Success' },
    { href: 'offers.html',    label: 'Offers' },
    { href: 'decision.html',  label: 'Decision' },
    { href: 'dac7.html',      label: 'DAC7' },
    { href: 'help.html',      label: 'Support' },
    { href: 'emails.html',    label: 'Transactional emails' },
    { href: 'components.html', label: 'Component gallery' }
  ];

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var cfg = window.protoPage || {};
    var params = new URLSearchParams(window.location.search);
    var file = (window.location.pathname.split('/').pop() || 'index.html');   // marks "(here)" in Go to

    /* ── styles ── */
    var css = document.createElement('style');
    css.textContent = [
      '#proto-bar{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;',
      '  font:12px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;',
      '  background:#f1f1f2;border-top:1px solid #d3d3d6;color:#3c3c43;',
      '  display:flex;align-items:center;gap:10px;padding:0 10px;height:' + BAR_H + 'px;',
      '  box-sizing:border-box;box-shadow:0 -1px 3px rgba(0,0,0,.05);',
      /* The bar carries a dozen controls and a phone is 375px wide, so it scrolls
         sideways rather than squashing or wrapping. The scrollbar itself is
         hidden: at 30px tall it would eat half the bar, and a touch device does
         not draw one anyway. */
      '  overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;',
      '  scrollbar-width:none;-ms-overflow-style:none;}',
      '#proto-bar::-webkit-scrollbar{display:none;}',
      /* Nothing shrinks — a squeezed row is what made the bar unusable narrow. */
      '#proto-bar > *{flex:0 0 auto;}',
      '#proto-bar *{font:inherit;box-sizing:border-box;}',
      '#proto-bar .pb-chip{display:inline-flex;align-items:center;gap:4px;padding:1px 6px;border-radius:3px;',
      '  background:#4a4a4f;color:#fff;font-size:10px;font-weight:600;letter-spacing:.04em;}',
      '#proto-bar label{display:inline-flex;align-items:center;gap:5px;color:#6b6b70;white-space:nowrap;}',
      '#proto-bar select{height:20px;max-width:230px;padding:0 4px;border:1px solid #c3c3c7;border-radius:3px;',
      '  background:#fff;color:#1d1d20;}',
      '#proto-bar select:disabled{background:#e9e9eb;color:#a0a0a5;}',
      '#proto-bar .pb-input{height:20px;width:74px;padding:0 4px;border:1px solid #c3c3c7;',
      '  border-radius:3px;background:#fff;color:#1d1d20;}',
      '#proto-bar .pb-spacer{flex:1 1 auto;}',
      '#proto-bar button{height:20px;padding:0 7px;border:1px solid #c3c3c7;border-radius:3px;',
      '  background:#fff;color:#1d1d20;cursor:pointer;}',
      '#proto-bar button:hover{background:#e9e9eb;}',
      /* An override is in force behind a closed panel — same chip colour as the
         Prototype badge, so "something is set" reads at a glance. */
      '#proto-bar button.pb-on{background:#4a4a4f;border-color:#4a4a4f;color:#fff;}',
      '#proto-bar button.pb-on:hover{background:#5a5a60;}',
      '#proto-bar .pb-tools{position:relative;display:inline-flex;}',
      /* FIXED, not absolute: the bar is a horizontal scroller now, and an
         absolutely positioned panel inside one is clipped by it — `overflow-x`
         forces the other axis to compute as `auto` too. Fixed escapes any
         ancestor's overflow (the bar sets no transform), so the panel is placed
         by JS at open time instead. Also keeps it inside the viewport on a phone,
         where a 300px panel hanging off a button near the right edge would
         otherwise run off-screen. */
      '#proto-bar .pb-panel{position:fixed;left:0;bottom:' + (BAR_H + 6) + 'px;min-width:300px;',
      '  max-width:calc(100vw - 16px);max-height:calc(100vh - ' + (BAR_H + 22) + 'px);overflow-y:auto;',
      '  padding:9px 10px 10px;background:#f1f1f2;border:1px solid #d3d3d6;border-radius:4px;',
      '  box-shadow:0 2px 10px rgba(0,0,0,.18);display:none;flex-direction:column;gap:9px;',
      '  text-align:left;cursor:default;}',
      '#proto-bar .pb-panel[data-open]{display:flex;}',
      '#proto-bar .pb-panel h4{margin:0 0 5px;font-size:10px;font-weight:600;letter-spacing:.05em;',
      '  text-transform:uppercase;color:#8a8a90;}',
      '#proto-bar .pb-panel .pb-row{display:flex;align-items:flex-end;gap:6px;flex-wrap:wrap;}',
      /* Apply gets its own right-aligned line. Sitting it after the inputs put it
         beside whichever field happened to wrap, which read as an accident. */
      '#proto-bar .pb-panel .pb-apply{display:flex;justify-content:flex-end;margin-top:6px;}',
      '#proto-bar .pb-panel .pb-stack{display:flex;flex-direction:column;gap:4px;}',
      '#proto-bar .pb-panel .pb-stack button{width:100%;text-align:left;}',
      '#proto-bar .pb-field{display:flex;flex-direction:column;gap:2px;}',
      '#proto-bar .pb-field > span{color:#6b6b70;font-size:10px;}',
      /* Fields stacked in a popover (Variants, Seed car) span the panel: the
         bar-wide label rule would otherwise centre their captions. */
      '#proto-bar .pb-stack .pb-field{align-items:stretch;}',
      'body.proto-bar-on{padding-bottom:' + BAR_H + 'px;}',

      /* ── Narrow screens ──────────────────────────────────────────────────
         Sideways scrolling keeps every control reachable, but a phone shows
         about two of them at a time and the rest have to be hunted for. Below
         620px (prod's own `sm`) the bar collapses to the Prototype chip and
         opens downwards into a stacked list, one control per row. The page
         keeps its 30px of padding either way — the open bar overlays the page
         rather than reflowing it, so opening the bar never moves the thing the
         tester was looking at. */
      '#proto-bar.pb-mobile{flex-wrap:wrap;overflow-x:hidden;}',
      '#proto-bar.pb-mobile .pb-chip{cursor:pointer;user-select:none;}',
      '#proto-bar.pb-mobile .pb-chip::after{content:"\\25B8";margin-left:4px;font-size:9px;}',
      '#proto-bar.pb-mobile.is-open .pb-chip::after{content:"\\25BE";}',
      /* Collapsed: the chip alone, at the bar's normal height. */
      '#proto-bar.pb-mobile:not(.is-open) > *:not(.pb-chip){display:none;}',
      /* Open: a column. Capped and scrollable, since the Go to row must stay
         reachable on a short screen in landscape. */
      '#proto-bar.pb-mobile.is-open{height:auto;max-height:70vh;overflow-y:auto;',
      '  align-items:stretch;padding:8px 10px;gap:8px;}',
      '#proto-bar.pb-mobile.is-open > *{flex:0 0 100%;}',
      '#proto-bar.pb-mobile.is-open .pb-chip{align-self:flex-start;flex:0 0 auto;}',
      '#proto-bar.pb-mobile.is-open label{width:100%;justify-content:space-between;}',
      '#proto-bar.pb-mobile.is-open select{flex:1 1 auto;max-width:none;min-width:0;margin-left:8px;}',
      '#proto-bar.pb-mobile.is-open .pb-tools,',
      '#proto-bar.pb-mobile.is-open .pb-tools > button{width:100%;}',
      '#proto-bar.pb-mobile .pb-spacer{display:none;}'
    ].join('');
    document.head.appendChild(css);

    /* ── helpers ── */
    /* null/undefined removes the param; anything else is set, EMPTY STRING
       INCLUDED. A falsy test here would delete `second=`, which is how
       decision.html spells "force a single offer" — so the keepEmpty fields
       documented below could never actually survive an Apply. Every caller
       already passes null to clear, so nothing relies on '' meaning delete. */
    function withParams(changes) {
      var p = new URLSearchParams(window.location.search);
      Object.keys(changes).forEach(function (k) {
        var v = changes[k];
        if (v === null || v === undefined) p.delete(k); else p.set(k, v);
      });
      var q = p.toString();
      return window.location.pathname + (q ? '?' + q : '');
    }
    function withParam(key, value) {
      var c = {}; c[key] = value; return withParams(c);
    }
    function groupsOf(list) {
      if (!list || !list.length) return [];
      return ('items' in list[0]) ? list : [{ group: null, items: list }];
    }
    /* An item may carry `params` to set alongside the main one — success.html
       needs scenario= and copy= together for the review-call timing states.
       Options are keyed by index so two items can share an id. */
    function buildSelect(list, param, currentValue, noneLabel, extraKeys) {
      var sel = document.createElement('select');
      var flat = [];
      var groups = groupsOf(list);
      var none = document.createElement('option');
      none.value = ''; none.textContent = noneLabel;
      sel.appendChild(none);
      groups.forEach(function (g) {
        var target = sel;
        if (g.group) {
          target = document.createElement('optgroup');
          target.label = g.group;
          sel.appendChild(target);
        }
        (g.items || []).forEach(function (it) {
          var o = document.createElement('option');
          o.value = String(flat.length);
          o.textContent = it.label || it.id;
          flat.push(it);
          target.appendChild(o);
        });
      });

      /* Select the option matching the current URL, including extra params, so
         the browser marks it — that check is the only "you are here" cue. */
      var chosen = '';
      flat.forEach(function (it, i) {
        if (String(it.id) !== String(currentValue)) return;
        var ok = (it.params || extraKeys) ? true : true;
        (extraKeys || []).forEach(function (k) {
          var want = (it.params || {})[k] || '';
          var have = params.get(k) || '';
          if (want !== have) ok = false;
        });
        if (ok && chosen === '') chosen = String(i);
      });
      sel.value = chosen;

      sel.addEventListener('change', function () {
        if (sel.value === '') {
          var clear = {}; clear[param] = null;
          (extraKeys || []).forEach(function (k) { clear[k] = null; });
          window.location.href = withParams(clear);
          return;
        }
        var it = flat[Number(sel.value)];
        var changes = {};
        changes[param] = it.id;
        /* Clear any extra key this option does not set, so switching away from
           a state that used it does not leave a stale param behind. */
        (extraKeys || []).forEach(function (k) { changes[k] = (it.params || {})[k] || null; });
        window.location.href = withParams(changes);
      });
      return sel;
    }

    /* One popover, used by every control that needs one — the page's own tooling
       and Seed car both go through this, so they open, close and read the same.
       Returns { wrap, button, panel, setOpen }; the caller fills the panel.
       Closes on outside click and on Escape. */
    function makePopover(label, title) {
      var wrap = document.createElement('span');
      wrap.className = 'pb-tools';

      var panel = document.createElement('div');
      panel.className = 'pb-panel';
      panel.setAttribute('role', 'group');

      var button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-expanded', 'false');
      button.textContent = label + ' \u25BE';
      if (title) button.title = title;

      /* The panel is `position:fixed`, so its left edge is set here rather than
         inherited from the button: aligned to the button, then clamped into the
         viewport so it cannot hang off either edge on a narrow screen. */
      function place() {
        if (!panel.hasAttribute('data-open')) return;
        var b = button.getBoundingClientRect();
        var w = panel.offsetWidth;
        var left = Math.min(b.left, window.innerWidth - w - 8);
        panel.style.left = Math.max(8, left) + 'px';
        /* Sit above the BUTTON rather than above the bar: once the bar opens
           into a column its rows are at different heights, and a panel pinned
           to the bar's own top edge would cover the control that opened it. */
        panel.style.bottom = Math.max(8, window.innerHeight - b.top + 6) + 'px';
      }

      function setOpen(open) {
        if (open) panel.setAttribute('data-open', ''); else panel.removeAttribute('data-open');
        button.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) place();
      }
      /* Follow the button when the bar is scrolled sideways or the window
         resizes; both move the anchor without closing the panel. */
      window.addEventListener('resize', place);
      document.addEventListener('scroll', place, true);
      button.addEventListener('click', function () { setOpen(!panel.hasAttribute('data-open')); });
      document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) setOpen(false); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panel.hasAttribute('data-open')) { setOpen(false); button.focus(); }
      });

      wrap.appendChild(button);
      wrap.appendChild(panel);
      return { wrap: wrap, button: button, panel: panel, setOpen: setOpen };
    }

    /* A stack of full-width buttons inside a popover, under a small heading —
       the shape both the Negotiation actions and the Seed car options use. */
    function popoverSection(panel, heading, items) {
      var sec = document.createElement('div');
      var h = document.createElement('h4');
      h.textContent = heading;
      sec.appendChild(h);
      var stack = document.createElement('div');
      stack.className = 'pb-stack';
      items.forEach(function (it) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = it.label;
        if (it.title) b.title = it.title;
        b.addEventListener('click', it.run);
        stack.appendChild(b);
      });
      sec.appendChild(stack);
      panel.appendChild(sec);
      return sec;
    }

    /* ── the bar ── */
    var bar = document.createElement('div');
    bar.id = 'proto-bar';
    bar.setAttribute('data-proto-dev', '');

    var chip = document.createElement('span');
    chip.className = 'pb-chip';
    chip.textContent = 'Prototype';
    chip.title = 'Prototype tooling — not part of the product UI';
    bar.appendChild(chip);

    /* Narrow screens: the chip is the bar's own open/close control. It stays a
       plain chip above 620px, where the row fits and there is nothing to
       toggle. The open state is remembered so switching scenario — which
       navigates — does not close the bar the tester is working in. */
    var MOBILE_MQ  = window.matchMedia('(max-width: 619px)');
    var OPEN_KEY   = 'autovex_proto_bar_open';
    var barOpen    = false;
    try { barOpen = localStorage.getItem(OPEN_KEY) === '1'; } catch (e) {}

    function syncBarOpen() {
      bar.classList.toggle('is-open', barOpen);
      chip.setAttribute('aria-expanded', barOpen ? 'true' : 'false');
      chip.title = MOBILE_MQ.matches
        ? (barOpen ? 'Hide the prototype controls' : 'Show the prototype controls')
        : 'Prototype tooling — not part of the product UI';
    }

    function syncBarLayout() {
      var mobile = MOBILE_MQ.matches;
      bar.classList.toggle('pb-mobile', mobile);
      if (mobile) {
        chip.setAttribute('role', 'button');
        chip.setAttribute('tabindex', '0');
      } else {
        chip.removeAttribute('role');
        chip.removeAttribute('tabindex');
        chip.removeAttribute('aria-expanded');
      }
      syncBarOpen();
    }

    function toggleBar() {
      if (!MOBILE_MQ.matches) return;
      barOpen = !barOpen;
      try { localStorage.setItem(OPEN_KEY, barOpen ? '1' : '0'); } catch (e) {}
      syncBarOpen();
    }

    chip.addEventListener('click', toggleBar);
    chip.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleBar(); }
    });
    if (MOBILE_MQ.addEventListener) MOBILE_MQ.addEventListener('change', syncBarLayout);
    else if (MOBILE_MQ.addListener) MOBILE_MQ.addListener(syncBarLayout);
    /* And on resize, because the media query's own change event does not always
       arrive when the viewport is resized by tooling rather than by the user —
       leaving the bar stuck in its phone layout on a desktop-width window.
       Toggling to the value it already has costs nothing. */
    window.addEventListener('resize', syncBarLayout);

    /* Mode — who is viewing, and the link to hand a user-test participant.
       The test link starts at the front page so the participant walks the
       whole journey with these variants pinned: `fresh=1` clears the last
       participant's data first (proto-mode.js), then `mode=test`, every
       variant in force, and only the outcomes a participant cannot produce
       themselves (today: a forced Review / No review). Seller answers are not
       carried; the participant gives those. For a link to one specific view,
       copy the browser address instead. */
    var modePop = makePopover(
      'Mode: ' + (window.protoMode === 'test' ? 'Test' : 'Dev'),
      'Dev or test mode, and the link for a user-test participant'
    );
    popoverSection(modePop.panel, 'Mode', [
      { label: (window.protoMode === 'dev' ? '✓ ' : '') + 'Dev — tooling visible',
        run: function () { window.location.href = withParam('mode', 'dev'); } },
      { label: (window.protoMode === 'test' ? '✓ ' : '') + 'Test — tooling hidden, sticks across pages',
        title: 'Exit with ?mode=dev in any URL',
        run: function () { window.location.href = withParam('mode', 'test'); } }
    ]);

    var linkArms = (window.protoInitiatives || []).map(function (reg) {
      var arm = params.get(reg.slug) || (window.protoVariantStored && window.protoVariantStored(reg.slug));
      return arm && String(arm) !== String(reg.prodArm || '') ? { reg: reg, arm: String(arm) } : null;
    }).filter(Boolean);
    var forced = window.PROTO_MOCK && window.PROTO_MOCK.forcedReview && window.PROTO_MOCK.forcedReview();
    var linkParams = new URLSearchParams();
    linkParams.set('fresh', '1');
    linkParams.set('mode', 'test');
    linkArms.forEach(function (x) { linkParams.set(x.reg.slug, x.arm); });
    if (forced) linkParams.set('review', forced === 'review' ? 'yes' : 'no');
    var testLink = ROOT + 'index.html?' + linkParams.toString();

    var tSec = document.createElement('div');
    var tHead = document.createElement('h4');
    tHead.textContent = 'Test link';
    tSec.appendChild(tHead);
    var tInfo = document.createElement('div');
    tInfo.style.cssText = 'display:flex;flex-direction:column;gap:3px;margin-bottom:6px;color:#3c3c43;';
    [
      'Starts at the front page, with a fresh prototype.',
      'Variants: ' + (linkArms.length
        ? linkArms.map(function (x) { return x.reg.name + ' ' + x.arm; }).join(', ')
        : 'none — production'),
      'Review: ' + (forced === 'review' ? 'forced to review' : forced === 'no-review' ? 'forced to no review' : 'from the car the participant enters')
    ].forEach(function (line) {
      var d = document.createElement('div'); d.textContent = line; tInfo.appendChild(d);
    });
    tSec.appendChild(tInfo);
    var tInput = document.createElement('input');
    tInput.type = 'text';
    tInput.readOnly = true;
    tInput.className = 'pb-input';
    tInput.style.width = '100%';
    tInput.value = testLink;
    tInput.addEventListener('focus', function () { tInput.select(); });
    tSec.appendChild(tInput);
    var tStack = document.createElement('div');
    tStack.className = 'pb-stack';
    tStack.style.marginTop = '6px';
    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.textContent = 'Copy test link';
    copyBtn.addEventListener('click', function () {
      function done(ok) {
        copyBtn.textContent = ok ? 'Copied' : 'Copy failed — select the link above';
        setTimeout(function () { copyBtn.textContent = 'Copy test link'; }, 1800);
      }
      function fallback() {
        tInput.focus(); tInput.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        done(ok);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(testLink).then(function () { done(true); }, fallback);
      } else fallback();
    });
    tStack.appendChild(copyBtn);
    tSec.appendChild(tStack);
    modePop.panel.appendChild(tSec);
    bar.appendChild(modePop.wrap);

    /* Language — ONLY on a page that registered a dictionary with proto-i18n.
       It is proto chrome here, not product UI: production's decision page has no
       language switcher, and this exists so the team can read the page in
       English while ideating. The marketing pages and the funnel keep their own
       in-page selector, because there the choice belongs to the seller and the
       bar is hidden in test mode.

       Migrating another page is its dictionary plus its script tag; this row
       appears on its own once `available()` is true, and nothing renders on a
       page that registers nothing. */
    if (window.protoI18n && window.protoI18n.available() && typeof window.setLang === 'function') {
      var langWrap = document.createElement('label');
      langWrap.appendChild(document.createTextNode('Language'));
      var langSel = document.createElement('select');
      window.protoI18n.langs.forEach(function (l) {
        var o = document.createElement('option');
        o.value = l[0]; o.textContent = l[1];
        langSel.appendChild(o);
      });
      langSel.value = (typeof window.getLang === 'function') ? window.getLang() : 'fi';
      /* setLang stores the choice and fires av:langchange, which both the FAQ
         renderer and proto-i18n already listen for — so no reload, and the
         choice follows the tester to the pages that use data-i18n. */
      langSel.addEventListener('change', function () { window.protoI18n.set(langSel.value); });
      langWrap.appendChild(langSel);
      bar.appendChild(langWrap);
    }

    /* Scenario */
    var scWrap = document.createElement('label');
    scWrap.appendChild(document.createTextNode('Scenario'));
    var scParam = cfg.scenarioParam || 'scenario';
    /* scenarioCurrent lets a page report its live state when it is not in the
       URL — the front page's state is localStorage, so after Seed car or Reset
       data the menu must still show what is actually loaded. */
    var scCurrent = params.get(scParam) ||
      (typeof cfg.scenarioCurrent === 'function' ? cfg.scenarioCurrent() : cfg.scenarioCurrent) || null;
    var scSel = cfg.scenarios && cfg.scenarios.length
      ? buildSelect(cfg.scenarios, scParam, scCurrent, '— default —', cfg.scenarioExtraParams)
      : (function () { var s = document.createElement('select'); s.disabled = true;
          var o = document.createElement('option'); o.textContent = 'none on this page';
          s.appendChild(o); return s; }());
    scWrap.appendChild(scSel);
    bar.appendChild(scWrap);

    /* ── Variants — one select per initiative, in one popover ───────────────
       Each initiative remembers its own arm (proto-mode.js), so several can be
       in force at once; the popover shows that rather than hiding it behind a
       single select. Changing one initiative leaves every other one alone. */
    var pageInitiatives = (cfg.initiatives || []).map(function (ini) {
      var reg = (window.protoInitiative && window.protoInitiative(ini.slug)) || null;
      if (!reg && window.console && console.warn) {
        console.warn('[proto] Unregistered initiative slug "' + ini.slug +
                     '" — add it to INITIATIVES in proto-mode.js.');
      }
      return {
        slug:    ini.slug,
        name:    (reg && reg.name) || ini.slug,
        spec:    reg && reg.spec,
        prodArm: reg && reg.prodArm,
        deflt:   ini.default ? String(ini.default) : '',
        arms:    groupsOf(ini.variants || []).reduce(function (all, g) {
                   return all.concat(g.items || []);
                 }, [])
      };
    }).filter(function (ini) { return ini.arms.length; });

    /* The arm actually in force: the URL, then the remembered arm, then the
       page's default — but only values this initiative offers, so a legacy alias
       or a typo cannot select an option that does not exist. */
    function activeArm(ini) {
      var ids = ini.arms.map(function (a) { return String(a.id); });
      var wanted = [params.get(ini.slug),
                    window.protoVariantStored && window.protoVariantStored(ini.slug),
                    ini.deflt];
      for (var i = 0; i < wanted.length; i++) {
        if (wanted[i] && ids.indexOf(String(wanted[i])) !== -1) return String(wanted[i]);
      }
      return ini.deflt;
    }

    /* Arms in force on initiatives this page does not show — picked on another
       page, or by a link. Listed so they are never invisible, and each can be
       switched back to production from here. */
    var elsewhere = (window.protoInitiatives || []).filter(function (reg) {
      var shown = pageInitiatives.some(function (ini) { return ini.slug === reg.slug; });
      if (shown) return false;
      var stored = window.protoVariantStored && window.protoVariantStored(reg.slug);
      var arm = params.get(reg.slug) || stored;
      return arm && String(arm) !== String(reg.prodArm || '');
    });

    var onHere = pageInitiatives.filter(function (ini) { return activeArm(ini) !== ini.deflt; });
    var onCount = onHere.length + elsewhere.length;

    /* Setting an initiative back to what the page renders unasked forgets it,
       so "nothing selected" stays the production state and the URL stays clean. */
    function setArm(slug, arm, deflt) {
      var changes = {};
      if (arm === null || arm === deflt) {
        changes[slug] = null;
        if (window.protoVariantSet) window.protoVariantSet(slug, null);
      } else {
        changes[slug] = arm;
      }
      window.location.href = withParams(changes);
    }

    var vPop = makePopover(
      'Variants' + (onCount ? ' (' + onCount + ' on)' : ''),
      onCount
        ? 'Variants in force: ' + onHere.map(function (ini) { return ini.name + ' ' + activeArm(ini); })
            .concat(elsewhere.map(function (reg) {
              return reg.name + ' ' + (params.get(reg.slug) || window.protoVariantStored(reg.slug));
            })).join(', ')
        : 'Design candidates — nothing selected renders production'
    );
    if (onCount) vPop.button.className = 'pb-on';

    function variantRow(name, title, options, current, onChange) {
      var field = document.createElement('label');
      field.className = 'pb-field';
      var cap = document.createElement('span');
      cap.textContent = name;
      if (title) cap.title = title;
      field.appendChild(cap);
      var sel = document.createElement('select');
      sel.style.maxWidth = 'none';
      options.forEach(function (o) {
        var opt = document.createElement('option');
        opt.value = o.value; opt.textContent = o.label;
        sel.appendChild(opt);
      });
      sel.value = current;
      sel.addEventListener('change', function () { onChange(sel.value); });
      field.appendChild(sel);
      return field;
    }

    if (pageInitiatives.length) {
      var hereSec = document.createElement('div');
      var hereHead = document.createElement('h4');
      hereHead.textContent = 'On this page';
      hereSec.appendChild(hereHead);
      var hereStack = document.createElement('div');
      hereStack.className = 'pb-stack';
      pageInitiatives.forEach(function (ini) {
        hereStack.appendChild(variantRow(
          ini.name,
          ini.spec ? 'Spec: ' + ini.spec : '',
          ini.arms.map(function (a) { return { value: String(a.id), label: a.label || a.id }; }),
          activeArm(ini),
          function (v) { setArm(ini.slug, v, ini.deflt); }
        ));
      });
      hereSec.appendChild(hereStack);
      vPop.panel.appendChild(hereSec);
    }

    if (elsewhere.length) {
      var elseSec = document.createElement('div');
      var elseHead = document.createElement('h4');
      elseHead.textContent = 'In force on other pages';
      elseSec.appendChild(elseHead);
      var elseStack = document.createElement('div');
      elseStack.className = 'pb-stack';
      elsewhere.forEach(function (reg) {
        var arm = String(params.get(reg.slug) || window.protoVariantStored(reg.slug));
        elseStack.appendChild(variantRow(
          reg.name,
          reg.spec ? 'Spec: ' + reg.spec : '',
          [{ value: arm, label: arm }, { value: '', label: 'Off — production' }],
          arm,
          function (v) { setArm(reg.slug, v || null, ''); }
        ));
      });
      elseSec.appendChild(elseStack);
      vPop.panel.appendChild(elseSec);
    }

    if (!pageInitiatives.length && !elsewhere.length) {
      var noneP = document.createElement('div');
      noneP.textContent = 'No variants on this page.';
      noneP.style.color = '#8a8a90';
      vPop.panel.appendChild(noneP);
    }

    if (onCount) {
      popoverSection(vPop.panel, 'Reset variants', [{
        label: 'All to production',
        title: 'Turn every variant off, on every page',
        run: function () {
          var changes = {};
          (window.protoInitiatives || []).forEach(function (reg) {
            changes[reg.slug] = null;
            if (window.protoVariantSet) window.protoVariantSet(reg.slug, null);
          });
          window.location.href = withParams(changes);
        }
      }]);
    }

    bar.appendChild(vPop.wrap);

    /* ── Events — what happened to the ad since the seller submitted it ─────
       One popover on every page, in a fixed slot after Seed car. Sections, in
       the order things happen: Review (AutoVex, built in below), then the
       page's own fields and actions under its fieldsLabel / actionsLabel
       (decision: Auction + Dealer response; offers: Market data; photos:
       System). A page with none still gets the button, so the bar's slots do
       not move between pages.

       fields = URL overrides the page reads at load, applied together on Enter
       or via Apply; an empty value clears the param unless the field declares
       keepEmpty (decision needs "second=" present-but-empty to mean "force a
       single offer"). actions = things that mutate simulated state rather than
       navigate. */
    var hasFields  = !!(cfg.fields && cfg.fields.length);
    var hasActions = !!(cfg.actions && cfg.actions.length);
    var activeFields = hasFields ? cfg.fields.filter(function (f) { return params.has(f.key); }) : [];

    /* Review — AutoVex: whether an advisor has booked the ad for its review
       call ("Seller edits before review" v1). World state the funnel, the
       success page and the offers page all read (store.reviewBooked). On a
       funnel step the change takes effect at the seller's next Jatka, so the
       page is not reloaded there; success and offers reload to show or hide
       their edit button. */
    var BOOKING_PAGES = ['details.html', 'services.html', 'photos.html', 'price.html', 'contact.html', 'success.html', 'offers.html'];
    var BOOKING_RELOADS = ['success.html', 'offers.html'];
    var hasBooking = BOOKING_PAGES.indexOf(file) !== -1 && window.protoVariant &&
        window.protoVariant('seller-edits-before-review', 'control') === 'v1';
    var readFunnelStore = function () { try { return JSON.parse(localStorage.getItem('autovex_funnel') || '{}'); } catch (e) { return {}; } };
    var booked = hasBooking && !!readFunnelStore().reviewBooked;

    var eventsOn = activeFields.length + (booked ? 1 : 0);
    var eventsPop = makePopover(
      'Events' + (eventsOn ? ' (' + eventsOn + ')' : ''),
      eventsOn
        ? 'Events in force: ' + activeFields.map(function (f) {
            var v = params.get(f.key);
            return (f.label || f.key) + ' = ' + (v === '' ? '(empty)' : v);
          }).concat(booked ? ['Advisor has booked the ad'] : []).join(', ')
        : 'What happened to the ad since it was submitted'
    );
    if (eventsOn) eventsPop.button.className = 'pb-on';
    var setPanelOpen = eventsPop.setOpen;
    var panel = eventsPop.panel;

    if (hasBooking) {
      var bookBtn, clearBookBtn;
      var setBooking = function (on) {
        var s = readFunnelStore();
        if (on) s.reviewBooked = true; else delete s.reviewBooked;
        try { localStorage.setItem('autovex_funnel', JSON.stringify(s)); } catch (e) {}
        setPanelOpen(false);
        /* The address carries the state too (proto-mock.js reads ?booked=), so
           the current URL can be sent as it is. */
        var url = withParams({ booked: on ? '1' : '0' });
        if (BOOKING_RELOADS.indexOf(file) !== -1) { window.location.href = url; return; }
        history.replaceState(null, '', url);
        bookBtn.disabled = on;
        clearBookBtn.disabled = !on;
      };
      var revSec = popoverSection(panel, 'Review — AutoVex', [
        { label: 'Advisor books the ad', title: 'An edit in progress ends at the seller\'s next Jatka',
          run: function () { setBooking(true); } },
        { label: 'Clear the booking', run: function () { setBooking(false); } }
      ]);
      var revBtns = revSec.querySelectorAll('button');
      bookBtn = revBtns[0]; clearBookBtn = revBtns[1];
      bookBtn.disabled = booked;
      clearBookBtn.disabled = !booked;
    }

    if (hasFields) {
      var fSec = document.createElement('div');
      var fHead = document.createElement('h4');
      fHead.textContent = cfg.fieldsLabel || 'Overrides';
      fSec.appendChild(fHead);
      var fRow = document.createElement('div');
      fRow.className = 'pb-row';
      var inputs = [];
      cfg.fields.forEach(function (f) {
        var field = document.createElement('label');
        field.className = 'pb-field';
        var cap = document.createElement('span');
        cap.textContent = f.label || f.key;
        field.appendChild(cap);
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'pb-input';
        inp.placeholder = f.placeholder || f.key;
        inp.value = params.get(f.key) || '';
        if (f.width) inp.style.width = f.width;
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') applyFields(); });
        inputs.push({ f: f, el: inp });
        field.appendChild(inp);
        fRow.appendChild(field);
      });
      function applyFields() {
        var changes = {};
        inputs.forEach(function (i) {
          var v = i.el.value.trim();
          changes[i.f.key] = v ? v : (i.f.keepEmpty ? '' : null);
        });
        window.location.href = withParams(changes);
      }
      fSec.appendChild(fRow);
      var applyRow = document.createElement('div');
      applyRow.className = 'pb-apply';
      var applyBtn = document.createElement('button');
      applyBtn.type = 'button';
      applyBtn.textContent = 'Apply';
      applyBtn.title = 'Reload with these values in the URL';
      applyBtn.addEventListener('click', applyFields);
      applyRow.appendChild(applyBtn);
      fSec.appendChild(applyRow);
      panel.appendChild(fSec);
    }

    if (hasActions) {
      /* An action mutates state and re-renders in place, so the panel would
         otherwise stay open over the result it just produced. */
      popoverSection(panel, cfg.actionsLabel || 'Actions', cfg.actions.map(function (a) {
        return { label: a.label, title: a.title, run: function () { setPanelOpen(false); a.run(); } };
      }));
    }

    if (!hasBooking && !hasFields && !hasActions) {
      var noEvents = document.createElement('div');
      noEvents.textContent = 'No events on this page.';
      noEvents.style.color = '#8a8a90';
      panel.appendChild(noEvents);
    }
    var eventsWrap = eventsPop.wrap;

    /* Built-in data actions. Available everywhere PROTO_MOCK is loaded, because
       "show me this page with a car in it" and "give me a clean slate" are
       needed on every page, not per page. */
    if (window.PROTO_MOCK) {
      /* On a mock-driven page (data-proto-mock, i.e. the front page) the
         scenario param IS the mock state, so it has to go — leaving it on meant
         the auto-seed re-applied the old state over the one just written, which
         is what produced the disagreeing combinations. Anywhere else the page
         owns ?scenario= for its own states, so it must survive: seeding a car
         on offers must not throw away which offers scenario you were looking
         at. */
      var mockDrivenPage = document.documentElement.hasAttribute('data-proto-mock');
      function applyMockState(name) {
        window.PROTO_MOCK.seed(name);
        if (!mockDrivenPage) { window.location.reload(); return; }
        var p = new URLSearchParams(window.location.search);
        p.delete(scParam);
        var q = p.toString();
        window.location.href = window.location.pathname + (q ? '?' + q : '');
      }

      /* Seed car: one click for a submitted draft that can enter the auction,
         then the few exceptions a tester varies on it, in funnel order
         (PROTO_MOCK.EXCEPTIONS). Changing a row writes the store, seeding the
         car first if there is none, and reloads with the row's URL param set,
         so the address bar reproduces the state for a shared link. An answer
         that only exists inside an arm switches that arm on; its empty option
         switches it off. */
      var exceptions = window.PROTO_MOCK.EXCEPTIONS || [];
      var fs0 = window.PROTO_MOCK.readFunnel ? window.PROTO_MOCK.readFunnel() : {};
      var hasCar = !!fs0.hero;
      var NEUTRAL = { review: '', photos: 'complete', exclusive: '', loggedin: 'no' };
      var setRows = exceptions.filter(function (ex) {
        return ex.type !== 'number' && (hasCar || !ex.needsCar) && ex.key in NEUTRAL && ex.get(fs0) !== NEUTRAL[ex.key];
      });
      var seedPop = makePopover(
        'Seed car' + (setRows.length ? ' (' + setRows.length + ')' : ''),
        setRows.length
          ? 'Seed car — exceptions set: ' + setRows.map(function (ex) {
              var v = ex.get(fs0);
              var o = (ex.options || []).filter(function (op) { return op.id === v; })[0];
              return ex.label + ' = ' + (o ? o.label : v);
            }).join(', ')
          : 'Fill every funnel field with one click, then vary the exceptions'
      );
      if (setRows.length) seedPop.button.className = 'pb-on';

      popoverSection(seedPop.panel, 'Submitted draft, can enter the auction', [{
        label: 'Seed car',
        title: 'Every funnel field filled, submitted, email not yet verified',
        /* A fresh car: the exception params come off the URL too, or they
           would re-apply on the reload. A forced review outcome is stored on
           its own and stays until it is changed or Reset. */
        run: function () {
          seedPop.setOpen(false);
          window.PROTO_MOCK.seed(window.PROTO_MOCK.SEED_STATE);
          var drop = {};
          exceptions.forEach(function (ex) { drop[ex.param] = null; });
          if (mockDrivenPage) drop[scParam] = null;
          window.location.href = withParams(drop);
        }
      }]);

      function exceptionUrl(ex, value) {
        var changes = {};
        changes[ex.param] = value === '' || value === null ? null : value;
        var arm = window.PROTO_MOCK.answerArm && window.PROTO_MOCK.answerArm(ex);
        if (arm) {
          changes[ex.initiative] = value ? arm : null;
          if (!value && window.protoVariantSet) window.protoVariantSet(ex.initiative, null);
          else if (window.protoVariantSet) window.protoVariantSet(ex.initiative, arm);
        }
        if (mockDrivenPage) changes[scParam] = null;   // the front page's scenario would re-seed over it
        return withParams(changes);
      }

      var exSec = document.createElement('div');
      var exHead = document.createElement('h4');
      exHead.textContent = 'Exceptions';
      exSec.appendChild(exHead);
      var exStack = document.createElement('div');
      exStack.className = 'pb-stack';
      exceptions.forEach(function (ex) {
        var field = document.createElement('label');
        field.className = 'pb-field';
        var cap = document.createElement('span');
        var label = typeof ex.label === 'function' ? ex.label(fs0) : ex.label;
        var reg = ex.initiative && window.protoInitiative && window.protoInitiative(ex.initiative);
        var arm = window.PROTO_MOCK.answerArm && window.PROTO_MOCK.answerArm(ex);
        cap.textContent = label + (reg && arm ? ' · ' + (reg.name === label ? '' : reg.name + ' ') + arm : '');
        if (reg && arm) cap.title = 'Choosing an answer switches ' + reg.name + ' ' + arm + ' on';
        field.appendChild(cap);
        /* No car yet: show what a seed would give (each list's first option),
           since choosing any value seeds the car first. */
        var current = hasCar || !ex.needsCar ? ex.get(fs0) : (ex.options ? ex.options[0].id : '');
        var control;
        if (ex.type === 'number') {
          control = document.createElement('input');
          control.type = 'text';
          control.inputMode = 'numeric';
          control.className = 'pb-input';
          control.style.width = '100%';
          control.placeholder = '12000';
          control.value = current || '';
          control.addEventListener('keydown', function (e) { if (e.key === 'Enter') control.blur(); });
        } else {
          control = document.createElement('select');
          control.style.maxWidth = 'none';
          ex.options.forEach(function (o) {
            var opt = document.createElement('option');
            opt.value = o.id; opt.textContent = o.label;
            control.appendChild(opt);
          });
          control.value = current;
        }
        control.addEventListener('change', function () {
          var v = control.value.trim();
          window.PROTO_MOCK.setException(ex.key, v);
          window.location.href = exceptionUrl(ex, v);
        });
        field.appendChild(control);
        exStack.appendChild(field);
      });
      exSec.appendChild(exStack);
      seedPop.panel.appendChild(exSec);
      bar.appendChild(seedPop.wrap);

      bar.appendChild(eventsWrap);

      /* Reset takes you back to the true initial state: no ad started, every
         variant off, and on the front page, wherever you happened to be. Clearing in place would
         leave you on a mid-funnel or offers page with nothing to render. */
      var clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.textContent = 'Reset';
      clearBtn.title = 'Clear all car details, turn every variant off and return to the front page, no ad started';
      clearBtn.addEventListener('click', function () {
        window.PROTO_MOCK.clear();
        (window.protoInitiatives || []).forEach(function (reg) {
          if (window.protoVariantSet) window.protoVariantSet(reg.slug, null);
        });
        window.location.href = ROOT + 'index.html';
      });
      bar.appendChild(clearBtn);
    }

    if (!eventsWrap.parentNode) bar.appendChild(eventsWrap);   // pages without PROTO_MOCK

    bar.appendChild(Object.assign(document.createElement('span'), { className: 'pb-spacer' }));

    /* Jump to another proto page */
    var goWrap = document.createElement('label');
    goWrap.appendChild(document.createTextNode('Go to'));
    var goSel = document.createElement('select');
    var known = PAGES.some(function (p) { return p.href === file; });
    if (!known) {   // e.g. a design-specs page, which isn't in the list
      var cur = document.createElement('option');
      cur.value = ''; cur.textContent = file;
      goSel.appendChild(cur);
    }
    PAGES.forEach(function (p) {
      var o = document.createElement('option');
      o.value = p.href; o.textContent = p.label;
      goSel.appendChild(o);
    });
    /* Preselect the current page so the browser marks it in the open dropdown —
       the same "you are here" check the Scenario and Variant selects get. */
    goSel.value = known ? file : '';
    goSel.addEventListener('change', function () {
      if (goSel.value && goSel.value !== file) window.location.href = ROOT + goSel.value;
    });
    goWrap.appendChild(goSel);
    bar.appendChild(goWrap);

    /* No scenario-reference button. The old modal dumped every scenario of every
       page into one wall of text; that reference belongs on its own page with
       each scenario collapsible. Pending. */

    document.body.appendChild(bar);
    document.body.classList.add('proto-bar-on');
    syncBarLayout();
  });
}());
