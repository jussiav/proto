/**
 * Shared site footer + prototype-wide script loading.
 *
 * The site nav lives in site-nav.js — one definition shared by every
 * non-funnel page. Do not re-add nav markup here.
 *
 * Runs synchronously during parsing so data-i18n attributes are present
 * before i18n.js fires on DOMContentLoaded.
 */
(function () {

  /* ── Footer HTML ── */
  var FOOTER_HTML =
    '<footer class="bg-av-blue flex flex-col items-center gap-[38px] pt-14 pb-14">' +
      '<div class="flex flex-col gap-3.5 w-full max-w-[1388px] px-5">' +
        '<div class="bg-av-blue-dark rounded-3xl px-5 py-6 md:px-9 md:py-8">' +
          '<div class="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:flex lg:gap-5 lg:items-stretch">' +
            '<div class="flex flex-col gap-1.5 text-sm text-white lg:flex-1">' +
              '<p class="font-dm font-bold leading-[21px]" data-i18n="footer.colAutoVex">AutoVex</p>' +
              '<div class="font-dm font-normal flex flex-col leading-[30px] text-[#B9E0FF]">' +
                '<a href="#" class="hover:underline" data-i18n="footer.submitListing">Jätä tarjouspyyntö</a>' +
                '<a href="help.html" class="hover:underline" data-i18n="footer.faq">FAQ</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.reviews">Kokemuksia</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.blog">Blogi</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.forSellers">Auton myyjälle</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.forDealers">Autoliikkeelle</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.about">Meistä</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.jobs">Avoimet työpaikat</a>' +
              '</div>' +
            '</div>' +
            '<div class="flex flex-col gap-1.5 text-sm text-white lg:flex-1">' +
              '<p class="font-dm font-bold leading-[21px]" data-i18n="footer.colBuying">Ostetaan autoja</p>' +
              '<div class="font-dm font-normal flex flex-col leading-[30px] text-[#B9E0FF]">' +
                '<a href="#" class="hover:underline" data-i18n="footer.buyingGeneral">Ostetaan autoja</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.buyingHelsinki">Ostetaan autoja Helsinki</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.buyingEspoo">Ostetaan autoja Espoo</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.buyingVantaa">Ostetaan autoja Vantaa</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.buyingTurku">Ostetaan autoja Turku</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.buyingTampere">Ostetaan autoja Tampere</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.buyingOulu">Ostetaan autoja Oulu</a>' +
              '</div>' +
            '</div>' +
            '<div class="flex flex-col gap-1.5 text-sm text-white lg:flex-1">' +
              '<p class="font-dm font-bold leading-[21px]" data-i18n="footer.colContent">Suosituimmat sisällöt</p>' +
              '<div class="font-dm font-normal flex flex-col leading-[30px] text-[#B9E0FF]">' +
                '<a href="#" class="hover:underline" data-i18n="footer.contentGermany">Auto Saksasta</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.contentSweden">Auto Ruotsista</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.contentDebt">Auton myynti ja loppuvelka</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.contentDealer">Auton myynti autoliikkeelle</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.contentLeasing">Yksityisleasing vs. omistaminen</a>' +
                '<a href="#" class="hover:underline" data-i18n="footer.contentAuction">Autohuutokauppa</a>' +
              '</div>' +
            '</div>' +
            '<div class="flex flex-col gap-4 text-sm text-white lg:flex-1">' +
              '<p class="font-dm font-bold leading-[21px]" data-i18n="footer.supportTeaser">Kysyttävää auton myynnistä?</p>' +
              '<a href="help.html" class="inline-flex items-center gap-1 font-dm font-normal text-[#B9E0FF] hover:text-white transition-colors"><span data-i18n="footer.supportBtn">Siirry tukikeskukseen</span><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 2 9 7 4 12"/></svg></a>' +
              '<div class="flex items-center gap-4 flex-wrap md:mt-auto">' +
                '<a href="https://www.facebook.com/autovex/" target="_blank" rel="noopener"><img src="assets/1a3ef3ef-243d-4b3a-9f4e-cbb1a769e548.svg" class="w-6 h-6 object-contain" alt="Facebook" /></a>' +
                '<a href="https://x.com/autovexfin" target="_blank" rel="noopener"><img src="assets/4195de77-84d5-4302-a0b5-dab59c3354ac.svg" class="w-6 h-6 object-contain" alt="X" /></a>' +
                '<a href="https://www.instagram.com/autovex.fi" target="_blank" rel="noopener"><img src="assets/324d1144-0784-498d-9058-4be7bc07f7e5.svg" class="w-6 h-6 object-contain" alt="Instagram" /></a>' +
                '<a href="https://fi.linkedin.com/company/autovex" target="_blank" rel="noopener"><img src="assets/67be36c3-7a12-4ffa-8ca2-3608d14a0e05.svg" class="w-6 h-6 object-contain" alt="LinkedIn" /></a>' +
                '<a href="https://www.youtube.com/channel/UCpE4LelrYxRIxrF-yLke9TQ" target="_blank" rel="noopener"><img src="assets/bdf2b9a0-fde9-4cee-8f58-8009581a87f2.svg" class="w-[34px] h-6 object-contain" alt="YouTube" /></a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="flex flex-col gap-3 px-4 py-1.5 text-sm text-white md:flex-row md:items-center md:justify-between md:gap-2">' +
          '<div class="flex gap-3.5 font-dm font-bold flex-wrap">' +
            '<a href="#" class="hover:underline" data-i18n="footer.terms">Käyttöehdot</a>' +
            '<a href="#" class="hover:underline" data-i18n="footer.privacy">Tietosuojakäytäntö</a>' +
            '<a href="#" class="hover:underline" data-i18n="footer.cookies">Evästekäytäntö</a>' +
          '</div>' +
          '<div class="flex items-center gap-4 font-dm text-sm text-white">' +
            '<span data-i18n="footer.language">Kieli</span>' +
            '<select id="lang-selector" onchange="setLang(this.value)"' +
            ' class="bg-transparent border border-white/40 rounded px-2 py-0.5 text-white text-sm font-dm cursor-pointer">' +
              '<option value="fi">Suomi</option>' +
              '<option value="en">English</option>' +
            '</select>' +
          '</div>' +
          '<span class="font-dm font-normal" data-i18n="footer.copyright">© 2025 All rights reserved</span>' +
          '<span class="font-dm font-normal opacity-50 text-sm">Updated 24.08.26 klo 13.32</span>' +
        '</div>' +
      '</div>' +
      '<div class="w-full max-w-[1388px] px-5">' +
        '<img id="footer-logo" src="assets/a58f6f26-6867-4bc8-ac6a-42028691bfe2.svg" alt="AutoVex" class="w-full h-auto block" />' +
      '</div>' +
    '</footer>';

  var footerEl = document.getElementById('site-footer');
  if (footerEl) footerEl.outerHTML = FOOTER_HTML;

  /* ── Vue nav icon (replaces img placeholders with inline SVG) ── */
  var iconScript = document.createElement('script');
  iconScript.src = 'vue-tests/dist/nav-user-icon.js';
  document.body.appendChild(iconScript);

  /* ── Vue brand logo (replaces all logo img placeholders) ── */
  var logoScript = document.createElement('script');
  logoScript.src = 'vue-tests/dist/brand-logo.js';
  document.body.appendChild(logoScript);

  /* ── Vue registration number badge ── */
  var regScript = document.createElement('script');
  regScript.src = 'vue-tests/dist/reg-badge.js';
  document.body.appendChild(regScript);

  /* ── Vue mileage display ── */
  var mileageScript = document.createElement('script');
  mileageScript.src = 'vue-tests/dist/mileage.js';
  document.body.appendChild(mileageScript);

  /* ── Vue SaveDraft component ── */
  var sdCss = document.createElement('link');
  sdCss.rel = 'stylesheet';
  sdCss.href = 'vue-tests/dist/style.css';
  document.head.appendChild(sdCss);
  var sdScript = document.createElement('script');
  sdScript.src = 'vue-tests/dist/save-draft.js';
  document.body.appendChild(sdScript);

  /* The prototype-instructions modal was removed with the bar button that opened
     it: one wall of text covering every scenario of every page. That reference
     should become its own page, with each scenario collapsible. The old content
     is recoverable from git history (layout.js before this commit) when someone
     builds it. */

})();
