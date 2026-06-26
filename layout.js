/**
 * Shared site layout: nav + footer.
 * Runs synchronously during parsing so data-i18n attributes are present
 * before i18n.js fires on DOMContentLoaded.
 */
(function () {
  var path = window.location.pathname;
  var isHelp = path.indexOf('help') !== -1;

  var faqBlue  = isHelp ? 'opacity-100 font-bold whitespace-nowrap'                           : 'opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap';
  var faqWhite = isHelp ? 'font-bold text-av-blue whitespace-nowrap'                          : 'opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap';

  /* ── nav-cta-visible rule (shared across pages) ── */
  var style = document.createElement('style');
  style.textContent = '.nav-cta-visible{display:none}@media(min-width:768px){.nav-cta-visible{display:flex}}';
  document.head.appendChild(style);

  /* ── Nav HTML ── */
  var NAV_HTML =
    '<nav id="nav-blue" class="h-24 flex items-center justify-center px-10 max-md:px-5 bg-av-blue">' +
      '<div class="flex items-center justify-between w-full max-w-[1366px]">' +
        '<div class="flex-shrink-0 flex items-center">' +
          '<a href="index.html" aria-label="AutoVex etusivu">' +
            '<img id="nav-logo" src="assets/3052c32b-59c9-4847-a303-88ace8a9bed7.svg" alt="AutoVex"' +
            ' class="w-[107px] h-[22px] flex-shrink-0 object-contain" style="filter:brightness(0) invert(1);" />' +
          '</a>' +
        '</div>' +
        '<ul id="nav-links" class="hidden md:flex items-center gap-7 font-dm font-medium text-base text-white list-none transition-colors duration-300">' +
          '<li><a href="#" class="opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap" data-i18n="nav.reviews">Kokemuksia</a></li>' +
          '<li><a href="#" class="opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap" data-i18n="nav.forSellers">Auton myyjälle</a></li>' +
          '<li><a href="#" class="opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap" data-i18n="nav.blog">Blogi</a></li>' +
          '<li><a href="help.html" class="' + faqBlue + '" data-i18n="nav.faq">Tuki</a></li>' +
        '</ul>' +
        '<div class="flex-shrink-0 flex items-center gap-3.5 justify-end ml-auto md:ml-0">' +
          '<a id="nav-cta" href="#"' +
          ' class="hidden items-center justify-center h-14 px-8 bg-av-blue text-white font-dm font-medium text-base rounded-lg whitespace-nowrap"' +
          ' style="box-shadow:inset 0px 1px 2px 1px rgba(255,255,255,0.2);"' +
          ' data-i18n="nav.startAuction">Aloita kilpailutus</a>' +
          '<a id="nav-login" href="#" class="flex flex-col items-center gap-0.5 px-1.5 transition-colors duration-300">' +
            '<img id="nav-login-icon" src="assets/nav-user-white.svg" alt="" class="w-6 h-6" />' +
            '<span id="nav-login-label" class="font-dm font-bold text-[11px] leading-[15px] text-white whitespace-nowrap" data-i18n="nav.login">Kirjaudu</span>' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</nav>' +
    '<nav id="nav-white"' +
    ' class="fixed top-0 left-0 right-0 z-50 h-24 flex items-center justify-center px-10 max-md:px-5 bg-white shadow-md"' +
    ' style="transform:translateY(-100%);transition:transform 0.3s ease;">' +
      '<div class="flex items-center justify-between w-full max-w-[1366px]">' +
        '<div class="flex-shrink-0 flex items-center">' +
          '<a href="index.html" aria-label="AutoVex etusivu">' +
            '<img id="nav-logo-white" src="assets/logo-blue.svg" alt="AutoVex" class="w-[107px] h-[22px] flex-shrink-0 object-contain" />' +
          '</a>' +
        '</div>' +
        '<ul class="hidden md:flex flex-1 min-w-0 overflow-hidden items-center justify-center gap-7 font-dm font-medium text-base text-slate-700 list-none px-6">' +
          '<li><a href="#" class="opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap" data-i18n="nav.reviews">Kokemuksia</a></li>' +
          '<li><a href="#" class="opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap" data-i18n="nav.forSellers">Auton myyjälle</a></li>' +
          '<li><a href="#" class="opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap" data-i18n="nav.blog">Blogi</a></li>' +
          '<li><a href="help.html" class="' + faqWhite + '" data-i18n="nav.faq">Tuki</a></li>' +
        '</ul>' +
        '<div class="flex-shrink-0 flex items-center gap-3.5 justify-end">' +
          '<a href="#"' +
          ' class="nav-cta-visible items-center justify-center h-14 px-8 bg-av-blue text-white font-dm font-bold text-base rounded-lg whitespace-nowrap hover:bg-[#0A59EB] transition-colors"' +
          ' style="box-shadow:inset 0px 1px 2px 1px rgba(255,255,255,0.2);"' +
          ' onclick="window.scrollTo({top:0,behavior:\'smooth\'});return false;"' +
          ' data-i18n="nav.startAuction">Aloita kilpailutus</a>' +
          '<a href="#" class="flex flex-col items-center gap-0.5 px-1.5">' +
            '<img id="nav-login-icon-white" src="assets/nav-user-blue.svg" alt="" class="w-6 h-6" />' +
            '<span class="font-dm font-bold text-[11px] leading-[15px] text-av-blue whitespace-nowrap" data-i18n="nav.login">Kirjaudu</span>' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</nav>';

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
            '<button onclick="window.__protoModal&&window.__protoModal.open()" class="font-dm text-sm text-white/70 hover:text-white underline underline-offset-2 cursor-pointer bg-transparent border-none p-0">Prototype instructions</button>' +
            '<span data-i18n="footer.language">Kieli</span>' +
            '<select id="lang-selector" onchange="setLang(this.value)"' +
            ' class="bg-transparent border border-white/40 rounded px-2 py-0.5 text-white text-sm font-dm cursor-pointer">' +
              '<option value="fi">Suomi</option>' +
              '<option value="en">English</option>' +
            '</select>' +
          '</div>' +
          '<span class="font-dm font-normal" data-i18n="footer.copyright">© 2025 All rights reserved</span>' +
          '<span class="font-dm font-normal opacity-50 text-sm">Updated 12.06.26 klo 13.41</span>' +
        '</div>' +
      '</div>' +
      '<div class="w-full max-w-[1388px] px-5">' +
        '<img id="footer-logo" src="assets/a58f6f26-6867-4bc8-ac6a-42028691bfe2.svg" alt="AutoVex" class="w-full h-auto block" />' +
      '</div>' +
    '</footer>';

  /* ── Inject ── */
  var navEl = document.getElementById('site-nav');
  if (navEl) navEl.innerHTML = NAV_HTML;

  /* ── Login state — show first name if stored ──
     Registered as a DOMContentLoaded listener so it fires AFTER i18n.js's
     listener (i18n registers in <head>, we register here in body). This
     guarantees our name overwrites the "Kirjaudu" i18n just applied. */
  (function () {
    try {
      var s = JSON.parse(localStorage.getItem('autovex_funnel') || '{}');
      var raw = ((s.contact || {}).kokoNimi || '').trim();
      var name = raw ? raw.split(' ')[0] : null;
      if (name) {
        document.addEventListener('DOMContentLoaded', function () {
          var blue = document.getElementById('nav-login-label');
          if (blue) blue.textContent = name;
          var white = document.querySelector('#nav-white [data-i18n="nav.login"]');
          if (white) white.textContent = name;
        });
      }
    } catch (e) {}
  })();

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

  /* ── Simple nav scroll for pages without a full-screen hero ── */
  window.SiteLayout = {
    initSimpleNavScroll: function () {
      var navWhite = document.getElementById('nav-white');
      if (!navWhite) return;
      window.addEventListener('scroll', function () {
        navWhite.style.transform = window.scrollY > 80 ? 'translateY(0)' : 'translateY(-100%)';
      }, { passive: true });
    }
  };

  /* ── Prototype instructions modal ── */
  /* UPDATE THIS SECTION whenever a new conditional flow is added to the prototype */
  (function () {
    var MODAL_HTML =
      '<div id="proto-modal" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(8,35,77,0.6);backdrop-filter:blur(2px);overflow-y:auto;padding:2rem 1rem;">' +
        '<div style="background:#fff;border-radius:16px;max-width:620px;margin:0 auto;padding:2rem;font-family:\'DM Sans\',sans-serif;position:relative;">' +
          '<button onclick="window.__protoModal.close()" style="position:absolute;top:1.25rem;right:1.25rem;background:none;border:none;cursor:pointer;color:#64758B;font-size:1.25rem;line-height:1;" aria-label="Close">✕</button>' +
          '<h2 style="font-family:Barlow,sans-serif;font-weight:700;font-size:1.25rem;color:#08234D;margin:0 0 0.25rem;">Prototype scenarios</h2>' +
          '<p style="font-size:0.875rem;color:#64758B;margin:0 0 1.5rem;">These are all the conditional flows the prototype supports. Different user inputs produce different screens and copy.</p>' +

          '<div style="display:flex;flex-direction:column;gap:1.25rem;">' +

            '<div style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">' +
              '<div style="background:#F1F5F9;padding:0.625rem 1rem;font-weight:700;font-size:0.875rem;color:#08234D;">Price step</div>' +
              '<div style="padding:0.875rem 1rem;display:flex;flex-direction:column;gap:0.625rem;font-size:0.875rem;color:#334155;">' +
                '<div><span style="background:#DAF0F5;border-radius:4px;padding:0.1rem 0.4rem;font-weight:600;font-size:0.75rem;color:#0B6DFF;margin-right:0.5rem;">Enter asking price</span>Triggers the <strong>asking price flow</strong>: auction-specific "next steps" copy on the contact page, and headline "Hienoa! Ilmoituksesi julkaistaan huutokauppaan." on the success page (if photos are complete).</div>' +
                '<div><span style="background:#F1F5F9;border-radius:4px;padding:0.1rem 0.4rem;font-weight:600;font-size:0.75rem;color:#475569;margin-right:0.5rem;">Skip / leave blank</span>Default flow. Success headline: "Hienoa! Ilmoitustasi tarkastetaan parhaillaan." (if photos are complete).</div>' +
              '</div>' +
            '</div>' +

            '<div style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">' +
              '<div style="background:#F1F5F9;padding:0.625rem 1rem;font-weight:700;font-size:0.875rem;color:#08234D;">Photos step</div>' +
              '<div style="padding:0.875rem 1rem;display:flex;flex-direction:column;gap:0.625rem;font-size:0.875rem;color:#334155;">' +
                '<div><span style="background:#DAF0F5;border-radius:4px;padding:0.1rem 0.4rem;font-weight:600;font-size:0.75rem;color:#0B6DFF;margin-right:0.5rem;">Photos complete</span>At least 5 photos uploaded, including ≥1 exterior (Ulkopuoli) and ≥1 interior (Sisätilat). Success page shows normal illustration and price-flow-dependent headline.</div>' +
                '<div><span style="background:#FEF2F2;border-radius:4px;padding:0.1rem 0.4rem;font-weight:600;font-size:0.75rem;color:#EF4444;margin-right:0.5rem;">Photos missing / skipped</span>Overrides all other flows. Success headline becomes "Ilmoituksesi on vastaanotettu – kuvat vielä puuttuvat", different illustration shown, and a CTA button appears to add photos.</div>' +
              '</div>' +
            '</div>' +

            '<div style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">' +
              '<div style="background:#F1F5F9;padding:0.625rem 1rem;font-weight:700;font-size:0.875rem;color:#08234D;">Success page — 3 variants</div>' +
              '<div style="padding:0.875rem 1rem;display:flex;flex-direction:column;gap:0.75rem;font-size:0.875rem;color:#334155;">' +
                '<div style="display:grid;grid-template-columns:auto 1fr;gap:0.25rem 0.75rem;align-items:start;">' +
                  '<span style="font-weight:600;white-space:nowrap;">Photos missing</span><span>Headline: <em>"Ilmoituksesi on vastaanotettu – kuvat vielä puuttuvat"</em> + add-photos CTA button (regardless of price choice).</span>' +
                  '<span style="font-weight:600;white-space:nowrap;">Photos OK + asking price</span><span>Headline: <em>"Hienoa! Ilmoituksesi julkaistaan huutokauppaan."</em> + auction-specific next-steps copy.</span>' +
                  '<span style="font-weight:600;white-space:nowrap;">Photos OK + no price</span><span>Headline: <em>"Hienoa! Ilmoitustasi tarkastetaan parhaillaan."</em> (default).</span>' +
                '</div>' +
              '</div>' +
            '</div>' +

            '<div style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">' +
              '<div style="background:#F1F5F9;padding:0.625rem 1rem;font-weight:700;font-size:0.875rem;color:#08234D;">Contact page</div>' +
              '<div style="padding:0.875rem 1rem;font-size:0.875rem;color:#334155;">' +
                'If an asking price was set: the right-column "next steps" bullets change to auction-specific copy. Default copy otherwise.' +
              '</div>' +
            '</div>' +

            '<div style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">' +
              '<div style="background:#F1F5F9;padding:0.625rem 1rem;font-weight:700;font-size:0.875rem;color:#08234D;">Photos return flow</div>' +
              '<div style="padding:0.875rem 1rem;font-size:0.875rem;color:#334155;">' +
                'The "Add photos" CTA on the success page links to <code style="background:#F1F5F9;padding:0.1rem 0.3rem;border-radius:3px;">photos.html?from=success</code>. After saving photos there, the user is redirected back to the success page (not the price step).' +
              '</div>' +
            '</div>' +

            '<div style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">' +
              '<div style="background:#F1F5F9;padding:0.625rem 1rem;font-weight:700;font-size:0.875rem;color:#08234D;">Email confirmation notification</div>' +
              '<div style="padding:0.875rem 1rem;display:flex;flex-direction:column;gap:0.625rem;font-size:0.875rem;color:#334155;">' +
                '<div>When photos are complete, the success page shows a new design: headline "Tarjouspyyntösi on valmis! Yksi juttu vielä.", a "Review in progress" badge, a new illustration, and an in-page email verification card showing the user\'s email address with a "Resend" link.</div>' +
                '<div>An OS-style toast also appears bottom-right ~1.5s after load: "Sinulla on 1 uusi sähköposti" / "You have 1 new email" with a "View email" link that opens the virtual mobile device showing the confirmation email. The "Resend" link on the page card also opens the phone frame.</div>' +
                '<div>"Vahvista sähköposti tästä" in the phone email verifies the address: the phone frame closes, the toast is hidden, and the success page switches to the verified treatment ("Hienoa! Ilmoitustasi tarkastetaan parhaillaan.") — unless the DAC7 flow intercepts (see below). Toast reappears every visit until verified; dismissed only via ✕. Language follows the app language selector.</div>' +
              '</div>' +
            '</div>' +

            '<div style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">' +
              '<div style="background:#F1F5F9;padding:0.625rem 1rem;font-weight:700;font-size:0.875rem;color:#08234D;">DAC7 flow (previous sellers)</div>' +
              '<div style="padding:0.875rem 1rem;display:flex;flex-direction:column;gap:0.625rem;font-size:0.875rem;color:#334155;">' +
                '<div><span style="background:#DAF0F5;border-radius:4px;padding:0.1rem 0.4rem;font-weight:600;font-size:0.75rem;color:#0B6DFF;margin-right:0.5rem;">Trigger</span>Enter an email starting with <code style="background:#F1F5F9;padding:0.1rem 0.3rem;border-radius:3px;">dac</code> (e.g. dactest@example.com) on the contact page. The email is treated as a previous AutoVex seller who must provide DAC7 reporting details.</div>' +
                '<div><span style="background:#DAF0F5;border-radius:4px;padding:0.1rem 0.4rem;font-weight:600;font-size:0.75rem;color:#0B6DFF;margin-right:0.5rem;">Verify email</span>Clicking "Vahvista sähköposti tästä" in the phone email (or opening <code style="background:#F1F5F9;padding:0.1rem 0.3rem;border-radius:3px;">success.html?emailVerified=1</code>) redirects to <code style="background:#F1F5F9;padding:0.1rem 0.3rem;border-radius:3px;">dac7.html</code> instead of the verified success treatment.</div>' +
                '<div><span style="background:#F1F5F9;border-radius:4px;padding:0.1rem 0.4rem;font-weight:600;font-size:0.75rem;color:#475569;margin-right:0.5rem;">DAC7 page</span>Funnel-style page: form (henkilötunnus, katuosoite, postinumero, postitoimipaikka — all required, basic format validation), two mock previously sold cars, collapsed FAQ accordions, and 3-step "next steps" in the right column. Submitting swaps the page to the completed state ("Henkilötiedot lähetetty!") with green checks and a "Jatka" CTA to the success page. Field values persist; revisiting after completion shows the completed state.</div>' +
                '<div><span style="background:#F1F5F9;border-radius:4px;padding:0.1rem 0.4rem;font-weight:600;font-size:0.75rem;color:#475569;margin-right:0.5rem;">Abandon</span>Leaving dac7.html without submitting keeps the email unverified: the success page still shows the verify-email treatment with the resend link, and the verify link keeps leading back to dac7.html. A dac-email user never reaches the verified treatment until the DAC7 form is completed.</div>' +
                '<div><span style="background:#F1F5F9;border-radius:4px;padding:0.1rem 0.4rem;font-weight:600;font-size:0.75rem;color:#475569;margin-right:0.5rem;">Non-dac emails</span>Unaffected — email verification leads straight to the verified success treatment.</div>' +
              '</div>' +
            '</div>' +

          '</div>' +
        '</div>' +
      '</div>';

    document.addEventListener('DOMContentLoaded', function () {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = MODAL_HTML;
      document.body.appendChild(wrapper.firstChild);

      var modal = document.getElementById('proto-modal');

      window.__protoModal = {
        open: function () {
          modal.style.display = 'block';
          document.body.style.overflow = 'hidden';
        },
        close: function () {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      };

      modal.addEventListener('click', function (e) {
        if (e.target === modal) window.__protoModal.close();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') window.__protoModal.close();
      });
    });
  }());

})();
