/* Seller protection, variant 3: VWO front-end test snippet for the consumer
 * decision page (autovex.fi/decision/<id>). Adds an "AutoVex-turva" card
 * directly under the offer cards while an offer can be accepted. Identical to
 * variant 1 except the body copy.
 *
 * Source of truth: design-specs/seller-protection.html#build. The
 * prototype's decision page runs this exact file for the arm.
 */
(function () {
  var ID = 'av-sp-v3';

  var CSS = [
    '#av-sp-v3 .av-sp-card{display:grid;gap:20px;padding:20px;border-radius:12px;background:#fff}',
    '#av-sp-v3 .av-sp-emblem{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:24px;border-radius:8px;background:#F1F5F9}',
    '#av-sp-v3 .av-sp-shield{display:block;width:48px;height:48px}',
    '#av-sp-v3 .av-sp-name{margin:0;font-family:Barlow,ui-sans-serif,system-ui,sans-serif;font-weight:700;font-size:24px;line-height:30px;color:#1E293B}',
    '#av-sp-v3 .av-sp-included{display:inline-flex;align-items:flex-start;gap:6px;margin:0;font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:20px;color:#334155}',
    '#av-sp-v3 .av-sp-included svg{width:16px;height:16px;margin-top:2px;flex-shrink:0;color:#0B6DFF}',
    '#av-sp-v3 .av-sp-text{display:flex;flex-direction:column;justify-content:center;text-align:left}',
    '#av-sp-v3 .av-sp-title{margin:0;font-family:Barlow,ui-sans-serif,system-ui,sans-serif;font-weight:700;font-size:20px;line-height:27.5px;color:#000}',
    '#av-sp-v3 .av-sp-body{margin:8px 0 0;font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif;font-size:16px;line-height:24px;color:#334155}',
    '@media (min-width:768px){#av-sp-v3 .av-sp-card{grid-template-columns:1fr 1fr;gap:24px}}'
  ].join('');

  // The production sprite's ph-fill-shield-check outline in two golds, with
  // the "A" of the AutoVex logo in white where the check was.
  var SHIELD_D = 'M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Z';
  var SHIELD =
    '<svg class="av-sp-shield" viewBox="0 0 256 256" aria-hidden="true">' +
      '<defs><clipPath id="av-sp-v3-half"><rect x="128" y="0" width="128" height="256"/></clipPath></defs>' +
      '<path fill="#FCD34D" d="' + SHIELD_D + '"/>' +
      '<path fill="#FBBF24" clip-path="url(#av-sp-v3-half)" d="' + SHIELD_D + '"/>' +
      '<path fill="#fff" fill-rule="evenodd" transform="translate(94.4 82) scale(4.04)" d="M4.69085 0L0.415527 21.7816H5.37707L5.84491 18.9416H10.6503L11.1181 21.7816H16.2358L11.8995 0H4.69085ZM6.53175 14.8541L8.24823 4.68096H8.31044L9.99581 14.8541H6.53175Z"/>' +
    '</svg>';

  // The production sprite's check-bold.
  var CHECK = '<svg viewBox="0 0 17 17" fill="currentColor" aria-hidden="true"><path d="M15.4388 5.34502L6.93876 13.845C6.86473 13.9193 6.77676 13.9783 6.6799 14.0185C6.58303 14.0587 6.47919 14.0794 6.37431 14.0794C6.26943 14.0794 6.16558 14.0587 6.06872 14.0185C5.97186 13.9783 5.88389 13.9193 5.80985 13.845L2.0911 10.1263C2.01698 10.0522 1.95818 9.96415 1.91806 9.8673C1.87795 9.77045 1.8573 9.66665 1.8573 9.56182C1.8573 9.45699 1.87795 9.35319 1.91806 9.25634C1.95818 9.15949 2.01698 9.07149 2.0911 8.99737C2.16523 8.92324 2.25323 8.86444 2.35008 8.82433C2.44693 8.78421 2.55073 8.76356 2.65556 8.76356C2.76039 8.76356 2.86419 8.78421 2.96104 8.82433C3.05789 8.86444 3.14589 8.92324 3.22001 8.99737L6.37497 12.1523L14.3112 4.21745C14.4609 4.06774 14.6639 3.98364 14.8756 3.98364C15.0873 3.98364 15.2904 4.06774 15.4401 4.21745C15.5898 4.36715 15.6739 4.57019 15.6739 4.7819C15.6739 4.99361 15.5898 5.19665 15.4401 5.34635L15.4388 5.34502Z"/></svg>';

  var MARKUP =
    '<section id="av-sp-v3" aria-labelledby="av-sp-v3-title">' +
      '<div class="container mx-auto">' +
        '<div class="av-sp-card">' +
          '<div class="av-sp-emblem">' + SHIELD +
            '<p class="av-sp-name">AutoVex-turva</p>' +
            '<p class="av-sp-included">' + CHECK + '<span>Ilmaiseksi sinulle</span></p>' +
          '</div>' +
          '<div class="av-sp-text">' +
            '<h2 class="av-sp-title" id="av-sp-v3-title">Me olemme tukenasi myös tarjouksen hyväksymisen jälkeen</h2>' +
            '<p class="av-sp-body">Autamme sinua esimerkiksi auton luovutukseen, maksuaikatauluun ja kaupan ehtoihin liittyvissä kysymyksissä sekä mahdollisissa ongelmatilanteissa. Olemme tukenasi kauppojen loppuun asti.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';

  // The distance row ("15 km (Helsinki)") closes the footer of every consumer
  // offer card and appears nowhere else; the B2B card has none.
  function distanceRows() {
    return document.querySelectorAll('div.rounded-b-lg div.flex.text-xs.text-left.mb-4');
  }

  // An offer is open for a decision while its card shows an accept button
  // ("Hyväksy korkein tarjous", "Hyväksy alhaisempi tarjous", "Hyväksy
  // lopullinen tarjous"). Accepted, rejected and expired cards show none.
  function canAccept(row) {
    var card = row.closest('.rounded-xl');
    if (!card) return false;
    return Array.prototype.some.call(card.querySelectorAll('button'), function (b) {
      return /^\s*Hyväksy/.test(b.textContent);
    });
  }

  function injectCss() {
    if (document.getElementById(ID + '-style')) return;
    var style = document.createElement('style');
    style.id = ID + '-style';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function sync() {
    var rows = distanceRows();
    var open = Array.prototype.some.call(rows, canAccept);
    var existing = document.getElementById(ID);
    if (!open) {
      if (existing) existing.remove();
      return;
    }
    // The offer cards' own <section>; the page's grid puts 48px between it
    // and the section inserted after it.
    var offersSection = rows[0].closest('section');
    if (!offersSection) return;
    if (existing && existing.previousElementSibling === offersSection) return;
    if (existing) existing.remove();
    injectCss();
    offersSection.insertAdjacentHTML('afterend', MARKUP);
  }

  // The page is a single-page app that mounts after load and re-renders on
  // every action, so sync whenever the DOM changes. sync is idempotent.
  function start() {
    sync();
    new MutationObserver(sync).observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
}());
