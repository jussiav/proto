/**
 * Similar cars - the block for the "Similar cars" initiative
 * (design-specs/similar-cars.html). Host-agnostic: it renders into any element
 * and brings no section heading, so the offers page, the decision page or a
 * funnel step can each wrap it in their own.
 *
 * window.SimilarCars.render(el, opts) -> boolean, false when nothing was drawn
 *   opts.variant  'table' | 'cards'
 *   opts.groups   Array<{ car: {make, model}, cars: Array<SimilarCar> }>, one per
 *                 seller's car in the order the host lists them; cars sharing a
 *                 make and model collapse into the first one's list. Each list
 *                 is ordered latest first by ended_at and split into recency
 *                 bands (RECENCY), whatever order the host passes
 *   opts.car + opts.cars  shorthand for a single group
 *   opts.price    'highest' (default) | 'accepted' - which offer each car shows
 *   opts.initial  shown per group before the load-more button (default 5)
 *   opts.step     added per press (default 5)
 *   opts.max      the most a list ever shows, newest kept (default: all)
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
 * @property {number} [accepted_offer]    EUR, the offer the seller accepted; read when opts.price is 'accepted'
 * @property {string|null} image          first exterior photo, plate already blurred
 * @property {{x:number,y:number,w:number,h:number}|null} plate_box
 *           proto only: where the plate sits in the 16:9 frame, as fractions,
 *           so the mock photos can be blurred client-side
 * @property {string} ended_at            ISO 8601, when the car's auction ended
 */
