/**
 * Proto mode — decides whether the prototype's own tooling is visible.
 *
 * The proto is used far more often by the team than in user tests, so it
 * DEFAULTS TO DEV: scenario switchers, variant switchers and the prototype
 * instructions link are all on unless explicitly turned off.
 *
 *   (no param)              dev  — panels visible. The default.
 *   ?mode=test              test — all proto tooling hidden. Sticks.
 *   ?mode=dev  /  ?dev=1    dev  — clears a stored test mode.
 *
 * Test mode persists in localStorage, not the URL, so a moderator hands over
 * ONE link and the participant keeps the clean view across every page and any
 * new tab they open. sessionStorage would have been lost the moment a link
 * opened in a new tab, which is exactly when dev chrome must not reappear.
 *
 * The trade-off is that test mode outlives the study, so exiting has to be
 * obvious: any page with ?mode=dev restores it, and while in test mode we log
 * the exit instruction to the console — invisible to a participant, findable
 * by whoever picks the machine up next.
 *
 * Exposes:
 *   window.protoMode  'dev' | 'test'
 *   window.protoDev   boolean — true in dev mode
 *
 * Adding new proto-only UI? Mark its root with data-proto-dev (hidden by CSS
 * in test mode) AND, if it is built in JS, skip building it when !protoDev.
 * The CSS is the safety net; not building it is the actual fix.
 */
(function () {
  var KEY = 'autovex_proto_mode';

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function store(v) {
    try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch (e) {}
  }

  var params = new URLSearchParams(window.location.search);
  var asked = params.get('mode');
  var mode;

  if (asked === 'test') {
    mode = 'test';
    store('test');
  } else if (asked === 'dev' || params.get('dev') === '1') {
    mode = 'dev';
    store(null);
  } else {
    mode = stored() === 'test' ? 'test' : 'dev';
  }

  window.protoMode = mode;
  window.protoDev = mode === 'dev';

  if (mode === 'test') {
    /* Safety net for anything that forgets the !protoDev check. Injected into
       <head> before body parsing so panels never flash into view. */
    var style = document.createElement('style');
    style.id = 'proto-mode-style';
    style.textContent = '[data-proto-dev]{display:none !important}';
    document.head.appendChild(style);

    if (window.console && console.info) {
      console.info(
        '[proto] Test mode: prototype tooling is hidden and this sticks across pages.\n' +
        '        Add ?mode=dev to any URL to restore it.'
      );
    }
  }
}());
