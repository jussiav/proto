/**
 * The duplicate-ad guard's full-page state in the funnel (prod:
 * steps/DuplicateInfo.vue, `viewingDuplicateInfo` in tenderFormMachine).
 *
 * Prod: a draft that already exists and then fails a step save or the publish
 * call with the server's duplicate code ends on this page, a final state, and
 * the browser's stored pointer to the draft is dropped, so the draft cannot be
 * reached from the UI any more. Which calls fail:
 *
 *   another consumer ad for the plate is in review or waiting for email
 *   verification   every step save and the publish (RegistrationNumberAlreadySubmitted)
 *   the plate is on auction   the publish only (RegistrationNumberAlreadyOnAuction);
 *                             step saves do not send the plate
 *
 * Creating a draft with a taken plate is an inline field error on the front
 * page instead (index.html), never this page.
 *
 * The proto takes the plate's state from the Seed car row "Same car elsewhere"
 * (`?duplicate=review|auction`, PROTO_MOCK.plateHeld). A step's Jatka calls
 * DuplicateInfo.blockOnSave / blockOnPublish before it moves on; a hit marks the
 * draft blocked (store.duplicateBlocked) and turns the page into this state.
 * A reload keeps it while the plate is still taken. `success.html?scenario=
 * duplicate-blocked` shows it without touching the store.
 *
 * Load in <head> after translations.js and proto-mock.js, so the blocked state
 * hides the step before it paints.
 */