(function () {
  'use strict';

  /* Below this many cars the block renders nothing: a list of one or two
     reads as a quote for the seller's own car rather than as evidence. */
  var MIN_RESULTS = 3;

  /* Rolling day counts, never "this week" or "this month": a calendar band
     would be empty or nearly so on a Monday or on the 1st. */
  var RECENCY = [
    { key: 'recent7',  maxDays: 7 },
    { key: 'recent30', maxDays: 30 },
    { key: 'older',    maxDays: Infinity }
  ];
  var RECENCY_FALLBACK = {
    recent7:  'Viimeisen 7 päivän aikana',
    recent30: 'Viimeisen kuukauden aikana',
    older:    'Yli kuukausi sitten'
  };
  var DAY_MS = 864e5;

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
      /* Recency band label: caption text with prod's calendar icon, one grey
         for every band. No fill, border, underline or blue, so it reads as a
         label rather than something to press, and stays quieter than the
         cars under it. slate-600: slate-500 is 4.35:1 on the offers page's
         blue-50, under AA at 12px. */
      '.sc-recency{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;line-height:1rem;font-weight:500;color:#475569;white-space:nowrap;margin:0;}',
      '.sc-recency svg{width:14px;height:14px;flex:0 0 auto;}',
      /* Rows carry no rule of their own; a gray-300 rule sits only above each
         band label, the first one being the column headings' own. */
      '.sc-table .sc-recency-row th{padding:16px 0 4px;}',
      '.sc-table tbody:first-of-type .sc-recency-row th{padding-top:12px;}',
      '.sc-table tbody + tbody .sc-recency-row th{border-top:1px solid #D1D5DB;}',
      /* OProductCard + OProductCardMedia (aspect-ratio-16/9). Bands sit side
         by side at the cards' own 16px gap, each label 6px above its first
         card. */
      '.sc-strip{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:thin;padding-bottom:6px;}',
      '.sc-band{display:flex;flex-direction:column;gap:6px;flex:0 0 auto;}',
      '.sc-band + .sc-band{margin-left:16px;}',
      /* Sticky, so the band of the card at the left edge stays named while a
         long band scrolls past; fit-content gives it room to travel. */
      '.sc-band > .sc-recency{position:sticky;left:0;align-self:flex-start;}',
      '.sc-band-cards{display:flex;gap:16px;flex:1 1 auto;}',
      /* OProductCard carries h-full, which in a flex row with no set height
         resolves to auto and stops the row stretching its cards level. */
      '.sc-band-cards > .sc-card{flex:0 0 260px;scroll-snap-align:start;height:auto;}',
      '.sc-media{position:relative;aspect-ratio:16/9;overflow:hidden;background:#88CFFF;}',
      '.sc-media img.sc-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}',
      '.sc-plate{position:absolute;border-radius:2px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);background:rgba(255,255,255,.2);}',
      '.sc-price-amount{font-size:1.25rem;line-height:1.75rem;}',
      /* The card's content slot is ours, so its rhythm is set here rather
         than taking OProductCard's default space-y-4: title one line at 14px
         (about 28 characters before the ellipsis), specification at most two
         lines at 12px, so long names fit a 260px card and a row of cards
         stays one height. */
      '.sc-title{font-size:.875rem;line-height:1.25rem;}',
      '.sc-spec{margin-top:4px;font-size:.75rem;line-height:1rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}',
      '.sc-pills{margin-top:10px;}',
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

  function endedMs(c) {
    var t = Date.parse(c.ended_at);
    return isNaN(t) ? -Infinity : t;
  }

  function latestFirst(cars) {
    return cars
      .map(function (c, i) { return { c: c, i: i }; })
      .sort(function (a, b) { return (endedMs(b.c) - endedMs(a.c)) || (a.i - b.i); })
      .map(function (x) { return x.c; });
  }

  /* Consecutive runs of an already latest-first list; empty bands are left
     out, so a list of recent cars shows one label. */
  function bands(cars) {
    var now = Date.now();
    var out = [];
    cars.forEach(function (c) {
      var days = Math.floor((now - endedMs(c)) / DAY_MS);
      var band = RECENCY.filter(function (b) { return days <= b.maxDays; })[0];
      var last = out[out.length - 1];
      if (last && last.key === band.key) last.cars.push(c);
      else out.push({ key: band.key, cars: [c] });
    });
    return out;
  }

  function bandLabel(key) { return tr(key, RECENCY_FALLBACK[key]); }

  /* ph-bold-calendar-dots from prod's sprite. */
  var ICON_CALENDAR = '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm92-76a16,16,0,1,1-16-16A16,16,0,0,1,144,128Zm48,0a16,16,0,1,1-16-16A16,16,0,0,1,192,128ZM96,176a16,16,0,1,1-16-16A16,16,0,0,1,96,176Zm48,0a16,16,0,1,1-16-16A16,16,0,0,1,144,176Zm48,0a16,16,0,1,1-16-16A16,16,0,0,1,192,176Z"/></svg>';

  function bandTag(key, tag, id) {
    return '<' + tag + ' class="sc-recency"' + (id ? ' id="' + id + '"' : '') + '>' +
      ICON_CALENDAR + '<span>' + esc(bandLabel(key)) + '</span></' + tag + '>';
  }

  var ICON_CARET_LEFT = '<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z"/></svg>';
  var ICON_CARET_RIGHT = '<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z"/></svg>';
  var ICON_CAR = '<img src="' + ROOT + 'assets/ph-car-simple-white.svg" class="relative opacity-60" style="width:70px;height:70px" alt="" />';

  /* UiButton secondary, size md (text-sm px-5 h-10, no weight of its own). */
  var BTN_SECONDARY = 'inline-flex items-center justify-center rounded-lg font-dm text-sm px-5 h-10 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-800 transition-colors cursor-pointer';
  /* UiButton secondary, size sm, iconOnly. */
  var BTN_ICON = 'inline-flex items-center justify-center rounded-lg h-8 w-8 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default disabled:hover:bg-blue-100';

  function priceLabel(kind) {
    return kind === 'accepted' ? tr('acceptedOffer', 'Hyväksytty tarjous') : tr('highestOffer', 'Korkein tarjous');
  }
  function priceOf(c, kind) {
    return kind === 'accepted' && c.accepted_offer != null ? c.accepted_offer : c.highest_offer;
  }

  function loadMore(gi, shown, total) {
    if (shown >= total) return '';
    return '<button type="button" data-sc-more="' + gi + '" class="' + BTN_SECONDARY + '">' + esc(tr('loadEarlier', 'Näytä aiemmat')) + '</button>';
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
  function subject(g) {
    var t = subjectText(g);
    return '<div role="heading" aria-level="3" class="font-dm text-base"><span class="font-bold text-slate-900">' + esc(t.name) + '</span>' +
      ' <span class="text-slate-500">· <span class="whitespace-nowrap">' + esc(t.years) + '</span></span></div>';
  }

  /* Timer.vue's card shell without its border, so the block reads as one of
     the page's own white cards; its rules are ComissionList.vue's border-b-gray-300,
     the only consumer-side table prod has. */
  function buildTableGroup(g, gi, shown, kind) {
    var uni = uniformModel(g.cars);
    var firstCol = uni ? tr('colSpec', 'Mallitarkennus') : tr('colCar', 'Auto');
    var t = subjectText(g);
    function row(c) {
      return '<tr class="sc-row">' +
        '<td class="text-left">' +
          (uni ? '' : '<span class="block font-bold text-slate-900">' + esc(c.make + ' ' + c.model) + '</span>') +
          '<span class="block text-black">' + esc(c.model_specification) + '</span>' +
          '<span class="sc-meta text-sm text-slate-500">' + esc(c.year) + ' · ' + esc(km(c.driven)) + '</span>' +
        '</td>' +
        '<td class="sc-wide text-left text-black whitespace-nowrap">' + esc(c.year) + '</td>' +
        '<td class="sc-wide text-right text-black whitespace-nowrap">' + esc(km(c.driven)) + '</td>' +
        '<td class="text-right font-bold text-black whitespace-nowrap">' + esc(eur(priceOf(c, kind))) + '</td>' +
      '</tr>';
    }
    /* One tbody per band, its label a rowgroup header. */
    var bodies = bands(g.cars.slice(0, shown)).map(function (b) {
      return '<tbody>' +
        '<tr class="sc-recency-row"><th colspan="4" scope="rowgroup" class="text-left">' + bandTag(b.key, 'span') + '</th></tr>' +
        b.cars.map(row).join('') +
      '</tbody>';
    }).join('');
    return '<div class="flex flex-col gap-4" data-sc-group="' + gi + '">' +
      subject(g) +
      '<table class="sc-table font-dm text-base">' +
        '<caption class="sr-only">' + esc(t.name + ', ' + t.years) + '</caption>' +
        '<thead><tr class="border-b border-b-gray-300 text-sm">' +
          '<th scope="col" class="text-left font-bold text-black">' + esc(firstCol) + '</th>' +
          '<th scope="col" class="sc-wide text-left font-bold text-black">' + esc(tr('colYear', 'Vuosimalli')) + '</th>' +
          '<th scope="col" class="sc-wide text-right font-bold text-black">' + esc(tr('colKm', 'Ajokilometrit')) + '</th>' +
          '<th scope="col" class="text-right font-bold text-black">' + esc(priceLabel(kind)) + '</th>' +
        '</tr></thead>' +
        bodies +
      '</table>' +
      (shown < g.cars.length ? '<div class="flex justify-center">' + loadMore(gi, shown, g.cars.length) + '</div>' : '') +
    '</div>';
  }

  function buildTable(groups, shown, kind) {
    return '<div class="sc sc--table bg-white shadow-sm rounded-xl p-4 sm:p-5 flex flex-col gap-8">' +
      groups.map(function (g, gi) { return buildTableGroup(g, gi, shown[gi], kind); }).join('') +
    '</div>';
  }

  /* OProductCard + OProductCardMedia used as they are, no structural change.
     The price fills the card's own #footer slot (mt-auto pt-4), so it sits
     lowest in the white area whatever the text above it wraps to. Nothing
     sits on the photo: at 260px it is far smaller than on the buyer-side
     cards, so anything over it hides too much. The amount is enlarged because
     it is the figure the block exists for. Title and subtitle are the card's props;
     CarCard's year and mileage pills fill #status. The plate blur is
     proto-only; production blurs the image before it is served. */
  function buildCard(c, kind) {
    var media = c.image
      ? '<img class="sc-photo" src="' + esc(/^(https?:|data:|\/)/.test(c.image) ? c.image : ROOT + c.image) + '" alt="" />' +
        (c.plate_box
          ? '<div class="sc-plate" style="left:' + (c.plate_box.x * 100) + '%;top:' + (c.plate_box.y * 100) + '%;width:' + (c.plate_box.w * 100) + '%;height:' + (c.plate_box.h * 100) + '%"></div>'
          : '')
      : '<div class="absolute inset-0 flex items-center justify-center">' + ICON_CAR + '</div>';
    var pill = function (v) {
      return '<span class="px-1.5 py-0.5 font-dm text-xs text-slate-500 rounded border border-slate-200">' + esc(v) + '</span>';
    };
    return '<article role="listitem" class="sc-card w-full rounded-2xl overflow-hidden h-full flex flex-col bg-white border border-slate-200">' +
      '<div class="sc-media">' + media + '</div>' +
      '<div class="flex-1 flex flex-col p-6">' +
        '<div class="flex flex-col">' +
          '<p class="sc-title font-body font-bold leading-snug text-slate-800 text-sm truncate" title="' + esc(c.make + ' ' + c.model) + '">' + esc(c.make + ' ' + c.model) + '</p>' +
          '<p class="sc-spec font-body font-medium leading-tight text-slate-600 text-xs">' + esc(c.model_specification) + '</p>' +
          '<div class="sc-pills flex flex-wrap gap-1.5 items-center">' + pill(c.year) + pill(km(c.driven)) + '</div>' +
        '</div>' +
        '<div class="mt-auto pt-4">' +
          /* "Hyväksytty tarjous" beside a 20px amount needs ~218px of the
             card's 212, so that label sits above the amount on every card
             rather than wrapping on some and not others. */
          '<div class="' + (kind === 'accepted' ? 'flex flex-col' : 'flex justify-between items-baseline gap-2') + ' font-dm">' +
            '<span class="text-sm font-medium text-slate-600 whitespace-nowrap">' + esc(priceLabel(kind)) + '</span>' +
            '<span class="sc-price-amount font-bold text-slate-900 whitespace-nowrap">' + esc(eur(priceOf(c, kind))) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function buildCardsGroup(g, gi, shown, kind) {
    var more = shown < g.cars.length
      ? '<div class="sc-card flex items-center justify-center rounded-2xl border border-slate-200 bg-white">' + loadMore(gi, shown, g.cars.length) + '</div>'
      : '';
    var bs = bands(g.cars.slice(0, shown));
    var strip = bs.map(function (b, bi) {
      var id = 'sc-' + gi + '-' + b.key;
      return '<div class="sc-band">' +
        bandTag(b.key, 'p', id) +
        '<div class="sc-band-cards" role="list" aria-labelledby="' + id + '">' +
          b.cars.map(function (c) { return buildCard(c, kind); }).join('') +
          (bi === bs.length - 1 ? more : '') +
        '</div>' +
      '</div>';
    }).join('');
    return '<div class="flex flex-col gap-4" data-sc-group="' + gi + '">' +
      '<div class="flex items-center justify-between gap-4">' + subject(g) +
        '<div class="sc-arrows gap-2 flex-shrink-0">' +
          '<button type="button" data-sc-prev class="' + BTN_ICON + '" aria-label="' + esc(tr('prev', 'Edelliset')) + '">' + ICON_CARET_LEFT + '</button>' +
          '<button type="button" data-sc-next class="' + BTN_ICON + '" aria-label="' + esc(tr('next', 'Seuraavat')) + '">' + ICON_CARET_RIGHT + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="sc-strip" tabindex="0">' + strip + '</div>' +
    '</div>';
  }

  function buildCards(groups, shown, kind) {
    return '<div class="sc sc--cards flex flex-col gap-8">' +
      groups.map(function (g, gi) { return buildCardsGroup(g, gi, shown[gi], kind); }).join('') +
    '</div>';
  }

  var mounts = [];

  function draw(m) {
    if (!m.groups.length) { m.el.innerHTML = ''; m.syncs = []; return false; }
    var shown = m.groups.map(function (g, gi) { return Math.min(m.shown[gi], g.cars.length); });
    var scrolls = Array.prototype.map.call(m.el.querySelectorAll('.sc-strip'), function (s) { return s.scrollLeft; });
    var kind = m.opts.price === 'accepted' ? 'accepted' : 'highest';
    m.el.innerHTML = m.opts.variant === 'cards' ? buildCards(m.groups, shown, kind) : buildTable(m.groups, shown, kind);
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
      /* Two cards per press; one made the user click too often. Capped at
         what is visible, so a narrow strip never skips a card unseen. */
      function page(dir) {
        var card = strip.querySelector('.sc-card');
        var w = card ? card.getBoundingClientRect().width + 16 : 276;
        var n = Math.min(2, Math.max(1, Math.floor((strip.clientWidth + 16) / w)));
        strip.scrollBy({ left: dir * n * w, behavior: 'smooth' });
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

  /* After a load-more press the button is gone, so focus would drop to <body>;
     moving it to the first added item keeps a keyboard user in place. */
  function focusFirstNew(m, gi, index) {
    var group = m.el.querySelectorAll('[data-sc-group]')[gi];
    if (!group) return;
    var target = group.querySelectorAll(m.opts.variant === 'cards' ? '.sc-strip article' : 'tr.sc-row')[index];
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
    var seen = {};
    m.groups = groups.filter(function (g) {
      var key = g.car && g.car.make ? (g.car.make + ' ' + g.car.model).toLowerCase() : null;
      if (key && seen[key]) return false;
      if (key) seen[key] = true;
      return (g.cars || []).length >= MIN_RESULTS;
    }).map(function (g) {
      var cars = latestFirst(g.cars);
      return { car: g.car, cars: opts.max ? cars.slice(0, opts.max) : cars };
    });
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
        ['2.0 BiTDI Comfortline 4Motion', 2020, 149000, 26900, 47],
        ['2.0 TDI Trendline 4Motion', 2018, 184000, 20600, 52],
        ['3.0 V6 TDI Highline 4Motion', 2019, 141000, 28100, 58],
        ['2.0 BiTDI Highline 4Motion', 2018, 166000, 23400, 64],
        ['2.0 TDI Comfortline', 2020, 132000, 25800, 71]
      ],
      peers: [
        ['Ford', 'Ranger', '2.0 EcoBlue Wildtrak 4x4', 2019, 141000, 27200, 4],
        ['Toyota', 'Hilux', '2.4 D-4D Double Cab Active 4WD', 2019, 155000, 26100, 9],
        ['Nissan', 'Navara', '2.3 dCi N-Connecta 4x4', 2018, 163000, 20900, 16],
        ['Mitsubishi', 'L200', '2.2 DI-D Intense 4WD', 2020, 137000, 24300, 24],
        ['Mercedes-Benz', 'X-sarja', 'X 250 d 4MATIC Power Double Cab Automatic', 2019, 158000, 28700, 29],
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
        ['1.2 T Active Touring Sports', 2019, 109000, 13300, 44],
        ['1.8 Hybrid Active Touring Sports', 2019, 96000, 15700, 49],
        ['2.0 Hybrid GR Sport Touring Sports', 2021, 58000, 21300, 54],
        ['1.8 Hybrid Style', 2020, 87000, 17600, 60],
        ['1.2 T Active Hatchback', 2019, 104000, 12900, 66],
        ['1.8 Hybrid Prestige Edition', 2020, 72000, 18800, 73],
        ['1.8 Hybrid Active Sedan', 2019, 113000, 14600, 80]
      ],
      peers: [
        ['Volkswagen', 'Golf', '1.5 eTSI Life DSG', 2020, 83000, 17900, 5],
        ['Ford', 'Focus', '1.0 EcoBoost Titanium', 2020, 77000, 13800, 12],
        ['Skoda', 'Octavia', '1.5 TSI Style DSG', 2020, 95000, 17200, 19],
        ['Hyundai', 'i30', '1.5 T-GDI Comfort', 2020, 81000, 14400, 28],
        ['Mercedes-Benz', 'A-sarja', 'A 180 Business Style Edition Launch DCT Automatic', 2020, 76000, 21900, 35]
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
    var now = Date.now();
    return rows.map(function (r, i) {
      var p = PHOTOS[i % PHOTOS.length];
      return {
        make: r[0], model: r[1], model_specification: r[2], year: r[3], driven: r[4],
        highest_offer: r[5], accepted_offer: r[5],
        ended_at: new Date(now - r[6] * DAY_MS).toISOString(),
        image: p.src, plate_box: p.plate
      };
    });
  }

  window.SimilarCars = { render: render, mock: mock, MIN_RESULTS: MIN_RESULTS };
})();
