/**
 * Similar cars - the block for the "Similar cars" initiative
 * (design-specs/similar-cars.html). Host-agnostic: it renders into any element
 * and brings no section heading, so the offers page, the decision page or a
 * funnel step can each wrap it in their own.
 *
 * window.SimilarCars.render(el, opts) -> boolean, false when nothing was drawn
 *   opts.variant  'table' | 'cards'
 *   opts.groups   Array<{ car: {make, model, registration_number}, cars: Array<SimilarCar> }>,
 *                 one per seller's car, in the order the host lists those cars
 *   opts.car + opts.cars  shorthand for a single group
 *   opts.initial  shown per group before "Näytä lisää" (default 5)
 *   opts.step     added per press (default 5)
 *
 * window.SimilarCars.mock(car, mode) -> Array<SimilarCar>
 *   car   { make, model } - the seller's own car
 *   mode  'same' | 'mixed' | 'few' | 'none'
 *
 * @typedef {Object} SimilarCar
 * @property {string} make
 * @property {string} model
 * @property {string} model_specification
 * @property {number} year
 * @property {number} driven              km
 * @property {number} highest_offer       EUR, the auction's highest offer - never a sale price
 * @property {string|null} image          first exterior photo, plate already blurred
 * @property {{x:number,y:number,w:number,h:number}|null} plate_box
 *           proto only: where the plate sits in the 16:9 frame, as fractions,
 *           so the mock photos can be blurred client-side
 * @property {number} ended_days_ago
 */
