/**
 * The logged-in app's footer: prod's OFooter as the Vue app renders it.
 *
 * No page of the Vue app fills OFooter's links slot, so every one of them
 * (offers, decision, the DAC7 personal-information page, profile, login,
 * password reset) shows only the wave crest, MLegalFooter's three links and
 * copyright, and the full-width logo. The marketing pages keep layout.js's
 * footer with its link columns.
 *
 * A page mounts it with <div id="site-footer"></div> followed by this script.
 * The crest takes the colour of the first opaque background above the footer,
 * measured after the page's styles apply, as OFooter does on mount.
 * assets/hero-wave.svg is prod's own mask.
 */
(function () {
  var mount = document.getElementById('site-footer');
  if (!mount) return;

  var WAVE_MASK = 'url(assets/hero-wave.svg)';
  mount.outerHTML =
    '<footer id="app-footer" class="font-display bg-blue">' +
      '<div id="app-footer-wave" class="block w-full h-[42px] -scale-y-100" aria-hidden="true" style="background-color:transparent;' +
        '-webkit-mask-image:' + WAVE_MASK + ';mask-image:' + WAVE_MASK + ';-webkit-mask-size:100% 100%;mask-size:100% 100%;' +
        '-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-mode:alpha;mask-mode:alpha"></div>' +
      '<div class="py-12 px-[20px] md:px-[120px] lg:px-[40px] xl:px-[120px]">' +
        '<div class="mx-auto rounded-3xl max-w-screen-xxl font-body">' +
          '<div class="flex mt-4 items-top justify-between px-4 pb-4 text-sm">' +
            '<ul class="flex flex-wrap flex-col sm:flex-row justify-start text-white">' +
              '<li class="mx-2 mb-2 sm:mb-0"><a class="font-bold no-underline hover:underline" href="#" data-i18n="footer.terms">Käyttöehdot</a></li>' +
              '<li class="mx-2 mb-2 sm:mb-0"><a class="font-bold no-underline hover:underline" href="#" data-i18n="footer.privacy">Tietosuojakäytäntö</a></li>' +
              '<li class="mx-2"><a class="font-bold no-underline hover:underline" href="#" data-i18n="footer.cookies">Evästekäytäntö</a></li>' +
            '</ul>' +
            '<div class="text-white">© ' + new Date().getFullYear() + ' All rights reserved</div>' +
          '</div>' +
        '</div>' +
        '<div class="mx-auto rounded-3xl max-w-screen-xxl text-white mt-6 mb-4">' +
          '<img src="assets/a58f6f26-6867-4bc8-ac6a-42028691bfe2.svg" alt="AutoVex" class="w-full h-auto block" />' +
        '</div>' +
      '</div>' +
    '</footer>';

  function paintCrest() {
    var footer = document.getElementById('app-footer');
    if (!footer) return;
    /* Start from the element in flow just above: a fixed or absolute sibling
       (a proto inbox notice, say) is not what the page paints behind the
       footer's top edge. */
    var node = footer.previousElementSibling;
    while (node && /^(fixed|absolute)$/.test(getComputedStyle(node).position)) node = node.previousElementSibling;
    node = node || footer.parentElement;
    while (node) {
      var bg = getComputedStyle(node).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        document.getElementById('app-footer-wave').style.backgroundColor = bg;
        return;
      }
      node = node.parentElement;
    }
  }
  if (document.readyState === 'complete') paintCrest();
  else window.addEventListener('load', paintCrest);
  setTimeout(paintCrest, 400);
})();
