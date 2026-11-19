/* Informed decision, variant 6: VWO front-end test snippet for the consumer
 * decision page (autovex.fi/decision/<id>). Adds the Nettiauto comparison
 * section after the auction-details section while the seller can still reject
 * the auction, and a note under the first-visit warm-up card.
 *
 * Source of truth: design-specs/informed-decision.html#build. The
 * prototype's decision page runs this exact file for the arm.
 */
(function () {
  var ID = 'av-nt6';
  var NOTE_ID = 'av-nt6-warmup';
  // The auction-result test renames this section; the variant works beside either title.
  var INSIGHTS_TITLES = ['Tarjouskilpailun tiedot', 'Tarjouskilpailun tulos'];
  var REJECT_LABEL = 'Hylkää tarjouskilpailu';
  var PROD_MESSAGE = 'Autosi kävi läpi koko tarjouskilpailun ja tavoitti satojen autoliikkeiden verkoston.';
  var MESSAGE = 'Autosi kävi läpi tarjouskilpailun ja tavoitti satojen autoliikkeiden verkoston.';

  var DM = '"DM Sans",ui-sans-serif,system-ui,sans-serif';
  var BARLOW = 'Barlow,ui-sans-serif,system-ui,sans-serif';

  // Production styles the bare h2, h3, p, ul and b elements (size, margin,
  // leading), so every element here sets its own.
  var CSS = [
    '#av-nt6 .av-nt6-title{display:flex;align-items:center;margin:0 0 20px;font-family:' + BARLOW + ';font-size:20px;font-weight:700}',
    '#av-nt6 .av-nt6-title svg{width:1.25em;height:1.25em;flex-shrink:0;fill:currentColor;color:#2890FF}',
    '#av-nt6 .av-nt6-title span{margin-left:10px;line-height:24px;color:#134195}',
    '#av-nt6 .av-nt6-card{padding:20px;border-radius:12px;background:#fff}',
    '#av-nt6 .av-nt6-grid{display:grid;gap:20px}',
    '#av-nt6 .av-nt6-text{display:flex;flex-direction:column;gap:16px}',
    '#av-nt6 .av-nt6-body{margin:0;font-family:' + DM + ';font-size:16px;line-height:24px;font-weight:400;color:#334155}',
    '#av-nt6 b{font-weight:700;color:#0F172A}',
    '#av-nt6 ul{display:grid;margin:0;padding:0;list-style:none}',
    '#av-nt6 li{display:flex;align-items:flex-start;gap:8px;margin:0}',
    '#av-nt6 .av-nt6-checks{gap:8px;font-family:' + DM + ';font-size:14px;line-height:20px;color:#334155}',
    '#av-nt6 .av-nt6-checks svg{width:16px;height:16px;margin-top:2px;flex-shrink:0;fill:currentColor;color:#0B6DFF}',
    '#av-nt6 .av-nt6-example{display:flex;flex-direction:column;gap:12px;padding:20px;border-radius:8px;background:#F1F5F9;font-family:' + DM + '}',
    '#av-nt6 .av-nt6-caption{margin:0;font-size:14px;line-height:20px;font-weight:700;color:#1E293B}',
    '#av-nt6 .av-nt6-bar{display:flex;height:36px;margin:0;border-radius:6px;overflow:hidden;font-size:14px;line-height:20px;font-weight:700}',
    '#av-nt6 .av-nt6-seg{display:flex;align-items:center;justify-content:center;padding:0 10px;white-space:nowrap}',
    // White on #0B6DFF is 4.52:1. Blue rather than the page's accept green: the figures are not the seller's money.
    '#av-nt6 .av-nt6-seg-offer{flex:1 1 auto;background:#0B6DFF;color:#fff}',
    '#av-nt6 .av-nt6-seg-costs{flex:0 0 auto;min-width:25%;background:#CBD5E1;color:#1E293B}',
    '#av-nt6 .av-nt6-legend{gap:6px;font-size:14px;line-height:20px;color:#334155}',
    '#av-nt6 .av-nt6-key{width:12px;height:12px;margin-top:4px;flex-shrink:0;border-radius:2px}',
    '#av-nt6 .av-nt6-key-offer{background:#0B6DFF}',
    '#av-nt6 .av-nt6-key-costs{background:#CBD5E1;box-shadow:inset 0 0 0 1px #94A3B8}',
    '#av-nt6 .av-nt6-footnote{margin:0;font-size:12px;line-height:16px;color:#475569}',
    '#av-nt6 .av-nt6-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}',
    '@media (min-width:768px){#av-nt6 .av-nt6-grid{grid-template-columns:1fr 1fr;gap:24px}}',
    '#av-nt6-warmup{display:flex;align-items:flex-start;gap:12px;margin-top:16px;padding:20px;border-radius:12px;background:#fff;box-shadow:0 4px 6px -1px rgb(0 0 0 / .1),0 2px 4px -2px rgb(0 0 0 / .1);text-align:left}',
    '#av-nt6-warmup svg{width:20px;height:20px;margin-top:4px;flex-shrink:0;fill:currentColor;color:#2890FF}',
    '#av-nt6-warmup h3{margin:0;font-family:' + BARLOW + ';font-size:20px;line-height:27.5px;font-weight:700;color:#000}',
    '#av-nt6-warmup p{margin:4px 0 0;font-family:' + DM + ';font-size:14px;line-height:20px;font-weight:400;color:#334155}',
    // The test fits the warm-up card and the note on one 375x667 screen; with the illustration the note ends ~160px below it.
    '@media (max-width:767px){.av-nt6-media{display:none !important}.av-nt6-msg{margin-bottom:16px !important}#av-nt6-warmup h3{font-size:18px;line-height:24px}}'
  ].join('');

  // The production sprite's ph-bold-info and check-bold.
  var INFO = '<svg viewBox="0 0 256 256" aria-hidden="true"><path d="M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z"/></svg>';
  var CHECK = '<svg viewBox="0 0 17 17" aria-hidden="true"><path d="M15.4388 5.34502L6.93876 13.845C6.86473 13.9193 6.77676 13.9783 6.6799 14.0185C6.58303 14.0587 6.47919 14.0794 6.37431 14.0794C6.26943 14.0794 6.16558 14.0587 6.06872 14.0185C5.97186 13.9783 5.88389 13.9193 5.80985 13.845L2.0911 10.1263C2.01698 10.0522 1.95818 9.96415 1.91806 9.8673C1.87795 9.77045 1.8573 9.66665 1.8573 9.56182C1.8573 9.45699 1.87795 9.35319 1.91806 9.25634C1.95818 9.15949 2.01698 9.07149 2.0911 8.99737C2.16523 8.92324 2.25323 8.86444 2.35008 8.82433C2.44693 8.78421 2.55073 8.76356 2.65556 8.76356C2.76039 8.76356 2.86419 8.78421 2.96104 8.82433C3.05789 8.86444 3.14589 8.92324 3.22001 8.99737L6.37497 12.1523L14.3112 4.21745C14.4609 4.06774 14.6639 3.98364 14.8756 3.98364C15.0873 3.98364 15.2904 4.06774 15.4401 4.21745C15.5898 4.36715 15.6739 4.57019 15.6739 4.7819C15.6739 4.99361 15.5898 5.19665 15.4401 5.34635L15.4388 5.34502Z"/></svg>';

  var SECTION =
    '<section id="av-nt6" aria-labelledby="av-nt6-title">' +
      '<h2 class="av-nt6-title" id="av-nt6-title">' + INFO + '<span>Tarjouksesi vs. Nettiauton pyyntihinta</span></h2>' +
      '<div class="container mx-auto"><div class="av-nt6-card"><div class="av-nt6-grid">' +
        '<div class="av-nt6-text">' +
          '<p class="av-nt6-body">Nettiautossa näkyvä <b>pyyntihinta</b> ei ole sama asia kuin saamasi tarjous.</p>' +
          '<ul class="av-nt6-checks">' +
            '<li>' + CHECK + '<span>AutoVex-tarjouksesi on kilpailutettu summa, jonka autoliike on valmis maksamaan sinulle autostasi.</span></li>' +
            '<li>' + CHECK + '<span>Pyyntihintaan sisältyvät autoliikkeen kulut, kate ja tinkimisvara.</span></li>' +
          '</ul>' +
        '</div>' +
        '<div class="av-nt6-example">' +
          '<p class="av-nt6-caption">Esimerkki pyyntihinnasta: 15 000 €</p>' +
          '<p class="av-nt6-bar"><span class="av-nt6-seg av-nt6-seg-offer">12 000 €</span><span class="av-nt6-sr"> + </span><span class="av-nt6-seg av-nt6-seg-costs">n. 3 000 €</span></p>' +
          '<ul class="av-nt6-legend">' +
            '<li><span class="av-nt6-key av-nt6-key-offer" aria-hidden="true"></span><span><b>Sisäänosto:</b> maksetaan myyjälle</span></li>' +
            '<li><span class="av-nt6-key av-nt6-key-costs" aria-hidden="true"></span><span><b>Kulut, kate ja tinkimisvara:</b> sisällytetään pyyntihintaan</span></li>' +
          '</ul>' +
          '<p class="av-nt6-footnote">*Esimerkkilaskelma. Luvut eivät liity autoosi.</p>' +
        '</div>' +
      '</div></div></div>' +
    '</section>';

  var NOTE =
    '<div id="av-nt6-warmup">' + INFO +
      '<div>' +
        '<h3>Vertailetko tarjouksia Nettiauton hintoihin?</h3>' +
        '<p>Saamasi tarjous on summa, jonka autoliike on valmis maksamaan autostasi. Nettiauton pyyntihinta ei ole sama kuin myyjälle maksettu summa.</p>' +
      '</div>' +
    '</div>';

  function text(el) {
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  // The distance row ("15 km (Helsinki)") closes every consumer offer card;
  // the B2B decision page has the same auction section and red button but no such row.
  function isConsumerPage() {
    return !!document.querySelector('div.rounded-b-lg div.flex.text-xs.text-left.mb-4');
  }

  // Production shows this button exactly while the seller can still reject the
  // auction: not after accepting or rejecting, not with no or expired offers,
  // and not while waiting for a dealership's reply to a counter offer.
  function rejectAllShown() {
    return Array.prototype.some.call(document.querySelectorAll('button'), function (b) {
      return text(b) === REJECT_LABEL;
    });
  }

  function insightsSection() {
    var headings = document.querySelectorAll('section > h2');
    for (var i = 0; i < headings.length; i++) {
      if (INSIGHTS_TITLES.indexOf(text(headings[i])) > -1) return headings[i].parentElement;
    }
    return null;
  }

  function injectCss() {
    if (document.getElementById(ID + '-style')) return;
    var style = document.createElement('style');
    style.id = ID + '-style';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function syncSection() {
    var existing = document.getElementById(ID);
    var anchor = isConsumerPage() && rejectAllShown() ? insightsSection() : null;
    if (!anchor) {
      if (existing) existing.remove();
      return;
    }
    if (existing && existing.previousElementSibling === anchor) return;
    if (existing) existing.remove();
    injectCss();
    anchor.insertAdjacentHTML('afterend', SECTION);
  }

  // The first-visit card with the "Hyvä tarjouskilpailu takana!" illustration;
  // the other warm-up cards (no offers, offers expired) use other images.
  function syncWarmup() {
    var img = document.querySelector('img[src*="excellent_auction"]');
    var card = img && img.closest('div.rounded-xl');
    var existing = document.getElementById(NOTE_ID);
    if (!card) {
      if (existing) existing.remove();
      return;
    }
    injectCss();
    img.parentElement.classList.add('av-nt6-media');
    // Only production's own message is replaced, so copy another test puts there stays.
    Array.prototype.forEach.call(card.querySelectorAll('p'), function (p) {
      var t = text(p);
      if (t === PROD_MESSAGE) p.textContent = MESSAGE;
      if (t === PROD_MESSAGE || t === MESSAGE) p.classList.add('av-nt6-msg');
    });
    if (existing && existing.previousElementSibling === card) return;
    if (existing) existing.remove();
    card.insertAdjacentHTML('afterend', NOTE);
  }

  function sync() {
    syncSection();
    syncWarmup();
  }

  // The page is a single-page app that mounts after load and re-renders on
  // every action, so sync whenever the DOM changes. sync is idempotent.
  function start() {
    sync();
    new MutationObserver(sync).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
}());
