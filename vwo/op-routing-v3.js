/* OP routing, variant 3: VWO front-end test snippet. Adds AutoVex's OP car
 * insurance suggestion in two places, with the same block in both:
 *
 *   1. Funnel success screen (autovex.fi/tarjouspyynto…): for a seller whose
 *      email is verified, while the ad is in review or published. Directly
 *      under the cream "Katso ilmoitukseni" notice.
 *   2. Decision page (autovex.fi/decision/<id>): after the seller accepted an
 *      offer ("Onneksi olkoon!") or the offers were rejected ("Tarjoukset
 *      hylätty"). Under the "Tarvitsetko apua?" banner when it follows the
 *      offers, otherwise directly under the offers.
 *
 * Source of truth: design-specs/op-routing.html#build. The prototype's
 * success and decision pages run this exact file for the arm.
 */
(function () {
  var ID = 'av-op-v3';
  var OP_URL = 'https://www.op.fi/henkiloasiakkaat/vakuutukset/ajoneuvovakuutus/autovakuutus-henkiloautolle';

  // The decision page hero titles of the two states, verbatim from
  // auction.auction_hero.offer_accepted.title / .offer_rejected.title.
  var DECISION_TITLES = ['Onneksi olkoon!', 'Tarjoukset hylätty'];

  var CSS = [
    '#av-op-v3{display:block}',
    '#av-op-v3 .av-op-card{box-sizing:border-box;display:flex;flex-direction:column;gap:16px;width:100%;max-width:448px;margin:0 auto;padding:20px;background:#fff;border:2px dashed #CBD5E1;border-radius:12px;text-align:left}',
    '#av-op-v3 .av-op-head{display:flex;flex-direction:column;align-items:center;gap:10px;padding-bottom:4px;text-align:center}',
    '#av-op-v3 .av-op-intro{margin:0;font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif;font-weight:400;font-size:16px;line-height:20px;color:#000}',
    '#av-op-v3 .av-op-row{display:flex;align-items:center;justify-content:center;gap:12px}',
    '#av-op-v3 .av-op-logo{display:block;width:40px;height:40px;flex-shrink:0}',
    '#av-op-v3 .av-op-title{margin:0;font-family:Barlow,ui-sans-serif,system-ui,sans-serif;font-weight:700;font-size:24px;line-height:26px;letter-spacing:normal;color:#0F172A;text-align:left}',
    '#av-op-v3 .av-op-actions{display:flex;flex-direction:column;gap:8px}',
    '#av-op-v3 a.av-op-cta{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;height:56px;padding:0 32px;border-radius:8px;background:#EE5A00;color:#fff;font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif;font-weight:400;font-size:16px;line-height:1.25;text-align:center;text-decoration:none;box-shadow:inset 0 1px 2px 1px rgba(255,255,255,0.2);transition:opacity .15s}',
    '#av-op-v3 a.av-op-cta:hover{opacity:.94;color:#fff;text-decoration:none}',
    '#av-op-v3 a.av-op-cta svg{width:20px;height:20px;flex-shrink:0}',
    '#av-op-v3 .av-op-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}',
    '#av-op-v3 .av-op-terms{margin:0;font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:20px;color:#475569;text-align:center}',
    // On the success screen the block follows the notice inside the 448px column.
    '#av-op-v3.av-op-success{width:100%;margin-top:32px}'
  ].join('');

  // OP's round logo, from op.fi's own inline SVG.
  var LOGO =
    '<svg class="av-op-logo" viewBox="0 0 50 50" role="img" aria-label="OP">' +
      '<path d="M25 0a25 25 0 1 0 0 50 25 25 0 1 0 0-50" fill="#ff6a10"/>' +
      '<path d="M27.5 44.5h-5V34.2c-1.7 1.1-3.8 1.8-6 1.8-6.1 0-11-4.9-11-11s4.9-11 11-11c2.2 0 4.3.7 6 1.8V5.5h5v10.3c1.7-1.1 3.8-1.8 6-1.8 6.1 0 11 4.9 11 11s-4.9 11-11 11c-2.2 0-4.3-.7-6-1.8zm6-25.5c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6m-17 0c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6" fill="#fff"/>' +
    '</svg>';

  // The production sprite's arrow-right.
  var ARROW = '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd"/></svg>';

  var CARD =
    '<div class="av-op-card">' +
      '<div class="av-op-head">' +
        '<p class="av-op-intro">Tutustu sillä aikaa suosittelemaamme tarjoukseen</p>' +
        '<div class="av-op-row">' + LOGO +
          '<h2 class="av-op-title">Uudelle autollesi vakuutus&nbsp;−50&nbsp;%</h2>' +
        '</div>' +
      '</div>' +
      '<div class="av-op-actions">' +
        '<a class="av-op-cta" href="' + OP_URL + '" target="_blank" rel="noopener">' +
          '<span>Laske vakuutustarjous OP:ssa</span><span class="av-op-sr">(avautuu uuteen välilehteen)</span>' + ARROW +
        '</a>' +
        '<p class="av-op-terms">Koskee uusien kaskovakuutusten ensimmäistä vakuutusjaksoa.</p>' +
      '</div>' +
    '</div>';

  function visible(el) {
    return !!el && el.getClientRects().length > 0;
  }

  // Funnel success screen. The cream notice with the link to the offers page
  // ("Katso ilmoitukseni") is drawn only for a verified seller whose ad is in
  // review (Review.vue) or published (Success.vue). The unverified, rejected
  // and photos-missing screens have no such notice.
  function successAnchor() {
    var notices = document.querySelectorAll('div.border-orange-300.rounded-lg');
    for (var i = 0; i < notices.length; i++) {
      if (visible(notices[i]) && notices[i].querySelector('a[href*="offers"]')) return notices[i];
    }
    return null;
  }

  // Decision page. The hero's own title names the state; the snippet reads
  // nothing else about the auction.
  function decisionAnchor() {
    var titles = document.querySelectorAll('h2.text-3xl.font-bold.text-black');
    var hero = null;
    for (var i = 0; i < titles.length; i++) {
      if (DECISION_TITLES.indexOf(titles[i].textContent.trim()) !== -1 && visible(titles[i])) { hero = titles[i]; break; }
    }
    if (!hero) return null;
    var offers = hero.closest('section');
    if (!offers) return null;
    var next = offers.nextElementSibling;
    while (next && next.id !== ID && !visible(next)) next = next.nextElementSibling;
    if (next && next.id === ID) next = null;
    // The "Tarvitsetko apua?" banner, when the page puts it right after the
    // offers (accepted, or every offer rejected).
    if (next && next.tagName === 'SECTION' && next.querySelector('h5')) return next;
    return offers;
  }

  function injectCss() {
    if (document.getElementById(ID + '-style')) return;
    var style = document.createElement('style');
    style.id = ID + '-style';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function place(anchor, tag, cls, inner) {
    var existing = document.getElementById(ID);
    if (existing && existing.previousElementSibling === anchor) return;
    if (existing) existing.remove();
    injectCss();
    anchor.insertAdjacentHTML('afterend', '<' + tag + ' id="' + ID + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + inner + '</' + tag + '>');
  }

  function sync() {
    // Finnish only, like the copy.
    if (/^en/i.test(document.documentElement.lang || '')) return remove();
    var anchor = successAnchor();
    if (anchor) return place(anchor, 'div', 'av-op-success', CARD);
    anchor = decisionAnchor();
    if (anchor) return place(anchor, 'section', '', '<div class="container mx-auto">' + CARD + '</div>');
    remove();
  }

  function remove() {
    var existing = document.getElementById(ID);
    if (existing) existing.remove();
  }

  // Both pages are single-page apps that mount after load and re-render on
  // every action, so sync whenever the DOM changes. sync is idempotent.
  function start() {
    sync();
    new MutationObserver(sync).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  }
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
}());
