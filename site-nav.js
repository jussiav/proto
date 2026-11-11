/**
 * Shared site navigation — the single definition used by every non-funnel page.
 *
 * Mirrors production's ONavigationBar.vue (color="blue"):
 *   - one fixed nav, h-20, bg-blue, z-50
 *   - a spacer div of the same height immediately before it
 *   - headroom.js scroll behaviour: hides on scroll-down past the offset,
 *     reappears on scroll-up (same nav, no second white nav)
 *
 * Verified against the live site (autovex.fi): header.navigation is
 * `bg-blue fixed ... z-50`, nav height 80px, spacer `h-20 bg-blue`,
 * transition `transform 0.2s linear`, headroom offset 96.
 *
 * Runs synchronously during parsing so data-i18n attributes exist before
 * i18n.js fires on DOMContentLoaded. Include AFTER the #site-nav element.
 *
 * Funnel pages (details/price/services/photos/contact/success) have no nav —
 * they simply omit the #site-nav element and this script.
 *
 * Account menu (prod MProfileMenu + MProfileSubMenu): logged out, the account
 * icon + "Kirjaudu"; logged in, the icon + first name opens a popover from lg
 * (992px) with the consumer role's three items from config/user-menu.php.
 * Below lg prod shows a hamburger instead, and the CTA and the account menu
 * live in a drawer: Header.astro's drawer on data-menu="marketing" pages,
 * ONavigationBar's on the rest. One DOM tree, as prod's: the drawer is
 * `lg:contents` on desktop, so its children sit in the nav row.
 *
 * data-auth="required" marks a page prod serves only to a logged-in seller
 * (offers, decision, DAC7, profile): the account menu shows whatever
 * store.loggedIn says, since those pages set or clear it for funnel reasons.
 *
 * window.siteNav.sync() re-reads the store and redraws the account menu;
 * window.siteNav.setName(name) changes the shown first name only.
 */
