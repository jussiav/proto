/**
 * Shared vehicle card + ad-preview modal component.
 * Included by contact.html, success.html and offers.html.
 *
 * Exposes:
 *   window.renderVehicleCard(containerId, options)  — funnel card (contact/success);
 *                                                      options.primaryCta { text, href }
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
      /* prod UiBadge's `text-xs xs:text-sm`, with prod's custom xs = 460px. */
      '.av-card__badge{font-size:.75rem;line-height:1rem;}',
      '@media (min-width:460px){.av-card__badge{font-size:.875rem;line-height:1.25rem;}}',
      /* Horizontal: prod's lg:max-h-[250px] card, photo capped at lg:w-[250px].
         The 250px is a CAP, not a fixed column: prod puts no width on the media
         wrapper and leaves flex-shrink at its default 1, with the body at
         width:100%. So the two compete and the photo shrinks as the card
         narrows — ~171px at a 540px card, which is what prod renders. A fixed
         flex-shrink:0 column squeezed the details instead.
         480px = the narrowest card that still reads as two columns. */
      '@container (min-width: 480px){',
      '  .av-card{flex-direction:row;max-height:250px;}',
      '  .av-card__media{height:auto;width:250px;flex-shrink:1;min-width:0;}',
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
  var DRAFT_ICON_HOURGLASS = '<svg width="1em" height="1em" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M10.0625 1.09375H3.9375C3.64742 1.09375 3.36922 1.20898 3.1641 1.4141C2.95898 1.61922 2.84375 1.89742 2.84375 2.1875V4.15625C2.84417 4.32597 2.88389 4.4933 2.95979 4.6451C3.0357 4.79691 3.14572 4.92908 3.28125 5.03125L5.90625 7L3.28125 8.96875C3.14572 9.07092 3.0357 9.20309 2.95979 9.3549C2.88389 9.5067 2.84417 9.67403 2.84375 9.84375V11.8125C2.84375 12.1026 2.95898 12.3808 3.1641 12.5859C3.36922 12.791 3.64742 12.9062 3.9375 12.9062H10.0625C10.3526 12.9062 10.6308 12.791 10.8359 12.5859C11.041 12.3808 11.1562 12.1026 11.1562 11.8125V9.86344C11.1561 9.69401 11.1168 9.52691 11.0415 9.37514C10.9662 9.22337 10.8569 9.09104 10.722 8.98844L8.08828 7L10.722 5.00937C10.8569 4.90678 10.9662 4.77444 11.0415 4.62267C11.1168 4.47091 11.1561 4.3038 11.1562 4.13437V2.1875C11.1563 1.89742 11.041 1.61922 10.8359 1.4141C10.6308 1.20898 10.3526 1.09375 10.0625 1.09375ZM9.84375 2.40625V3.28125H4.15625V2.40625H9.84375ZM7 6.17969L4.88523 4.59375H9.09617L7 6.17969ZM9.84375 11.5938H4.15625V9.95312L7 7.82031L9.84375 9.97117V11.5938Z"/></svg>';
  var DRAFT_ICON_WARNING   = '<svg width="1em" height="1em" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M6.34375 7.21875V4.375C6.34375 4.20095 6.41289 4.03403 6.53596 3.91096C6.65903 3.78789 6.82595 3.71875 7 3.71875C7.17405 3.71875 7.34097 3.78789 7.46404 3.91096C7.58711 4.03403 7.65625 4.20095 7.65625 4.375V7.21875C7.65625 7.3928 7.58711 7.55972 7.46404 7.68279C7.34097 7.80586 7.17405 7.875 7 7.875C6.82595 7.875 6.65903 7.80586 6.53596 7.68279C6.41289 7.55972 6.34375 7.3928 6.34375 7.21875ZM12.9063 5.00664V8.99336C12.9066 9.13704 12.8785 9.27938 12.8235 9.41211C12.7685 9.54485 12.6877 9.66535 12.5858 9.76664L9.76664 12.5858C9.66537 12.6877 9.54487 12.7685 9.41213 12.8235C9.27939 12.8786 9.13705 12.9067 8.99336 12.9063H5.00664C4.86295 12.9067 4.72061 12.8786 4.58787 12.8235C4.45513 12.7685 4.33463 12.6877 4.23336 12.5858L1.41422 9.76664C1.31231 9.66535 1.23151 9.54485 1.1765 9.41211C1.12149 9.27938 1.09336 9.13704 1.09375 8.99336V5.00664C1.09336 4.86296 1.12149 4.72062 1.1765 4.58789C1.23151 4.45515 1.31231 4.33465 1.41422 4.23336L4.23336 1.41422C4.33463 1.31228 4.45513 1.23147 4.58787 1.17645C4.72061 1.12144 4.86295 1.09333 5.00664 1.09375H8.99336C9.13705 1.09333 9.27939 1.12144 9.41213 1.17645C9.54487 1.23147 9.66537 1.31228 9.76664 1.41422L12.5858 4.23336C12.6877 4.33465 12.7685 4.45515 12.8235 4.58789C12.8785 4.72062 12.9066 4.86296 12.9063 5.00664ZM11.5938 5.09742L8.90258 2.40625H5.09742L2.40625 5.09742V8.90258L5.09742 11.5938H8.90258L11.5938 8.90258V5.09742ZM7 8.53125C6.82694 8.53125 6.65777 8.58257 6.51388 8.67871C6.36998 8.77486 6.25783 8.91152 6.19161 9.0714C6.12538 9.23129 6.10805 9.40722 6.14181 9.57695C6.17558 9.74669 6.25891 9.9026 6.38128 10.025C6.50365 10.1473 6.65956 10.2307 6.8293 10.2644C6.99903 10.2982 7.17496 10.2809 7.33485 10.2146C7.49473 10.1484 7.63139 10.0363 7.72754 9.89237C7.82368 9.74848 7.875 9.57931 7.875 9.40625C7.875 9.17419 7.78281 8.95163 7.61872 8.78753C7.45462 8.62344 7.23206 8.53125 7 8.53125Z"/></svg>';
  var DRAFT_ICON_PAPERCLIP = '<svg width="1em" height="1em" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="m11.62 7.464-4.487 4.484a3.282 3.282 0 0 1-4.64-4.642L7.86 1.953a2.188 2.188 0 1 1 3.093 3.095l-.01.008L5.707 10.1a.658.658 0 0 1-1.066-.234.656.656 0 0 1 .156-.712l5.234-5.038a.875.875 0 0 0-1.242-1.234L3.42 8.234a1.97 1.97 0 0 0 2.786 2.784l4.487-4.485a.659.659 0 0 1 1.123.465.656.656 0 0 1-.193.465h-.002Z"/></svg>';

  /* One entry per draft status, transcribed from prod's Preview.vue
     draftStatusConfig (text key + icon + UiBadge colour) with the colour spelled
     out from UiBadge's own statusColorVariants:

       open      light      bg-slate-50  border-slate-200  icon slate-400  text slate-500
       in_review gray       bg-slate-200 border-gray-300   icon+text gray-500
       rejected  light_red  bg-transparent border-red-300  icon+text red-700
       queued    amber      bg-amber-50  border-amber-400  icon+text amber-700

     `iconColor` exists because UiBadge colours the icon separately, and `light`
     is the one variant where it differs from the text.

     `key` not literal text, so the label follows the language toggle. */
  window.DRAFT_BADGES = {
    'open': {
      key: 'draftStatus.open', icon: DRAFT_ICON_PAPERCLIP,
      badge: 'bg-slate-50 border-slate-200 text-slate-500',
      iconColor: 'text-slate-400'
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
    /* No `published` entry. Prod's Preview.vue has one — the untranslated literal
       "Published" with a warning-octagon icon — but nothing renders it:
       shouldShowPreview excludes the `success` state and Success.vue draws no
       card, so a published draft shows no car card at all. Adding it here would
       be inventing UI, not mirroring prod. */
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
  /* Prod stores these as enum keys and prints them through
     tender.fuel_types / .drive_types / .transmission_types, so a raw "fwd" or
     "gasoline" never reaches a Finnish card. Values the map does not know pass
     through unchanged - the funnel already writes some of them in Finnish. */
  var ENUM_LABELS_FI = {
    gasoline: 'Bensiini', diesel: 'Diesel', hybrid: 'Hybridi', electric: 'Sähkö',
    gas: 'Kaasu', e85: 'E85/bensiini',
    petrol_electric: 'Bensiini-sähkö', diesel_electric: 'Diesel-sähkö',
    manual: 'Manuaali', automatic: 'Automaatti', stepless: 'Portaaton',
    fwd: 'Etuveto', rwd: 'Takaveto', awd: 'Neliveto'
  };
  function ENUM_FI(v) {
    return (typeof v === 'string' && ENUM_LABELS_FI[v.toLowerCase()]) || v;
  }

  //   year, mileage, fuelType, driveType, image,
  //   status, statusColor, statusIcon, statusIconColor, supportingText,
  //   primaryCta / secondaryCta  { text, href?, attrs? }
  //
  // Proto-only extensions (no prod equivalent), kept explicit:
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

    /* UiBadge: wrapper colours, then icon and text coloured separately. The
       font-size step is prod's `text-xs xs:text-sm`, and prod's `xs` is a custom
       460px breakpoint — hand-written in the shell CSS rather than as a utility,
       since the proto's pages do not override Tailwind's default screens. */
    var statusBadge = props.status
      ? '<div class="av-card__badge inline-flex items-center space-x-2 px-2 py-1 font-dm rounded border ' +
          (props.statusColor || 'bg-slate-50 border-slate-200 text-slate-500') + '">' +
          (props.statusIcon
            ? '<span class="inline-flex ' + (props.statusIconColor || '') + '">' + props.statusIcon + '</span>'
            : '') +
          '<span>' + esc(props.status) + '</span>' +
        '</div>'
      : '';

    var name = [props.make, props.model].filter(Boolean).map(esc).join(' ');

    var pills = [props.year, props.mileage, ENUM_FI(props.driveType), ENUM_FI(props.fuelType)]
      .filter(Boolean)
      .map(function (v) {
        return '<span class="px-1.5 py-0.5 font-dm text-xs text-slate-500 rounded border border-slate-200">' + esc(v) + '</span>';
      }).join('');

    // CTAs. prod's CarCard renders UiButton secondary (primary action) and ghost
    // (secondary action), or an #actions slot. Descriptors are
    // { text, href?, attrs? } — an href renders <a>, otherwise <button>.
    var BTN_BASE = 'px-4 py-2 font-dm text-sm font-medium rounded-lg text-center cursor-pointer transition-colors inline-flex items-center justify-center';
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
          mediaInner + (props.mediaBottom || '') +
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
    /* No price on the card. Prod passes asking_price into CarCard (Preview.vue)
       and CarCard never renders it — the prop is declared and unused — while
       CarDetailsCard, the modal behind the card's own CTA, has no price field at
       all. Nowhere in the prod funnel is the seller's price shown back to them,
       so the proto's price tag went with the media overlay it lived on. */

    // Status is carried by the card's body badge (prod's CarCard status prop),
    // driven by draft status. There used to be an extra pill overlaid on the
    // photo here — prod's CarCard never overlays the media, and it duplicated
    // the body badge, so it's gone.
    const badge = window.DRAFT_BADGES[options.draftStatus] || window.DRAFT_BADGES['open'];

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
      statusIconColor: badge.iconColor,

      primaryCta: options.primaryCta || null,
      secondaryCta: { text: t('card.openDetails'), attrs: 'id="av-open-modal-btn"' },
      // No ctaFullWidth: prod's CarCard row is md:justify-end with w-full
      // md:w-auto buttons, so "Avaa tiedot" sits at the right edge on desktop.

      // Proto-only extensions
      // No cardClass: prod's CarCard root is `bg-white … shadow-sm` with no
      // border, and no prod consumer ever passes one. The old blue border on
      // success and slate border mid-funnel were both proto inventions.
    });

    document.getElementById('av-open-modal-btn').addEventListener('click', window.openAdModal);
  };

  // ── Car details sheet ─────────────────────────────────────────
  /* A transcription of prod's CarDetailsCard.vue, the read-only sheet behind
     "Avaa tiedot" in both the funnel preview and the offers page (the dead
     PreviewModal.vue is what this used to follow). Its `advert` prop is the raw
     draft or request resource, so the store is mapped onto prod's field names
     first (advertFromStore) and rendered from those.

     Three values print RAW in prod, reproduced as-is: `fuel_type` and
     `drive_type` are enum keys (CarCard translates them, this card does not),
     and `last_service_date` is its key, because the translation beside it is
     commented out. Also prod's: the VAT line sits above the "Varusteet" heading.

     Hand-written CSS, not utilities: the markup is JS-built and the Play CDN
     generates arbitrary-value classes a tick after render. */
  const CDC_ICON = {
    x: '<svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>',
    check: '<svg class="cdc-ico" width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/></svg>',
    cross: '<svg class="cdc-ico" width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>',
    location: '<svg class="cdc-ico" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/></svg>'
  };

  const CDC_CSS = [
    '#av-ad-modal{display:none;position:fixed;inset:0;z-index:9999;}',
    '#av-ad-modal .cdc-overlay{position:fixed;inset:0;background:rgba(17,24,39,.5);}',
    '#av-ad-modal .cdc-scroll{position:fixed;inset:0;overflow-y:auto;}',
    '#av-ad-modal .cdc-center{min-height:100vh;padding:0;text-align:center;}',
    '#av-ad-modal .cdc-panel{position:relative;overflow:hidden;border-radius:.5rem;background:#fff;text-align:left;box-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);}',
    '@media(min-width:620px){#av-ad-modal .cdc-center{display:flex;justify-content:center;align-items:center;}',
    '  #av-ad-modal .cdc-panel{margin:2rem 0;width:100%;max-width:44rem;}}',
    '#av-ad-modal .cdc-close{position:absolute;top:1rem;right:1rem;background:#fff;padding:.5rem;border:0;border-radius:.375rem;z-index:1;cursor:pointer;color:#000;line-height:0;}',
    '#av-ad-modal .cdc-figure{margin:0;width:100%;}',
    '#av-ad-modal .cdc-figure img{display:block;width:100%;height:100%;object-fit:cover;}',
    '@media(min-width:460px){#av-ad-modal .cdc-figure{height:22.5rem;}}',
    '#av-ad-modal .cdc-thumbs{display:flex;flex-wrap:wrap;gap:1rem;padding:1rem;}',
    '#av-ad-modal .cdc-thumb{cursor:pointer;padding-bottom:.25rem;border-bottom:2px solid transparent;background:none;border-top:0;border-left:0;border-right:0;padding-left:0;padding-right:0;padding-top:0;}',
    '#av-ad-modal .cdc-thumb.is-main{border-bottom-color:#0B6DFF;}',
    '#av-ad-modal .cdc-thumb img{display:block;width:3rem;height:3rem;object-fit:cover;}',
    '#av-ad-modal .cdc-more{width:3rem;height:3rem;border:1px solid #6B7280;border-radius:.25rem;display:flex;align-items:center;justify-content:center;cursor:pointer;background:none;font-size:1.25rem;line-height:1.75rem;color:inherit;}',
    '#av-ad-modal .cdc-body{width:100%;padding:1.25rem;}',
    '@media(min-width:992px){#av-ad-modal .cdc-body{padding:1rem;}}',
    '#av-ad-modal .cdc-head{padding-bottom:.625rem;display:flex;flex-direction:column;gap:.625rem;border-bottom:1px solid #D1D5DB;}',
    '#av-ad-modal .cdc-plate{width:100%;display:flex;border-radius:.375rem;}',
    '#av-ad-modal .cdc-plate-strip{width:.5rem;background:#0B6DFF;border-radius:.375rem 0 0 .375rem;}',
    '#av-ad-modal .cdc-plate-text{padding:.25rem .375rem;border:1px solid #E2E8F0;border-left:0;border-radius:0 .375rem .375rem 0;}',
    '#av-ad-modal .cdc-name{display:flex;flex-direction:column;}',
    '#av-ad-modal .cdc-name .cdc-make{font-weight:500;}',
    '#av-ad-modal .cdc-pills{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;font-size:.875rem;line-height:1.25rem;}',
    '#av-ad-modal .cdc-pill{padding:.125rem .25rem;background:#F0F1F4;font-size:.75rem;line-height:1rem;color:#585D64;border-radius:.125rem;}',
    '#av-ad-modal .cdc-grid{margin-top:.625rem;padding-bottom:.625rem;display:grid;grid-template-columns:1fr;gap:1rem;border-bottom:1px solid #D1D5DB;word-break:break-all;}',
    '@media(min-width:620px){#av-ad-modal .cdc-grid{grid-template-columns:1fr 1fr;}}',
    '#av-ad-modal .cdc-col{display:flex;flex-direction:column;gap:.5rem;font-size:.75rem;line-height:1rem;color:#585D64;}',
    '#av-ad-modal .cdc-col-title{font-weight:500;font-size:1rem;line-height:1.5rem;color:#000;}',
    '#av-ad-modal .cdc-ico{display:inline-block;vertical-align:middle;}',
    '#av-ad-modal .cdc-blue{color:#0B6DFF;}',
    '#av-ad-modal .cdc-grey{color:#1F2937;}',
    '#av-ad-modal .cdc-ml{margin-left:.25rem;}',
    '#av-ad-modal .cdc-mr{margin-right:.25rem;}',
    '#av-ad-modal .cdc-files{margin-top:.625rem;display:flex;flex-direction:column;gap:.5rem;font-size:.75rem;line-height:1rem;}',
    '#av-ad-modal .cdc-files a{color:#0B6DFF;text-decoration:underline;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;}',
    '#av-ad-modal .cdc-actions{margin-bottom:1rem;padding:.75rem 2rem;display:flex;flex-direction:column;justify-content:center;align-items:center;}',
    '@media(min-width:768px){#av-ad-modal .cdc-actions{flex-direction:row;}}',
    /* elements/Button.vue, color blue, size medium. Its pt-13px/pb-15px out-rank
       the size's py-2 in Tailwind's property order, hence 13/15. */
    '#av-ad-modal .cdc-btn{margin-bottom:.5rem;padding:13px 1.25rem 15px;display:inline-block;line-height:1;font-weight:500;font-size:1rem;letter-spacing:.05em;border-radius:.5rem;background:#0B6DFF;color:#fff;border:2px solid #0B6DFF;cursor:pointer;}'
  ].join('');

  function ensureModal() {
    if (document.getElementById('av-ad-modal')) return;
    if (!document.getElementById('av-ad-modal-style')) {
      const st = document.createElement('style');
      st.id = 'av-ad-modal-style';
      st.textContent = CDC_CSS;
      document.head.appendChild(st);
    }
    const wrap = document.createElement('div');
    wrap.id = 'av-ad-modal';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.innerHTML = '<div class="cdc-overlay" aria-hidden="true"></div>' +
      '<div class="cdc-scroll"><div class="cdc-center"><div class="cdc-panel" id="av-ad-modal-panel"></div></div></div>';
    document.body.appendChild(wrap);
    wrap.addEventListener('click', function (e) {
      if (!document.getElementById('av-ad-modal-panel').contains(e.target)) window.closeAdModal();
    });
  }

  window.openAdModal = function () {
    cdcMain = 0;
    cdcShowAll = false;
    ensureModal();
    populateModal();
    document.getElementById('av-ad-modal').style.display = 'block';
  };

  window.closeAdModal = function () {
    const m = document.getElementById('av-ad-modal');
    if (m) m.style.display = 'none';
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeAdModal();
  });

  /* A data: URL cannot be opened as a top-level document in Chrome, so file links
     point at a blob built from the stored bytes. Revoked when the sheet is
     repopulated, so opening the modal repeatedly does not leak. */
  var modalFileUrls = [];
  function modalFileUrl(entry) {
    try {
      var parts = String(entry.data).split(',');
      var mime = (parts[0].match(/:(.*?);/) || [null, entry.type || 'application/octet-stream'])[1];
      var bin = atob(parts[1]);
      var buf = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
      var url = URL.createObjectURL(new Blob([buf], { type: mime }));
      modalFileUrls.push(url);
      return url;
    } catch (e) { return null; }
  }

  /* The funnel stores RENDERED LABELS for these answers (services.html's
     radioGroups), so a stored value is matched against both languages. */
  function labelKey(value, pairs) {
    var T = window.TRANSLATIONS || {};
    for (var k in pairs) {
      var path = pairs[k].split('.');
      var hit = ['fi', 'en'].some(function (l) {
        var node = T[l];
        path.forEach(function (p) { node = node && node[p]; });
        return node === value;
      });
      if (hit) return k;
    }
    return null;
  }

  function enumKey(label) {
    if (!label) return null;
    for (var k in ENUM_LABELS_FI) if (ENUM_LABELS_FI[k] === label) return k;
    return label;
  }

  /* prod's lastServiceYears() ends at currentYear - 3, labelled "or before";
     the funnel stores that option as 'before'. */
  function serviceYear(v) {
    if (v === 'before') return String(new Date().getFullYear() - 3);
    return v || null;
  }

  function advertFromStore(s) {
    const hero = s.hero || {}, d = s.details || {}, sv = s.services || {};
    const rg = Array.isArray(sv.radioGroups) ? sv.radioGroups : [];
    const ls = sv.lastServiceDetail || {};
    const photos = s.photos || {};
    const km = parseInt(String(hero.km || '').replace(/\D/g, ''), 10);
    const images = [];
    ['ulkopuoli', 'sisatilat', 'huoltokirja', 'renkaat', 'naarmut', 'tuulilasi'].forEach(function (name) {
      (photos[name] || []).forEach(function (u) {
        if (typeof u === 'string' && !u.startsWith('data:application/pdf')) images.push(u);
      });
    });
    return {
      registration_number: hero.plate ? String(hero.plate).toUpperCase() : null,
      make: d.merkki || '',
      model: d.malli || '',
      model_specification: d.mallitarkennus || null,
      year: d.vuosimalli || null,
      driven: isNaN(km) ? null : km,
      drive_type: enumKey(d.vetotapa),
      fuel_type: enumKey(d.polttoaine),
      postalcode: d.sijainti || null,
      vat_deductible: !!d.yrityskaytto,
      summer_tires_condition: d.kesarenkaat || null,
      summer_tires: d.kesavanteet || null,
      winter_tires_condition: d.talvirenkaat || null,
      winter_tires: d.talvivanteet || null,
      keys: d.avaimet || null,
      accessories: d.varustelu || null,
      windscreen_condition: rg[3] || null,
      windscreen_insurance: labelKey(rg[4], { yes: 'service.yes', no: 'service.no' }),
      service_book: rg[0] || null,
      last_service_date: labelKey(rg[2], {
        within_6_months: 'service.lastService6mo',
        over_6_months:   'service.lastServiceOlder',
        dont_remember:   'service.lastServiceUnsure'
      }),
      last_service_month: ls.month || null,
      last_service_year: serviceYear(ls.year),
      last_service_km: ls.km ? parseInt(ls.km, 10) : null,
      damage_and_service_information: sv.korjaukset || null,
      images: images
    };
  }

  function rimIcon(v) {
    if (v === 'Vanteilla') return '<span class="cdc-blue">' + CDC_ICON.check + '</span>';
    if (v === 'Ilman vanteita') return '<span class="cdc-grey">' + CDC_ICON.cross + '</span>';
    return '';
  }

  function tireRow(labelKey2, cond, rims) {
    if (!cond) return '';
    return '<div><span>' + esc(t(labelKey2)) + ': </span> ' + esc(cond) +
      '<span class="cdc-ml">' + rimIcon(rims) + ' ' + esc(rims || '') + '</span></div>';
  }

  let cdcShowAll = false;
  let cdcMain = 0;

  function populateModal() {
    modalFileUrls.forEach(function (u) { try { URL.revokeObjectURL(u); } catch (e) {} });
    modalFileUrls = [];
    ensureModal();
    const s = getStore();
    const a = advertFromStore(s);
    const panel = document.getElementById('av-ad-modal-panel');
    const mileage = a.driven ? a.driven.toLocaleString('fi-FI') + ' km' : null;
    const lastServiceMileage = a.last_service_km ? a.last_service_km.toLocaleString('fi-FI') + ' km' : null;
    const shown = cdcShowAll ? a.images : a.images.slice(0, 5);
    if (cdcMain >= a.images.length) cdcMain = 0;

    let html = '<button type="button" class="cdc-close" id="av-modal-close" aria-label="' + esc(t('carDetails.close')) + '">' + CDC_ICON.x + '</button>';

    html += '<figure class="cdc-figure">' + (a.images.length
      ? '<img src="' + esc(a.images[cdcMain]) + '" alt="">'
      : '<img src="assets/missing-images-fi.svg" loading="lazy" alt="">') + '</figure>';

    if (a.images.length) {
      html += '<div class="cdc-thumbs">' + shown.map(function (src, i) {
        return '<button type="button" class="cdc-thumb' + (i === cdcMain ? ' is-main' : '') + '" data-cdc-img="' + i + '"><img src="' + esc(src) + '" alt=""></button>';
      }).join('');
      if (shown.length < a.images.length) {
        html += '<button type="button" class="cdc-more" id="cdc-more">+' + (a.images.length - shown.length) + '</button>';
      }
      html += '</div>';
    }

    const pills = [a.year, mileage, a.drive_type, a.fuel_type].filter(Boolean)
      .map(function (v) { return '<span class="cdc-pill">' + esc(v) + '</span>'; });
    if (a.postalcode) pills.push('<span class="cdc-pill"><span style="color:#585D64">' + CDC_ICON.location + '</span> ' + esc(a.postalcode) + '</span>');

    html += '<div class="cdc-body">' +
      '<div class="cdc-head">' +
        '<div class="cdc-plate"><div class="cdc-plate-strip"></div><div class="cdc-plate-text">' + esc(a.registration_number) + '</div></div>' +
        '<div class="cdc-name"><span class="cdc-make">' + esc(a.make) + ' ' + esc(a.model) + '</span><span>' + esc(a.model_specification || '') + '</span></div>' +
        '<div class="cdc-pills">' + pills.join('') + '</div>' +
      '</div>';

    let col1 = '';
    if (a.vat_deductible) col1 += '<div><span class="cdc-blue cdc-mr">' + CDC_ICON.check + '</span><span>' + esc(t('carDetails.vatDeductible')) + '</span></div>';
    col1 += '<span class="cdc-col-title">' + esc(t('carDetails.accessories')) + '</span>';
    col1 += tireRow('carDetails.summerTires', a.summer_tires_condition, a.summer_tires);
    col1 += tireRow('carDetails.winterTires', a.winter_tires_condition, a.winter_tires);
    if (a.keys) col1 += '<div><span>' + esc(t('carDetails.keys')) + ': </span> ' + esc(a.keys) + '</div>';
    if (a.accessories) col1 += '<div><span>' + esc(t('carDetails.accessoriesDescription')) + ': </span><span>' + esc(a.accessories) + '</span></div>';

    let col2 = '<span class="cdc-col-title">' + esc(t('carDetails.serviceHistory')) + '</span>';
    if (a.windscreen_condition) {
      let ins = '';
      if (a.windscreen_insurance === 'yes') ins = '<span class="cdc-ml"><span class="cdc-blue">' + CDC_ICON.check + '</span> ' + esc(t('carDetails.insurance')) + '</span>';
      if (a.windscreen_insurance === 'no')  ins = '<span class="cdc-ml"><span class="cdc-grey">' + CDC_ICON.cross + '</span> ' + esc(t('carDetails.noInsurance')) + '</span>';
      col2 += '<div><span>' + esc(t('carDetails.windshield')) + ': </span> ' + esc(a.windscreen_condition) + ins + '</div>';
    }
    if (a.service_book) col2 += '<div><span>' + esc(t('carDetails.serviceHistory')) + ': </span> ' + esc(a.service_book) + '</div>';
    if (a.last_service_date) {
      const when = (a.last_service_month || a.last_service_year)
        ? ' - ' + (a.last_service_month ? a.last_service_month + '/' : '') + (a.last_service_year || '')
        : '';
      col2 += '<div><span>' + esc(t('carDetails.lastService')) + ': </span> ' + esc(a.last_service_date) + esc(when) + '</div>';
    }
    if (lastServiceMileage) col2 += '<div><span>' + esc(t('carDetails.lastServiceMileage')) + ': </span> ' + esc(lastServiceMileage) + '</div>';
    if (a.damage_and_service_information) col2 += '<div><span>' + esc(t('carDetails.serviceAndDamage')) + ': ' + esc(a.damage_and_service_information) + '</span></div>';

    html += '<div class="cdc-grid"><div class="cdc-col">' + col1 + '</div><div class="cdc-col">' + col2 + '</div></div>';

    /* "Seller file upload" v1 only. prod has no files, and Seed car writes them
       in every state, so listing them unconditionally put something production
       cannot show into control. Filenames open in a new tab; no delete. */
    const sellerFiles = Array.isArray(s.files) ? s.files : [];
    const filesArm = window.protoVariant ? window.protoVariant('seller-file-upload', 'control') : 'control';
    if (filesArm === 'v1' && sellerFiles.length) {
      html += '<div class="cdc-files"><span class="cdc-col-title">' + esc(t('carDetails.files')) + '</span>' +
        sellerFiles.map(function (f) {
          const href = modalFileUrl(f);
          return '<a href="' + (href || '#') + '" target="_blank" rel="noopener">' + esc(f.name) + '</a>';
        }).join('') + '</div>';
    }

    html += '</div>';
    html += '<div class="cdc-actions"><button type="button" class="cdc-btn" id="av-modal-close-btn">' + esc(t('carDetails.close')) + '</button></div>';

    panel.innerHTML = html;

    document.getElementById('av-modal-close').addEventListener('click', window.closeAdModal);
    document.getElementById('av-modal-close-btn').addEventListener('click', window.closeAdModal);
    panel.querySelectorAll('[data-cdc-img]').forEach(function (b) {
      b.addEventListener('click', function () { cdcMain = parseInt(b.dataset.cdcImg, 10); populateModal(); });
    });
    const more = document.getElementById('cdc-more');
    if (more) more.addEventListener('click', function () { cdcShowAll = true; populateModal(); });
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
