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
        /* prod ul: flex-1 ... lg:justify-start lg:ml-16, no gap class.
           Hidden below lg because prod's mobile drawer is a separate follow-up. */
        '<ul id="nav-links" class="hidden lg:flex flex-1 lg:flex-row items-center lg:h-full lg:justify-start lg:ml-16 font-dm text-base list-none">' +
          MENU_HTML +
        '</ul>' +
        '<div class="flex-shrink-0 flex items-center gap-3.5 justify-end">' +
          /* CTA classes verbatim from the live nav (MMenuCTA + AButton with
             Header.astro's buttonClass): white on desktop, blue below lg. */
          '<a id="nav-cta" href="index.html"' +
          ' class="hidden lg:inline-flex justify-center items-center transition cursor-pointer outline-offset-2 py-1.5 px-8 h-14 text-base leading-tight rounded-lg relative whitespace-nowrap font-dm' +
          ' shadow-[inset_0px_1px_2px_1px_rgba(255,255,255,0.20)]' +
          ' bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white' +
          ' lg:bg-white lg:text-blue-600 lg:hover:bg-blue-50 lg:active:bg-blue-100"' +
          ' data-i18n="nav.startAuction">Aloita kilpailutus</a>' +
          '<a id="nav-login" href="#" class="flex flex-col items-center gap-0.5 px-1.5">' +
            '<img id="nav-login-icon" src="assets/nav-user-white.svg" alt="" class="w-6 h-6" />' +
            '<span id="nav-login-label" class="font-dm font-bold text-[11px] leading-[15px] text-white whitespace-nowrap" data-i18n="nav.login">Kirjaudu</span>' +
          '</a>' +
        '</div>' +
      '</nav>' +
    '</header>';

  mount.innerHTML = NAV_HTML;

  /* ── Login state — show first name if stored ──
     Registered as a DOMContentLoaded listener so it fires AFTER i18n.js's
     listener (i18n registers in <head>, we register here in body). This
     guarantees our name overwrites the "Kirjaudu" i18n just applied. */
  try {
    var s = JSON.parse(localStorage.getItem('autovex_funnel') || '{}');
    var raw = ((s.contact || {}).kokoNimi || '').trim();
    var name = raw ? raw.split(' ')[0] : null;
    if (name) {
      document.addEventListener('DOMContentLoaded', function () {
        var label = document.getElementById('nav-login-label');
        if (label) label.textContent = name;
      });
    }
  } catch (e) {}

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