(function () {
  var mount = document.getElementById('site-nav');
  if (!mount) return;

  var path = window.location.pathname;
  var isHelp = path.indexOf('help') !== -1;

  /* Menu item classes copied verbatim from the live nav's rendered markup
     (MMenu.vue, color="blue"). Idle = white text, transparent. Active = white
     block, blue text, 1px blue-100 bottom border — NOT bold; prod renders
     every item at font-weight 400. */
  var itemBase = 'px-4 py-3 lg:px-8 lg:py-2 rounded-lg lg:rounded-none flex items-center justify-center w-full gap-2 lg:h-full';
  var itemIdle = itemBase + ' lg:text-white hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-white/75';
  var itemActive = itemBase + ' lg:border-b lg:border-b-1 lg:border-b-blue-100 lg:bg-white lg:text-blue';

  /* Menu items appear ONLY on the marketing pages. In prod, ONavigationBar's
     menuItems prop defaults to [] and just two consumers pass anything:
     Header.astro (marketing, from Contentful) and offers/landing — and there
     only for B2B sellers (`isB2BSeller ? menuItems : []`). Every consumer-facing
     app page (decision, PersonalInformationPage/DAC7, auth, not-verified,
     complete-profile) passes none, so MMenu's v-if="menuItems.length" renders
     nothing. Same default here: a page opts in with data-menu="marketing".
     The CTA and profile link are NOT gated — prod's default #actions slot
     renders MMenuCTA + MProfileMenu on every one of those pages. */
  var showMenu = mount.dataset.menu === 'marketing';
  var authRequired = mount.dataset.auth === 'required';

  function T(key, fallback) {
    if (typeof window.t !== 'function') return fallback;
    var v = window.t(key);
    return v && v !== key ? v : fallback;
  }

  /* Prod order and labels (live autovex.fi). Only Tuki has a page in the proto;
     the rest keep href="#" rather than inventing routes. */
  var MENU = [
    { key: 'nav.reviews',    fi: 'Kokemuksia',     href: '#' },
    { key: 'nav.blog',       fi: 'Blogi',          href: '#' },
    { key: 'nav.forSellers', fi: 'Auton myyjälle', href: '#' },
    { key: 'nav.forDealers', fi: 'Autoliikkeelle', href: '#' },
    { key: 'nav.faq',        fi: 'Tuki',           href: 'help.html', active: isHelp }
  ];

  var MENU_HTML = MENU.map(function (m) {
    return '<li class="flex flex-col items-center w-full lg:w-auto h-auto lg:h-full">' +
             '<a href="' + m.href + '" class="' + (m.active ? itemActive : itemIdle) + '"' +
             ' data-i18n="' + m.key + '">' + m.fi + '</a>' +
           '</li>';
  }).join('');

  /* Price guess (initiative price-guess), v1-v3 only: the landing page
     joins the menu as its own machine sign. The label follows the arm, so it
     matches the sign on the page. price-guess.html renders v1 when no arm is
     remembered, so the item shows there too. */
  var pgArm = window.protoVariantStored ? window.protoVariantStored('price-guess') : null;
  var onPriceGuess = path.indexOf('price-guess') !== -1;
  var onSanta = path.indexOf('santa') !== -1;
  if (!pgArm && onPriceGuess) pgArm = 'v1';
  if ((!pgArm || pgArm === 'control') && onSanta) pgArm = 'v3';
  if (showMenu && (pgArm === 'v1' || pgArm === 'v2' || pgArm === 'v3')) {
    /* v3 is the Christmas campaign: its own page, a red sign, snowflakes.
       v4 has no item: hinta-arvio.html is a landing for search traffic. */
    var xmas = pgArm === 'v3';
    var pgKey = xmas ? 'priceSanta.navLabel' : pgArm === 'v2' ? 'priceEstimate.sign' : 'priceGuess.sign';
    var pgLabel = xmas ? 'Kirje Pukille' : pgArm === 'v2' ? 'Arviokone' : 'Hinta-arvaus';
    var pgGlyph = xmas ? '❄' : '★';
    var pgHref = xmas ? 'santa.html' : 'price-guess.html';
    var pgHere = xmas ? onSanta : onPriceGuess;
    MENU_HTML +=
      '<li class="flex flex-col items-center justify-center w-full lg:w-auto h-auto lg:h-full lg:pr-2">' +
        '<a href="' + pgHref + '" class="nav-pg' + (xmas ? ' is-xmas' : '') + '" title="' + pgLabel + '"' +
          (pgHere ? ' aria-current="page"' : '') + '>' +
          '<span class="nav-pg-star" aria-hidden="true">' + pgGlyph + '</span>' +
          '<span class="nav-pg-label" data-i18n="' + pgKey + '">' + pgLabel + '</span>' +
          '<span class="nav-pg-star" aria-hidden="true">' + pgGlyph + '</span>' +
        '</a>' +
      '</li>';
    /* Hand-written: the sign is the landing page's own (.pg-sign), scaled to
       the nav, and its twinkle is a keyframe utilities cannot express. The
       menu has ~135px to spare at 1280px and less below, so the sign grows
       with the viewport: one star below 1280px (the label stays for screen
       readers and in the title), the label without stars to 1359px, the full
       starred sign from 1360px. */
    var pgCss = document.createElement('style');
    pgCss.textContent =
      '.nav-pg{display:inline-flex;align-items:center;gap:8px;white-space:nowrap;padding:8px 10px;border-radius:12px;' +
        'background:#00F0DC;color:#08234D;font:700 14px/1 Barlow,sans-serif;letter-spacing:.06em;text-transform:uppercase;' +
        'box-shadow:0 4px 0 rgba(8,35,77,.35),0 0 18px rgba(0,240,220,.55);transition:translate .15s,rotate .2s,box-shadow .15s}' +
      '.nav-pg:hover{translate:0 -2px;rotate:-2deg;box-shadow:0 6px 0 rgba(8,35,77,.35),0 0 26px rgba(0,240,220,.75)}' +
      '.nav-pg:focus-visible{outline:3px solid #FAEADA;outline-offset:3px}' +
      '.nav-pg[aria-current="page"]{box-shadow:0 0 0 2px #fff,0 4px 0 2px rgba(8,35,77,.35),0 0 18px rgba(0,240,220,.55)}' +
      '.nav-pg-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}' +
      '.nav-pg-star{display:inline-block;color:#0B6DFF;animation:nav-pg-twinkle 1.6s ease-in-out infinite}' +
      '.nav-pg-star:last-child{display:none;animation-delay:-.8s}' +
      '@media (min-width:1280px){.nav-pg{padding:8px 12px;font-size:12px}.nav-pg-label{position:static;width:auto;height:auto;overflow:visible;clip:auto}.nav-pg-star{display:none}}' +
      '@media (min-width:1360px){.nav-pg{padding:9px 14px;font-size:14px;letter-spacing:.08em}.nav-pg-star,.nav-pg-star:last-child{display:inline-block}}' +
      '.nav-pg.is-xmas{background:#DC2626;color:#fff;box-shadow:0 4px 0 #7F1D1D,0 0 18px rgba(220,38,38,.55)}' +
      '.nav-pg.is-xmas:hover{box-shadow:0 6px 0 #7F1D1D,0 0 26px rgba(220,38,38,.75)}' +
      '.nav-pg.is-xmas[aria-current="page"]{box-shadow:0 0 0 2px #fff,0 4px 0 2px #7F1D1D,0 0 18px rgba(220,38,38,.55)}' +
      '.nav-pg.is-xmas .nav-pg-star{color:#fff}' +
      '@keyframes nav-pg-twinkle{50%{transform:scale(.6) rotate(45deg);opacity:.5}}' +
      '@media (prefers-reduced-motion:reduce){.nav-pg-star{animation:none}}';
    document.head.appendChild(pgCss);
  }

  /* Icons from prod's sprite (resources/assets/icons), path data verbatim.
     account-filled is MProfileMenu's own icon at size 30px; x-bold closes the
     drawer at UiIcon's default 1em. */
  var ICON_ACCOUNT =
    '<svg class="fill-current flex-shrink-0" width="30" height="30" viewBox="0 -960 960 960" aria-hidden="true">' +
      '<path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>' +
    '</svg>';
  var ICON_X =
    '<svg width="1em" height="1em" viewBox="0 0 17 17" fill="currentColor" aria-hidden="true">' +
      '<path d="M13.845 12.7175C13.9947 12.8672 14.0788 13.0702 14.0788 13.2819C14.0788 13.4936 13.9947 13.6967 13.845 13.8464C13.6953 13.9961 13.4923 14.0802 13.2806 14.0802C13.0688 14.0802 12.8658 13.9961 12.7161 13.8464L8.49997 9.62893L4.28251 13.8451C4.13281 13.9948 3.92977 14.0789 3.71806 14.0789C3.50635 14.0789 3.30331 13.9948 3.1536 13.8451C3.0039 13.6954 2.9198 13.4923 2.9198 13.2806C2.9198 13.0689 3.0039 12.8659 3.1536 12.7162L7.37106 8.50002L3.15493 4.28256C3.00523 4.13286 2.92113 3.92982 2.92113 3.71811C2.92113 3.5064 3.00523 3.30336 3.15493 3.15366C3.30463 3.00396 3.50767 2.91985 3.71939 2.91985C3.9311 2.91985 4.13414 3.00396 4.28384 3.15366L8.49997 7.37112L12.7174 3.15299C12.8671 3.00329 13.0702 2.91919 13.2819 2.91919C13.4936 2.91919 13.6966 3.00329 13.8463 3.15299C13.996 3.3027 14.0801 3.50574 14.0801 3.71745C14.0801 3.92916 13.996 4.1322 13.8463 4.2819L9.62888 8.50002L13.845 12.7175Z"/>' +
    '</svg>';

  /* AButton variant="nav-cta" size="lg", w-full in the drawer. Classes as the
     live nav renders them (MMenuCTA + Header.astro's buttonClass). */
  var CTA_CLASSES = 'inline-flex justify-center items-center transition cursor-pointer outline-offset-2 py-1.5 px-8 h-14 text-base leading-tight rounded-lg relative whitespace-nowrap font-dm w-full' +
    ' shadow-[inset_0px_1px_2px_1px_rgba(255,255,255,0.20)]' +
    ' bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white' +
    ' lg:bg-white lg:text-blue-600 lg:hover:bg-blue-50 lg:active:bg-blue-100';
  var CTA_HTML = '<a id="nav-cta" href="index.html" class="' + CTA_CLASSES + '" data-i18n="nav.startAuction">' +
    T('nav.startAuction', 'Aloita kilpailutus') + '</a>';

  var CLOSE_BTN =
    '<button id="drawer-menu-close" type="button" aria-controls="drawer-menu"' +
    ' class="bg-transparent rounded-lg hover:bg-gray-100 w-9 h-9 flex items-center justify-center lg:hidden">' +
      '<span class="sr-only" data-i18n="nav.close">' + T('nav.close', 'Sulje') + '</span>' + ICON_X +
    '</button>';

  /* The two drawers differ in prod, so each is transcribed from its own file.
     The marketing close row carries lg:hidden where prod's has none: prod's
     empty row takes no width, but this nav's gap-4 would add 16px for it. */
  var ACTIONS_UL_CLASSES = 'flex flex-col lg:flex-row grow-0 gap-1 items-center py-4 lg:p-0';
  var DRAWER_INNER = showMenu
    ? '<div class="flex justify-end lg:hidden">' + CLOSE_BTN + '</div>' +
      '<ul id="nav-links" class="flex-1 flex flex-col lg:flex-row items-center lg:h-full lg:justify-start lg:ml-16 font-dm text-base list-none">' +
        MENU_HTML +
      '</ul>' +
      '<ul class="' + ACTIONS_UL_CLASSES + '">' +
        '<div class="w-full lg:w-auto order-2 lg:order-1">' + CTA_HTML + '</div>' +
        '<div id="nav-profile-slot" class="flex-initial w-full lg:w-auto order-1 lg:order-2 text-black lg:text-white"></div>' +
      '</ul>'
    : '<div class="flex relative flex-col justify-between min-h-full lg:contents">' +
        '<a href="index.html" class="lg:hidden absolute top-4 left-4">' +
          '<span class="sr-only">AutoVex</span>' +
          '<img src="assets/logo-fi.svg" width="108" height="22" alt="AutoVex" class="-mt-1 block" />' +
        '</a>' +
        '<div class="absolute top-0 right-0 z-10 lg:hidden">' + CLOSE_BTN + '</div>' +
        '<div class="grow p-4 pt-12 lg:pt-0 lg:contents"></div>' +
        '<div class="grow-0 flex flex-col gap-y-2 p-4 lg:p-0 lg:contents">' +
          '<ul class="' + ACTIONS_UL_CLASSES + '">' +
            CTA_HTML.replace('class="', 'class="order-2 lg:order-1 lg:w-auto ') +
            '<div id="nav-profile-slot" class="flex-initial w-full lg:w-auto order-1 lg:order-2"></div>' +
          '</ul>' +
        '</div>' +
      '</div>';

  var NAV_HTML =
    /* Spacer — prod renders this as a sibling before the fixed header so page
       content starts below the nav. bg matches the nav for the blue variant. */
    '<div class="h-20 bg-av-blue"></div>' +
    '<header id="nav-bar"' +
    ' class="navigation fixed top-0 left-0 right-0 w-full h-20 z-50 bg-av-blue"' +
    ' style="transition:transform 200ms linear;">' +
      /* prod: max-w-screen-xxl — screens.xxl is 1440px in tailwind.config.js.
         Spelled literally because the proto's per-page configs don't define xxl. */
      '<nav class="h-full max-w-[1440px] mx-auto px-6 flex items-center justify-between gap-4">' +
        '<div class="flex-shrink-0 flex items-center">' +
          '<a href="index.html" aria-label="AutoVex etusivu">' +
            '<img id="nav-logo" src="assets/3052c32b-59c9-4847-a303-88ace8a9bed7.svg" alt="AutoVex"' +
            ' class="w-[107px] h-[22px] flex-shrink-0 object-contain block" style="filter:brightness(0) invert(1);" />' +
          '</a>' +
        '</div>' +
        /* AHamburgerMenu color="white" */
        '<button id="drawer-menu-trigger" type="button" class="lg:hidden flex flex-col items-stretch justify-evenly h-12 w-12 p-3 text-white"' +
        ' aria-controls="drawer-menu" aria-expanded="false" aria-label="' + T('nav.openMenu', 'Avaa valikko') + '" data-i18n-aria="nav.openMenu">' +
          '<span class="h-0.5 bg-current rounded"></span>' +
          '<span class="h-0.5 bg-current rounded"></span>' +
          '<span class="h-0.5 bg-current rounded"></span>' +
        '</button>' +
        '<div id="drawer-menu" tabindex="-1" aria-hidden="true"' +
        ' class="nav-drawer ' + (showMenu ? 'nav-drawer--marketing' : 'nav-drawer--app') + ' text-base text-black lg:contents">' +
          DRAWER_INNER +
        '</div>' +
      '</nav>' +
    '</header>';

  mount.innerHTML = NAV_HTML;

  /* Hand-written, not utilities: the drawer's off-canvas state and the
     popover's display must hold on first paint and after every redraw, and
     the Play CDN generates classes a tick after JS-built markup lands. */
  var navCss = document.createElement('style');
  navCss.textContent =
    '@media (max-width:991.98px){' +
      '#drawer-menu{position:fixed;top:0;bottom:0;right:0;max-width:100%;overflow-y:auto;background:#fff;transform:translateX(100%);transition:transform 150ms cubic-bezier(.4,0,.2,1)}' +
      '#drawer-menu.nav-drawer--app{width:20rem;z-index:50}' +
      '#drawer-menu.nav-drawer--marketing{width:24rem;z-index:40;display:flex;flex-direction:column;padding:.5rem}' +
      '#drawer-menu.is-open{transform:none}' +
    '}' +
    '@media (min-width:992px){#drawer-menu{display:contents}#drawer-menu-trigger{display:none}}' +
    '.nav-drawer-backdrop{position:fixed;inset:0;z-index:30;background:rgb(17 24 39 / .5)}' +
    '#nav-profile-trigger{display:none}' +
    '#profile-submenu{display:contents}' +
    '#profile-submenu>ul{z-index:50;line-height:30px}' +
    '@media (min-width:992px){' +
      '#nav-profile-trigger{display:flex}' +
      '#profile-submenu{display:none;position:absolute;top:0;left:0;margin:0}' +
      '#nav-profile.is-open #profile-submenu{display:block}' +
    '}';
  document.head.appendChild(navCss);

  /* ── Account menu ── */
  function readStore() {
    try { return JSON.parse(localStorage.getItem('autovex_funnel') || '{}'); } catch (e) { return {}; }
  }

  /* prod's acronym: the name up to its first space. */
  function firstName(name) {
    return String(name || '').replace(/ .*/, '');
  }

  function session() {
    var s = readStore();
    return {
      loggedIn: authRequired || !!s.loggedIn,
      acronym: firstName((s.contact || {}).kokoNimi)
    };
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* MProfileMenu's hover for white text (textColor="lg:text-white"): a box
     below lg, where the menu is on the white drawer, dimming from lg. */
  var HOVER = 'hover:bg-blue-100 lg:hover:bg-transparent lg:hover:opacity-90';

  /* MProfileSubMenu's ALink and UiButton. The logout string is UiButton's
     ghost/lg cva merged with the class prop the way its useClassMerging does:
     the prop's px-4 py-3 text-black hover:bg-gray-100 flex replace the cva's
     own, and h-14 stays. */
  var ITEM_LINK = 'px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center justify-center lg:justify-start gap-2 cursor-pointer';
  var ITEM_LOGOUT = 'flex justify-center lg:justify-start items-center transition cursor-pointer outline-offset-2 py-3 px-4 text-base leading-tight rounded-lg relative border-none h-14 bg-transparent hover:bg-gray-100 active:bg-blue-100 text-black active:text-blue-500 gap-2';

  function profileHtml(sess) {
    if (!sess.loggedIn) {
      /* prod's login path; the proto has no login page. */
      return '<div class="w-full">' +
        '<a id="nav-login" href="#" class="group rounded-lg block min-w-[50px] w-full lg:w-auto ' + HOVER + '">' +
          '<div class="flex flex-row lg:flex-col gap-x-2 items-center justify-center px-4 py-3 min-w-[50px] lg:text-white">' +
            ICON_ACCOUNT +
            '<span id="nav-login-label" class="text-md lg:text-xs font-semibold group-hover:underline" data-i18n="nav.login">' +
              T('nav.login', 'Kirjaudu') + '</span>' +
          '</div>' +
        '</a>' +
      '</div>';
    }
    var name = esc(sess.acronym);
    return '<div class="w-full">' +
      '<div id="nav-profile" class="w-full lg:w-auto">' +
        '<button id="nav-profile-trigger" type="button" aria-expanded="false"' +
        ' class="group hidden lg:flex flex-col items-center justify-center px-3 py-2 rounded-lg min-w-[50px] ' + HOVER + ' lg:text-white">' +
          ICON_ACCOUNT +
          '<span id="nav-login-label" class="text-xs font-semibold lg:text-white group-hover:underline">' + name + '</span>' +
        '</button>' +
        '<div id="profile-submenu" class="contents lg:block w-full lg:w-auto">' +
          '<hr class="mb-3 w-full lg:hidden" />' +
          '<ul class="flex flex-col flex-wrap w-full leading-[30px] z-[50] p-0 pb-4 lg:p-2 lg:shadow bg-white rounded-lg text-base text-center lg:text-left text-black">' +
            '<li id="nav-profile-name" class="lg:hidden flex flex-col items-stretch relative px-4 py-2 text-xl text-black font-bold leading-normal">' + name + '</li>' +
            '<li class="flex flex-col items-stretch relative">' +
              '<a href="offers.html" class="' + ITEM_LINK + '" data-i18n="nav.offers">' + T('nav.offers', 'Omat tarjouspyynnöt') + '</a>' +
            '</li>' +
            '<li class="flex flex-col items-stretch relative">' +
              '<a href="profile.html" class="' + ITEM_LINK + '" data-i18n="nav.editProfile">' + T('nav.editProfile', 'Muokkaa profiilia') + '</a>' +
            '</li>' +
            '<li class="flex flex-col items-stretch relative">' +
              '<button id="nav-logout" type="button" class="' + ITEM_LOGOUT + '">' +
                '<span class="inline-flex items-center justify-center" data-i18n="nav.logout">' + T('nav.logout', 'Kirjaudu ulos') + '</span>' +
              '</button>' +
            '</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  var header = document.getElementById('nav-bar');
  var slot = document.getElementById('nav-profile-slot');

  function subMenuOpen() {
    var w = document.getElementById('nav-profile');
    return !!(w && w.classList.contains('is-open'));
  }

  /* Popper (placement bottom, preventOverflow padding 8, as MProfileSubMenu
     configures it): centred under the trigger, kept 8px inside the viewport,
     translated rather than offset so the panel keeps its natural width. */
  function placeSubMenu() {
    var w = document.getElementById('nav-profile');
    var panel = document.getElementById('profile-submenu');
    if (!w || !panel || !subMenuOpen()) return;
    var ref = w.getBoundingClientRect();
    var box = header.getBoundingClientRect();
    var width = panel.offsetWidth;
    var vw = document.documentElement.clientWidth;
    var x = ref.left + ref.width / 2 - width / 2;
    x = Math.max(8, Math.min(x, vw - 8 - width));
    panel.style.transform = 'translate(' + Math.round(x - box.left) + 'px,' + Math.round(ref.bottom - box.top) + 'px)';
  }

  function setSubMenu(open, refocus) {
    var w = document.getElementById('nav-profile');
    var trigger = document.getElementById('nav-profile-trigger');
    if (!w || !trigger) return;
    w.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) trigger.setAttribute('aria-controls', 'profile-submenu');
    else trigger.removeAttribute('aria-controls');
    if (open) placeSubMenu();
    if (!open && refocus) trigger.focus();
  }

  /* prod's logoutUser: the session ends and the browser goes to "/". */
  function logout() {
    var s = readStore();
    delete s.loggedIn;
    try { localStorage.setItem('autovex_funnel', JSON.stringify(s)); } catch (e) {}
    window.location.href = 'index.html';
  }

  function bindProfile() {
    var w = document.getElementById('nav-profile');
    if (!w) return;
    document.getElementById('nav-profile-trigger').addEventListener('click', function () {
      setSubMenu(!subMenuOpen());
    });
    w.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && subMenuOpen()) setSubMenu(false, true);
    });
    document.getElementById('nav-logout').addEventListener('click', logout);
  }

  function sync() {
    if (!slot) return;
    slot.innerHTML = profileHtml(session());
    bindProfile();
  }

  function setName(name) {
    var label = document.getElementById('nav-login-label');
    var item = document.getElementById('nav-profile-name');
    if (!document.getElementById('nav-profile')) return;
    var first = firstName(name);
    if (label) label.textContent = first;
    if (item) item.textContent = first;
  }

  sync();

  /* onClickOutside, with the trigger's wrapper ignored. */
  document.addEventListener('click', function (e) {
    var w = document.getElementById('nav-profile');
    if (w && subMenuOpen() && !w.contains(e.target)) setSubMenu(false);
  });
  window.addEventListener('resize', placeSubMenu);

  /* Pages that set the session later in the parse (offers, decision) and
     i18n.js's DOMContentLoaded pass both land before this redraw. */
  document.addEventListener('DOMContentLoaded', sync);

  window.siteNav = { sync: sync, setName: setName };

  /* ── Drawer (Flowbite Drawer via RelativeBackdropDrawer) ──
     placement right, backdrop appended to the header, body scroll locked
     while open; Escape and a click on the backdrop close it. ONavigationBar
     also closes it on any link click inside. */
  (function () {
    var drawer = document.getElementById('drawer-menu');
    var trigger = document.getElementById('drawer-menu-trigger');
    var closeBtn = document.getElementById('drawer-menu-close');
    var backdrop = null;

    function isOpen() { return drawer.classList.contains('is-open'); }

    function show() {
      drawer.classList.add('is-open');
      drawer.removeAttribute('aria-hidden');
      drawer.setAttribute('aria-modal', 'true');
      drawer.setAttribute('role', 'dialog');
      trigger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      backdrop = document.createElement('div');
      backdrop.className = 'nav-drawer-backdrop';
      backdrop.setAttribute('drawer-backdrop', '');
      backdrop.addEventListener('click', hide);
      header.appendChild(backdrop);
    }

    function hide() {
      if (drawer.contains(document.activeElement)) document.activeElement.blur();
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.removeAttribute('aria-modal');
      drawer.removeAttribute('role');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (backdrop) { backdrop.remove(); backdrop = null; }
    }

    trigger.addEventListener('click', function () { if (isOpen()) hide(); else show(); });
    closeBtn.addEventListener('click', hide);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) hide();
    });
    if (!showMenu) {
      drawer.addEventListener('click', function (e) {
        if (e.target instanceof Element && e.target.closest('a')) hide();
      });
    }
    window.matchMedia('(min-width: 992px)').addEventListener('change', function (mq) {
      if (mq.matches && isOpen()) hide();
    });
  }());

  /* ── Headroom scroll behaviour ──
     Port of headroom.js as prod configures it (offset 96): past the offset,
     scrolling down unpins the nav (translateY(-100%)), scrolling up pins it
     back. Above the offset it is always pinned. Same nav in both states. */
  (function () {
    var nav = document.getElementById('nav-bar');
    var OFFSET = 96;
    var TOLERANCE = 5; // ignore sub-pixel / inertial jitter
    var lastY = window.scrollY || 0;
    var pinned = true;

    function pin()   { if (!pinned) { nav.style.transform = 'none';               pinned = true;  } }
    function unpin() { if (pinned)  { nav.style.transform = 'translateY(-100%)';  pinned = false; } }

    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var delta = y - lastY;

      if (Math.abs(delta) <= TOLERANCE) return;

      if (y <= OFFSET) {
        pin();
      } else if (delta > 0) {
        unpin();
      } else {
        pin();
      }

      lastY = y;
    }, { passive: true });
  }());
}());
