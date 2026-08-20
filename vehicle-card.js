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

  // ── Draft status badge ────────────────────────────────────────────
  // Mirrors prod's draftStatusConfig in Preview.vue: the card's status badge is
  // driven by the draft's status, not hardcoded. Text comes from
  // auction.landing.drafts.status.*; icons and badge colours match prod's
  // UiBadge colours (light / gray / light_red / amber).
  // Shared with offers.html's DRAFT_STATUS_CFG, which adds its own CTA fields.
  var DRAFT_ICON_HOURGLASS = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M10.0625 1.09375H3.9375C3.64742 1.09375 3.36922 1.20898 3.1641 1.4141C2.95898 1.61922 2.84375 1.89742 2.84375 2.1875V4.15625C2.84417 4.32597 2.88389 4.4933 2.95979 4.6451C3.0357 4.79691 3.14572 4.92908 3.28125 5.03125L5.90625 7L3.28125 8.96875C3.14572 9.07092 3.0357 9.20309 2.95979 9.3549C2.88389 9.5067 2.84417 9.67403 2.84375 9.84375V11.8125C2.84375 12.1026 2.95898 12.3808 3.1641 12.5859C3.36922 12.791 3.64742 12.9062 3.9375 12.9062H10.0625C10.3526 12.9062 10.6308 12.791 10.8359 12.5859C11.041 12.3808 11.1562 12.1026 11.1562 11.8125V9.86344C11.1561 9.69401 11.1168 9.52691 11.0415 9.37514C10.9662 9.22337 10.8569 9.09104 10.722 8.98844L8.08828 7L10.722 5.00937C10.8569 4.90678 10.9662 4.77444 11.0415 4.62267C11.1168 4.47091 11.1561 4.3038 11.1562 4.13437V2.1875C11.1563 1.89742 11.041 1.61922 10.8359 1.4141C10.6308 1.20898 10.3526 1.09375 10.0625 1.09375ZM9.84375 2.40625V3.28125H4.15625V2.40625H9.84375ZM7 6.17969L4.88523 4.59375H9.09617L7 6.17969ZM9.84375 11.5938H4.15625V9.95312L7 7.82031L9.84375 9.97117V11.5938Z"/></svg>';
  var DRAFT_ICON_WARNING   = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M6.34375 7.21875V4.375C6.34375 4.20095 6.41289 4.03403 6.53596 3.91096C6.65903 3.78789 6.82595 3.71875 7 3.71875C7.17405 3.71875 7.34097 3.78789 7.46404 3.91096C7.58711 4.03403 7.65625 4.20095 7.65625 4.375V7.21875C7.65625 7.3928 7.58711 7.55972 7.46404 7.68279C7.34097 7.80586 7.17405 7.875 7 7.875C6.82595 7.875 6.65903 7.80586 6.53596 7.68279C6.41289 7.55972 6.34375 7.3928 6.34375 7.21875ZM12.9063 5.00664V8.99336C12.9066 9.13704 12.8785 9.27938 12.8235 9.41211C12.7685 9.54485 12.6877 9.66535 12.5858 9.76664L9.76664 12.5858C9.66537 12.6877 9.54487 12.7685 9.41213 12.8235C9.27939 12.8786 9.13705 12.9067 8.99336 12.9063H5.00664C4.86295 12.9067 4.72061 12.8786 4.58787 12.8235C4.45513 12.7685 4.33463 12.6877 4.23336 12.5858L1.41422 9.76664C1.31231 9.66535 1.23151 9.54485 1.1765 9.41211C1.12149 9.27938 1.09336 9.13704 1.09375 8.99336V5.00664C1.09336 4.86296 1.12149 4.72062 1.1765 4.58789C1.23151 4.45515 1.31231 4.33465 1.41422 4.23336L4.23336 1.41422C4.33463 1.31228 4.45513 1.23147 4.58787 1.17645C4.72061 1.12144 4.86295 1.09333 5.00664 1.09375H8.99336C9.13705 1.09333 9.27939 1.12144 9.41213 1.17645C9.54487 1.23147 9.66537 1.31228 9.76664 1.41422L12.5858 4.23336C12.6877 4.33465 12.7685 4.45515 12.8235 4.58789C12.8785 4.72062 12.9066 4.86296 12.9063 5.00664ZM11.5938 5.09742L8.90258 2.40625H5.09742L2.40625 5.09742V8.90258L5.09742 11.5938H8.90258L11.5938 8.90258V5.09742ZM7 8.53125C6.82694 8.53125 6.65777 8.58257 6.51388 8.67871C6.36998 8.77486 6.25783 8.91152 6.19161 9.0714C6.12538 9.23129 6.10805 9.40722 6.14181 9.57695C6.17558 9.74669 6.25891 9.9026 6.38128 10.025C6.50365 10.1473 6.65956 10.2307 6.8293 10.2644C6.99903 10.2982 7.17496 10.2809 7.33485 10.2146C7.49473 10.1484 7.63139 10.0363 7.72754 9.89237C7.82368 9.74848 7.875 9.57931 7.875 9.40625C7.875 9.17419 7.78281 8.95163 7.61872 8.78753C7.45462 8.62344 7.23206 8.53125 7 8.53125Z"/></svg>';
  var DRAFT_ICON_PAPERCLIP = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="m11.62 7.464-4.487 4.484a3.282 3.282 0 0 1-4.64-4.642L7.86 1.953a2.188 2.188 0 1 1 3.093 3.095l-.01.008L5.707 10.1a.658.658 0 0 1-1.066-.234.656.656 0 0 1 .156-.712l5.234-5.038a.875.875 0 0 0-1.242-1.234L3.42 8.234a1.97 1.97 0 0 0 2.786 2.784l4.487-4.485a.659.659 0 0 1 1.123.465.656.656 0 0 1-.193.465h-.002Z"/></svg>';

  // `key` not literal text, so the label follows the language toggle.
  window.DRAFT_BADGES = {
    'open': {
      key: 'draftStatus.open', icon: DRAFT_ICON_PAPERCLIP,
      badge: 'bg-slate-50 border-slate-200 text-slate-500'
    },
    'in_review': {
      key: 'draftStatus.in_review', icon: DRAFT_ICON_HOURGLASS,
      badge: 'bg-slate-200 border-gray-300 text-gray-500'
    },
    'rejected': {
      key: 'draftStatus.rejected', icon: DRAFT_ICON_WARNING,
      badge: 'bg-transparent border-red-300 text-red-700'
    },
    'queued_for_publishing_after_verification': {
      key: 'draftStatus.queued', icon: DRAFT_ICON_WARNING,
      badge: 'bg-amber-50 border-amber-400 text-amber-700'
    }
  };

  // ── buildRegBadge(plate, opts) ────────────────────────────────────
  // Mirrors ARegistrationNumberBadge.vue (in Storybook) verbatim, including
  // bg-white and the a11y attributes. The Vue bundle can't mount inside the
  // card any more — the card re-renders wholesale, so the old MutationObserver
  // hook was fragile — so this is the proto's vanilla renderer of that same
  // component. Keep the two in sync.
  //   opts.plateClass  extra classes on the plate half (offers' notification
  //                    cards override the border/background there)
  function buildRegBadge(plate, opts) {
    opts = opts || {};
    return '<div class="flex rounded-md bg-white" role="text"' +
           ' aria-label="Rekisterinumero ' + esc(plate || '') + '">' +
             '<div class="w-2 h-auto bg-av-blue rounded-l-md"></div>' +
             '<div class="py-1 px-1.5 border border-l-0 rounded-r-md font-dm text-xs sm:text-sm text-slate-800 whitespace-nowrap ' +
               (opts.plateClass || 'border-slate-200') + '">' +
               (esc(plate) || '\u2013') +
             '</div>' +
           '</div>';
  }

  window.buildRegBadge = buildRegBadge;

  // ── buildCarCard(props) ───────────────────────────────────────────
  // The one card renderer. Structure mirrors prod's CarCard.vue, so props
  // mirror its props too — see CARD-COMPONENT-PLAN.md for the contract.
  //
  //   registrationNumber, make, model, modelSpecification,
  //   year, mileage, fuelType, driveType, image,
  //   status, statusColor, statusIcon, supportingText,
  //   primaryCta / secondaryCta  { text, href?, attrs? }
  //
  // Proto-only extensions (no prod equivalent), kept explicit:
  //   mediaOverlay  extra markup layered over the photo (price tag, badges)
  //   mediaBottom   extra markup pinned to the photo's bottom edge
  //   cardClass     extra classes on the card root (default: prod's shadow-sm)
  //   ctaFullWidth  keep CTAs full-width instead of prod's right-aligned row
  //   ctaSlot       raw markup replacing the CTA row (prod's #actions slot)
  //
  // Returns an HTML string. Callers own their own event wiring.
  function buildCarCard(props) {
    props = props || {};

    var mediaInner = props.image
      ? '<img src="' + esc(props.image) + '" class="absolute inset-0 w-full h-full object-cover" alt="" />'
      // No photo — prod renders a plain bg-blue-300 with the white ph-car-simple icon.
      : '<img src="assets/ph-car-simple-white.svg" class="relative z-10 w-[70px] h-[70px] opacity-60" alt="" />';

    var plateBadge = buildRegBadge(props.registrationNumber);

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

    // CTAs. prod's CarCard renders UiButton secondary (primary action) and ghost
    // (secondary action), or an #actions slot. Descriptors are
    // { text, href?, attrs? } — an href renders <a>, otherwise <button>.
    var BTN_BASE = 'px-4 py-2 font-dm text-xs sm:text-sm font-medium rounded-lg text-center cursor-pointer transition-colors inline-flex items-center justify-center';
    // UiButton variants — see CLAUDE.md rule 8
    var BTN_SECONDARY = BTN_BASE + ' bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-800 sm:order-2';
    var BTN_GHOST     = BTN_BASE + ' bg-transparent hover:bg-blue-50 active:bg-blue-100 text-blue-600';

    function cta(desc, variantCls, widthCls) {
      if (!desc || !desc.text) return '';
      var cls = widthCls + ' ' + variantCls;
      var attrs = desc.attrs || '';
      return desc.href
        ? '<a href="' + esc(desc.href) + '" ' + attrs + ' class="' + cls + '" style="text-decoration:none">' + esc(desc.text) + '</a>'
        : '<button type="button" ' + attrs + ' class="' + cls + '">' + esc(desc.text) + '</button>';
    }

    var btnWidth = props.ctaFullWidth ? 'w-full' : 'w-full md:w-auto';
    var ctaRow = props.ctaSlot ? props.ctaSlot
      : (props.primaryCta || props.secondaryCta)
        ? '<div class="w-full flex items-center ' +
            (props.ctaFullWidth ? 'flex-col gap-y-2' : 'md:justify-end flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-2') + '">' +
            cta(props.secondaryCta, BTN_GHOST, btnWidth) +
            cta(props.primaryCta, BTN_SECONDARY, btnWidth) +
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
            (props.supportingText
              ? '<p class="font-dm text-sm text-slate-500 italic">' + esc(props.supportingText) + '</p>'
              : '') +
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
  // Photo requirements: >=5 total, with at least one exterior and one interior.
  // NOTE: this rule is also implemented in success.html (photosComplete(store))
  // and contact.html's stepper. Three copies — worth consolidating, but they
  // take different arguments so it is not a drop-in change.
  function photosComplete(photos) {
    photos = photos || {};
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

    // Status is carried by the card's body badge (prod's CarCard status prop),
    // driven by draft status. There used to be an extra pill overlaid on the
    // photo here — prod's CarCard never overlays the media, and it duplicated
    // the body badge, so it's gone.
    const badge = window.DRAFT_BADGES[options.draftStatus] || window.DRAFT_BADGES['open'];

    // Price tag overlay (proto-only; prod has no media overlay at all).
    const overlayTop = priceTag
      ? `<div style="position:absolute;top:.5rem;left:.5rem;right:.5rem;z-index:10;display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:.25rem;">
           ${priceTag}
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

      // Status badge — prod Preview.vue draftStatusConfig, keyed on draft status
      status: t(badge.key),
      statusColor: badge.badge,
      statusIcon: badge.icon,

      secondaryCta: { text: t('card.openDetails'), attrs: 'id="av-open-modal-btn"' },
      ctaFullWidth: true,

      // Proto-only extensions
      mediaOverlay: overlayTop,
      // No cardClass: prod's CarCard root is `bg-white … shadow-sm` with no
      // border, and no prod consumer ever passes one. The old blue border on
      // success and slate border mid-funnel were both proto inventions.
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
