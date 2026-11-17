/* OP routing, variant 4: VWO front-end test snippet. OP's own banner, "Muista
 * vakuuttaa uusi autosi", built as HTML, in the same two places as variant 3:
 *
 *   1. Funnel success screen (autovex.fi/tarjouspyynto…): for a seller whose
 *      email is verified, while the ad is in review or published. Directly
 *      under the cream "Katso ilmoitukseni" notice. Links with OP's tracking
 *      code for that placement (URL_SUCCESS).
 *   2. Decision page (autovex.fi/decision/<id>): after the seller accepted an
 *      offer ("Onneksi olkoon!") or the offers were rejected ("Tarjoukset
 *      hylätty"). Directly above the "Usein kysytyt kysymykset" (FAQ)
 *      section, the page's last. Links with OP's tracking code for that
 *      placement (URL_DECISION).
 *
 * Text is set in OP Chevin Pro, which this snippet does not load: the page
 * has to provide the web font under OP's licence, otherwise Arial is used.
 *
 * Source of truth: design-specs/op-routing.html#build. The prototype's
 * success and decision pages run this exact file for the arm.
 */
(function () {
  var ID = 'av-op-v4';
  var URL_SUCCESS = 'https://www.op.fi/henkiloasiakkaat/vakuutukset/ajoneuvovakuutus/autovakuutus-henkiloautolle?cmpid=.havaku.1.banner.autovex.partner.mn_tak_huom_tp_in.ha_jn_autonvakuutukset';
  var URL_DECISION = 'https://www.op.fi/henkiloasiakkaat/vakuutukset/ajoneuvovakuutus/autovakuutus-henkiloautolle?cmpid=.havaku.1.banner.autovex.partner.mn_tak_huom_tar_hy.ha_jn_autonvakuutukset';

  // The decision page hero titles of the two states, verbatim from
  // auction.auction_hero.offer_accepted.title / .offer_rejected.title.
  var DECISION_TITLES = ['Onneksi olkoon!', 'Tarjoukset hylätty'];

  // OP's banner is drawn at 600 px wide; here it is at most 448 px (the
  // success page's column) so it never outgrows the page. Sizes scale with its own
  // width (1cqw = 1 % of it) and stop at a floor so text stays readable on a
  // phone; the disclaimer is a fixed 10 px, OP's own small print.
  var FONT = '"OP Chevin Pro",Arial,Helvetica,sans-serif';
  var CSS = [
    '#av-op-v4{display:block}',
    '#av-op-v4 .av-op-banner{box-sizing:border-box;container-type:inline-size;width:100%;max-width:448px;margin:0 auto;background:#fff;border:1px solid #E2E8F0;color:#484848;font-family:' + FONT + ';text-align:center}',
    '#av-op-v4 .av-op-inner{display:flex;flex-direction:column;align-items:center;padding:max(32px,11cqw) max(16px,5cqw) max(20px,4.67cqw)}',
    '#av-op-v4 .av-op-title{margin:0;font-family:' + FONT + ';font-weight:300;font-size:max(24px,7.5cqw);line-height:1.15;letter-spacing:0;color:#484848;text-wrap:balance}',
    '#av-op-v4 .av-op-text{margin:max(10px,3.17cqw) 0 0;font-family:' + FONT + ';font-weight:300;font-size:max(18px,5cqw);line-height:1.1;color:#484848;text-wrap:balance}',
    '#av-op-v4 a.av-op-cta{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;margin-top:max(20px,4cqw);min-width:max(200px,36.67cqw);height:max(48px,8.33cqw);padding:0 max(24px,5cqw);border-radius:9999px;background:#EE5A00;color:#fff;font-family:' + FONT + ';font-weight:600;font-size:max(16px,3.17cqw);line-height:1.2;text-decoration:none;transition:opacity .15s}',
    '#av-op-v4 a.av-op-cta:hover{opacity:.94;color:#fff;text-decoration:none}',
    '#av-op-v4 a.av-op-cta:focus-visible{outline:2px solid #484848;outline-offset:2px}',
    '#av-op-v4 .av-op-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}',
    '#av-op-v4 .av-op-foot{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;width:100%;margin-top:max(28px,7.5cqw);text-align:left}',
    '#av-op-v4 .av-op-legal{margin:0;max-width:46%;font-family:' + FONT + ';font-weight:300;font-size:10px;line-height:14px;color:#484848}',
    '#av-op-v4 .av-op-logo{display:block;flex-shrink:0;width:auto;height:max(34px,8.33cqw)}',
    // Too narrow for small print beside the logo: logo first, text under it.
    '@container (max-width:439px){#av-op-v4 .av-op-foot{flex-direction:column;align-items:center;text-align:center}#av-op-v4 .av-op-legal{max-width:none;order:2}}',
    // On the success screen the block follows the notice inside the 448px column.
    '#av-op-v4.av-op-success{width:100%;margin-top:32px}'
  ].join('');

  // The Pohjola Vakuutus logo with the OP symbol on the right, grey text
  // (Pohjola_Vakuutus_RGB_oikea_harmaa.svg from brand.op.fi, Latausoikotiet).
  var LOGO =
    '<svg class="av-op-logo" viewBox="0 0 421.26 84.8" role="img" aria-label="Pohjola Vakuutus">' +
    '<path fill="#FF6A10" d="M378.87,84.8c23.42,0,42.4-18.98,42.4-42.4S402.28,0,378.87,0c-23.42,0-42.4,18.98-42.4,42.4 S355.45,84.8,378.87,84.8"/>' +
    '<path fill="#FFFFFF" d="M412.13,42.4c0-10.36-8.4-18.77-18.77-18.77c-3.78,0-7.29,1.12-10.24,3.04V9.13h-8.53v17.54 c-2.94-1.92-6.46-3.04-10.24-3.04c-10.36,0-18.77,8.4-18.77,18.77c0,10.36,8.4,18.77,18.77,18.77c3.78,0,7.29-1.12,10.24-3.04 v17.54h8.53V58.12c2.94,1.92,6.46,3.04,10.24,3.04C403.73,61.16,412.13,52.76,412.13,42.4 M374.6,42.4 c0,5.65-4.58,10.24-10.24,10.24c-5.65,0-10.24-4.58-10.24-10.24c0-5.65,4.58-10.24,10.24-10.24 C370.02,32.16,374.6,36.75,374.6,42.4 M403.6,42.4c0,5.65-4.58,10.24-10.24,10.24c-5.65,0-10.24-4.58-10.24-10.24 c0-5.65,4.58-10.24,10.24-10.24C399.02,32.16,403.6,36.75,403.6,42.4"/>' +
    '<path fill="#6E6E6E" d="M13.13,45.43H4.38v14.03c0,0.97-0.72,1.69-1.69,1.69C1.77,61.15,1,60.43,1,59.46V25.05 c0-0.92,0.77-1.69,1.69-1.69h9.83c8.75,0,11.88,5.07,11.88,9.83v2.61C24.4,41.44,20.2,45.43,13.13,45.43z M21.02,33.24 c0-3.02-1.89-6.71-8.65-6.71H4.38v15.77h8.65c5.48,0,7.99-2.97,7.99-6.55V33.24z"/>' +
    '<path fill="#6E6E6E" d="M35.1,60.99c-7.12,0-9.93-4.71-9.93-10.44v-5.17c0-5.79,2.82-10.44,9.93-10.44s9.93,4.66,9.93,10.44v5.17 C45.03,56.28,42.21,60.99,35.1,60.99z M41.8,45.38c0-4.45-1.95-7.37-6.71-7.37c-4.81,0-6.71,2.92-6.71,7.37v5.17 c0,4.45,1.89,7.37,6.71,7.37c4.76,0,6.71-2.92,6.71-7.37V45.38z"/>' +
    '<path fill="#6E6E6E" d="M66.33,60.99c-0.87,0-1.64-0.72-1.64-1.64V44.3c0-3.79-1.02-6.25-5.43-6.25c-3.48,0-5.94,1.48-7.17,3.79 v17.51c0,0.92-0.77,1.64-1.64,1.64c-0.92,0-1.64-0.72-1.64-1.64v-34.1c0-0.92,0.72-1.64,1.64-1.64c0.87,0,1.64,0.72,1.64,1.64 v12.49c1.69-1.79,4.2-2.82,7.63-2.82c6.5,0,8.24,4.04,8.24,9.16v15.26C67.96,60.28,67.25,60.99,66.33,60.99z"/>' +
    '<path fill="#6E6E6E" d="M68.47,70.06c-0.97,0-1.48-0.72-1.48-1.48c0-0.77,0.51-1.43,1.48-1.48c2.87-0.05,4.35-1.28,4.35-5.89V36.57 c0-0.92,0.77-1.64,1.64-1.64c0.97,0,1.64,0.72,1.64,1.64V61.1C76.1,67.14,73.59,70.06,68.47,70.06z M74.46,24.34 c1.23,0,2.2,0.97,2.2,2.2s-0.97,2.15-2.2,2.15s-2.2-0.92-2.2-2.15S73.23,24.34,74.46,24.34z"/>' +
    '<path fill="#6E6E6E" d="M90.13,60.99c-7.12,0-9.93-4.71-9.93-10.44v-5.17c0-5.79,2.82-10.44,9.93-10.44s9.93,4.66,9.93,10.44v5.17 C100.06,56.28,97.25,60.99,90.13,60.99z M96.84,45.38c0-4.45-1.95-7.37-6.71-7.37c-4.81,0-6.71,2.92-6.71,7.37v5.17 c0,4.45,1.89,7.37,6.71,7.37c4.76,0,6.71-2.92,6.71-7.37V45.38z"/>' +
    '<path fill="#6E6E6E" d="M108.1,60.99c-0.61,0-1.74-0.41-2.46-1.08c-1.18-1.08-1.64-2.61-1.64-4.15V25.26c0-0.92,0.72-1.64,1.59-1.64 c0.92,0,1.64,0.72,1.64,1.64V54.9c0,2.25,0.56,2.87,1.69,3.33c0.56,0.26,0.77,0.72,0.77,1.28 C109.68,60.48,109.02,60.99,108.1,60.99z"/>' +
    '<path fill="#6E6E6E" d="M130.57,60.99c-0.82,0-1.54-0.31-2.15-0.82c-0.56-0.51-0.97-1.28-1.23-2.05c-1.84,2.36-4.92,2.87-7.17,2.87 c-6.45,0-8.86-3.38-8.86-7.32v-0.41c0-3.99,2.56-7.22,9.11-7.22h6.45v-1.43c0-4.61-1.13-6.86-5.99-6.86 c-1.84,0-3.07,0.26-4.1,0.67c-1.18,0.51-1.69,0.92-2.3,0.92c-0.77,0-1.38-0.61-1.38-1.38c0-0.87,0.87-1.54,2.2-2.1 c1.69-0.67,3.74-0.92,5.73-0.92c7.22,0,9.06,3.64,9.06,9.88V54.9c0,2.2,0.36,2.87,1.48,3.33c0.56,0.26,0.82,0.72,0.82,1.28 C132.26,60.48,131.54,60.99,130.57,60.99z M126.73,48.76h-6.25c-4.86,0-6.09,2.25-6.09,4.56v0.36c0,2.36,1.23,4.56,5.99,4.56 c3.99,0,6.35-2,6.35-6.09V48.76z"/>' +
    '<path fill="#6E6E6E" d="M159.5,59.51c-0.41,1.18-1.02,1.64-1.89,1.64c-0.97,0-1.59-0.46-2.05-1.64 c-4.51-12.24-8.29-23.65-11.47-34.46c-0.41-1.28,0.61-2.15,1.64-2.15c0.67,0,1.33,0.41,1.59,1.28c2.87,9.73,6.3,20.33,10.39,31.33 c4.05-11.06,7.63-21.66,10.5-31.49c0.26-0.77,0.87-1.13,1.49-1.13c0.97,0,1.89,0.82,1.54,2C168.05,35.7,164.05,47.22,159.5,59.51z"/>' +
    '<path fill="#6E6E6E" d="M189.91,60.99c-0.82,0-1.54-0.31-2.15-0.82c-0.56-0.51-0.97-1.28-1.23-2.05c-1.84,2.36-4.92,2.87-7.17,2.87 c-6.45,0-8.86-3.38-8.86-7.32v-0.41c0-3.99,2.56-7.22,9.11-7.22h6.45v-1.43c0-4.61-1.13-6.86-5.99-6.86 c-1.84,0-3.07,0.26-4.1,0.67c-1.18,0.51-1.69,0.92-2.3,0.92c-0.77,0-1.38-0.61-1.38-1.38c0-0.87,0.87-1.54,2.2-2.1 c1.69-0.67,3.74-0.92,5.73-0.92c7.22,0,9.06,3.64,9.06,9.88V54.9c0,2.2,0.36,2.87,1.48,3.33c0.56,0.26,0.82,0.72,0.82,1.28 C191.6,60.48,190.88,60.99,189.91,60.99z M186.07,48.76h-6.25c-4.86,0-6.09,2.25-6.09,4.56v0.36c0,2.36,1.23,4.56,5.99,4.56 c3.99,0,6.35-2,6.35-6.09V48.76z"/>' +
    '<path fill="#6E6E6E" d="M211.51,60.99c-0.51,0-1.08-0.26-1.38-0.92c-2.25-4.35-5.12-8.7-8.04-12.59l-3.94,4.04v7.83 c0,0.92-0.77,1.64-1.64,1.64c-0.92,0-1.64-0.72-1.64-1.64v-34.1c0-0.92,0.72-1.64,1.64-1.64c0.87,0,1.64,0.72,1.64,1.64v22.17 l11.78-12.08c0.61-0.56,1.53-0.56,2.15,0c0.56,0.56,0.56,1.54-0.05,2.1l-7.63,7.78c3.12,4.15,6.19,8.81,8.6,13.47 C213.61,59.97,212.59,60.99,211.51,60.99z"/>' +
    '<path fill="#6E6E6E" d="M235.73,60.99c-0.66,0-1.79-0.41-2.46-1.08c-0.66-0.61-1.07-1.33-1.28-2.1c-1.74,2-4.35,3.17-8.04,3.17 c-6.45,0-8.29-4.1-8.29-9.22V36.57c0-0.97,0.77-1.64,1.64-1.64c0.92,0,1.64,0.67,1.64,1.64v15c0,3.89,1.07,6.25,5.48,6.25 c3.69,0,5.99-1.59,7.17-4.04v-17.2c0-0.97,0.72-1.64,1.64-1.64c0.92,0,1.64,0.72,1.64,1.64V54.9c0,2.25,0.51,2.87,1.64,3.33 c0.56,0.26,0.87,0.72,0.87,1.28C237.36,60.48,236.6,60.99,235.73,60.99z"/>' +
    '<path fill="#6E6E6E" d="M259.84,60.99c-0.67,0-1.79-0.41-2.46-1.08c-0.67-0.61-1.08-1.33-1.28-2.1c-1.74,2-4.35,3.17-8.04,3.17 c-6.45,0-8.29-4.1-8.29-9.22V36.57c0-0.97,0.77-1.64,1.64-1.64c0.92,0,1.64,0.67,1.64,1.64v15c0,3.89,1.08,6.25,5.48,6.25 c3.69,0,5.99-1.59,7.17-4.04v-17.2c0-0.97,0.72-1.64,1.64-1.64c0.92,0,1.64,0.72,1.64,1.64V54.9c0,2.25,0.51,2.87,1.64,3.33 c0.56,0.26,0.87,0.72,0.87,1.28C261.48,60.48,260.71,60.99,259.84,60.99z"/>' +
    '<path fill="#6E6E6E" d="M274.94,60.69h-1.28c-6.96,0-8.4-4.25-8.4-10.7V38.16h-1.79c-0.82,0-1.48-0.67-1.48-1.48 c0-0.82,0.66-1.43,1.48-1.43h1.79v-6.2c0-0.92,0.72-1.64,1.64-1.64c0.92,0,1.64,0.72,1.64,1.64v6.2h5.12 c0.82,0,1.48,0.61,1.48,1.43c0,0.82-0.66,1.48-1.48,1.48h-5.12v11.83c0,5.53,0.87,7.63,5.32,7.63h1.07c0.87,0,1.54,0.72,1.54,1.54 C276.47,60.02,275.81,60.69,274.94,60.69z"/>' +
    '<path fill="#6E6E6E" d="M298.13,60.99c-0.66,0-1.79-0.41-2.46-1.08c-0.66-0.61-1.07-1.33-1.28-2.1c-1.74,2-4.35,3.17-8.04,3.17 c-6.45,0-8.29-4.1-8.29-9.22V36.57c0-0.97,0.77-1.64,1.64-1.64c0.92,0,1.64,0.67,1.64,1.64v15c0,3.89,1.07,6.25,5.48,6.25 c3.69,0,5.99-1.59,7.17-4.04v-17.2c0-0.97,0.72-1.64,1.64-1.64c0.92,0,1.64,0.72,1.64,1.64V54.9c0,2.25,0.51,2.87,1.64,3.33 c0.56,0.26,0.87,0.72,0.87,1.28C299.77,60.48,299,60.99,298.13,60.99z"/>' +
    '<path fill="#6E6E6E" d="M309.85,60.99c-3.17,0-5.17-0.36-7.17-1.13c-0.87-0.31-1.13-1.23-0.82-1.95c0.26-0.77,1.07-1.18,1.89-0.82 c1.69,0.61,3.28,0.97,6.14,0.97c4.3,0,6.09-1.89,6.09-4.61c0-3.53-3.64-3.79-7.27-4.56c-3.48-0.77-6.86-1.89-6.86-6.71 c0-4.61,3.53-7.27,8.4-7.27c2.66,0,4.45,0.26,6.35,1.08c0.87,0.31,1.13,1.23,0.82,2c-0.31,0.67-1.07,1.13-1.89,0.77 c-1.69-0.67-3.07-0.97-5.22-0.97c-3.48,0-5.32,1.79-5.32,4.3c0,3.17,3.23,3.64,6.61,4.3c3.74,0.77,7.58,1.74,7.58,6.96 C319.17,58.33,315.48,60.99,309.85,60.99z"/>' +
    '</svg>';

  function banner(url) {
    return '<div class="av-op-banner"><div class="av-op-inner">' +
      '<h2 class="av-op-title">Muista vakuuttaa uusi autosi</h2>' +
      '<p class="av-op-text">Saat kaskon vuodeksi ‑50 %, kun keskität vakuutuksesi Pohjola Vakuutukseen.</p>' +
      '<a class="av-op-cta" href="' + url + '" target="_blank" rel="noopener">' +
        'Laske hinta ja osta<span class="av-op-sr"> (avautuu uuteen välilehteen)</span>' +
      '</a>' +
      '<div class="av-op-foot">' +
        '<p class="av-op-legal">Etu koskee henkilöauton uusia kaskoja ensimmäisen vakuutuskauden ajan ja on voimassa 31.12.2026 saakka. Vakuutuksen myöntää Pohjola Vakuutus Oy.</p>' +
        LOGO +
      '</div>' +
    '</div></div>';
  }

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
  // nothing else about the auction. The block goes directly above the FAQ
  // section, found by its title.
  var FAQ_TITLE = 'Usein kysytyt kysymykset';
  function decisionAnchor() {
    var titles = document.querySelectorAll('h2.text-3xl.font-bold.text-black');
    var hero = null;
    for (var i = 0; i < titles.length; i++) {
      if (DECISION_TITLES.indexOf(titles[i].textContent.trim()) !== -1 && visible(titles[i])) { hero = titles[i]; break; }
    }
    if (!hero) return null;
    var sections = document.querySelectorAll('section');
    for (var j = 0; j < sections.length; j++) {
      var h = sections[j].querySelector('h2');
      if (h && h.textContent.trim() === FAQ_TITLE && visible(sections[j])) return sections[j];
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

  // where: 'afterend' (after the anchor) or 'beforebegin' (before it).
  function place(anchor, where, tag, cls, inner) {
    var existing = document.getElementById(ID);
    if (existing && (where === 'afterend' ? existing.previousElementSibling : existing.nextElementSibling) === anchor) return;
    if (existing) existing.remove();
    injectCss();
    anchor.insertAdjacentHTML(where, '<' + tag + ' id="' + ID + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + inner + '</' + tag + '>');
  }

  function remove() {
    var existing = document.getElementById(ID);
    if (existing) existing.remove();
  }

  function sync() {
    // Finnish only, like the copy.
    if (/^en/i.test(document.documentElement.lang || '')) return remove();
    var anchor = successAnchor();
    if (anchor) return place(anchor, 'afterend', 'div', 'av-op-success', banner(URL_SUCCESS));
    anchor = decisionAnchor();
    if (anchor) return place(anchor, 'beforebegin', 'section', '', '<div class="container mx-auto">' + banner(URL_DECISION) + '</div>');
    remove();
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