(function () {
  var KEY = 'autovex_funnel';

  function getStore() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function setStore(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  function held() {
    return window.PROTO_MOCK && window.PROTO_MOCK.plateHeld ? window.PROTO_MOCK.plateHeld() : null;
  }
  function tr(key, fallback) {
    var v = window.t ? window.t(key) : null;
    return v && v !== key ? v : fallback;
  }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Hand-written rather than utilities: the block is built by script and the
     Play CDN generates classes a tick after it, which would paint it unstyled.
     The prod classes stay on the elements as the record. Values: the card
     `mt-8 p-6 border-2 border-red-400 rounded-2xl bg-white text-base`, the
     plate badge ARegistrationNumberBadge, the title an h3 with `mb-2 text-2xl
     font-bold text-slate-900` (Barlow through the element rule, 24/32 from the
     utility), the body `text-slate-600 leading-relaxed [&_a]:underline` plus
     prod's p element rule (16px, 18px from 620px, last child no margin), and
     AButton ghost + neutral + lg with `w-full mt-4 gap-2 font-medium`. */
  var CSS = [
    'html[data-duplicate-blocked] .funnel-col > :not(.funnel-logo):not(#duplicate-info) { display: none !important; }',
    'html[data-duplicate-blocked] .funnel-col + * > * { display: none !important; }',
    '@media (max-width: 991px) { html[data-duplicate-blocked] .funnel-col + * { display: none !important; } }',
    '#duplicate-info .dup-card { margin-top: 32px; padding: 24px; border: 2px solid #F87171; border-radius: 16px; background: #fff; font-size: 16px; line-height: 24px; }',
    '#duplicate-info .dup-plate { display: flex; width: fit-content; margin-bottom: 20px; border-radius: 6px; background: #fff; }',
    '#duplicate-info .dup-plate-bar { width: 8px; background: #0B6DFF; border-radius: 6px 0 0 6px; }',
    '#duplicate-info .dup-plate-text { padding: 4px 6px; border: 1px solid #E2E8F0; border-left: 0; border-radius: 0 6px 6px 0; }',
    '#duplicate-info h3.dup-title { margin: 0 0 8px; font-family: Barlow, ui-sans-serif, system-ui, sans-serif; font-size: 24px; line-height: 32px; font-weight: 700; color: #0F172A; }',
    '#duplicate-info p.dup-body { margin: 0; color: #475569; font-size: 16px; line-height: 1.625; }',
    '@media (min-width: 620px) { #duplicate-info p.dup-body { font-size: 18px; } }',
    '#duplicate-info p.dup-body a { color: inherit; text-decoration: underline; }',
    '#duplicate-info .dup-home { display: flex; justify-content: center; align-items: center; gap: 8px; width: 100%; height: 56px; margin-top: 16px; padding: 6px 32px; border: none; border-radius: 8px; background: transparent; color: #334155; font-size: 16px; line-height: 1.25; font-weight: 500; text-decoration: none; cursor: pointer; outline-offset: 2px; transition: background-color .15s, color .15s; }',
    '#duplicate-info .dup-home:hover { background: #F1F5F9; color: #1E293B; }',
    '#duplicate-info .dup-home:active { background: #E2E8F0; color: #475569; }',
    '#duplicate-info .dup-home svg { width: 1.5em; height: 1.5em; padding-left: 4px; transform: scaleX(-1); flex-shrink: 0; }'
  ].join('\n');

  var ARROW = '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd"/></svg>';

  function markup(plate) {
    var badge = plate
      ? '<div class="dup-plate flex rounded-md bg-white mb-5 w-fit" role="text" aria-label="' + esc(tr('duplicate.plateLabel', 'Rekisterinumero')) + ' ' + esc(plate) + '">' +
          '<div class="dup-plate-bar w-2 h-auto bg-av-blue rounded-l-md"></div>' +
          '<div class="dup-plate-text py-1 px-1.5 border border-l-0 rounded-r-md border-slate-200">' + esc(plate) + '</div>' +
        '</div>'
      : '';
    return '<div class="flex flex-wrap flex-col items-center"><div class="w-full max-w-md">' +
        '<div class="dup-card mt-8 p-6 border-2 border-red-400 rounded-2xl bg-white text-base">' +
          badge +
          '<h3 class="dup-title mb-2 text-2xl font-bold text-slate-900">' + esc(tr('duplicate.title', '')) + '</h3>' +
          '<p class="dup-body text-slate-600 leading-relaxed">' + tr('duplicate.body', '') + '</p>' +
        '</div>' +
        '<a class="dup-home w-full mt-4 gap-2 font-medium" href="index.html">' + ARROW + '<span>' + esc(tr('duplicate.back', '')) + '</span></a>' +
      '</div></div>';
  }

  var params = new URLSearchParams(window.location.search);
  var page = window.location.pathname.split('/').pop() || 'index.html';
  var forced = page === 'success.html' && params.get('scenario') === 'duplicate-blocked';

  /* The block holds while the plate is taken: prod re-checks on every save, so
     a plate that has been freed lets the next one through. */
  var store = getStore();
  if (store.duplicateBlocked && !held()) {
    delete store.duplicateBlocked;
    setStore(store);
  }
  var active = forced || !!store.duplicateBlocked;

  var style = document.createElement('style');
  style.setAttribute('data-duplicate-info', '');
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);
  if (active) document.documentElement.setAttribute('data-duplicate-blocked', '');

  function render() {
    var col = document.querySelector('.funnel-col');
    if (!col) return;
    var plate = (getStore().hero || {}).plate || '';
    var el = document.getElementById('duplicate-info');
    if (!el) {
      el = document.createElement('div');
      el.id = 'duplicate-info';
      var logo = col.querySelector(':scope > .funnel-logo');
      if (logo && logo.nextSibling) col.insertBefore(el, logo.nextSibling); else col.appendChild(el);
    }
    el.innerHTML = markup(plate);
  }

  function block(s) {
    s = s || getStore();
    s.duplicateBlocked = true;
    setStore(s);
    document.documentElement.setAttribute('data-duplicate-blocked', '');
    render();
    window.scrollTo(0, 0);
    return true;
  }

  window.DuplicateInfo = {
    /** A step save on an existing draft: refused while another ad for the plate is in review or queued. */
    blockOnSave: function (s) { return held() === 'review' ? block(s) : false; },
    /** The publish: refused while another ad is in review or queued, or the plate is on auction. */
    blockOnPublish: function (s) { return held() ? block(s) : false; },
    isBlocked: function () { return document.documentElement.hasAttribute('data-duplicate-blocked'); }
  };

  document.addEventListener('DOMContentLoaded', function () { if (active) render(); });
  document.addEventListener('av:langchange', function () { if (document.getElementById('duplicate-info')) render(); });
}());
