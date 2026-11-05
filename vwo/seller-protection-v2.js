/* Seller protection, variant 2: VWO front-end test snippet for the consumer
 * decision page (autovex.fi/decision/<id>). Adds an "AutoVex-turvattu" row
 * to every offer card that can be accepted; the row opens a modal describing
 * AutoVex-turva.
 *
 * Source of truth: design-specs/seller-protection.html#build. The
 * prototype's decision page runs this exact file for the arm.
 */
(function () {
  var ID = 'av-sp-v2';

  var CSS = [
    // The row follows the card's own fact rows: 22px icon, 12px text.
    '.av-sp-row{display:flex;align-items:center;gap:12px;margin:-8px 0 16px;padding:0;border:0;background:none;cursor:pointer;font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif;font-size:12px;line-height:16px;font-weight:600;color:#334155;text-align:left}',
    '.av-sp-row .av-sp-shield{width:22px;height:22px;flex-shrink:0}',
    '.av-sp-row span{text-decoration:underline;text-decoration-color:#94A3B8;text-underline-offset:2px}',
    '.av-sp-row:hover span{color:#0B6DFF;text-decoration-color:currentColor}',
    '.av-sp-row:focus-visible{outline:2px solid #2890FF;outline-offset:2px;border-radius:4px}',
    // The page's own modal: Reveal's overlay, close button and body padding,
    // a 512px container and NegotiationGuidance's title row.
    '.av-sp-modal{position:fixed;inset:0;z-index:1000;display:none;justify-content:center;overflow-y:auto;overflow-x:hidden;padding:32px 16px;background:rgba(30,41,59,.5)}',
    '.av-sp-modal.av-sp-open{display:flex}',
    '.av-sp-panel{position:relative;align-self:flex-start;width:100%;max-width:512px;margin:0 auto;border-radius:8px;background:#fff;text-align:left}',
    '.av-sp-x{position:absolute;top:-2px;right:-2px;z-index:1;display:flex;align-items:center;justify-content:center;width:48px;height:48px;padding:16px;border:0;background:none;color:#000;font-size:24px;line-height:1;cursor:pointer}',
    '.av-sp-x:hover{color:#475569}',
    '.av-sp-body{padding:16px}',
    '.av-sp-head{display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-right:48px}',
    '.av-sp-head .av-sp-shield{width:40px;height:40px;flex-shrink:0}',
    '.av-sp-title{margin:0;font-family:Barlow,ui-sans-serif,system-ui,sans-serif;font-weight:700;font-size:20px;line-height:27px;color:#0F172A}',
    '.av-sp-lead{margin:0;font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif;font-size:16px;line-height:24px;color:#334155}',
    '.av-sp-intro{margin:16px 0 0;font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:20px;color:#334155}',
    '.av-sp-list{margin:8px 0 0;padding:0;list-style:none;font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:20px;color:#0F172A}',
    '.av-sp-list li{display:flex;align-items:flex-start;gap:8px;margin:0}',
    '.av-sp-list li + li{margin-top:8px}',
    '.av-sp-list svg,.av-sp-promise svg{flex-shrink:0;color:#0B6DFF}',
    '.av-sp-list svg{width:16px;height:16px;margin-top:2px}',
    '.av-sp-contact{display:inline-flex;margin-top:12px;font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:20px;color:#0B6DFF;text-decoration:none}',
    '.av-sp-contact:hover{text-decoration:underline}',
    '.av-sp-x:focus-visible,.av-sp-contact:focus-visible{outline:2px solid #2890FF;outline-offset:2px}',
    '.av-sp-promise{display:flex;align-items:center;gap:8px;margin:20px 0 0;padding-top:16px;border-top:1px solid #E2E8F0;font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif;font-weight:600;font-size:16px;line-height:24px;color:#0F172A}',
    '.av-sp-promise svg{width:18px;height:18px}',
    '@media (min-width:620px){.av-sp-x{width:64px;height:64px;font-size:32px}.av-sp-head{padding-right:64px}}',
    '@media (min-width:992px){.av-sp-body{padding:48px 24px 24px}.av-sp-head{margin-top:-24px}}'
  ].join('');

  // The production sprite's ph-fill-shield-check outline in two golds, with
  // the "A" of the AutoVex logo in white where the check was.
  var SHIELD_D = 'M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Z';
  var uid = 0;
  function shield() {
    var clip = 'av-sp-v2-half-' + (++uid);
    return '<svg class="av-sp-shield" viewBox="0 0 256 256" aria-hidden="true">' +
      '<defs><clipPath id="' + clip + '"><rect x="128" y="0" width="128" height="256"/></clipPath></defs>' +
      '<path fill="#FCD34D" d="' + SHIELD_D + '"/>' +
      '<path fill="#FBBF24" clip-path="url(#' + clip + ')" d="' + SHIELD_D + '"/>' +
      '<path fill="#fff" fill-rule="evenodd" transform="translate(94.4 82) scale(4.04)" d="M4.69085 0L0.415527 21.7816H5.37707L5.84491 18.9416H10.6503L11.1181 21.7816H16.2358L11.8995 0H4.69085ZM6.53175 14.8541L8.24823 4.68096H8.31044L9.99581 14.8541H6.53175Z"/>' +
      '</svg>';
  }

  // The production sprite's check-bold.
  var CHECK = '<svg viewBox="0 0 17 17" fill="currentColor" aria-hidden="true"><path d="M15.4388 5.34502L6.93876 13.845C6.86473 13.9193 6.77676 13.9783 6.6799 14.0185C6.58303 14.0587 6.47919 14.0794 6.37431 14.0794C6.26943 14.0794 6.16558 14.0587 6.06872 14.0185C5.97186 13.9783 5.88389 13.9193 5.80985 13.845L2.0911 10.1263C2.01698 10.0522 1.95818 9.96415 1.91806 9.8673C1.87795 9.77045 1.8573 9.66665 1.8573 9.56182C1.8573 9.45699 1.87795 9.35319 1.91806 9.25634C1.95818 9.15949 2.01698 9.07149 2.0911 8.99737C2.16523 8.92324 2.25323 8.86444 2.35008 8.82433C2.44693 8.78421 2.55073 8.76356 2.65556 8.76356C2.76039 8.76356 2.86419 8.78421 2.96104 8.82433C3.05789 8.86444 3.14589 8.92324 3.22001 8.99737L6.37497 12.1523L14.3112 4.21745C14.4609 4.06774 14.6639 3.98364 14.8756 3.98364C15.0873 3.98364 15.2904 4.06774 15.4401 4.21745C15.5898 4.36715 15.6739 4.57019 15.6739 4.7819C15.6739 4.99361 15.5898 5.19665 15.4401 5.34635L15.4388 5.34502Z"/></svg>';

  var TOPICS = [
    'Suora myynti vai vaihtokauppa',
    'Auton luovutus ja aikataulut',
    'Mistä tarjouksen hinta muodostuu',
    'Jäljellä oleva autolaina',
    'Asiointi autoliikkeen kanssa'
  ];

  // Same queue polyfill as the app's own sendVwoEvent.
  function vwoEvent(name) {
    try {
      window.VWO = window.VWO || [];
      var VWO = window.VWO;
      VWO.event = VWO.event || function () { VWO.push(['event'].concat([].slice.call(arguments))); };
      VWO.event(name, {});
    } catch (e) {}
  }

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

  // The "Tarvitsetko apua?" banner carries the customer service phone number.
  // It is hidden while a counter offer waits for the dealership's reply.
  function helpSection() {
    var h = Array.prototype.find.call(document.querySelectorAll('h5'), function (el) {
      return el.textContent.trim() === 'Tarvitsetko apua?';
    });
    return h ? h.closest('section') : null;
  }

  function injectCss() {
    if (document.getElementById(ID + '-style')) return;
    var style = document.createElement('style');
    style.id = ID + '-style';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  var modal = null;
  var lastTrigger = null;

  function closeModal() {
    if (!modal || !modal.classList.contains('av-sp-open')) return;
    modal.classList.remove('av-sp-open');
    document.body.style.overflow = '';
    if (lastTrigger && document.body.contains(lastTrigger)) lastTrigger.focus();
  }

  function openModal(trigger) {
    lastTrigger = trigger;
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'av-sp-modal';
      modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
      document.body.appendChild(modal);
    }
    var help = helpSection();
    modal.innerHTML =
      '<div class="av-sp-panel" role="dialog" aria-modal="true" aria-labelledby="av-sp-v2-title">' +
        '<button type="button" class="av-sp-x" aria-label="Sulje">&times;</button>' +
        '<div class="av-sp-body">' +
          '<div class="av-sp-head">' + shield() + '<h2 class="av-sp-title" id="av-sp-v2-title">AutoVex-turva</h2></div>' +
          '<p class="av-sp-lead">Asiantuntijamme ovat tukenasi koko kaupan ajan, ennen tarjouksen hyväksymistä ja sen jälkeen.</p>' +
          '<p class="av-sp-intro">Autamme esimerkiksi näissä asioissa:</p>' +
          '<ul class="av-sp-list">' + TOPICS.map(function (t) { return '<li>' + CHECK + '<span>' + t + '</span></li>'; }).join('') + '</ul>' +
          (help ? '<a class="av-sp-contact" href="#">Ota yhteyttä asiantuntijaamme</a>' : '') +
          '<p class="av-sp-promise">' + CHECK + '<span>Ilmaiseksi sinulle</span></p>' +
        '</div>' +
      '</div>';
    modal.querySelector('.av-sp-x').addEventListener('click', closeModal);
    var link = modal.querySelector('.av-sp-contact');
    if (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        vwoEvent('sellerProtectionContactClicked');
        lastTrigger = null;
        closeModal();
        help.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
    modal.classList.add('av-sp-open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.av-sp-x').focus();
    vwoEvent('sellerProtectionOpened');
  }

  function sync() {
    Array.prototype.forEach.call(distanceRows(), function (row) {
      var next = row.nextElementSibling;
      var has = next && next.classList.contains('av-sp-row');
      if (!canAccept(row)) {
        if (has) next.remove();
        return;
      }
      if (has) return;
      injectCss();
      row.insertAdjacentHTML('afterend', '<button type="button" class="av-sp-row" aria-haspopup="dialog">' + shield() + '<span>AutoVex-turvattu</span></button>');
      var btn = row.nextElementSibling;
      btn.addEventListener('click', function () { openModal(btn); });
    });
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
