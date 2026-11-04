/* Seller protection (design-specs/seller-protection.html): "AutoVex-turva".
 * Host-agnostic, so the decision page and the spec page draw the same thing
 * from one definition.
 *
 *   SellerProtection.card(el)          v1, a block under the offers
 *   SellerProtection.badge(el, opts)   v2, a badge under the hero copy that
 *                                       expands to what the help covers
 *
 * The two arms keep their own copy and builders: a shared body with a flag is
 * how two arms quietly converge. Only the shield is shared.
 *
 * Styles are hand-written and injected once rather than Tailwind utilities:
 * the markup is built by JS, and the Play CDN generates utilities a tick after
 * the render, which would paint it unstyled first. The spec page also does not
 * load tw-tokens.js, so utilities would size differently there.
 *
 * Copy is Finnish only, like the rest of decision.html; decision-i18n.js
 * carries the English reading aid. All of it is a draft.
 */
(function () {
  var COPY_V1 = {
    tag:   'AutoVex-turva',
    title: 'Me olemme tukenasi myös tarjouksen hyväksymisen jälkeen',
    body:  'AutoVexin asiantuntijat auttavat sinua koko matkan, aina auton luovutukseen asti. Jos jokin mietityttää, ota meihin yhteyttä.'
  };

  var COPY_V2 = {
    name:    'AutoVex-turva',
    tagline: 'Tukenasi koko kaupan ajan',
    intro:   'Asiantuntijamme auttavat sinua ennen tarjouksen hyväksymistä ja sen jälkeen, esimerkiksi näissä asioissa:',
    items: [
      'Suora myynti vai vaihtokauppa',
      'Auton luovutus ja aikataulut',
      'Mistä tarjouksen hinta muodostuu',
      'Jäljellä oleva autolaina',
      'Asiointi autoliikkeen kanssa'
    ],
    contact: 'Ota yhteyttä asiantuntijaamme'
  };

  var CSS = [
    /* v1 — outlined card with a ribbon */
    '.sp-card{position:relative;overflow:hidden;background:#fff;border:2px solid #D7EDFF;border-radius:12px;padding:60px 24px 28px}',
    '.sp-tag{position:absolute;top:0;left:0;display:inline-flex;align-items:center;gap:8px;margin:0;padding:6px 30px 6px 16px;background:#0B6DFF;color:#fff;font-family:Barlow,ui-sans-serif,system-ui,sans-serif;font-weight:700;font-size:16px;line-height:24px;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 50%,100% 100%,0 100%)}',
    '.sp-tag svg{width:16px;height:16px;flex-shrink:0}',
    '.sp-content{display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center}',
    '.sp-content .sp-shield{width:56px;height:56px;flex-shrink:0}',
    '.sp-title{margin:0;font-family:Barlow,ui-sans-serif,system-ui,sans-serif;font-weight:700;font-size:20px;line-height:26px;color:#0F172A}',
    '.sp-body{margin:8px auto 0;max-width:560px;font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif;font-size:16px;line-height:24px;color:#475569}',
    '@media (min-width:620px){',
    '.sp-content{flex-direction:row;justify-content:center;gap:32px}',
    '.sp-content .sp-shield{width:72px;height:72px}',
    '.sp-title{font-size:24px;line-height:30px}',
    '}',

    /* v2 — badge under the hero copy. White, no border: an outline is the
       offer cards' mark on this page. */
    '.spb{display:flex;flex-direction:column;align-items:center;margin-top:20px;text-align:left}',
    '.spb-toggle{display:inline-flex;align-items:center;gap:10px;padding:8px 14px 8px 10px;border:0;border-radius:9999px;background:#fff;box-shadow:0 1px 3px rgba(15,23,42,.10),0 1px 2px rgba(15,23,42,.06);cursor:pointer;font:inherit;color:inherit;transition:background-color .15s}',
    '.spb-toggle:hover{background:#F8FAFC}',
    '.spb-toggle:focus-visible{outline:2px solid #2890FF;outline-offset:2px}',
    '.spb-toggle .sp-shield{width:28px;height:28px;flex-shrink:0}',
    '.spb-label{display:flex;flex-direction:column;line-height:1}',
    '.spb-name{font-family:Barlow,ui-sans-serif,system-ui,sans-serif;font-weight:700;font-size:16px;line-height:20px;color:#134195}',
    '.spb-tagline{font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif;font-size:13px;line-height:16px;color:#475569}',
    '.spb-caret{width:16px;height:16px;flex-shrink:0;color:#64748B;transition:transform .15s}',
    '.spb.is-open .spb-caret{transform:rotate(180deg)}',
    /* MAccordion's open transition (grid rows 0fr → 1fr plus opacity), with
       visibility so the closed panel leaves the accessibility tree too. */
    '.spb-panel{display:grid;grid-template-rows:0fr;opacity:0;visibility:hidden;width:100%;max-width:440px;transition:grid-template-rows .15s,opacity .15s,visibility 0s .15s}',
    '.spb.is-open .spb-panel{grid-template-rows:1fr;opacity:1;visibility:visible;transition-delay:0s}',
    '.spb-panel > div{overflow:hidden}',
    '.spb-panel-inner{margin-top:8px;padding:16px 20px;border-radius:12px;background:#fff;box-shadow:0 1px 3px rgba(15,23,42,.10),0 1px 2px rgba(15,23,42,.06);font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif}',
    '.spb-intro{margin:0;font-size:14px;line-height:20px;color:#334155}',
    '.spb-list{margin:12px 0 0;padding:0;list-style:none}',
    '.spb-list li{display:flex;align-items:flex-start;gap:8px;font-size:14px;line-height:20px;color:#0F172A}',
    '.spb-list li + li{margin-top:8px}',
    '.spb-list svg{width:16px;height:16px;margin-top:2px;flex-shrink:0;color:#0B6DFF}',
    '.spb-contact{display:inline-flex;margin-top:14px;font-size:14px;line-height:20px;color:#0B6DFF;text-decoration:none}',
    '.spb-contact:hover{text-decoration:underline}',
    '.spb-contact:focus-visible{outline:2px solid #2890FF;outline-offset:2px}',
    '@media (prefers-reduced-motion:reduce){.spb-panel,.spb-caret,.spb-toggle{transition:none}}'
  ].join('');

  /* prod's check-bold sprite. */
  var ICON_CHECK = '<svg viewBox="0 0 17 17" fill="currentColor" aria-hidden="true"><path d="M15.4388 5.34502L6.93876 13.845C6.86473 13.9193 6.77676 13.9783 6.6799 14.0185C6.58303 14.0587 6.47919 14.0794 6.37431 14.0794C6.26943 14.0794 6.16558 14.0587 6.06872 14.0185C5.97186 13.9783 5.88389 13.9193 5.80985 13.845L2.0911 10.1263C2.01698 10.0522 1.95818 9.96415 1.91806 9.8673C1.87795 9.77045 1.8573 9.66665 1.8573 9.56182C1.8573 9.45699 1.87795 9.35319 1.91806 9.25634C1.95818 9.15949 2.01698 9.07149 2.0911 8.99737C2.16523 8.92324 2.25323 8.86444 2.35008 8.82433C2.44693 8.78421 2.55073 8.76356 2.65556 8.76356C2.76039 8.76356 2.86419 8.78421 2.96104 8.82433C3.05789 8.86444 3.14589 8.92324 3.22001 8.99737L6.37497 12.1523L14.3112 4.21745C14.4609 4.06774 14.6639 3.98364 14.8756 3.98364C15.0873 3.98364 15.2904 4.06774 15.4401 4.21745C15.5898 4.36715 15.6739 4.57019 15.6739 4.7819C15.6739 4.99361 15.5898 5.19665 15.4401 5.34635L15.4388 5.34502Z"/></svg>';

  /* prod's caret-down, as the FAQ accordion uses it. */
  var ICON_CARET = '<svg class="spb-caret" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>';

  /* prod's ph-fill-shield-check, drawn twice so the right half is a shade
     darker (two-tone gold, from the first screenshot). The check is a hole in
     the path; the white disc behind it keeps the check white on any
     background. */
  var SHIELD_PATH = 'M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm-34.32,69.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z';
  var uid = 0;
  function shield() {
    var clip = 'sp-shield-half-' + (++uid);
    return '<svg class="sp-shield" viewBox="0 0 256 256" aria-hidden="true">' +
      '<defs><clipPath id="' + clip + '"><rect x="128" y="0" width="128" height="256"/></clipPath></defs>' +
      '<circle cx="128" cy="128" r="56" fill="#fff"/>' +
      '<path fill="#FCD34D" fill-rule="evenodd" d="' + SHIELD_PATH + '"/>' +
      '<path fill="#FBBF24" fill-rule="evenodd" clip-path="url(#' + clip + ')" d="' + SHIELD_PATH + '"/>' +
      '</svg>';
  }

  function injectCss() {
    if (document.getElementById('sp-css')) return;
    var style = document.createElement('style');
    style.id = 'sp-css';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function card(el) {
    injectCss();
    var titleId = 'sp-title-' + (++uid);
    el.innerHTML =
      '<div class="sp-card" role="group" aria-labelledby="' + titleId + '">' +
        '<p class="sp-tag">' + ICON_CHECK + '<span>' + COPY_V1.tag + '</span></p>' +
        '<div class="sp-content">' +
          shield() +
          '<div>' +
            '<h2 class="sp-title" id="' + titleId + '">' + COPY_V1.title + '</h2>' +
            '<p class="sp-body">' + COPY_V1.body + '</p>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* The decision page rebuilds the hero after every action, so whether the
     badge is open lives here rather than in the markup. */
  var badgeOpen = false;

  /* opts.contactTarget: id of the element "Ota yhteyttä" scrolls to (the
     "Tarvitsetko apua?" banner, which carries the phone number). Without
     one the link is left out. */
  function badge(el, opts) {
    injectCss();
    opts = opts || {};
    var panelId = 'spb-panel-' + (++uid);
    var target = opts.contactTarget ? document.getElementById(opts.contactTarget) : null;
    el.innerHTML =
      '<div class="spb' + (badgeOpen ? ' is-open' : '') + '">' +
        '<button type="button" class="spb-toggle" aria-expanded="' + badgeOpen + '" aria-controls="' + panelId + '">' +
          shield() +
          '<span class="spb-label"><span class="spb-name">' + COPY_V2.name + '</span><span class="spb-tagline">' + COPY_V2.tagline + '</span></span>' +
          ICON_CARET +
        '</button>' +
        '<div class="spb-panel" id="' + panelId + '"><div><div class="spb-panel-inner">' +
          '<p class="spb-intro">' + COPY_V2.intro + '</p>' +
          '<ul class="spb-list">' + COPY_V2.items.map(function (item) {
            return '<li>' + ICON_CHECK + '<span>' + item + '</span></li>';
          }).join('') + '</ul>' +
          (target ? '<a class="spb-contact" href="#' + opts.contactTarget + '">' + COPY_V2.contact + '</a>' : '') +
        '</div></div></div>' +
      '</div>';

    var root = el.firstChild;
    var toggle = root.querySelector('.spb-toggle');
    toggle.addEventListener('click', function () {
      badgeOpen = !badgeOpen;
      root.classList.toggle('is-open', badgeOpen);
      toggle.setAttribute('aria-expanded', String(badgeOpen));
    });
    var link = root.querySelector('.spb-contact');
    if (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  window.SellerProtection = { card: card, badge: badge, copyV1: COPY_V1, copyV2: COPY_V2 };
}());
