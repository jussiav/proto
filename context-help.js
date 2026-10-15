/* Prod's ContextHelp (tenderRequestDraftForm/components/ContextHelp.vue): a
   link-style UiButton that folds out an OContainer (`default-filled`, size md)
   with a ✕ in its header and a neutral "Sulje" button in its footer.

   The markup lives in each page so `data-i18n` reaches it; this file only
   drives it. Mount: an element with `data-context-help`, containing one
   `[data-ch-trigger]`, one `[data-ch-panel]` (starts `hidden`) and any number
   of `[data-ch-close]`. Open/close events go out as `contexthelp:open` /
   `contexthelp:close` on the mount, prod's `open` / `close` emits.

   The accordion is prod's own transition (max-height + opacity, 300ms
   ease-in-out, --accordion-max 1000px). Its CSS is injected here rather than
   left to utilities: the Play CDN generates classes a tick late, and the fold
   would jump. */
(function () {
  var DURATION = 300;

  var css =
    '.dialog-inline{position:static;inset:auto;transform:none;margin:0}' +
    '.dialog-inline::backdrop{display:none}' +
    '[data-ch-panel]{overflow:hidden;max-height:var(--accordion-max,1000px);opacity:1;' +
      'transition:max-height ' + DURATION + 'ms ease-in-out,opacity ' + DURATION + 'ms ease-in-out}' +
    '[data-ch-panel].ch-collapsed{max-height:0;opacity:0}';
  var style = document.createElement('style');
  style.setAttribute('data-context-help', '');
  style.textContent = css;
  document.head.appendChild(style);

  function init(root) {
    if (root.dataset.chReady) return;
    root.dataset.chReady = '1';
    var trigger = root.querySelector('[data-ch-trigger]');
    var panel = root.querySelector('[data-ch-panel]');
    if (!trigger || !panel) return;
    var timer = null;

    function isOpen() { return !panel.hidden && !panel.classList.contains('ch-collapsed'); }

    function open() {
      clearTimeout(timer);
      panel.hidden = false;
      panel.classList.add('ch-collapsed');
      // Forces the collapsed state to be painted before the transition starts.
      void panel.offsetHeight;
      panel.classList.remove('ch-collapsed');
      trigger.setAttribute('aria-expanded', 'true');
      root.dispatchEvent(new CustomEvent('contexthelp:open'));
    }

    function close(returnFocus) {
      if (!isOpen()) return;
      panel.classList.add('ch-collapsed');
      trigger.setAttribute('aria-expanded', 'false');
      timer = setTimeout(function () { panel.hidden = true; }, DURATION);
      if (returnFocus) trigger.focus();
      root.dispatchEvent(new CustomEvent('contexthelp:close'));
    }

    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', function () { isOpen() ? close(false) : open(); });
    root.querySelectorAll('[data-ch-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { close(true); });
    });
  }

  function initAll() { document.querySelectorAll('[data-context-help]').forEach(init); }

  window.ContextHelp = { init: init, initAll: initAll };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();
}());
