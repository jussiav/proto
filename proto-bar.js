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
 *   };
 *
 * Scenario = which state of the world (a real seller could be in it).
 * Variant   = which design candidate (exists only because we are proposing it).
 * Keeping them on separate rows keeps that distinction visible.
 */
(function () {
  if (!window.protoDev) return;   // test mode: no tooling at all

  var BAR_H = 30;
  var COLLAPSE_KEY = 'autovex_proto_bar_collapsed';

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
    var file = (window.location.pathname.split('/').pop() || 'index.html');
    var collapsed = false;
    try { collapsed = localStorage.getItem(COLLAPSE_KEY) === '1'; } catch (e) {}

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
      '#proto-bar .pb-file{color:#6b6b70;white-space:nowrap;}',
      '#proto-bar label{display:inline-flex;align-items:center;gap:5px;color:#6b6b70;white-space:nowrap;}',
      '#proto-bar select{height:20px;max-width:230px;padding:0 4px;border:1px solid #c3c3c7;border-radius:3px;',
      '  background:#fff;color:#1d1d20;}',
      '#proto-bar select:disabled{background:#e9e9eb;color:#a0a0a5;}',
      '#proto-bar .pb-spacer{flex:1 1 auto;}',
      '#proto-bar button{height:20px;padding:0 7px;border:1px solid #c3c3c7;border-radius:3px;',
      '  background:#fff;color:#1d1d20;cursor:pointer;}',
      '#proto-bar button:hover{background:#e9e9eb;}',
      /* Collapsed: a small tab in the corner, out of the way. */
      '#proto-bar-tab{position:fixed;right:8px;bottom:8px;z-index:2147483000;',
      '  font:11px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;',
      '  background:#4a4a4f;color:#fff;border:none;border-radius:3px;padding:5px 8px;',
      '  cursor:pointer;opacity:.55;}',
      '#proto-bar-tab:hover{opacity:1;}',
      'body.proto-bar-on{padding-bottom:' + BAR_H + 'px;}'
    ].join('');
    document.head.appendChild(css);

    /* ── helpers ── */
    function withParam(key, value) {
      var p = new URLSearchParams(window.location.search);
      if (value) p.set(key, value); else p.delete(key);
      var q = p.toString();
      return window.location.pathname + (q ? '?' + q : '');
    }
    function groupsOf(list) {
      if (!list || !list.length) return [];
      return ('items' in list[0]) ? list : [{ group: null, items: list }];
    }
    function buildSelect(list, param, currentValue, noneLabel) {
      var sel = document.createElement('select');
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
          o.value = it.id; o.textContent = it.label || it.id;
          target.appendChild(o);
        });
      });
      sel.value = currentValue || '';
      sel.addEventListener('change', function () {
        window.location.href = withParam(param, sel.value);
      });
      return sel;
    }

    /* ── collapsed tab ── */
    var tab = document.createElement('button');
    tab.id = 'proto-bar-tab';
    tab.type = 'button';
    tab.textContent = 'DEV ▲';
    tab.title = 'Show prototype controls';
    tab.addEventListener('click', function () { setCollapsed(false); });

    /* ── the bar ── */
    var bar = document.createElement('div');
    bar.id = 'proto-bar';
    bar.setAttribute('data-proto-dev', '');

    var chip = document.createElement('span');
    chip.className = 'pb-chip';
    chip.textContent = 'DEV';
    chip.title = 'Prototype tooling is visible. Switch to Test to hide it.';
    bar.appendChild(chip);

    var fileLabel = document.createElement('span');
    fileLabel.className = 'pb-file';
    fileLabel.textContent = file;
    bar.appendChild(fileLabel);

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
      ? buildSelect(cfg.scenarios, scParam, params.get(scParam), '— default —')
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
        cfg.variantDefault ? '— none —' : 'prod baseline'));
      bar.appendChild(vWrap);
    }

    bar.appendChild(Object.assign(document.createElement('span'), { className: 'pb-spacer' }));

    /* Jump to another proto page */
    var goWrap = document.createElement('label');
    goWrap.appendChild(document.createTextNode('Go to'));
    var goSel = document.createElement('select');
    var cur = document.createElement('option');
    cur.value = ''; cur.textContent = 'page…';
    goSel.appendChild(cur);
    PAGES.forEach(function (p) {
      var o = document.createElement('option');
      o.value = p.href; o.textContent = p.label;
      if (p.href === file) o.textContent += '  (here)';
      goSel.appendChild(o);
    });
    goSel.addEventListener('change', function () {
      if (goSel.value) window.location.href = goSel.value;
    });
    goWrap.appendChild(goSel);
    bar.appendChild(goWrap);

    /* Prototype instructions — moved off the site footer, where it did not belong */
    if (window.__protoModal) {
      var infoBtn = document.createElement('button');
      infoBtn.type = 'button';
      infoBtn.textContent = 'Scenarios…';
      infoBtn.title = 'Prototype instructions';
      infoBtn.addEventListener('click', function () { window.__protoModal.open(); });
      bar.appendChild(infoBtn);
    }

    var hideBtn = document.createElement('button');
    hideBtn.type = 'button';
    hideBtn.textContent = '▼';
    hideBtn.title = 'Hide the bar (stays hidden until you show it again)';
    hideBtn.addEventListener('click', function () { setCollapsed(true); });
    bar.appendChild(hideBtn);

    function setCollapsed(v) {
      collapsed = v;
      try { localStorage.setItem(COLLAPSE_KEY, v ? '1' : '0'); } catch (e) {}
      bar.style.display = v ? 'none' : 'flex';
      tab.style.display = v ? 'block' : 'none';
      document.body.classList.toggle('proto-bar-on', !v);
    }

    document.body.appendChild(bar);
    document.body.appendChild(tab);
    setCollapsed(collapsed);
  });
}());
