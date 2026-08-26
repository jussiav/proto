/**
 * Prod scale tokens for the Tailwind Play CDN — ONE shared definition.
 *
 * Production's own `tailwind.config.js` replaces several of Tailwind's default
 * scales. The proto was built against the CDN defaults, so every class copied
 * out of a prod component rendered at a slightly different size here — and the
 * gap compounds: the more headings, labels and fields a funnel step has, the
 * more visibly it drifts from prod.
 *
 * Load this AFTER the page's own `tailwind.config` block, which it merges into:
 *
 *   <script src="https://cdn.tailwindcss.com"></script>
 *   <script> tailwind.config = { ... page colours/fonts ... } </script>
 *   <script src="tw-tokens.js"></script>
 *
 * Assigning `tailwind.config` re-runs the CDN's generator, so the merge has to
 * happen before first paint — hence a plain script in <head>, not DOMContentLoaded.
 *
 * ── What is ported, and what deliberately is not ────────────────────────────
 *
 * **fontSize — ported from `3xl` up.** `xs`…`2xl` are already identical to the
 * CDN defaults (12/14/16/18/20/24px), so only the heading end differed, and it
 * differed a lot: prod is 28/32/40/48/56/64 where the default is 30/36/48/60/72/96.
 * A prod `heading-2` (`text-3xl lg:text-5xl`) rendered 30/48 here instead of
 * 28/40. Values are plain strings, exactly as prod writes them, which also means
 * these keys stop pairing a default line-height — the same as prod, where a
 * heading's leading always comes from an explicit `leading-*`.
 *
 * **lineHeight — NOT ported, on purpose.** Prod remaps the numeric leading scale
 * completely (`leading-5` is 30px there, 20px here) and the proto has ~235 uses
 * of `leading-5` written against the default meaning. Porting it would silently
 * restyle every one of them. Where a prod class has to be reproduced exactly,
 * the proto writes the pixel value (`leading-[30px]`) — the convention it
 * already uses elsewhere. Prod's own numbers, for reference when transcribing:
 * 1:16 2:21 3:24 4:28 5:30 6:36 7:40 8:48 9:52 10:56.
 *
 * **screens — ported.** Prod's breakpoints are its own (`sm` 620, `lg` 992,
 * `xl` 1200) plus `xxs`/`xs`/`xxl`, which pages previously hand-wrote in CSS
 * because the utility did not exist. `md` is 768 in both.
 *
 * **spacing — ported (additive).** Prod's half-step extras, so a transcribed
 * `mb-3.5`/`p-4.5` resolves instead of silently doing nothing.
 */
(function () {
  if (!window.tailwind) return;

  var cfg = window.tailwind.config || {};
  cfg.theme = cfg.theme || {};
  cfg.theme.extend = cfg.theme.extend || {};
  var extend = cfg.theme.extend;

  /* The page's own values win: a page that deliberately overrides a token keeps
     it. Nothing does today, but a merge that silently loses page config would be
     a nasty surprise later. */
  function fill(key, values) {
    extend[key] = Object.assign({}, values, extend[key] || {});
  }

  fill('fontSize', {
    '2xs':  '.625rem',   // 10px — prod has it, the CDN does not
    '3xl':  '1.75rem',   // 28px (CDN default 30px)
    '4xl':  '2rem',      // 32px (36px)
    '5xl':  '2.5rem',    // 40px (48px)
    '6xl':  '3rem',      // 48px (60px)
    '7xl':  '3.5rem',    // 56px (72px)
    '8xl':  '4rem'       // 64px (96px)
  });

  fill('screens', {
    'xxs': '360px',
    'xs':  '460px',
    'sm':  '620px',      // CDN default 640px
    'md':  '768px',      // same as default, stated for completeness
    'lg':  '992px',      // 1024px
    'xl':  '1200px',     // 1280px
    'xxl': '1440px'      // prod's own top breakpoint (max-w-screen-xxl)
  });

  /* prod's scale steps — `hover:scale-102` on an empty image slot
     (ImagePreview.vue) has no CDN equivalent. */
  fill('scale', {
    '98':  '0.98',
    '102': '1.02',
    '105': '1.05',
    '110': '1.10',
    '120': '1.20',
    '130': '1.30'
  });

  fill('spacing', {
    '0.75': '0.1875rem', // 3px
    '2.25': '0.5625rem', // 9px
    '4.5':  '1.125rem',  // 18px
    '5.5':  '1.375rem',  // 22px
    '6.5':  '1.625rem',  // 26px
    '7.5':  '1.875rem',  // 30px
    '8.5':  '2.125rem',  // 34px
    '13.5': '3.25rem',   // 52px
    '18':   '4.5rem',    // 72px
    '23':   '5.75rem'    // 92px
  });

  window.tailwind.config = cfg;
}());
