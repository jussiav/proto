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
 *     variants:  [ { id, label } ],
 *     variantParam:  'variant',    // default
 *     fields:    [ { key, label, placeholder, width, keepEmpty } ],  // URL overrides
 *     actions:   [ { label, title, run } ],                          // state mutations
 *   };
 *
 * Scenario = which state of the world (a real seller could be in it).
 * Variant   = which design candidate (exists only because we are proposing it).
 * Keeping them on separate rows keeps that distinction visible.
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
      '  box-sizing:border-box;box-shadow:0 -1px 3px rgba(0,0,0,.05);}',
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
      'body.proto-bar-on{padding-bottom:' + BAR_H + 'px;}'
    ].join('');
    document.head.appendChild(css);

    /* ── helpers ── */
    function withParams(changes) {
      var p = new URLSearchParams(window.location.search);
      Object.keys(changes).forEach(function (k) {
        var v = changes[k];
        if (v) p.set(k, v); else p.delete(k);
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

    /* ── the bar ── */
    var bar = document.createElement('div');
    bar.id = 'proto-bar';
    bar.setAttribute('data-proto-dev', '');

    var chip = document.createElement('span');
    chip.className = 'pb-chip';
    chip.textContent = 'Prototype';
    chip.title = 'Prototype tooling — not part of the product UI';
    bar.appendChild(chip);

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
    var scSel = cfg.scenarios && cfg.scenarios.length
      ? buildSelect(cfg.scenarios, scParam, params.get(scParam), '— default —', cfg.scenarioExtraParams)
      : (function () { var s = document.createElement('select'); s.disabled = true;
          var o = document.createElement('option'); o.textContent = 'none on this page';
          s.appendChild(o); return s; }());
    scWrap.appendChild(scSel);
    bar.appendChild(scWrap);

    /* Variant — only when the page actually offers candidates. variantDefault
       lets a page say what it renders with no param, so the bar shows the truth
       rather than implying a baseline that isn't active (details.html
       defaults to v2, not control). */
    if (cfg.variants && cfg.variants.length) {
      var vWrap = document.createElement('label');
      vWrap.appendChild(document.createTextNode('Variant'));
      var vParam = cfg.variantParam || 'variant';
      var vCurrent = params.get(vParam) || cfg.variantDefault || '';
      vWrap.appendChild(buildSelect(cfg.variants, vParam, vCurrent,
        cfg.variantDefault ? '— none —' : 'prod baseline', cfg.variantExtraParams));
      bar.appendChild(vWrap);
    }

    /* Numeric/text overrides — decision.html drives its offer amounts this way.
       Applied together on Enter or via Apply, since they are read from the URL
       at page load. An empty value clears the param, except where the page has
       declared keepEmpty (decision needs "second=" present-but-empty to mean
       "force a single offer"). */
    if (cfg.fields && cfg.fields.length) {
      var fWrap = document.createElement('label');
      fWrap.appendChild(document.createTextNode(cfg.fieldsLabel || 'Overrides'));
      var inputs = [];
      cfg.fields.forEach(function (f) {
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'pb-input';
        inp.placeholder = f.placeholder || f.label || f.key;
        inp.title = f.label || f.key;
        inp.value = params.get(f.key) || '';
        if (f.width) inp.style.width = f.width;
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') applyFields(); });
        inputs.push({ f: f, el: inp });
        fWrap.appendChild(inp);
      });
      function applyFields() {
        var changes = {};
        inputs.forEach(function (i) {
          var v = i.el.value.trim();
          changes[i.f.key] = v ? v : (i.f.keepEmpty ? '' : null);
        });
        window.location.href = withParams(changes);
      }
      var applyBtn = document.createElement('button');
      applyBtn.type = 'button';
      applyBtn.textContent = 'Apply';
      applyBtn.addEventListener('click', applyFields);
      fWrap.appendChild(applyBtn);
      bar.appendChild(fWrap);
    }

    /* Page-supplied actions — things that mutate simulated state rather than
       navigate, e.g. decision.html's "Simulate dealer reply". */
    if (cfg.actions && cfg.actions.length) {
      cfg.actions.forEach(function (a) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = a.label;
        if (a.title) b.title = a.title;
        b.addEventListener('click', function () { a.run(); });
        bar.appendChild(b);
      });
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
  });
}());
