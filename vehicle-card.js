/**
 * Shared vehicle card + ad-preview modal component.
 * Included by contact.html, success.html and offers.html.
 *
 * Exposes:
 *   window.renderVehicleCard(containerId, options)  — funnel card (contact/success)
 *   window.carCardClasses                           — shared shell class names
 *   window.openAdModal() / closeAdModal()
 *
 * ── Card shell ────────────────────────────────────────────────────────────
 * Mirrors prod's CarCard.vue: stacked photo-on-top by default, flipping to
 * photo-left / details-right with a fixed 250px photo column.
 *
 * Prod switches on `lg:` (viewport ≥1024px), which works there because the card
 * spans a 768px main column. In this proto the funnel card sits in the tan
 * bg-av-cream sidebar (max-w-[48%]), so at viewport 1024 the card is only
 * ~375px wide — a 250px photo would leave 125px for the details. Viewport
 * breakpoints are the wrong tool for a card whose container is much narrower
 * than the window, so the switch is a CONTAINER query on the card's own width.
 * Same intent as prod, correct behaviour in a narrow column.
 */
(function () {
  'use strict';

  // ── Shared card shell ─────────────────────────────────────────────
  // One definition for all three car cards: the funnel card below, and
  // offers.html's published-listing + draft cards.
  var SHELL_STYLE_ID = 'av-car-card-style';
  if (!document.getElementById(SHELL_STYLE_ID)) {
    var shellStyle = document.createElement('style');
    shellStyle.id = SHELL_STYLE_ID;
    shellStyle.textContent = [
      /* The mount is the query container; the card reacts to its own width. */
      '.av-card-shell{container-type:inline-size;}',
      '.av-card{display:flex;flex-direction:column;width:100%;height:auto;}',
      /* Stacked: prod's h-[220px] w-full photo. */
      '.av-card__media{position:relative;height:220px;width:100%;flex-shrink:0;background:#88CFFF;',
      'display:flex;align-items:center;justify-content:center;overflow:hidden;}',
      '.av-card__body{width:100%;height:auto;}',
      /* Horizontal: prod's lg:w-[250px] photo column and lg:max-h-[250px] card.
         480px = 250px photo + 230px details, the narrowest the details column
         stays usable. Below that the card stays stacked. */
      '@container (min-width: 480px){',
      '  .av-card{flex-direction:row;max-height:250px;}',
      '  .av-card__media{height:auto;width:250px;}',
      '}'
    ].join('');
    document.head.appendChild(shellStyle);
  }

  // Class names for consumers that build their own card markup (offers.html).
  window.carCardClasses = {
    shell: 'av-card-shell',
    card: 'av-card',
    media: 'av-card__media',
    body: 'av-card__body'
  };

  // ── buildCarCard(props) ───────────────────────────────────────────
  // The one card renderer. Structure mirrors prod's CarCard.vue, so props
  // mirror its props too — see CARD-COMPONENT-PLAN.md for the contract.
  //
  //   registrationNumber, make, model, modelSpecification,
  //   year, mileage, fuelType, driveType, image,
  //   status, statusColor, statusIcon,
  //   primaryCtaText/primaryCtaAttrs, secondaryCtaText/secondaryCtaAttrs
  //
  // Proto-only extensions (no prod equivalent), kept explicit:
  //   mediaOverlay  extra markup layered over the photo (price tag, badges)
  //   mediaBottom   extra markup pinned to the photo's bottom edge
  //   cardClass     extra classes on the card root (e.g. the success border)
  //   ctaFullWidth  keep CTAs full-width instead of prod's right-aligned row
  //
  // Returns an HTML string. Callers own their own event wiring.
  function buildCarCard(props) {
    props = props || {};

    var mediaInner = props.image
      ? '<img src="' + esc(props.image) + '" class="absolute inset-0 w-full h-full object-cover" alt="" />'
      // No photo — prod renders a plain bg-blue-300 with the white ph-car-simple icon.
      : '<img src="assets/ph-car-simple-white.svg" class="relative z-10 w-[70px] h-[70px] opacity-60" alt="" />';

    // prod: <div class="w-2 h-auto bg-blue-600 rounded-l-md" /> + bordered plate
    var plateBadge =
      '<div class="flex rounded-md">' +
        '<div class="w-2 h-auto bg-av-blue rounded-l-md"></div>' +
        '<div class="py-1 px-1.5 border border-l-0 rounded-r-md border-slate-200 font-dm text-xs sm:text-sm text-slate-800 whitespace-nowrap">' +
          (esc(props.registrationNumber) || '\u2013') +
        '</div>' +
      '</div>';

    var statusBadge = props.status
      ? '<div class="inline-flex items-center space-x-2 px-2 py-1 font-dm text-xs sm:text-sm rounded border ' +
          (props.statusColor || 'bg-slate-50 border-slate-200 text-slate-500') + '">' +
          (props.statusIcon || '') + '<span>' + esc(props.status) + '</span>' +
        '</div>'
      : '';

    var name = [props.make, props.model].filter(Boolean).map(esc).join(' ');

    var pills = [props.year, props.mileage, props.driveType, props.fuelType]
      .filter(Boolean)
      .map(function (v) {
        return '<span class="px-1.5 py-0.5 font-dm text-xs text-slate-500 rounded border border-slate-200">' + esc(v) + '</span>';
      }).join('');

    function cta(text, attrs, cls) {
      if (!text) return '';
      return '<button type="button" ' + (attrs || '') + ' class="' + cls + '">' + esc(text) + '</button>';
    }
    var btnWidth = props.ctaFullWidth ? 'w-full' : 'w-full md:w-auto';
    var ctaRow = (props.primaryCtaText || props.secondaryCtaText)
      ? '<div class="w-full flex items-center ' +
          (props.ctaFullWidth ? 'flex-col gap-y-2' : 'md:justify-end flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-2') + '">' +
          cta(props.secondaryCtaText, props.secondaryCtaAttrs,
              btnWidth + ' h-10 flex items-center justify-center rounded-lg border border-slate-200 font-dm font-medium text-sm text-av-blue cursor-pointer hover:bg-slate-50 transition-colors') +
          cta(props.primaryCtaText, props.primaryCtaAttrs,
              btnWidth + ' h-10 flex items-center justify-center rounded-lg font-dm font-medium text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 cursor-pointer transition-colors') +
        '</div>'
      : '';

    return '' +
      '<div class="av-card bg-white rounded-xl overflow-hidden ' + (props.cardClass || 'shadow-sm') + '">' +
        '<div class="av-card__media">' +
          mediaInner + (props.mediaBottom || '') + (props.mediaOverlay || '') +
        '</div>' +
        '<div class="av-card__body p-5 flex flex-col justify-between space-y-5">' +
          '<div class="w-full flex space-x-2 justify-between items-center text-nowrap overflow-auto">' +
            plateBadge + statusBadge +
          '</div>' +
          '<div class="space-y-3">' +
            '<div class="flex flex-col">' +
              '<span class="font-dm text-base font-bold text-slate-900">' + (name || '\u2013') + '</span>' +
              (props.modelSpecification
                ? '<span class="font-dm text-sm text-slate-500 text-wrap">' + esc(props.modelSpecification) + '</span>'
                : '') +
            '</div>' +
            '<div class="flex flex-wrap self-stretch gap-1.5 items-center">' + pills + '</div>' +
          '</div>' +
          ctaRow +
        '</div>' +
      '</div>';
  }

  window.buildCarCard = buildCarCard;

  // ── Storage ──
  const STORE_KEY = 'autovex_funnel';
  function getStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { return {}; }
  }

  // ── Helpers ──
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function fmtKm(raw) {
    const n = parseInt(String(raw || '').replace(/\D/g, ''), 10);
    return isNaN(n) ? (raw || '') : n.toLocaleString('fi-FI') + '\u00a0km';
  }
  function firstPhoto(photos) {
    for (const name of ['ulkopuoli', 'sisatilat', 'huoltokirja', 'renkaat', 'naarmut', 'tuulilasi']) {
      if (photos[name] && photos[name].length) return photos[name][0];
    }
    return null;
  }

  // ── Vehicle Card ──────────────────────────────────────────────
  function photosComplete(photos) {
    const total = Object.values(photos).reduce((n, a) => n + (a ? a.length : 0), 0);
    return total >= 5 && !!(photos.ulkopuoli && photos.ulkopuoli.length) && !!(photos.sisatilat && photos.sisatilat.length);
  }

  window.renderVehicleCard = function (containerId, options) {
    options = options || {};
    const container = document.getElementById(containerId);
    if (!container) return;

    const s       = getStore();
    const hero    = s.hero    || {};
    const details = s.details || {};
    const photos  = s.photos  || {};

    const plate   = (hero.plate || '').toUpperCase();
    const carName = [details.merkki, details.malli].filter(Boolean).join(' ');
    const trim    = details.mallitarkennus || '';
    const tags    = [details.vuosimalli, hero.km ? fmtKm(hero.km) : '', details.polttoaine].filter(Boolean);
    const photo   = firstPhoto(photos);
    const photosOk = photosComplete(photos);
    // Single price variant: the seller's optional own estimate.
    const priceValue = s.priceExpectation || null;
    const priceLabel = t('card.priceLabelTarget');

    const priceTag = priceValue
      ? `<div style="background:white;border-radius:.375rem;padding:.25rem .625rem;display:flex;align-items:center;gap:.25rem;box-shadow:0 1px 4px rgba(0,0,0,0.15);">
           <span style="font-family:'DM Sans',sans-serif;font-size:.75rem;color:#64748b;">${priceLabel}</span>
           <span style="font-family:'DM Sans',sans-serif;font-weight:700;font-size:.75rem;color:#0f172a;">${Number(priceValue).toLocaleString('fi-FI')} €</span>
         </div>`
      : '';

    let statusBadge = '';
    if (options.successView) {
      if (!photosOk) {
        statusBadge = `<div style="display:flex;align-items:center;gap:.25rem;background:#fff7ed;border:1px solid #fb923c;border-radius:.375rem;padding:.25rem .5rem;">
          <img src="assets/icon-warning-octagon.svg" style="width:.875rem;height:.875rem;flex-shrink:0;" alt="" />
          <span style="font-family:'DM Sans',sans-serif;font-size:.75rem;font-weight:500;color:#c2410c;">${t('card.photosRequired')}</span>
        </div>`;
      } else {
        const badgeText = t('card.underReview');
        // top-right (same anchor as the photos-required badge above) — centring collided with
        // the left-anchored price tag once the card moved into the narrower tan column
        statusBadge = `<div style="display:flex;align-items:center;gap:.25rem;background:#e2e8f0;border:1px solid #cbd5e1;border-radius:.375rem;padding:.25rem .5rem;white-space:nowrap;">
          <img src="assets/icon-hourglass.svg" style="width:.875rem;height:.875rem;flex-shrink:0;" alt="" />
          <span style="font-family:'DM Sans',sans-serif;font-size:.75rem;font-weight:500;color:#64748b;">${badgeText}</span>
        </div>`;
      }
    }

    const amberBar = options.successView ? '' :
      `<div style="position:absolute;bottom:0;left:0;right:0;background:rgba(180,83,9,0.88);padding:.4rem .75rem;display:flex;align-items:center;justify-content:center;gap:.375rem;">
         <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L11.5 10.5H1.5L6.5 1.5Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/><rect x="6" y="5" width="1" height="3" rx=".5" fill="white"/><rect x="6" y="9" width="1" height="1" rx=".5" fill="white"/></svg>
         <span style="font-family:'DM Sans',sans-serif;font-size:.75rem;font-weight:600;color:white;">${t('card.photosRequired')}</span>
       </div>`;

    // Price tag and status badge share one overlay row. They used to be anchored
    // independently (top-left / top-right), which collided once the photo column
    // narrowed to prod's 250px. Now they sit in a flex row that wraps instead.
    const overlayTop = (priceTag || statusBadge)
      ? `<div style="position:absolute;top:.5rem;left:.5rem;right:.5rem;z-index:10;display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:.25rem;">
           ${priceTag}${statusBadge}
         </div>`
      : '';

    // ── Adapter: funnel store -> buildCarCard props ──
    // Everything below is data mapping; the markup lives in buildCarCard.
    container.classList.add('av-card-shell');
    container.innerHTML = buildCarCard({
      registrationNumber: plate,
      make:  details.merkki,
      model: details.malli,
      modelSpecification: trim,
      year:     details.vuosimalli,
      mileage:  hero.km ? fmtKm(hero.km) : '',
      fuelType: details.polttoaine,
      image: photo,

      // Draft badge — prod Preview.vue draftStatusConfig.open uses ph-bold-paperclip
      status: t('card.draft'),
      statusColor: 'bg-slate-50 border-slate-200 text-slate-500',
      statusIcon: '<img src="assets/ph-bold-paperclip-slate.svg" class="w-3.5 h-3.5 flex-shrink-0" alt="" />',

      secondaryCtaText: t('card.openDetails'),
      secondaryCtaAttrs: 'id="av-open-modal-btn"',
      ctaFullWidth: true,

      // Proto-only extensions
      mediaOverlay: overlayTop,
      mediaBottom: amberBar,
      cardClass: (options.successView ? 'border-2 border-av-blue' : 'border border-slate-200') + ' shadow-md'
    });

    document.getElementById('av-open-modal-btn').addEventListener('click', window.openAdModal);
  };

  // ── Modal ─────────────────────────────────────────────────────
  function ensureModal() {
    if (document.getElementById('av-ad-modal')) return;

    // Inject responsive style for bottom-sheet on mobile / centered on desktop
    if (!document.getElementById('av-ad-modal-style')) {
      const s = document.createElement('style');
      s.id = 'av-ad-modal-style';
      s.textContent = [
        '#av-ad-modal{display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.5);align-items:flex-end;justify-content:center;}',
        '#av-ad-modal-sheet{background:#fff;border-radius:1rem 1rem 0 0;width:100%;max-height:85vh;box-shadow:0 -4px 30px rgba(0,0,0,.15);display:flex;flex-direction:column;overflow:hidden;}',
        '@media(min-width:768px){',
        '  #av-ad-modal{align-items:center;padding:2rem 1rem;}',
        '  #av-ad-modal-sheet{border-radius:1rem;max-width:600px;max-height:calc(100vh - 4rem);box-shadow:0 20px 60px rgba(0,0,0,.2);}',
        '}',
      ].join('');
      document.head.appendChild(s);
    }

    const wrap = document.createElement('div');
    wrap.id = 'av-ad-modal';
    wrap.innerHTML = `
      <div id="av-ad-modal-sheet">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid #f1f5f9;flex-shrink:0;">
          <span style="font-family:'Barlow',sans-serif;font-weight:700;font-size:1.25rem;color:#0f172a;">${t('modal.previewTitle')}</span>
          <button id="av-modal-close" style="width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;border:none;background:transparent;border-radius:9999px;cursor:pointer;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='transparent'">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M14 4L4 14M4 4l10 10" stroke="#475569" stroke-width="1.75" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div id="av-modal-body" style="display:flex;flex-direction:column;overflow-y:auto;flex:1;"></div>
        <div style="padding:1.25rem 1.5rem;border-top:1px solid #f1f5f9;flex-shrink:0;">
          <button id="av-modal-close-btn" style="width:100%;height:3rem;display:flex;align-items:center;justify-content:center;background:#0B6DFF;border:none;border-radius:.5rem;font-family:'DM Sans',sans-serif;font-weight:500;font-size:1rem;color:#fff;cursor:pointer;" onmouseover="this.style.background='#0A59EB'" onmouseout="this.style.background='#0B6DFF'">
            ${t('modal.closeBtn')}
          </button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    document.getElementById('av-modal-close').addEventListener('click', window.closeAdModal);
    document.getElementById('av-modal-close-btn').addEventListener('click', window.closeAdModal);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) window.closeAdModal(); });
  }

  window.openAdModal = function () {
    ensureModal();
    populateModal();
    const m = document.getElementById('av-ad-modal');
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeAdModal = function () {
    const m = document.getElementById('av-ad-modal');
    if (m) m.style.display = 'none';
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeAdModal();
  });

  function populateModal() {
    ensureModal();
    const s        = getStore();
    const hero     = s.hero     || {};
    const details  = s.details  || {};
    const services = s.services || {};
    const photos   = s.photos   || {};
    const body     = document.getElementById('av-modal-body');
    const DASH     = '–';

    function val(v) {
      return (v !== null && v !== undefined && v !== '') ? esc(String(v)) : DASH;
    }
    function row(label, value) {
      return `<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;">
        <span style="font-family:'DM Sans',sans-serif;font-size:.875rem;color:#64748b;flex-shrink:0;">${label}</span>
        <span style="font-family:'DM Sans',sans-serif;font-size:.875rem;color:#0f172a;text-align:right;">${val(value)}</span>
      </div>`;
    }
    function section(title, url, inner) {
      return `<div style="display:flex;flex-direction:column;gap:.75rem;padding:1.25rem 1.5rem;border-bottom:1px solid #f1f5f9;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-family:'DM Sans',sans-serif;font-weight:700;font-size:1rem;color:#0f172a;">${title}</span>
          <a href="${url}" style="font-family:'DM Sans',sans-serif;font-weight:500;font-size:.875rem;color:#0B6DFF;text-decoration:none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${t('modal.editLink')}</a>
        </div>
        <div style="display:flex;flex-direction:column;gap:.5rem;">${inner}</div>
      </div>`;
    }

    let html = '';

    // ── Perustiedot ──
    html += section(t('modal.sections.basicInfo'), 'details.html', [
      row(t('modal.labels.registration'), hero.plate ? hero.plate.toUpperCase() : null),
      row(t('modal.labels.mileage'), hero.km ? fmtKm(hero.km) : null),
      row(t('modal.labels.make'), details.merkki),
      row(t('modal.labels.model'), details.malli),
      row(t('modal.labels.year'), details.vuosimalli),
      row(t('modal.labels.trim'), details.mallitarkennus),
      row(t('modal.labels.fuel'), details.polttoaine),
      row(t('modal.labels.location'), details.sijainti),
      row(t('modal.labels.deliveryRange'), details.deliveryRange ? details.deliveryRange + ' km' : null),
      row(t('modal.labels.companyUse'), details.yrityskaytto != null ? (details.yrityskaytto ? t('modal.labels.yes') : t('modal.labels.no')) : null),
    ].join(''));

    // ── Huollot & kunto ──
    const rg = Array.isArray(services.radioGroups) ? services.radioGroups : [];
    const vauriot = [
      services.vaurio_naky   ? t('modal.labels.visibleDamage')    : null,
      services.vaurio_kolari ? t('modal.labels.accidentHistory')   : null,
    ].filter(Boolean);
    let svcInner = [
      row(t('modal.labels.serviceHistory'),   rg[0]),
      row(t('modal.labels.serviceBookType'),  rg[1]),
      row(t('modal.labels.lastService'),      rg[2]),
      row(t('modal.labels.windshield'),       rg[3]),
      row(t('modal.labels.glassInsurance'),   rg[4]),
      row(t('modal.labels.damages'),          vauriot.length ? vauriot.join(', ') : null),
    ].join('');
    if (services.korjaukset) {
      svcInner += `<div style="display:flex;flex-direction:column;gap:.25rem;padding-top:.25rem;">
        <span style="font-family:'DM Sans',sans-serif;font-size:.875rem;color:#64748b;">${t('modal.labels.repairsAndFaults')}</span>
        <span style="font-family:'DM Sans',sans-serif;font-size:.875rem;color:#0f172a;white-space:pre-wrap;">${esc(services.korjaukset)}</span>
      </div>`;
    } else {
      svcInner += row(t('modal.labels.repairsAndFaults'), null);
    }
    html += section(t('modal.sections.serviceCondition'), 'services.html', svcInner);

    // ── Kuvat ──
    const PNAMES  = ['ulkopuoli', 'sisatilat', 'huoltokirja', 'renkaat', 'naarmut', 'tuulilasi'];
    const PLABELS = {
      ulkopuoli:   t('modal.photoCategories.ulkopuoli'),
      sisatilat:   t('modal.photoCategories.sisatilat'),
      huoltokirja: t('modal.photoCategories.huoltokirja'),
      renkaat:     t('modal.photoCategories.renkaat'),
      naarmut:     t('modal.photoCategories.naarmut'),
      tuulilasi:   t('modal.photoCategories.tuulilasi'),
    };
    const isPdf      = u => typeof u === 'string' && u.startsWith('data:application/pdf');
    const isHeicDataUrl = u => typeof u === 'string' && /^data:image\/hei[cf]/i.test(u);
    const docCard = label => `<div style="height:5rem;width:calc(50% - .25rem);border-radius:.375rem;background:#f8fafc;border:1px solid #e2e8f0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span style="font-size:.6rem;font-weight:700;color:#ef4444;letter-spacing:.05em;font-family:'DM Sans',sans-serif;">${label}</span></div>`;
    const pdfCard  = () => docCard('PDF');
    const heicCard = () => docCard('HEIC');

    let photoHTML = '';
    let hasPhotos = false;
    PNAMES.forEach(name => {
      const urls = photos[name];
      if (!urls || !urls.length) return;
      hasPhotos = true;
      photoHTML += `<div style="display:flex;flex-direction:column;gap:.375rem;">
        <span style="font-family:'DM Sans',sans-serif;font-size:.75rem;font-weight:500;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;">${PLABELS[name]}</span>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;">
          ${urls.map(u => isPdf(u) ? pdfCard() : isHeicDataUrl(u) ? heicCard() : `<img src="${u}" style="height:5rem;width:calc(50% - .25rem);object-fit:cover;border-radius:.375rem;" alt="" />`).join('')}
        </div>
      </div>`;
    });
    if (!hasPhotos) photoHTML = `<span style="font-family:'DM Sans',sans-serif;font-size:.875rem;color:#64748b;">${t('modal.labels.noPhotos')}</span>`;

    html += `<div style="display:flex;flex-direction:column;gap:1rem;padding:1.25rem 1.5rem;border-bottom:1px solid #f1f5f9;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="font-family:'DM Sans',sans-serif;font-weight:700;font-size:1rem;color:#0f172a;">${t('modal.sections.photos')}</span>
        <a href="photos.html" style="font-family:'DM Sans',sans-serif;font-weight:500;font-size:.875rem;color:#0B6DFF;text-decoration:none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${t('modal.editLink')}</a>
      </div>
      <div style="display:flex;flex-direction:column;gap:1rem;">${photoHTML}</div>
    </div>`;

    // ── Hinta ──
    const priceRowLabel = t('price.targetLabel');
    const priceRowValue = s.priceExpectation
      ? Number(s.priceExpectation).toLocaleString('fi-FI') + ' €'
      : null;
    html += section(t('modal.sections.price'), 'price.html', row(priceRowLabel, priceRowValue));

    // ── Yhteystiedot ──
    const contact = s.contact || {};
    html += section(t('modal.sections.contact'), 'contact.html', [
      row(t('modal.labels.name'), contact.kokoNimi),
      row(t('modal.labels.email'), contact.sahkoposti),
      row(t('modal.labels.phone'), contact.puhelin),
    ].join(''));

    // ── Delete link (inside scrollable body) ──
    html += `<div style="padding:1.5rem;display:flex;justify-content:center;">
      <button id="av-modal-delete-btn" style="font-family:'DM Sans',sans-serif;font-size:.9375rem;font-weight:500;color:#ef4444;background:none;border:none;cursor:pointer;text-decoration:underline;text-underline-offset:2px;" onmouseover="this.style.color='#dc2626'" onmouseout="this.style.color='#ef4444'">
        ${t('modal.labels.deleteAd')}
      </button>
    </div>`;

    body.innerHTML = html;

    document.getElementById('av-modal-delete-btn').addEventListener('click', function () {
      window.confirmDeleteAd(function () {
        window.closeAdModal();
        window.location.href = 'index.html';
      });
    });
  }

  // ── Delete confirmation dialog ────────────────────────────────
  window.confirmDeleteAd = function (onConfirm) {
    if (document.getElementById('av-delete-confirm')) return;
    const overlay = document.createElement('div');
    overlay.id = 'av-delete-confirm';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;padding:1rem;';
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:1rem;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,0.25);overflow:hidden;">
        <div style="padding:1.5rem 1.5rem 0;">
          <p style="font-family:'Barlow',sans-serif;font-weight:700;font-size:1.125rem;color:#0f172a;margin:0 0 .625rem;">${t('modal.deleteConfirm.title')}</p>
          <p style="font-family:'DM Sans',sans-serif;font-size:.9375rem;color:#475569;margin:0;">${t('modal.deleteConfirm.message')}</p>
        </div>
        <div style="display:flex;gap:.75rem;padding:1.25rem 1.5rem;">
          <button id="av-delete-cancel" style="flex:1;height:2.75rem;border:1.5px solid #cbd5e1;background:white;border-radius:.5rem;font-family:'DM Sans',sans-serif;font-weight:500;font-size:.9375rem;color:#475569;cursor:pointer;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">${t('modal.deleteConfirm.cancel')}</button>
          <button id="av-delete-confirm-btn" style="flex:1;height:2.75rem;border:none;background:#ef4444;border-radius:.5rem;font-family:'DM Sans',sans-serif;font-weight:500;font-size:.9375rem;color:#fff;cursor:pointer;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">${t('modal.deleteConfirm.confirm')}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    function close() { overlay.remove(); }
    document.getElementById('av-delete-cancel').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    function onEsc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); } }
    document.addEventListener('keydown', onEsc);
    document.getElementById('av-delete-confirm-btn').addEventListener('click', function () {
      // Wipe all funnel data
      try { localStorage.removeItem('autovex_funnel'); } catch (e) {}
      close();
      if (typeof onConfirm === 'function') onConfirm();
    });
  };
})();