(function () {
  'use strict';

  /* Below this many cars the block renders nothing: a list of one or two
     reads as a quote for the seller's own car rather than as evidence. */
  var MIN_RESULTS = 3;

  /* Resolved against this script's own src so spec pages under design-specs/
     can mount the block too. */
  var ROOT = ((document.currentScript && document.currentScript.src) || '').replace(/similar-cars\.js(\?.*)?$/, '');

  var STYLE_ID = 'similar-cars-style';
  if (!document.getElementById(STYLE_ID)) {
    var st = document.createElement('style');
    st.id = STYLE_ID;
    /* Hand-written because the markup is built by JS: the Play CDN generates
       utilities a tick after first paint, and layout must not jump. Values
       transcribe prod classes named beside each rule. */
    st.textContent = [
      '.sc{container-type:inline-size;}',
      /* The two layout-only columns drop below 520px of the BLOCK's width, not
         the viewport's, because a funnel sidebar is narrow at any viewport. */
      '.sc-wide{display:none;}',
      '.sc-meta{display:block;}',
      '@container (min-width: 520px){.sc-wide{display:table-cell;}.sc-meta{display:none;}}',
      '.sc-table{width:100%;border-collapse:collapse;}',
      '.sc-table th,.sc-table td{padding:8px 0;vertical-align:top;}',
      '.sc-table th+th,.sc-table td+td{padding-left:16px;}',
      /* OProductCard + OProductCardMedia (aspect-ratio-16/9). */
      '.sc-strip{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:thin;padding-bottom:6px;}',
      '.sc-card{flex:0 0 260px;scroll-snap-align:start;}',
      '.sc-media{position:relative;aspect-ratio:16/9;overflow:hidden;background:#88CFFF;}',
      '.sc-media img.sc-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}',
      '.sc-plate{position:absolute;border-radius:2px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);background:rgba(255,255,255,.2);}',
      /* ListingCardBiddingInfo's label is leading-4 on prod's scale = 28px. */
      '.sc-bid-label{line-height:28px;}',
      '.sc-arrows{display:none;}',
      '@container (min-width: 520px){.sc-arrows{display:flex;}}'
    ].join('');
    document.head.appendChild(st);
  }

  function tr(key, fallback) {
    var v = window.t ? window.t('similarCars.' + key) : null;
    return (v && v !== 'similarCars.' + key) ? v : fallback;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function groupThousands(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  function eur(n) { return groupThousands(n) + ' €'; }
  function km(n) { return groupThousands(n) + ' km'; }

  function uniformModel(cars) {
    var first = cars[0];
    var same = cars.every(function (c) { return c.make === first.make && c.model === first.model; });
    return same ? { make: first.make, model: first.model } : null;
  }

  function yearRange(cars) {
    var ys = cars.map(function (c) { return c.year; });
    return { from: Math.min.apply(null, ys), to: Math.max.apply(null, ys) };
  }

  var ICON_INFO = '<svg width="16" height="16" viewBox="0 0 30 31" fill="#0B6DFF" class="flex-shrink-0 mt-0.5" aria-hidden="true"><path d="M15 3.14648C12.5895 3.14648 10.2332 3.86127 8.22899 5.20045C6.22477 6.53963 4.66267 8.44306 3.74022 10.67C2.81778 12.897 2.57643 15.3475 3.04668 17.7116C3.51694 20.0758 4.67769 22.2474 6.38214 23.9518C8.08659 25.6563 10.2582 26.817 12.6223 27.2873C14.9865 27.7576 17.437 27.5162 19.664 26.5938C21.8909 25.6713 23.7944 24.1092 25.1335 22.105C26.4727 20.1008 27.1875 17.7444 27.1875 15.334C27.1841 12.1027 25.899 9.00475 23.6141 6.71989C21.3292 4.43503 18.2313 3.1499 15 3.14648ZM14.5313 8.77148C14.8094 8.77148 15.0813 8.85396 15.3125 9.00848C15.5438 9.163 15.724 9.38263 15.8305 9.63959C15.9369 9.89654 15.9647 10.1793 15.9105 10.4521C15.8562 10.7249 15.7223 10.9754 15.5256 11.1721C15.329 11.3688 15.0784 11.5027 14.8056 11.557C14.5328 11.6112 14.2501 11.5834 13.9931 11.4769C13.7361 11.3705 13.5165 11.1903 13.362 10.959C13.2075 10.7277 13.125 10.4559 13.125 10.1777C13.125 9.80477 13.2732 9.44709 13.5369 9.18337C13.8006 8.91964 14.1583 8.77148 14.5313 8.77148ZM15.9375 21.8965C15.4402 21.8965 14.9633 21.6989 14.6117 21.3473C14.26 20.9957 14.0625 20.5188 14.0625 20.0215V15.334C13.8139 15.334 13.5754 15.2352 13.3996 15.0594C13.2238 14.8836 13.125 14.6451 13.125 14.3965C13.125 14.1478 13.2238 13.9094 13.3996 13.7336C13.5754 13.5578 13.8139 13.459 14.0625 13.459C14.5598 13.459 15.0367 13.6565 15.3883 14.0082C15.74 14.3598 15.9375 14.8367 15.9375 15.334V20.0215C16.1861 20.0215 16.4246 20.1203 16.6004 20.2961C16.7762 20.4719 16.875 20.7103 16.875 20.959C16.875 21.2076 16.7762 21.4461 16.6004 21.6219C16.4246 21.7977 16.1861 21.8965 15.9375 21.8965Z"/></svg>';
  var ICON_CARET_LEFT = '<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z"/></svg>';
  var ICON_CARET_RIGHT = '<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z"/></svg>';
  var ICON_CAR = '<img src="' + ROOT + 'assets/ph-car-simple-white.svg" class="relative opacity-60" style="width:70px;height:70px" alt="" />';

  /* UiButton secondary, size md (text-sm px-5 h-10, no weight of its own). */
  var BTN_SECONDARY = 'inline-flex items-center justify-center rounded-lg font-dm text-sm px-5 h-10 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-800 transition-colors cursor-pointer';
  /* UiButton secondary, size sm, iconOnly. */
  var BTN_ICON = 'inline-flex items-center justify-center rounded-lg h-8 w-8 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default disabled:hover:bg-blue-100';

  function infoLine() {
    return '<div class="flex items-start gap-2">' + ICON_INFO +
      '<p class="font-dm text-sm text-slate-700">' + esc(tr('caveat', 'Jokainen auto on yksilö. Kunto, varustelu ja huoltohistoria vaikuttavat siihen, mitä siitä tarjotaan.')) + '</p>' +
    '</div>';
  }

  function loadMore(gi, shown, total) {
    if (shown >= total) return '';
    return '<button type="button" data-sc-more="' + gi + '" class="' + BTN_SECONDARY + '">' + esc(tr('loadMore', 'Näytä lisää')) + '</button>';
  }

  /* Names the seller's car each list belongs to, so a seller with several cars
     can tell the lists apart. A div with a heading role rather than an h3:
     the proto's element rules would restyle an h3 as a 24-32px title. */
  function subjectText(g) {
    var car = (g.car && g.car.make) ? g.car : (uniformModel(g.cars) || { make: '', model: '' });
    var name = (car.make + ' ' + car.model).trim();
    var range = yearRange(g.cars);
    var years = tr('years', 'vuosimallit {from}–{to}').replace('{from}', range.from).replace('{to}', range.to);
    return { name: name, years: years };
  }
  /* The plate badge is vehicle-card.js's ARegistrationNumberBadge, so the
     heading matches the seller's own car card and notification above it;
     a host that does not load vehicle-card.js gets the heading without it. */
  function subject(g) {
    var t = subjectText(g);
    var plate = g.car && g.car.registration_number && window.buildRegBadge ? window.buildRegBadge(g.car.registration_number) : '';
    return '<div role="heading" aria-level="3" class="flex flex-wrap items-center gap-x-3 gap-y-1 font-dm text-base">' +
      (plate ? '<span class="flex-shrink-0">' + plate + '</span>' : '') +
      '<span><span class="font-bold text-slate-900">' + esc(t.name) + '</span>' +
      ' <span class="text-slate-500">· <span class="whitespace-nowrap">' + esc(t.years) + '</span></span></span></div>';
  }

  /* Timer.vue's card shell, so the block reads as one of the offers page's
     own white cards; rows take ComissionList.vue's border-b-gray-300 rule,
     the only consumer-side table prod has. */
  function buildTableGroup(g, gi, shown) {
    var uni = uniformModel(g.cars);
    var firstCol = uni ? tr('colSpec', 'Mallitarkennus') : tr('colCar', 'Auto');
    var t = subjectText(g);
    var rows = g.cars.slice(0, shown).map(function (c) {
      return '<tr class="border-b border-b-gray-300 last:border-b-0">' +
        '<td class="text-left">' +
          (uni ? '' : '<span class="block font-bold text-slate-900">' + esc(c.make + ' ' + c.model) + '</span>') +
          '<span class="block text-black">' + esc(c.model_specification) + '</span>' +
          '<span class="sc-meta text-sm text-slate-500">' + esc(c.year) + ' · ' + esc(km(c.driven)) + '</span>' +
        '</td>' +
        '<td class="sc-wide text-left text-black whitespace-nowrap">' + esc(c.year) + '</td>' +
        '<td class="sc-wide text-right text-black whitespace-nowrap">' + esc(km(c.driven)) + '</td>' +
        '<td class="text-right font-bold text-black whitespace-nowrap">' + esc(eur(c.highest_offer)) + '</td>' +
      '</tr>';
    }).join('');
    return '<div class="flex flex-col gap-4" data-sc-group="' + gi + '">' +
      subject(g) +
      '<table class="sc-table font-dm text-base">' +
        '<caption class="sr-only">' + esc(t.name + ', ' + t.years) + '</caption>' +
        '<thead><tr class="border-b border-b-gray-300 text-sm">' +
          '<th scope="col" class="text-left font-bold text-black">' + esc(firstCol) + '</th>' +
          '<th scope="col" class="sc-wide text-left font-bold text-black">' + esc(tr('colYear', 'Vuosimalli')) + '</th>' +
          '<th scope="col" class="sc-wide text-right font-bold text-black">' + esc(tr('colKm', 'Ajokilometrit')) + '</th>' +
          '<th scope="col" class="text-right font-bold text-black">' + esc(tr('highestOffer', 'Korkein tarjous')) + '</th>' +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
      (shown < g.cars.length ? '<div class="flex justify-center">' + loadMore(gi, shown, g.cars.length) + '</div>' : '') +
    '</div>';
  }

  function buildTable(groups, shown) {
    return '<div class="sc sc--table bg-white border border-gray-200 shadow-sm rounded-xl p-4 sm:p-5 flex flex-col gap-8">' +
      groups.map(function (g, gi) { return buildTableGroup(g, gi, shown[gi]); }).join('') +
      infoLine() +
    '</div>';
  }

  /* OProductCard (default variant) with OProductCardMedia. The price row is
     ListingCardAuctionRows + ListingCardBiddingInfo, the one place prod already
     shows a seller "Korkein tarjous" on a car card. Deliberate deviation: prod
     overlays that row on the photo's bottom edge; on a 260px card it covered a
     third of a 146px photo, so here it sits under the photo instead. */
  function buildCard(c) {
    var media = c.image
      ? '<img class="sc-photo" src="' + esc(/^(https?:|data:|\/)/.test(c.image) ? c.image : ROOT + c.image) + '" alt="" />' +
        (c.plate_box
          ? '<div class="sc-plate" style="left:' + (c.plate_box.x * 100) + '%;top:' + (c.plate_box.y * 100) + '%;width:' + (c.plate_box.w * 100) + '%;height:' + (c.plate_box.h * 100) + '%"></div>'
          : '')
      : '<div class="absolute inset-0 flex items-center justify-center">' + ICON_CAR + '</div>';
    var pill = function (v) {
      return '<span class="px-1.5 py-0.5 font-dm text-xs text-slate-500 rounded border border-slate-200">' + esc(v) + '</span>';
    };
    return '<article role="listitem" class="sc-card w-full rounded-2xl overflow-hidden flex flex-col bg-white border border-slate-200">' +
      '<div class="sc-media">' + media + '</div>' +
      '<div class="bg-white px-5 py-3 border-b border-gray-200">' +
        '<div class="flex justify-between items-center w-full font-dm">' +
          '<span class="sc-bid-label font-medium text-slate-800">' + esc(tr('highestOffer', 'Korkein tarjous')) + '</span>' +
          '<span class="text-slate-800">' + esc(eur(c.highest_offer)) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="flex-1 flex flex-col p-6 space-y-4">' +
        '<p class="font-body font-bold leading-snug text-slate-800 text-xl">' + esc(c.make + ' ' + c.model) + '</p>' +
        '<p class="font-body font-medium leading-tight text-slate-600 text-base">' + esc(c.model_specification) + '</p>' +
        '<div class="flex flex-wrap gap-1.5 items-center">' + pill(c.year) + pill(km(c.driven)) + '</div>' +
      '</div>' +
    '</article>';
  }

  function buildCardsGroup(g, gi, shown) {
    var more = shown < g.cars.length
      ? '<div class="sc-card flex items-center justify-center rounded-2xl border border-slate-200 bg-white">' + loadMore(gi, shown, g.cars.length) + '</div>'
      : '';
    return '<div class="flex flex-col gap-4" data-sc-group="' + gi + '">' +
      '<div class="flex items-center justify-between gap-4">' + subject(g) +
        '<div class="sc-arrows gap-2 flex-shrink-0">' +
          '<button type="button" data-sc-prev class="' + BTN_ICON + '" aria-label="' + esc(tr('prev', 'Edelliset')) + '">' + ICON_CARET_LEFT + '</button>' +
          '<button type="button" data-sc-next class="' + BTN_ICON + '" aria-label="' + esc(tr('next', 'Seuraavat')) + '">' + ICON_CARET_RIGHT + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="sc-strip" role="list" tabindex="0">' + g.cars.slice(0, shown).map(buildCard).join('') + more + '</div>' +
    '</div>';
  }

  function buildCards(groups, shown) {
    return '<div class="sc sc--cards flex flex-col gap-8">' +
      groups.map(function (g, gi) { return buildCardsGroup(g, gi, shown[gi]); }).join('') +
      infoLine() +
    '</div>';
  }

  var mounts = [];

  function draw(m) {
    if (!m.groups.length) { m.el.innerHTML = ''; m.syncs = []; return false; }
    var shown = m.groups.map(function (g, gi) { return Math.min(m.shown[gi], g.cars.length); });
    var scrolls = Array.prototype.map.call(m.el.querySelectorAll('.sc-strip'), function (s) { return s.scrollLeft; });
    m.el.innerHTML = m.opts.variant === 'cards' ? buildCards(m.groups, shown) : buildTable(m.groups, shown);
    wire(m, scrolls);
    return true;
  }

  function wire(m, scrolls) {
    m.syncs = [];
    Array.prototype.forEach.call(m.el.querySelectorAll('[data-sc-more]'), function (btn) {
      btn.addEventListener('click', function () {
        var gi = +btn.getAttribute('data-sc-more');
        var before = m.shown[gi];
        m.shown[gi] += m.step;
        draw(m);
        focusFirstNew(m, gi, before);
      });
    });
    Array.prototype.forEach.call(m.el.querySelectorAll('[data-sc-group]'), function (group, gi) {
      var strip = group.querySelector('.sc-strip');
      if (!strip) return;
      strip.scrollLeft = scrolls[gi] || 0;
      var prev = group.querySelector('[data-sc-prev]');
      var next = group.querySelector('[data-sc-next]');
      function page(dir) {
        var card = strip.querySelector('.sc-card');
        var w = card ? card.getBoundingClientRect().width + 16 : 276;
        strip.scrollBy({ left: dir * w, behavior: 'smooth' });
      }
      function sync() {
        prev.disabled = strip.scrollLeft <= 1;
        next.disabled = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1;
      }
      prev.addEventListener('click', function () { page(-1); });
      next.addEventListener('click', function () { page(1); });
      strip.addEventListener('scroll', sync, { passive: true });
      m.syncs.push(sync);
      sync();
      /* A host usually un-hides its section after render() returns, so the
         first measurement can be of a zero-width strip. */
      setTimeout(sync, 0);
      setTimeout(sync, 200);
    });
  }

  /* After "Näytä lisää" the button is gone, so focus would drop to <body>;
     moving it to the first added item keeps a keyboard user in place. */
  function focusFirstNew(m, gi, index) {
    var group = m.el.querySelectorAll('[data-sc-group]')[gi];
    if (!group) return;
    var target = group.querySelectorAll(m.opts.variant === 'cards' ? '.sc-strip article' : 'tbody tr')[index];
    if (!target) return;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: m.opts.variant !== 'cards' });
    if (m.opts.variant === 'cards') target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }

  function render(el, opts) {
    if (!el) return false;
    opts = opts || {};
    var m = null;
    for (var i = 0; i < mounts.length; i++) if (mounts[i].el === el) m = mounts[i];
    if (!m) { m = { el: el }; mounts.push(m); }
    m.opts = opts;
    m.step = opts.step || 5;
    var groups = opts.groups || [{ car: opts.car || null, cars: opts.cars || [] }];
    m.groups = groups.filter(function (g) { return (g.cars || []).length >= MIN_RESULTS; });
    m.shown = m.groups.map(function () { return opts.initial || 5; });
    return draw(m);
  }

  document.addEventListener('av:langchange', function () { mounts.forEach(draw); });
  window.addEventListener('resize', function () {
    mounts.forEach(function (m) { (m.syncs || []).forEach(function (f) { f(); }); });
  });

  /* Mock data. Figures are invented for the prototype and carry no market
     meaning. Photos are a shared placeholder pool of front three-quarter
     shots (the funnel's first photo slot) and do NOT show the model named on
     the card; production uses each car's own first exterior photo. */
  var PHOTOS = [
    { src: 'assets/review-car-corolla.jpg', plate: null },
    { src: 'assets/scenario-ulkopuoli-1.jpg', plate: { x: 0.41, y: 0.725, w: 0.165, h: 0.085 } },
    { src: 'assets/review-car-focus.jpg', plate: null }
  ];

  var DATA = {
    'volkswagen amarok': {
      same: [
        ['2.0 TDI Highline 4Motion', 2019, 139000, 26450, 3],
        ['3.0 V6 TDI Aventura 4Motion', 2019, 162000, 29900, 5],
        ['2.0 BiTDI Trendline 4Motion', 2018, 171000, 21300, 8],
        ['2.0 TDI Highline', 2020, 118000, 30800, 11],
        ['3.0 V6 TDI Highline 4Motion', 2018, 154000, 25700, 14],
        ['2.0 TDI Comfortline 4Motion', 2019, 181000, 22950, 18],
        ['2.0 BiTDI Highline 4Motion', 2019, 127000, 27600, 21],
        ['3.0 V6 TDI Canyon 4Motion', 2020, 146000, 31200, 26],
        ['2.0 TDI Trendline', 2018, 192000, 19800, 30],
        ['2.0 TDI Highline 4Motion', 2019, 158000, 25100, 35],
        ['3.0 V6 TDI Aventura 4Motion', 2018, 133000, 28300, 41],
        ['2.0 BiTDI Comfortline 4Motion', 2020, 149000, 26900, 47]
      ],
      peers: [
        ['Ford', 'Ranger', '2.0 EcoBlue Wildtrak 4x4', 2019, 141000, 27200, 4],
        ['Toyota', 'Hilux', '2.4 D-4D Double Cab Active 4WD', 2019, 155000, 26100, 9],
        ['Nissan', 'Navara', '2.3 dCi N-Connecta 4x4', 2018, 163000, 20900, 16],
        ['Mitsubishi', 'L200', '2.2 DI-D Intense 4WD', 2020, 137000, 24300, 24],
        ['Ford', 'Ranger', '3.2 TDCi Limited 4x4', 2018, 176000, 22400, 33]
      ]
    },
    'toyota corolla': {
      same: [
        ['1.8 Hybrid Active Touring Sports', 2020, 79000, 17450, 2],
        ['2.0 Hybrid GR Sport', 2020, 91000, 19900, 6],
        ['1.8 Hybrid Prestige Edition', 2019, 88000, 16300, 9],
        ['1.2 T Active', 2020, 74000, 14950, 13],
        ['1.8 Hybrid Style Hatchback', 2021, 61000, 19600, 17],
        ['1.8 Hybrid Active', 2019, 102000, 15200, 22],
        ['2.0 Hybrid Executive', 2020, 84000, 20400, 27],
        ['1.8 Hybrid Active Sedan', 2020, 97000, 16100, 31],
        ['1.8 Hybrid Prestige Touring Sports', 2021, 69000, 20100, 38],
        ['1.2 T Active Touring Sports', 2019, 109000, 13300, 44]
      ],
      peers: [
        ['Volkswagen', 'Golf', '1.5 eTSI Life DSG', 2020, 83000, 17900, 5],
        ['Ford', 'Focus', '1.0 EcoBoost Titanium', 2020, 77000, 13800, 12],
        ['Skoda', 'Octavia', '1.5 TSI Style DSG', 2020, 95000, 17200, 19],
        ['Hyundai', 'i30', '1.5 T-GDI Comfort', 2020, 81000, 14400, 28]
      ]
    }
  };

  function mock(car, mode) {
    car = car || {};
    var key = ((car.make || '') + ' ' + (car.model || '')).trim().toLowerCase();
    var set = DATA[key] || DATA['volkswagen amarok'];
    var make = DATA[key] ? car.make : 'Volkswagen';
    var model = DATA[key] ? car.model : 'Amarok';
    var rows = set.same.map(function (r) { return [make, model].concat(r); });
    if (mode === 'mixed') {
      var mixed = [];
      for (var i = 0; i < rows.length; i++) {
        mixed.push(rows[i]);
        if (i % 2 === 1 && set.peers[(i - 1) / 2]) mixed.push(set.peers[(i - 1) / 2]);
      }
      rows = mixed;
    }
    rows.sort(function (a, b) { return a[6] - b[6]; });
    if (mode === 'few') rows = rows.slice(0, MIN_RESULTS);
    if (mode === 'none') rows = rows.slice(0, MIN_RESULTS - 1);
    return rows.map(function (r, i) {
      var p = PHOTOS[i % PHOTOS.length];
      return {
        make: r[0], model: r[1], model_specification: r[2], year: r[3], driven: r[4],
        highest_offer: r[5], ended_days_ago: r[6],
        image: p.src, plate_box: p.plate
      };
    });
  }

  window.SimilarCars = { render: render, mock: mock, MIN_RESULTS: MIN_RESULTS };
})();
