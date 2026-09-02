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
 *     panelLabel: 'Auction settings',   // names the button they collapse into
 *     fieldsLabel: 'Prices €', actionsLabel: 'Negotiation',   // headings inside it
 *   };
 *
 * ── fields and actions live in ONE popover, not on the bar ──────────────────
 * Both used to render inline, so decision.html alone put three text inputs, an
 * Apply and three buttons on the strip — more controls than the rest of the bar
 * put together, and each one only meaningful on that page. They now collapse
 * into a single button named by panelLabel, so page-specific tooling costs one
 * slot however much of it a page declares.
 *
 * Collapsing hides state, so the button says when an override is in force: it
 * takes the dark chip styling and a count, with the values in its tooltip.
 * Otherwise a hand-written ?asking= would be invisible behind a closed panel.
 *
 * Scenario = which state of the world (a real seller could be in it).
 * Variant   = which design candidate (exists only because we are proposing it).
 * Keeping them on separate rows keeps that distinction visible.
 *
 * ── One Variants row, grouped by initiative ────────────────────────────────
 * Every variant exists because some initiative proposes it, so the Variants
 * select groups its options under the initiative's name — the same shape the
 * Scenario row already uses for grouped states. One row scales as initiatives
 * accumulate, where a row per initiative would push the bar off the screen; and
 * grouping keeps each arm traceable, which a flat "Variant 1 / Variant 2 / …"
 * list from several initiatives could never be.
 *
 * A page declares only what is ITS business — which initiative, which arms, and
 * what it renders unasked:
 *
 *   initiatives: [{
 *     slug:    'delivery',   // the identity; name + spec come from the registry
 *     default: 'v2',         // what this page renders with no param
 *     variants: [ { id: 'control', label: 'Control — current design' }, … ]
 *   }]
 *
 * The name, the spec path and which arm equals production live once, in
 * proto-mode.js's INITIATIVES registry. See CLAUDE.md, "Initiatives".
 *
 * ── One variant at a time ──────────────────────────────────────────────────
 * Selecting an arm clears every OTHER initiative, remembered arms included, and
 * the default option clears them all: no selection means every page renders what
 * it renders unasked, which is production wherever the page's default is the
 * registry's prodArm. That is what a user-test participant must land in, and it
 * is the state the bar returns to in one click. Combinations remain reachable by
 * hand-writing the params; the row then says so rather than picking one arm and
 * implying the rest are off.
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

    /* Mode */
    var modeWrap = document.createElement('label');
    modeWrap.appendChild(document.createTextNode('Mode'));
    var modeSel = document.createElement('select');
    [['dev', 'Dev — tooling visible'], ['test', 'Test — tooling hidden']].forEach(function (m) {
      var o = document.createElement('option');
      o.value = m[0]; o.textContent = m[1];
      modeSel.appendChild(o);
    });
    modeSel.value = window.protoMode;
    modeSel.addEventListener('change', function () {
      window.location.href = withParam('mode', modeSel.value);
    });
    modeWrap.appendChild(modeSel);
    bar.appendChild(modeWrap);

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

    /* ── Variants — one row for the page, grouped by initiative ──────────── */
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

    /* The row is always here, disabled when the page proposes nothing — same as
       the Scenario row. A row that vanishes makes "no variants on this page" look
       identical to "the bar is missing something". */
    var vWrap = document.createElement('label');
    vWrap.appendChild(document.createTextNode('Variants'));

    /* Arms in force on initiatives this page does not show — a hand-written URL,
       or an arm picked on another page. Computed BEFORE the branch below, because
       a page that proposes nothing of its own is exactly where a remembered arm
       is most invisible: the row used to read "none on this page" while another
       initiative was still pinned for the whole prototype. Listed disabled, with
       a working "— none —" above it, so the state can at least be cleared from
       any page. */
    var elsewhere = (window.protoInitiatives || []).filter(function (reg) {
      var shown = pageInitiatives.some(function (ini) { return ini.slug === reg.slug; });
      if (shown) return false;
      var stored = window.protoVariantStored && window.protoVariantStored(reg.slug);
      var arm = params.get(reg.slug) || stored;
      return arm && String(arm) !== String(reg.prodArm || '');
    });

    if (!pageInitiatives.length && !elsewhere.length) {
      var emptySel = document.createElement('select');
      emptySel.disabled = true;
      var emptyOpt = document.createElement('option');
      emptyOpt.textContent = 'none on this page';
      emptySel.appendChild(emptyOpt);
      vWrap.appendChild(emptySel);
      bar.appendChild(vWrap);
    } else {
      var vSel = document.createElement('select');
      var armOptions = [];   // { ini, arm }, indexed by option value

      /* With nothing selected each initiative renders its own default. That is
         production only when every default IS the production arm, which is the
         rule today but not a guarantee — an initiative may default to a candidate
         while it is being demoed — so the label states which it is rather than
         promising production everywhere. */
      var allProd = pageInitiatives.every(function (ini) {
        return !ini.deflt || !ini.prodArm || ini.deflt === String(ini.prodArm);
      });
      var noneOpt = document.createElement('option');
      noneOpt.value = '';
      noneOpt.textContent = allProd ? '— none — production behaviour' : '— none — page defaults';
      vSel.appendChild(noneOpt);

      pageInitiatives.forEach(function (ini) {
        var group = document.createElement('optgroup');
        group.label = ini.name;
        if (ini.spec) group.title = ini.name + ' — spec: ' + ini.spec;
        ini.arms.forEach(function (arm) {
          var o = document.createElement('option');
          o.value = String(armOptions.length);
          o.textContent = arm.label || arm.id;
          armOptions.push({ ini: ini, arm: arm });
          group.appendChild(o);
        });
        vSel.appendChild(group);
      });

      /* Picking anything in this row clears them, including from a page that
         shows no initiative of its own. */
      if (elsewhere.length) {
        var elseGroup = document.createElement('optgroup');
        elseGroup.label = 'Active on other pages';
        elsewhere.forEach(function (reg) {
          var arm = params.get(reg.slug) || window.protoVariantStored(reg.slug);
          var o = document.createElement('option');
          o.disabled = true;
          o.textContent = reg.name + ': ' + arm;
          elseGroup.appendChild(o);
        });
        vSel.appendChild(elseGroup);
      }

      /* One select cannot show two arms at once, and it cannot show an arm that
         belongs to another page at all. Either way it says what is going on
         rather than sitting on "none" while something is live, or naming one arm
         and implying the rest are off. */
      var offDefault = pageInitiatives.filter(function (ini) { return activeArm(ini) !== ini.deflt; });
      var offTotal = offDefault.length + elsewhere.length;
      if (offTotal > 1 || (offTotal === 1 && !offDefault.length)) {
        var mixed = document.createElement('option');
        mixed.value = 'mixed';
        mixed.textContent = offTotal > 1
          ? 'Mixed — ' + offTotal + ' initiatives off default'
          : 'Off default on another page — ' + elsewhere[0].name;
        vSel.insertBefore(mixed, noneOpt.nextSibling);
        vSel.value = 'mixed';
      } else if (offDefault.length === 1) {
        var live = activeArm(offDefault[0]);
        armOptions.forEach(function (opt, i) {
          if (opt.ini === offDefault[0] && String(opt.arm.id) === live) vSel.value = String(i);
        });
      } else {
        vSel.value = '';
      }

      vSel.addEventListener('change', function () {
        if (vSel.value === 'mixed') return;   // not a state you can navigate INTO
        var chosen = vSel.value === '' ? null : armOptions[Number(vSel.value)];
        var changes = {};
        /* Every registered initiative, not just this page's: an arm picked three
           steps ago is still in force, and "one variant at a time" has to mean
           the whole prototype, not the current page. Clearing the param is not
           enough — arms are remembered — so each one is forgotten too. */
        (window.protoInitiatives || []).forEach(function (reg) {
          var keep = chosen && chosen.ini.slug === reg.slug;
          changes[reg.slug] = keep ? String(chosen.arm.id) : null;
          if (!keep && window.protoVariantSet) window.protoVariantSet(reg.slug, null);
        });
        window.location.href = withParams(changes);
      });

      vWrap.appendChild(vSel);
      bar.appendChild(vWrap);
    }

    /* ── One popover for everything page-specific ────────────────────────────
       fields = URL overrides the page reads at load (decision.html's offer
       amounts), applied together on Enter or via Apply; an empty value clears
       the param unless the field declares keepEmpty (decision needs "second="
       present-but-empty to mean "force a single offer").
       actions = things that mutate simulated state rather than navigate, e.g.
       "Simulate dealer reply".

       They share one button because they are one thought — "set this page's
       situation up" — and because inline they crowded out the rows that are on
       every page. */
    var hasFields  = !!(cfg.fields && cfg.fields.length);
    var hasActions = !!(cfg.actions && cfg.actions.length);

    if (hasFields || hasActions) {
      /* Which overrides are actually set, named in the tooltip so a closed panel
         cannot hide them. keepEmpty fields count when present-but-empty — that
         IS their meaning. */
      var activeFields = hasFields ? cfg.fields.filter(function (f) { return params.has(f.key); }) : [];
      var panelName = cfg.panelLabel || 'Page tools';
      var toolsPop = makePopover(
        panelName + (activeFields.length ? ' (' + activeFields.length + ')' : ''),
        activeFields.length
          ? panelName + ' — in force: ' + activeFields.map(function (f) {
              var v = params.get(f.key);
              return (f.label || f.key) + ' = ' + (v === '' ? '(empty)' : v);
            }).join(', ')
          : (cfg.panelTitle || (panelName + ' — set this page up'))
      );
      var tools   = toolsPop.wrap;
      var panel   = toolsPop.panel;
      var setPanelOpen = toolsPop.setOpen;
      if (activeFields.length) toolsPop.button.className = 'pb-on';

      if (hasFields) {
        var fSec = document.createElement('div');
        var fHead = document.createElement('h4');
        fHead.textContent = cfg.fieldsLabel || 'Overrides';
        fSec.appendChild(fHead);
        var fRow = document.createElement('div');
        fRow.className = 'pb-row';
        var inputs = [];
        cfg.fields.forEach(function (f) {
          /* Real labels rather than the bar's cryptic placeholders — the panel
             has the room the strip never had. */
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
        var aSec = document.createElement('div');
        var aHead = document.createElement('h4');
        aHead.textContent = cfg.actionsLabel || 'Actions';
        aSec.appendChild(aHead);
        var aStack = document.createElement('div');
        aStack.className = 'pb-stack';
        cfg.actions.forEach(function (a) {
          var b = document.createElement('button');
          b.type = 'button';
          b.textContent = a.label;
          if (a.title) b.title = a.title;
          /* An action mutates state and re-renders in place, so the panel would
             otherwise stay open over the result it just produced. */
          b.addEventListener('click', function () { setPanelOpen(false); a.run(); });
          aStack.appendChild(b);
        });
        aSec.appendChild(aStack);
        panel.appendChild(aSec);
      }

      bar.appendChild(tools);
    }

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

      /* Seed car offers a choice, through the same popover the page's own tooling
         uses. Both seeds fill every funnel field on a submitted, unverified
         draft; they differ only in mileage, which is what decides whether the
         seller is review-called — so the two options are the two halves of
         Review/No review, reachable in one click each rather than by walking the
         funnel twice with different numbers.

         Falls back to a plain button if PROTO_MOCK declares no options, so an
         older mock file still works. */
      var seedOptions = window.PROTO_MOCK.SEED_OPTIONS;
      if (seedOptions && seedOptions.length) {
        var seedPop = makePopover('Seed car', 'Fill every funnel field — pick the review outcome');
        popoverSection(seedPop.panel, 'Submitted draft, email not verified',
          seedOptions.map(function (o) {
            return {
              label: o.label,
              title: o.title,
              /* Close before seeding: seeding navigates, and a panel left open
                 over a page that is about to reload reads as a hung click. */
              run: function () { seedPop.setOpen(false); applyMockState(o.state); }
            };
          }));
        bar.appendChild(seedPop.wrap);
      } else {
        var seedBtn = document.createElement('button');
        seedBtn.type = 'button';
        seedBtn.textContent = 'Seed car';
        seedBtn.title = 'Fill every funnel field — submitted, email not yet verified';
        seedBtn.addEventListener('click', function () {
          applyMockState(window.PROTO_MOCK.SEED_STATE);
        });
        bar.appendChild(seedBtn);
      }

      /* Reset takes you back to the true initial state: no ad started, and on
         the front page, wherever you happened to be. Clearing in place would
         leave you on a mid-funnel or offers page with nothing to render. */
      var clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.textContent = 'Reset prototype';
      clearBtn.title = 'Clear all car details and return to the front page, no ad started';
      clearBtn.addEventListener('click', function () {
        window.PROTO_MOCK.clear();
        window.location.href = ROOT + 'index.html';
      });
      bar.appendChild(clearBtn);
    }

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
