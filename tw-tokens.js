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
 * `mb-3.5`/`p-4.5` resolves instead of silently doing nothing. *
 * **Element-level typography — ported, and it is the reason headings drifted.**
 * Prod's `sass/base/_typography.scss` styles h1-h6 as ELEMENTS (`@apply text-3xl
 * leading-6 lg:text-5xl lg:leading-8 font-bold` and so on), and `custom.scss`
 * gives h1-h5 `font-display`. Both are loaded AFTER `@tailwind utilities`, so
 * they beat Tailwind's preflight — which zeroes heading size and weight — while
 * still losing to any utility class on the element itself. The proto had neither
 * file, so a prod heading transcribed WITHOUT explicit size classes rendered at
 * the inherited body size in regular weight. That is what made the decision
 * page's support-banner title and the reject survey's thank-you title look
 * nothing like production.
 *
 * The rules are injected here rather than written into each page's `<style>`,
 * for the same reason the scales live here: one definition. Specificity is what
 * makes this safe — a bare element selector loses to every `text-*` /
 * `font-*` utility, so the ~140 proto headings that carry explicit classes are
 * untouched and only genuinely bare ones change.
 *
 * `.heading-1`…`.heading-6`, which prod pairs with each element, are
 * deliberately NOT added: no proto markup uses them, every consumer here is a
 * real heading element that the element rule already covers, and as classes they
 * would out-rank the utility strings rule 6 of CLAUDE.md tells us to write.
 * `.hero h1` is skipped for the same reason — the proto has no `.hero`.
 *
 * **`p` is NOT ported.** Prod also styles the paragraph element
 * (`mb-4.5 lg:mb-6 text-base leading-snug sm:text-lg last:mb-0 font-normal`),
 * and 335 of the proto's 561 `<p>` elements carry no size class, so porting it
 * would resize and re-space most body copy in the prototype. That is a separate
 * decision, not a side effect of fixing the headings.
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

  /* ── Prod's element-level typography ──────────────────────────────────────
     `sass/base/_typography.scss` (size, leading, weight) + `custom.scss`
     (family, h1-h5 only — h6 stays on the body font). Values resolved through
     prod's own scales: fontSize lg 18 / xl 20 / 2xl 24 / 3xl 28 / 4xl 32 /
     5xl 40 / 6xl 48; lineHeight 2:21 3:24 4:28 5:30 6:36 8:46 9:52 — note 8 is
     `2.875rem`, i.e. 46px, where prod's own inline comment beside it says 48;
     screens sm 620 / lg 992. Appended after the CDN's own stylesheet so it
     out-ranks preflight's heading reset at equal specificity, and left as bare
     element selectors so any utility class on the element still wins. */
  var DISPLAY = "Barlow, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";
  var css = [
    'h1,h2,h3,h4,h5{font-family:' + DISPLAY + '}',
    'h1{font-size:2rem;line-height:2.25rem;font-weight:700}',
    'h2{font-size:1.75rem;line-height:2.25rem;font-weight:700}',
    'h3{font-size:1.5rem;line-height:1.875rem;font-weight:700}',
    'h4{font-size:1.125rem;line-height:1.5rem;font-weight:700}',
    'h5{font-size:1.125rem;line-height:1.3125rem;font-weight:600}',
    'h6{font-size:0.875rem;line-height:1.25;font-weight:600;letter-spacing:0.025em}',
    /* prod's `sm`, 620px — h5 and h6 are the two that step up here */
    '@media (min-width:620px){',
    'h5{font-size:1.25rem;line-height:1.5rem}',
    'h6{font-size:1rem;line-height:1.375}',
    '}',
    /* prod's `lg`, 992px */
    '@media (min-width:992px){',
    'h1{font-size:3rem;line-height:3.25rem}',
    'h2{font-size:2.5rem;line-height:2.875rem}',
    'h3{font-size:2rem;line-height:2.25rem}',
    'h4{font-size:1.5rem;line-height:1.6875rem}',
    '}'
  ].join('');

  /* The CDN rewrites its own <style> in place, so appending once is enough —
     but it also injects late on some pages, so the tag is re-appended on
     DOMContentLoaded to keep it last. Moving a <style> that is already last is
     a no-op. */
  var el = document.createElement('style');
  el.setAttribute('data-proto-typography', '');
  el.textContent = css;
  function place() { document.head.appendChild(el); }
  place();
  document.addEventListener('DOMContentLoaded', place);
}());
