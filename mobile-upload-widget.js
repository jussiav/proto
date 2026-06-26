/**
 * mobile-upload-widget.js
 *
 * Self-contained QR / mobile-frame upload widget for the photos step.
 * Remove: delete this file + `id="right-col"` + `id="right-col-spacer"` on photos.html + the <script> tag.
 */
(function () {
  'use strict';

  var params            = new URLSearchParams(window.location.search);
  var isMobileMode      = params.get('mode') === 'mobile';
  var isFromEmail       = params.get('from') === 'email';
  var isFromVerifyEmail = params.get('from') === 'verify-email';

  // Same language key as i18n.js
  function muwIsFi() {
    try { return (localStorage.getItem('av_lang') || 'fi') !== 'en'; } catch (_) { return true; }
  }

  function whenReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  if (isMobileMode) {
    whenReady(initMobileMode);
  } else {
    whenReady(initDesktopWidget);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MOBILE MODE  (runs when page loaded inside the phone-frame iframe)
  // ─────────────────────────────────────────────────────────────────────────────

  function initMobileMode() {
    applyMobileLayout();
    if (isFromEmail) {
      showEmailPreview();
    } else if (isFromVerifyEmail) {
      showVerifyEmailPreview();
    } else {
      overrideCtaNavigate();
    }
  }

  function applyMobileLayout() {
    // Inject CSS to contain layout within iframe viewport
    var mobileStyle = document.createElement('style');
    mobileStyle.id = 'muw-mobile-style';
    mobileStyle.textContent = [
      'html,body{overflow-x:hidden;max-width:100vw;}',
      '.flex-1.flex.flex-col.items-start{',
        'padding-left:20px!important;padding-right:20px!important;',
        'box-sizing:border-box!important;max-width:100%!important;',
        'width:100%!important;overflow-x:hidden!important;',
      '}',
      '.section-container{overflow-x:hidden;max-width:100%;}',
      '.photo-grid{overflow:hidden;max-width:100%;}',
    ].join('');
    document.head.appendChild(mobileStyle);

    // Remove outer top/bottom padding
    var outerWrap = document.querySelector('.flex.flex-col.items-center');
    if (outerWrap) {
      outerWrap.style.paddingTop    = '0';
      outerWrap.style.paddingBottom = '0';
      outerWrap.style.minHeight     = '100%';
      outerWrap.style.overflowX     = 'hidden';
    }

    // Hide desktop-only elements
    [
      document.querySelector('a[aria-label="Takaisin etusivulle"]'),
      document.querySelector('nav[aria-label="Vaiheet"]'),
      document.getElementById('skip-btn'),
      document.getElementById('right-col'),
      (function () {
        var a = document.querySelector('a[href="services.html"]');
        return a ? a.closest('.flex.items-center.justify-center') : null;
      }())
    ].forEach(function (el) { if (el) el.style.display = 'none'; });

    // Make left column full-width — let Tailwind max-md classes handle padding/width
    var leftCol = document.querySelector('.flex-1.flex.flex-col.items-start');
    if (leftCol) {
      leftCol.style.minWidth  = '0';
      leftCol.style.overflowX = 'hidden';
    }
  }

  // ── Email preview screen ─────────────────────────────────────────────────────

  function showEmailPreview() {
    var isFi = muwIsFi();
    // Get car details from localStorage
    var st   = {};
    try { st = JSON.parse(localStorage.getItem('autovex_funnel') || '{}'); } catch (_) {}
    var d     = st.details || {};
    var plate = params.get('plate') || '';
    if (!plate) { try { plate = (JSON.parse(localStorage.getItem('autovex_funnel') || '{}').hero || {}).plate || ''; } catch (_) {} }

    var carLine = [d.merkki, d.malli, d.vuosimalli ? '(' + d.vuosimalli + ')' : '']
      .filter(Boolean).join(' ');

    // Stash and hide all current left-column children
    var leftCol = document.querySelector('.flex-1.flex.flex-col.items-start');
    if (leftCol) {
      Array.from(leftCol.children).forEach(function (child) {
        child.style.display    = 'none';
        child.dataset.muwHidden = '1';
      });
    }

    var screen = document.createElement('div');
    screen.id = 'muw-email-preview';
    screen.style.cssText = 'width:100%;flex:1;background:#f2f2f7;overflow-y:auto;font-family:-apple-system,\'DM Sans\',sans-serif;';

    var carInfoHtml = '';
    if (carLine || plate) {
      carInfoHtml =
        '<div style="background:#f0f4ff;border-radius:10px;padding:12px 14px;margin-bottom:20px;">' +
          (carLine ? '<p style="font-size:14px;font-weight:700;color:#020617;margin:0 0 2px;">' + carLine + '</p>' : '') +
          (plate   ? '<p style="font-size:12px;color:#475569;margin:0;font-family:monospace;letter-spacing:0.05em;">' + plate.toUpperCase() + '</p>' : '') +
        '</div>';
    }

    screen.innerHTML =
      // Mail app top bar
      '<div style="background:rgba(242,242,247,0.95);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:10px 16px 8px;display:flex;align-items:center;gap:6px;border-bottom:1px solid rgba(0,0,0,0.08);">' +
        '<svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M7 1L1 7l6 6" stroke="#0B6DFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<span style="font-size:16px;color:#0B6DFF;font-weight:400;">' + (isFi ? 'Postilaatikko' : 'Inbox') + '</span>' +
        '<div style="flex:1;text-align:center;font-size:15px;font-weight:600;color:#020617;">AutoVex</div>' +
        '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 5.5l8 6 8-6" stroke="#0B6DFF" stroke-width="1.5" stroke-linecap="round"/><rect x="1" y="3" width="20" height="16" rx="3" stroke="#0B6DFF" stroke-width="1.5"/></svg>' +
      '</div>' +

      // Email header meta
      '<div style="background:white;padding:14px 16px 12px;margin-bottom:1px;">' +
        '<p style="font-size:18px;font-weight:700;color:#020617;margin:0 0 10px;line-height:1.3;">' +
          (isFi ? 'Pyyntö lisätä kuvat' + (plate ? ' – ' + plate.toUpperCase() : '') + ' AutoVex-ilmoitukseen'
                : 'Request to add photos' + (plate ? ' – ' + plate.toUpperCase() : '') + ' to your AutoVex listing') +
        '</p>' +
        '<div style="display:flex;align-items:center;gap:10px;">' +
          '<div style="width:38px;height:38px;background:#0B6DFF;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
            '<svg width="18" height="14" viewBox="0 0 18 14" fill="none"><rect x="1" y="1" width="16" height="12" rx="2.5" stroke="white" stroke-width="1.5"/><path d="M1 3l8 5.5L17 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<p style="font-size:14px;font-weight:700;color:#020617;margin:0;">AutoVex</p>' +
            '<p style="font-size:12px;color:#94a3b8;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">noreply@autovex.fi</p>' +
          '</div>' +
          '<p style="font-size:12px;color:#94a3b8;flex-shrink:0;margin:0;">' + (isFi ? 'nyt' : 'now') + '</p>' +
        '</div>' +
      '</div>' +

      // Email body
      '<div style="background:white;padding:24px 16px;">' +
        '<div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #f1f5f9;">' +
          '<svg width="80" height="16" viewBox="0 0 80 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<text x="0" y="13" font-family="Barlow,sans-serif" font-weight="700" font-size="15" fill="#0B6DFF">AutoVex</text>' +
          '</svg>' +
        '</div>' +
        '<p style="font-size:16px;font-weight:700;color:#020617;margin:0 0 8px;">' + (isFi ? 'Hei!' : 'Hi!') + '</p>' +
        '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 16px;">' +
          (isFi ? 'Sinulle on lähetetty pyyntö lisätä kuvat AutoVex-myynti-ilmoitukseen. Kuvien lisääminen on helppoa ja nopeaa suoraan puhelimellasi.'
                : 'You have received a request to add photos to an AutoVex sales listing. Adding photos is quick and easy straight from your phone.') +
        '</p>' +

        carInfoHtml +

        '<button id="muw-email-cta" style="' +
          'width:100%;padding:15px;background:#0B6DFF;color:white;border:none;' +
          'border-radius:12px;font-family:\'DM Sans\',sans-serif;font-size:16px;font-weight:600;' +
          'cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:20px;' +
        '">' +
          '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="16" rx="4" stroke="white" stroke-width="1.5"/><path d="M9 5.5v7M5.5 9h7" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>' +
          (isFi ? 'Lisää kuvat nyt →' : 'Add photos now →') +
        '</button>' +

        '<p style="font-size:11px;color:#94a3b8;text-align:center;margin:0;line-height:1.6;">' +
          'AutoVex Oy · autovex.fi · tuki@autovex.fi<br>' +
          (isFi ? 'Sait tämän viestin, koska joku käyttää AutoVex-palvelua.'
                : 'You received this message because someone is using the AutoVex service.') +
        '</p>' +
      '</div>';

    var outerFlex = document.querySelector('.flex.items-start');
    if (outerFlex && outerFlex.parentNode) {
      outerFlex.parentNode.insertBefore(screen, outerFlex.nextSibling);
    } else {
      document.body.appendChild(screen);
    }

    // Wire CTA after DOM insertion
    var cta = document.getElementById('muw-email-cta');
    if (cta) cta.addEventListener('click', muwOpenUploadFromEmail);
  }

  function showVerifyEmailPreview() {
    var isFi = muwIsFi();

    var st = {};
    try { st = JSON.parse(localStorage.getItem('autovex_funnel') || '{}'); } catch (_) {}
    var recipientEmail = (st.contact || {}).sahkoposti || '';

    var leftCol = document.querySelector('.flex-1.flex.flex-col.items-start');
    if (leftCol) {
      Array.from(leftCol.children).forEach(function (child) {
        child.style.display    = 'none';
        child.dataset.muwHidden = '1';
      });
    }

    var screen = document.createElement('div');
    screen.id = 'muw-verify-email-preview';
    screen.style.cssText = 'width:100%;flex:1;background:#f2f2f7;overflow-y:auto;font-family:-apple-system,\'DM Sans\',sans-serif;';

    var recipientHtml = recipientEmail
      ? '<p style="font-size:12px;color:#94a3b8;margin:6px 0 0;padding-top:6px;border-top:1px solid #f1f5f9;">' +
          (isFi ? 'Vastaanottaja: ' : 'To: ') + recipientEmail +
        '</p>'
      : '';

    screen.innerHTML =
      // Mail app top bar
      '<div style="background:rgba(242,242,247,0.95);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:10px 16px 8px;display:flex;align-items:center;gap:6px;border-bottom:1px solid rgba(0,0,0,0.08);">' +
        '<svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M7 1L1 7l6 6" stroke="#0B6DFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<span style="font-size:16px;color:#0B6DFF;font-weight:400;">' + (isFi ? 'Postilaatikko' : 'Inbox') + '</span>' +
        '<div style="flex:1;text-align:center;font-size:15px;font-weight:600;color:#020617;">AutoVex</div>' +
        '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 5.5l8 6 8-6" stroke="#0B6DFF" stroke-width="1.5" stroke-linecap="round"/><rect x="1" y="3" width="20" height="16" rx="3" stroke="#0B6DFF" stroke-width="1.5"/></svg>' +
      '</div>' +

      // Email header meta
      '<div style="background:white;padding:14px 16px 12px;margin-bottom:1px;">' +
        '<p style="font-size:18px;font-weight:700;color:#020617;margin:0 0 10px;line-height:1.3;">' +
          (isFi ? 'Vahvista sähköpostiosoitteesi ja jatka auton myyntiä'
                : 'Confirm your email address and continue selling your car') +
        '</p>' +
        '<div style="display:flex;align-items:center;gap:10px;">' +
          '<div style="width:38px;height:38px;background:#0B6DFF;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
            '<svg width="18" height="14" viewBox="0 0 18 14" fill="none"><rect x="1" y="1" width="16" height="12" rx="2.5" stroke="white" stroke-width="1.5"/><path d="M1 3l8 5.5L17 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<p style="font-size:14px;font-weight:700;color:#020617;margin:0;">AutoVex</p>' +
            '<p style="font-size:12px;color:#94a3b8;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">tiimi@autovex.fi</p>' +
          '</div>' +
          '<p style="font-size:12px;color:#94a3b8;flex-shrink:0;margin:0;">' + (isFi ? 'nyt' : 'now') + '</p>' +
        '</div>' +
        recipientHtml +
      '</div>' +

      // Email body
      '<div style="background:white;padding:24px 16px;">' +
        '<div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #f1f5f9;">' +
          '<svg width="80" height="16" viewBox="0 0 80 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<text x="0" y="13" font-family="Barlow,sans-serif" font-weight="700" font-size="15" fill="#0B6DFF">AutoVex</text>' +
          '</svg>' +
        '</div>' +
        '<p style="font-size:16px;font-weight:700;color:#020617;margin:0 0 10px;">' +
          (isFi ? 'Hei ja tervetuloa AutoVexille!' : 'Hi and welcome to AutoVex!') +
        '</p>' +
        '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 10px;">' +
          (isFi ? 'Kiva, että haluat myydä autosi kauttamme!' : 'Great to hear you want to sell your car through us!') +
        '</p>' +
        '<p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 24px;">' +
          (isFi ? 'Vahvistathan sähköpostiosoitteesi alla olevasta painikkeesta. Vahvistaminen on tärkeää, jotta pystymme pitämään sinut ajan tasalla auton myyntiprosessin kulusta.'
                : 'Please confirm your email address using the button below. Confirming is important so we can keep you updated on the progress of your car sale.') +
        '</p>' +
        '<button id="muw-verify-cta" style="' +
          'width:100%;padding:15px;background:#0B6DFF;color:white;border:none;' +
          'border-radius:12px;font-family:\'DM Sans\',sans-serif;font-size:16px;font-weight:600;' +
          'cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:20px;' +
        '">' +
          (isFi ? 'Vahvista sähköposti tästä' : 'Confirm email here') +
        '</button>' +
        '<p style="font-size:11px;color:#94a3b8;text-align:center;margin:0;line-height:1.6;">' +
          'AutoVex Oy · autovex.fi · tiimi@autovex.fi' +
        '</p>' +
      '</div>';

    var outerFlex = document.querySelector('.flex.items-start');
    if (outerFlex && outerFlex.parentNode) {
      outerFlex.parentNode.insertBefore(screen, outerFlex.nextSibling);
    } else {
      document.body.appendChild(screen);
    }

    var verifyCta = document.getElementById('muw-verify-cta');
    if (verifyCta) {
      verifyCta.addEventListener('click', function () {
        window.parent.postMessage({ type: 'emailVerified' }, '*');
      });
    }
  }

  function getVerifyEmailUrl() {
    return location.protocol + '//' + location.host +
      location.pathname.replace(/[^/]*$/, '') + 'photos.html?mode=mobile&from=verify-email';
  }

  window.muwOpenUploadFromEmail = function () {
    var preview = document.getElementById('muw-email-preview');
    if (preview) preview.style.display = 'none';
    document.querySelectorAll('[data-muw-hidden]').forEach(function (el) {
      el.style.display = '';
      delete el.dataset.muwHidden;
    });
  };

  // ── Mobile CTA override ──────────────────────────────────────────────────────

  function overrideCtaNavigate() {
    var _orig = window.ctaNavigate;
    window.ctaNavigate = function () {
      if (typeof window.photosReady === 'function' && !window.photosReady()) {
        if (_orig) _orig();
        return;
      }
      muwShowCompletionSheet();
    };
  }

  function muwGetPhotoCount() {
    try {
      var d = JSON.parse(localStorage.getItem('autovex_funnel') || '{}');
      var p = d.photos || {};
      return Object.values(p).reduce(function (n, a) { return n + (Array.isArray(a) ? a.length : 0); }, 0);
    } catch (_) { return typeof window.totalUploaded !== 'undefined' ? window.totalUploaded : 0; }
  }

  function muwShowCompletionSheet() {
    if (document.getElementById('muw-completion-sheet')) return;

    var count = muwGetPhotoCount();

    var backdrop = document.createElement('div');
    backdrop.id = 'muw-completion-backdrop';
    backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:199;';

    var sheet = document.createElement('div');
    sheet.id = 'muw-completion-sheet';
    sheet.style.cssText = [
      'position:fixed',
      'bottom:0',
      'left:0',
      'right:0',
      'background:white',
      'border-radius:22px 22px 0 0',
      'padding:0 20px 36px',
      'box-shadow:0 -4px 28px rgba(0,0,0,0.18)',
      'z-index:200',
      'font-family:\'DM Sans\',sans-serif'
    ].join(';');
    sheet.innerHTML =
      '<div style="width:40px;height:4px;background:#e2e8f0;border-radius:2px;margin:14px auto 22px;"></div>' +
      '<div style="width:56px;height:56px;background:#0B6DFF;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">' +
        '<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M5 13l6 6L21 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</div>' +
      '<p style="font-family:\'Barlow\',sans-serif;font-weight:700;font-size:24px;color:#020617;margin:0 0 6px;text-align:center;">' + (muwIsFi() ? 'Kuvat lisätty!' : 'Photos added!') + '</p>' +
      '<p style="font-size:14px;color:#64748b;margin:0 0 26px;text-align:center;">' + count + (muwIsFi() ? ' kuvaa ladattu onnistuneesti.' : ' photos uploaded successfully.') + '</p>' +
      '<div style="display:flex;flex-direction:column;gap:10px;">' +
        '<button id="muw-continue-mobile-btn" style="' +
          'width:100%;height:52px;background:#0B6DFF;color:white;border:none;border-radius:12px;' +
          'font-family:\'DM Sans\',sans-serif;font-size:16px;font-weight:600;cursor:pointer;' +
        '">' + (muwIsFi() ? 'Jatka puhelimella →' : 'Continue on phone →') + '</button>' +
        '<button id="muw-done-desktop-btn" style="' +
          'width:100%;height:52px;background:white;color:#0B6DFF;border:1.5px solid #0B6DFF;border-radius:12px;' +
          'font-family:\'DM Sans\',sans-serif;font-size:16px;font-weight:600;cursor:pointer;' +
        '">' + (muwIsFi() ? 'Valmis – jatka tietokoneella' : 'Done – continue on computer') + '</button>' +
      '</div>';

    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);

    document.getElementById('muw-continue-mobile-btn').addEventListener('click', function () {
      window.muwContinueOnMobile(count);
    });
    document.getElementById('muw-done-desktop-btn').addEventListener('click', function () {
      window.parent.postMessage({ type: 'mobileUploadComplete', photoCount: count }, '*');
    });
  }

  window.muwContinueOnMobile = function (count) {
    var sheet    = document.getElementById('muw-completion-sheet');
    var backdrop = document.getElementById('muw-completion-backdrop');
    if (sheet)    sheet.remove();
    if (backdrop) backdrop.remove();

    if (typeof count === 'undefined') { count = muwGetPhotoCount(); }

    var endScreen = document.createElement('div');
    endScreen.style.cssText = [
      'min-height:100vh',
      'display:flex',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'padding:36px 28px',
      'text-align:center',
      'background:#f8fafc',
      'font-family:\'DM Sans\',sans-serif'
    ].join(';');
    endScreen.innerHTML =
      '<div style="width:76px;height:76px;background:#0B6DFF;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:24px;">' +
        '<svg width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M7 17l7 7 13-14" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</div>' +
      '<h1 style="font-family:\'Barlow\',sans-serif;font-weight:700;font-size:26px;color:#020617;margin:0 0 10px;">' + count + (muwIsFi() ? ' kuvaa lisätty!' : ' photos added!') + '</h1>' +
      '<p style="font-size:15px;line-height:1.6;color:#64748b;margin:0 0 12px;max-width:280px;">' +
        (muwIsFi() ? 'Oikeassa sovelluksessa jatkaisit nyt hinnoitteluvaiheeseen puhelimellasi.'
                   : 'In the real app you would now continue to the pricing step on your phone.') +
      '</p>' +
      '<span style="display:inline-block;font-size:12px;color:#94a3b8;background:#e8f0fe;padding:6px 16px;border-radius:20px;margin-bottom:32px;">' + (muwIsFi() ? 'Tämä on prototyyppi' : 'This is a prototype') + '</span>' +
      '<button id="muw-end-close-btn" style="' +
        'padding:15px 32px;background:#0B6DFF;color:white;border:none;border-radius:12px;' +
        'font-family:\'DM Sans\',sans-serif;font-size:16px;font-weight:600;cursor:pointer;' +
      '">' + (muwIsFi() ? 'Sulje mobiilimäkymä' : 'Close mobile view') + '</button>';

    document.body.innerHTML = '';
    document.body.appendChild(endScreen);

    document.getElementById('muw-end-close-btn').addEventListener('click', function () {
      window.parent.postMessage({ type: 'mobileUploadComplete', photoCount: count }, '*');
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // DESKTOP WIDGET
  // ─────────────────────────────────────────────────────────────────────────────

  function initDesktopWidget() {
    injectQrBanner();
    buildPhoneFrameOverlay();
    listenToStorage();
    listenToMessages();
  }

  function getMobileUrl(withEmail) {
    var plate = params.get('plate') || '';
    if (!plate) { try { plate = (JSON.parse(localStorage.getItem('autovex_funnel') || '{}').hero || {}).plate || ''; } catch (_) {} }
    var base  = location.protocol + '//' + location.host + location.pathname + '?mode=mobile';
    if (plate)     base += '&plate=' + encodeURIComponent(plate);
    if (withEmail) base += '&from=email';
    return base;
  }

  // ── QR banner ────────────────────────────────────────────────────────────────

  function injectQrBanner() {
    var rightCol = document.getElementById('right-col');
    if (!rightCol) return;

    var spacer = document.getElementById('right-col-spacer');
    if (spacer) spacer.remove();

    var qrSrc = 'https://api.qrserver.com/v1/create-qr-code/?size=128x128' +
      '&data=' + encodeURIComponent(getMobileUrl(false)) +
      '&bgcolor=FFFFFF&color=0B2A5C&margin=6';

    var isFi = muwIsFi();
    var banner = document.createElement('div');
    banner.id = 'muw-qr-banner';
    banner.innerHTML =
      '<div style="background:white;border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:16px;' +
        'box-shadow:0px 2px 4px -2px rgba(0,0,0,0.1),0px 4px 6px -1px rgba(0,0,0,0.1);">' +

        // QR code left, headline + subline right — mirrors "Erinomainen aika myydä" layout
        '<div style="display:flex;gap:16px;align-items:center;">' +
          '<button id="muw-qr-btn" title="' + (isFi ? 'Avaa mobiilimäkymä' : 'Open mobile view') + '" style="' +
            'flex-shrink:0;cursor:pointer;border:1.5px solid #e2e8f0;border-radius:10px;' +
            'overflow:hidden;background:none;padding:0;transition:border-color 0.15s,transform 0.1s;' +
          '">' +
            '<img src="' + qrSrc + '" width="100" height="100" alt="' + (isFi ? 'QR-koodi mobiilimäkymään' : 'QR code to mobile view') + '" style="display:block;"/>' +
          '</button>' +
          '<div style="flex:1;">' +
            '<p style="font-family:\'Barlow\',sans-serif;font-weight:700;font-size:24px;line-height:26px;color:#020617;margin:0 0 6px;">' + (isFi ? 'Kuvat toisella laitteella?' : 'Photos on another device?') + '</p>' +
            '<p style="font-family:\'DM Sans\',sans-serif;font-size:14px;line-height:1.45;color:#020617;margin:0;">' + (isFi ? 'Skannaa koodi tai lähetä linkki kuvien lisäämiseksi toisella laitteella.' : 'Scan the code or send a link to add photos on another device.') + '</p>' +
          '</div>' +
        '</div>' +

        // Divider
        '<div style="height:1px;background:#e2e8f0;"></div>' +

        // Collapsed email row (matches SaveDraft collapsed pattern)
        '<div id="muw-email-collapsed" style="display:flex;align-items:center;gap:6px;cursor:pointer;">' +
          '<span style="font-family:\'DM Sans\',sans-serif;font-weight:500;font-size:15px;color:#334155;">' + (isFi ? 'Lähetä linkki sähköpostilla' : 'Send link by email') + '</span>' +
          '<svg style="flex-shrink:0;" width="14" height="12" viewBox="0 0 11 9.19" fill="none">' +
            '<path d="M10.75 5.06L6.81 9C6.68 9.12 6.52 9.19 6.34 9.19c-.17 0-.34-.07-.46-.19C5.75 8.87 5.69 8.71 5.69 8.53c0-.17.07-.34.19-.46L8.7 5.25H.66C.48 5.25.32 5.18.19 5.06.07 4.94 0 4.77 0 4.60c0-.17.07-.34.19-.47.12-.12.29-.19.47-.19h8.04L5.88 1.12C5.76.999 5.69.832 5.69.657 5.69.483 5.76.316 5.88.193 6.00.069 6.17 0 6.34 0c.17 0 .34.069.47.193l3.94 3.937c.06.061.11.134.14.214.03.08.05.165.05.252 0 .086-.02.172-.05.251-.03.08-.08.152-.14.213z" fill="#334155"/>' +
          '</svg>' +
        '</div>' +

        // Expanded email form (hidden initially, matches SaveDraft expanded pattern)
        '<div id="muw-email-expanded" style="display:none;flex-direction:column;gap:10px;">' +
          '<p style="font-family:\'DM Sans\',sans-serif;font-size:14px;color:#020617;line-height:1.45;margin:0;">' + (isFi ? 'Anna sähköpostiosoite johon haluat linkin lähettää.' : 'Enter the email address you want the link sent to.') + '</p>' +
          '<div style="display:flex;gap:8px;align-items:stretch;">' +
            '<input type="email" id="muw-email-input" placeholder="' + (isFi ? 'Sähköpostiosoitteesi' : 'Your email address') + '" style="' +
              'flex:1;min-width:0;height:56px;border:1.5px solid #94a3b8;border-radius:8px;padding:0 14px;' +
              'font-family:\'DM Sans\',sans-serif;font-size:15px;color:#020617;outline:none;box-sizing:border-box;' +
              'transition:border-color 0.15s;' +
            '" />' +
            '<button id="muw-email-send" style="' +
              'flex-shrink:0;height:56px;padding:0 28px;background:white;color:#334155;border:1.5px solid #94a3b8;border-radius:8px;' +
              'font-family:\'DM Sans\',sans-serif;font-size:15px;font-weight:600;cursor:pointer;' +
              'display:flex;align-items:center;gap:7px;transition:background 0.15s,border-color 0.15s;white-space:nowrap;' +
            '">' +
              (isFi ? 'Lähetä' : 'Send') +
              '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12M9 3l5 5-5 5" stroke="#334155" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
          '</div>' +
          '<p id="muw-email-error" style="display:none;font-family:\'DM Sans\',sans-serif;font-size:12px;color:#ef4444;margin:0;">' + (isFi ? 'Tarkista sähköpostiosoite.' : 'Check the email address.') + '</p>' +
        '</div>' +

        // Sent confirmation (hidden initially)
        '<div id="muw-email-sent" style="display:none;align-items:center;gap:8px;">' +
          '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" fill="#22c55e"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '<span id="muw-sent-label" style="font-family:\'DM Sans\',sans-serif;font-size:14px;color:#334155;">' + (isFi ? 'Linkki lähetetty' : 'Link sent') + '</span>' +
        '</div>' +

      '</div>';

    rightCol.insertBefore(banner, rightCol.firstChild);

    // QR click → open mobile frame
    var qrBtn = document.getElementById('muw-qr-btn');
    qrBtn.addEventListener('click', function () { muwOpenFrame(false); });
    qrBtn.addEventListener('mouseover', function () {
      this.style.borderColor = '#0B6DFF';
      this.style.transform   = 'scale(1.02)';
    });
    qrBtn.addEventListener('mouseout', function () {
      this.style.borderColor = '#e2e8f0';
      this.style.transform   = '';
    });

    // Collapsed row click → reveal email form
    document.getElementById('muw-email-collapsed').addEventListener('click', function () {
      this.style.display = 'none';
      var exp = document.getElementById('muw-email-expanded');
      exp.style.display = 'flex';
      setTimeout(function () {
        var inp = document.getElementById('muw-email-input');
        if (inp) inp.focus();
      }, 50);
    });

    // Email input events
    var inp = document.getElementById('muw-email-input');
    inp.addEventListener('focus', function () { this.style.borderColor = '#0B6DFF'; });
    inp.addEventListener('blur',  function () {
      var err = document.getElementById('muw-email-error');
      if (!err || err.style.display === 'none') this.style.borderColor = '#94a3b8';
    });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') muwSendEmailInline(); });

    // Send button
    var sendBtn = document.getElementById('muw-email-send');
    sendBtn.addEventListener('click', muwSendEmailInline);
    sendBtn.addEventListener('mouseover', function () { this.style.background = '#f3f4f6'; });
    sendBtn.addEventListener('mouseout',  function () { this.style.background = 'white'; });
  }

  function muwSendEmailInline() {
    var input = document.getElementById('muw-email-input');
    var error = document.getElementById('muw-email-error');
    var val   = input ? input.value.trim() : '';
    if (!val || !val.includes('@') || !val.includes('.')) {
      if (error) error.style.display = 'block';
      if (input) { input.style.borderColor = '#ef4444'; input.focus(); }
      return;
    }
    if (error) error.style.display = 'none';
    // Transition to sent state
    var exp  = document.getElementById('muw-email-expanded');
    var sent = document.getElementById('muw-email-sent');
    var lbl  = document.getElementById('muw-sent-label');
    if (exp)  exp.style.display  = 'none';
    if (sent) sent.style.display = 'flex';
    if (lbl)  lbl.textContent    = (muwIsFi() ? 'Linkki lähetetty · ' : 'Link sent · ') + val;
    // Open the mobile frame with email preview
    setTimeout(function () { muwOpenFrame(true); }, 250);
  }

  // ── Phone frame overlay ──────────────────────────────────────────────────────

  function buildPhoneFrameOverlay() {
    var overlay = document.createElement('div');
    overlay.id = 'muw-frame-overlay';
    overlay.style.cssText = [
      'display:none',
      'position:fixed',
      'inset:0',
      'z-index:9999',
      'align-items:center',
      'justify-content:center'
    ].join(';');

    overlay.innerHTML =
      // Backdrop
      '<div id="muw-frame-backdrop" style="position:absolute;inset:0;background:rgba(0,0,0,0.68);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);"></div>' +

      // Phone wrapper (no external close button)
      '<div style="position:relative;z-index:1;">' +

        // Phone shell
        '<div style="' +
          'width:390px;height:720px;background:#1C1C1E;border-radius:44px;padding:12px;' +
          'box-shadow:0 0 0 1px rgba(255,255,255,0.07),0 32px 80px rgba(0,0,0,0.65),inset 0 0 0 1.5px rgba(255,255,255,0.05);' +
          'position:relative;display:flex;flex-direction:column;' +
        '">' +
          // Dynamic island
          '<div style="position:absolute;top:14px;left:50%;transform:translateX(-50%);width:126px;height:34px;background:#000;border-radius:20px;z-index:10;box-shadow:0 0 0 1px rgba(255,255,255,0.05);"></div>' +

          // Side buttons (decorative)
          '<div style="position:absolute;left:-3px;top:108px;width:3px;height:28px;background:#2a2a2e;border-radius:2px 0 0 2px;"></div>' +
          '<div style="position:absolute;left:-3px;top:146px;width:3px;height:60px;background:#2a2a2e;border-radius:2px 0 0 2px;"></div>' +
          '<div style="position:absolute;left:-3px;top:216px;width:3px;height:60px;background:#2a2a2e;border-radius:2px 0 0 2px;"></div>' +
          '<div style="position:absolute;right:-3px;top:136px;width:3px;height:80px;background:#2a2a2e;border-radius:0 2px 2px 0;"></div>' +

          // Screen
          '<div style="flex:1;background:white;border-radius:33px;overflow:hidden;position:relative;">' +
            // Status bar (on top of iframe)
            '<div id="muw-status-bar" style="' +
              'position:absolute;top:0;left:0;right:0;height:48px;' +
              'background:white;z-index:10;' +
              'display:flex;align-items:flex-end;justify-content:space-between;' +
              'padding:0 26px 8px;' +
              'font-family:-apple-system,\'DM Sans\',sans-serif;font-size:15px;font-weight:600;color:#020617;' +
              'pointer-events:none;' +
            '">' +
              '<span id="muw-clock">9:41</span>' +
              '<div style="display:flex;align-items:center;gap:6px;">' +
                '<svg width="18" height="13" viewBox="0 0 18 13" fill="none">' +
                  '<rect x="0" y="5" width="3" height="8" rx="0.75" fill="#020617"/>' +
                  '<rect x="5" y="3" width="3" height="10" rx="0.75" fill="#020617"/>' +
                  '<rect x="10" y="1" width="3" height="12" rx="0.75" fill="#020617"/>' +
                  '<rect x="15" y="0" width="3" height="13" rx="0.75" fill="#020617" opacity="0.3"/>' +
                '</svg>' +
                '<svg width="17" height="13" viewBox="0 0 17 13" fill="none">' +
                  '<path d="M8.5 11a.5.5 0 110 1 .5.5 0 010-1z" fill="#020617"/>' +
                  '<path d="M5.4 8.1A4.4 4.4 0 018.5 7c1.2 0 2.2.4 3.1 1.1" stroke="#020617" stroke-width="1.5" stroke-linecap="round"/>' +
                  '<path d="M2.5 5.1A7.7 7.7 0 018.5 3c2.3 0 4.4.9 5.9 2.4" stroke="#020617" stroke-width="1.5" stroke-linecap="round"/>' +
                  '<path d="M0 2.3A11.2 11.2 0 018.5 0c3.2 0 6.1 1.3 8.2 3.4" stroke="#020617" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>' +
                '</svg>' +
                '<svg width="28" height="14" viewBox="0 0 28 14" fill="none">' +
                  '<rect x="0.5" y="0.5" width="23" height="13" rx="3.5" stroke="#020617" stroke-opacity="0.35"/>' +
                  '<rect x="2" y="2" width="19" height="10" rx="2" fill="#020617"/>' +
                  '<path d="M25.5 5.5v3" stroke="#020617" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round"/>' +
                '</svg>' +
              '</div>' +
            '</div>' +

            // iframe
            '<iframe id="muw-iframe" src="" allow="camera;microphone" style="' +
              'width:100%;height:100%;border:none;display:block;' +
              'padding-top:48px;box-sizing:border-box;' +
            '"></iframe>' +
          '</div>' +

          // Home indicator
          '<div style="height:28px;display:flex;align-items:center;justify-content:center;">' +
            '<div style="width:134px;height:5px;background:rgba(255,255,255,0.45);border-radius:3px;"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    // Backdrop click closes frame (tap outside phone)
    document.getElementById('muw-frame-backdrop').addEventListener('click', function (e) {
      if (e.target === this) muwCloseFrame(false);
    });

    // Live clock
    function syncClock() {
      var el = document.getElementById('muw-clock');
      if (!el) return;
      var n = new Date();
      el.textContent = n.getHours() + ':' + ('0' + n.getMinutes()).slice(-2);
    }
    syncClock();
    setInterval(syncClock, 15000);
  }

  window.muwOpenFrame = function (withEmail) {
    var overlay = document.getElementById('muw-frame-overlay');
    var iframe  = document.getElementById('muw-iframe');
    if (!overlay || !iframe) return;
    iframe.src = getMobileUrl(withEmail);
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.muwOpenVerifyFrame = function () {
    var overlay = document.getElementById('muw-frame-overlay');
    var iframe  = document.getElementById('muw-iframe');
    if (!overlay || !iframe) return;
    iframe.src = getVerifyEmailUrl();
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  // showToast: true when closed via mobile "done" buttons; false on backdrop tap
  window.muwCloseFrame = function (showToast) {
    var overlay = document.getElementById('muw-frame-overlay');
    var iframe  = document.getElementById('muw-iframe');
    if (!overlay) return;
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    if (iframe) {
      setTimeout(function () { iframe.src = ''; }, 200);
    }
    if (showToast) {
      muwShowToast(muwIsFi() ? 'Kuvat ladattu puhelimelta ✓' : 'Photos uploaded from phone ✓');
      if (typeof window.loadPhotos    === 'function') window.loadPhotos();
      if (typeof window.initStepNav   === 'function') window.initStepNav('photos');
    }
  };

  // ── Storage listener — sync live photo count to desktop UI ──────────────────

  function listenToStorage() {
    window.addEventListener('storage', function (e) {
      if (e.key !== 'autovex_funnel') return;
      try {
        var data   = JSON.parse(e.newValue || '{}');
        var photos = data.photos || {};
        var total  = Object.values(photos).reduce(function (n, a) {
          return n + (Array.isArray(a) ? a.length : 0);
        }, 0);

        var countEl = document.getElementById('photo-count');
        var barEl   = document.getElementById('progress-bar');
        if (countEl) countEl.textContent = total;
        if (barEl)   barEl.style.width = Math.min(total / 5 * 100, 100) + '%';

        if (typeof window.totalUploaded !== 'undefined') window.totalUploaded = total;
        if (typeof window.loadPhotos    === 'function')  window.loadPhotos();
      } catch (_) {}
    });
  }

  // ── postMessage listener — handle iframe → desktop events ───────────────────

  function listenToMessages() {
    window.addEventListener('message', function (e) {
      if (!e.data || typeof e.data !== 'object') return;
      var type = e.data.type;
      if (type !== 'mobileUploadComplete') return;
      muwCloseFrame(true);
    });
  }

  // ── Toast ────────────────────────────────────────────────────────────────────

  function muwShowToast(message) {
    var old = document.getElementById('muw-toast');
    if (old) old.remove();

    var toast = document.createElement('div');
    toast.id = 'muw-toast';
    toast.style.cssText = [
      'position:fixed',
      'bottom:28px',
      'left:50%',
      'transform:translateX(-50%) translateY(16px)',
      'z-index:99999',
      'background:#020617',
      'color:white',
      'font-family:\'DM Sans\',sans-serif',
      'font-size:14px',
      'font-weight:600',
      'padding:12px 22px',
      'border-radius:100px',
      'box-shadow:0 8px 28px rgba(0,0,0,0.28)',
      'display:flex',
      'align-items:center',
      'gap:9px',
      'opacity:0',
      'transition:opacity 0.25s,transform 0.25s',
      'white-space:nowrap',
      'pointer-events:none'
    ].join(';');
    toast.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none">' +
        '<circle cx="10" cy="10" r="9" fill="#22c55e"/>' +
        '<path d="M6 10l3 3 5-5.5" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
      message;

    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.style.opacity   = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
      });
    });

    setTimeout(function () {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3800);
  }

  // ── ESC closes desktop overlays ──────────────────────────────────────────────

  if (!isMobileMode) {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var frameOpen = document.getElementById('muw-frame-overlay');
      if (frameOpen && frameOpen.style.display !== 'none') { muwCloseFrame(false); }
    });
  }

}());
