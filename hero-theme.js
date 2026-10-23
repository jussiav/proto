/* Seasonal decoration for a hero section (initiative hero-theme).

   HeroTheme.autumn(section) fills `section` with a Finnish autumn: ruska
   leaves falling (birch, aspen, Norway maple), a birch on the left and a
   rowan branch with berries top right, and fallen leaves with mushrooms and
   lingonberries in the two bottom corners. Where the hero is too narrow for
   the trees, the corners take smaller pieces instead: drooping birch twigs
   top left, a rowan sprig top right.

   Two layers, both `absolute inset-0` inside the section, which clips them:
   the back one sits under the section's own children, so the form, the
   headline and the wave stay on top; the front one holds only the ground
   pieces, so they lie on the wave's edge. Neither takes pointer events.
   Shapes come from a seeded random, so every load draws the same scene.

   Fall distance is `100cqh`: the back layer is a size container, so a leaf
   falls the hero's full height whatever state the hero is in. */
(function () {
  var CSS =
    '.ht-on{position:relative;isolation:isolate}' +
    '.ht-on>:not(.ht-root){position:relative;z-index:1}' +
    '.ht-root{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;container-type:size}' +
    '.ht-root.ht-front{z-index:2}' +
    '.ht-root svg{overflow:visible}' +
    '.ht-spin{display:block}' +
    '.ht-leaf{position:absolute;top:0;left:var(--x);width:var(--size);height:var(--size);' +
      'animation:ht-fall var(--dur) linear var(--delay) infinite;will-change:transform}' +
    '.ht-sway{width:100%;height:100%;animation:ht-sway var(--sway-dur) ease-in-out var(--delay) infinite alternate}' +
    '.ht-spin{width:100%;height:100%;animation:ht-spin var(--spin-dur) linear var(--delay) infinite}' +
    '@keyframes ht-fall{from{transform:translateY(-60px)}to{transform:translateY(calc(100cqh + 20px))}}' +
    '@keyframes ht-sway{from{transform:translateX(calc(var(--sway) * -1))}to{transform:translateX(var(--sway))}}' +
    '@keyframes ht-spin{from{transform:rotate(var(--r)) rotate3d(1,.45,.1,0deg)}to{transform:rotate(calc(var(--r) + 360deg)) rotate3d(1,.45,.1,360deg)}}' +
    '.ht-birch{position:absolute;left:-36px;bottom:0;height:min(88%,480px);width:auto;display:none;' +
      'transform-origin:30% 100%;animation:ht-tree 9s ease-in-out infinite alternate}' +
    '@keyframes ht-tree{from{transform:rotate(-.8deg)}to{transform:rotate(.8deg)}}' +
    '.ht-rowan{position:absolute;top:0;right:0;width:250px;height:auto;display:none}' +
    '.ht-pivot{transform-box:view-box;animation:ht-branch var(--pd,7s) ease-in-out var(--pdl,0s) infinite alternate}' +
    '@keyframes ht-branch{from{transform:rotate(calc(var(--pa,2.5deg) * -1))}to{transform:rotate(var(--pa,2.5deg))}}' +
    '.ht-twigs{position:absolute;top:0;left:0;width:110px;height:auto}' +
    '.ht-sprig{position:absolute;top:0;right:0;width:124px;height:auto}' +
    '.ht-ground{position:absolute;bottom:0;width:116px;height:auto}' +
    '.ht-ground-l{left:0}.ht-ground-r{right:0}' +
    '@media (min-width:768px){.ht-pocket{display:none}.ht-sprig{right:-14px}.ht-ground{width:156px}}' +
    '@media (min-width:992px){.ht-birch{display:block}.ht-twigs{display:none}}' +
    '@media (min-width:1200px){.ht-rowan{display:block}.ht-sprig{display:none}}' +
    '@media (max-width:767px){.ht-leaf.ht-wide{display:none}}' +
    '.ht-paused *{animation-play-state:paused!important}' +
    '@media (prefers-reduced-motion:reduce){' +
      '.ht-root *{animation:none!important}' +
      '.ht-leaf{transform:translateY(calc(var(--rest) * 1cqh))}' +
    '}';

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function between(rand, a, b) { return a + rand() * (b - a); }
  function pick(rand, list) { return list[Math.floor(rand() * list.length)]; }
  function r1(n) { return Math.round(n * 10) / 10; }

  function bezier(p, t) {
    var u = 1 - t;
    return [0, 1].map(function (k) {
      return u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k];
    });
  }
  function curve(p) {
    return 'M' + p[0].join(' ') + 'C' + p[1].join(' ') + ' ' + p[2].join(' ') + ' ' + p[3].join(' ');
  }

  /* Leaves point up with the petiole end at (12, 22.6); veins darken any fill. */
  var VEIN = 'fill="none" stroke="rgba(0,0,0,.24)" stroke-width=".8" stroke-linecap="round"';
  var LEAVES = {
    birch: {
      size: [18, 24], colors: ['#FACC15', '#FBBF24', '#EAB308', '#FDE047'],
      svg: '<path fill="currentColor" d="M12 2.2c1.6 2.6 4.6 5 6.2 8 1.4 2.6 1 5.6-1.2 7.4-1.4 1.2-3.2 1.6-5 1.6s-3.6-.4-5-1.6C4.8 15.8 4.4 12.8 5.8 10.2c1.6-3 4.6-5.4 6.2-8z"/>' +
        '<path ' + VEIN + ' d="M12 4.5v14.5M12 8.5l2.8 1.8M12 8.5l-2.8 1.8M12 11.5l3.8 2.2M12 11.5l-3.8 2.2M12 14.5l3.2 1.8M12 14.5l-3.2 1.8M12 19v3.6"/>'
    },
    aspen: {
      size: [20, 27], colors: ['#F97316', '#EA580C', '#FB923C', '#DC2626', '#F5AB84'],
      svg: '<path fill="currentColor" d="M12 3.2c.6 1 1.6 1.4 2.8 1.6 3.2.6 5.6 3.4 5.6 6.8 0 4-3.6 7.2-8.4 7.2s-8.4-3.2-8.4-7.2c0-3.4 2.4-6.2 5.6-6.8 1.2-.2 2.2-.6 2.8-1.6z"/>' +
        '<path ' + VEIN + ' d="M12 5.5v13M12 9l4.4 1.8M12 9l-4.4 1.8M12 12.6l5 1.4M12 12.6l-5 1.4M12 18.6v4"/>'
    },
    maple: {
      size: [26, 34], colors: ['#DC2626', '#EF4444', '#F97316', '#B91C1C'],
      svg: '<path fill="currentColor" d="M12 1.5l1.6 4.1 2.6-1.4-.6 4.4 4.8-1.8-1.6 3.8 3.6 1.6-4.6 2 1 2.8-5.4-1.2-.8 3.6h-1.2l-.8-3.6-5.4 1.2 1-2.8-4.6-2 3.6-1.6-1.6-3.8 4.8 1.8-.6-4.4 2.6 1.4z"/>' +
        '<path ' + VEIN + ' d="M12 18.5V4M12 15.5l7.4-7.6M12 15.5L4.6 7.9M12 16.5l9-4.2M12 16.5l-9-4.2M12 19v4"/>'
    }
  };
  var LEAF_MIX = ['birch', 'birch', 'birch', 'birch', 'aspen', 'aspen', 'aspen', 'maple', 'maple'];

  /* One leaf as SVG, petiole end at (x, y), turned by `angle` (0 = tip up). */
  function leafAt(type, color, x, y, angle, scale) {
    return '<g color="' + color + '" transform="translate(' + r1(x) + ' ' + r1(y) + ') rotate(' + Math.round(angle) + ') scale(' + scale + ') translate(-12 -22.6)">' +
      LEAVES[type].svg + '</g>';
  }

  function fallingLeaf(rand, i, count) {
    var type = pick(rand, LEAF_MIX);
    var def = LEAVES[type];
    var size = Math.round(between(rand, def.size[0], def.size[1]));
    var el = document.createElement('div');
    el.className = 'ht-leaf' + (i % 2 ? ' ht-wide' : '');
    var dur = between(rand, 10, 17);
    el.style.cssText =
      '--x:' + r1((i + 0.1 + rand() * 0.8) / count * 100) + '%;' +
      '--size:' + size + 'px;' +
      '--dur:' + r1(dur) + 's;' +
      '--delay:' + r1(-rand() * dur) + 's;' +
      '--sway:' + Math.round(between(rand, 18, 48)) + 'px;' +
      '--sway-dur:' + r1(between(rand, 2.4, 4)) + 's;' +
      '--spin-dur:' + r1(between(rand, 4, 8)) + 's;' +
      '--r:' + Math.round(rand() * 360) + 'deg;' +
      '--rest:' + Math.round(between(rand, 8, 70)) + ';' +
      'color:' + pick(rand, def.colors);
    el.innerHTML = '<div class="ht-sway"><svg class="ht-spin" viewBox="0 0 24 24">' + def.svg + '</svg></div>';
    return el;
  }

  function pivot(x, y, amp, dur, delay) {
    return '<g class="ht-pivot" style="transform-origin:' + x + 'px ' + y + 'px;--pa:' + amp + 'deg;--pd:' + dur + 's;--pdl:' + delay + 's">';
  }

  function birch(rand) {
    var marks = '';
    [[78, 452, 9], [76, 404, 6], [80, 360, 8], [82, 318, 5], [84, 270, 7], [86, 226, 5], [88, 182, 6], [90, 140, 4], [92, 104, 4],
     [138, 430, 5], [142, 382, 4], [146, 334, 5], [150, 288, 3], [154, 244, 4]].forEach(function (m) {
      marks += '<rect x="' + (m[0] - m[2] / 2) + '" y="' + m[1] + '" width="' + m[2] + '" height="' + r1(between(rand, 2, 3.4)) + '" rx="1.2" fill="#1E293B"/>';
    });
    var crown = '';
    for (var i = 0; i < 34; i++) {
      var a = rand() * Math.PI * 2, d = Math.sqrt(rand());
      crown += '<circle cx="' + r1(118 + Math.cos(a) * d * 104) + '" cy="' + r1(150 + Math.sin(a) * d * 118) + '" r="' + r1(between(rand, 16, 30)) +
        '" fill="' + pick(rand, ['#FACC15', '#FBBF24', '#EAB308', '#FDE047', '#F59E0B']) + '"/>';
    }
    return '<svg class="ht-birch" viewBox="0 0 240 500">' +
      '<g opacity=".97">' + crown + '</g>' +
      '<path d="M128 502 C134 400 144 300 158 180 L164 182 C152 300 144 400 142 502 Z" fill="#E2E8F0"/>' +
      '<path d="M68 502 C72 380 80 240 90 60 L98 62 C92 240 88 380 90 502 Z" fill="#F8FAFC"/>' +
      '<path d="M68 502 C69 482 70 470 71 462 L88 462 C88 476 89 488 90 502 Z" fill="#1E293B"/>' +
      marks +
      '</svg>';
  }

  /* Drooping birch twigs for narrow heroes. Long pendants stay within the
     left gutter; the short ones hang only in the band above the headline.
     The "pocket" branch reaches in beside the phone headline's shorter
     second line, and goes from 768px, where the headline is one long line. */
  function birchTwigs(rand) {
    var YELLOWS = ['#FACC15', '#FBBF24', '#EAB308', '#FDE047'];
    var TWIG = 'fill="none" stroke="#3F3F46" stroke-linecap="round"';
    var branches = [
      { p: [[-6, 6], [24, 2], [60, 8], [110, 24]], w: 2.4, leaves: 4 },
      { p: [[-6, 98], [20, 92], [50, 98], [88, 112]], w: 2, leaves: 3, pocket: true }
    ];
    var pendants = [
      { p: [[6, 5], [3, 60], [13, 130], [9, 206]], leaves: 11 },
      { p: [[19, 4], [17, 50], [25, 100], [21, 152]], leaves: 8 },
      { p: [[36, 5], [35, 18], [38, 30], [37, 40]], leaves: 2 },
      { p: [[56, 9], [55, 20], [58, 32], [57, 42]], leaves: 2 },
      { p: [[80, 14], [79, 24], [82, 36], [81, 44]], leaves: 2 },
      { p: [[26, 95], [25, 104], [28, 116], [27, 128]], leaves: 2, pocket: true },
      { p: [[48, 98], [47, 108], [50, 118], [49, 128]], leaves: 2, pocket: true },
      { p: [[70, 104], [69, 112], [72, 120], [71, 128]], leaves: 2, pocket: true }
    ];
    function hang(p, n) {
      var out = '';
      for (var k = 1; k <= n; k++) {
        var pt = bezier(p, k / (n + 0.2));
        var side = k % 2 ? 1 : -1;
        out += leafAt('birch', pick(rand, YELLOWS), pt[0], pt[1], 180 + side * between(rand, 22, 48), r1(between(rand, 0.46, 0.58)));
      }
      return out;
    }
    var svg = '<svg class="ht-twigs" viewBox="0 0 110 230">' + pivot(0, 0, 1.2, 8, 0);
    var pocket = '';
    branches.forEach(function (b) {
      var g = '<path ' + TWIG + ' stroke-width="' + b.w + '" d="' + curve(b.p) + '"/>' + hang(b.p, b.leaves);
      if (b.pocket) pocket += g; else svg += g;
    });
    pendants.forEach(function (pd) {
      var g = pivot(pd.p[0][0], pd.p[0][1], r1(between(rand, 2, 4)), r1(between(rand, 3.5, 6)), r1(-rand() * 4)) +
        '<path ' + TWIG + ' stroke-width="1.1" d="' + curve(pd.p) + '"/>' + hang(pd.p, pd.leaves) + '</g>';
      if (pd.pocket) pocket += g; else svg += g;
    });
    return svg + '<g class="ht-pocket">' + pocket + '</g></g></svg>';
  }

  /* Rowan: pinnate leaves on a twig, berries in a dome-shaped cluster. */
  function rowanLeaf(x, y, angle, len, rand) {
    var colors = ['#EA580C', '#F97316', '#DC2626', '#C2410C', '#FB923C'];
    var LEAFLET = 'M0 0C4 -4 14 -3.6 20 0C14 3.6 4 4 0 0Z';
    var out = '<g transform="translate(' + x + ' ' + y + ') rotate(' + angle + ')">' +
      '<path d="M0 0H' + len + '" stroke="#7C2D12" stroke-width="1.6" stroke-linecap="round"/>';
    var pairs = 5;
    for (var k = 1; k <= pairs; k++) {
      var px = r1(len * k / (pairs + 0.6));
      out += '<path d="' + LEAFLET + '" fill="' + pick(rand, colors) + '" transform="translate(' + px + ' 0) rotate(-58) scale(1.05 1)"/>';
      out += '<path d="' + LEAFLET + '" fill="' + pick(rand, colors) + '" transform="translate(' + px + ' 0) rotate(58) scale(1.05 1)"/>';
    }
    out += '<path d="' + LEAFLET + '" fill="' + pick(rand, colors) + '" transform="translate(' + len + ' 0) scale(1.1 1)"/></g>';
    return out;
  }

  function berries(cx, cy, scale) {
    var spots = [[0, 0], [-11, -4], [11, -4], [-6, 9], [6, 9], [-17, 7], [17, 7], [0, -11], [-10, 17], [10, 17], [0, 20], [-20, -5], [20, -5]];
    if (scale < 1) spots = spots.slice(0, 9);
    var stalks = '', fruit = '';
    spots.forEach(function (s) {
      var bx = r1(cx + s[0] * scale), by = r1(cy + s[1] * scale);
      stalks += 'M' + cx + ' ' + r1(cy - 30 * scale) + 'L' + bx + ' ' + by;
      fruit += '<circle cx="' + bx + '" cy="' + by + '" r="' + r1(6.2 * scale) + '" fill="#DC2626" stroke="#991B1B" stroke-width=".8"/>' +
        '<circle cx="' + r1(bx - 1.8 * scale) + '" cy="' + r1(by - 1.8 * scale) + '" r="' + r1(1.5 * scale) + '" fill="#fff" opacity=".55"/>';
    });
    return '<path d="' + stalks + '" stroke="#7C2D12" stroke-width="1"/>' + fruit;
  }

  function rowan(rand) {
    return '<svg class="ht-rowan" viewBox="0 0 260 230">' + pivot(262, -6, 2.2, 7, 0) +
      rowanLeaf(240, 20, 198, 100, rand) +
      rowanLeaf(198, 54, 152, 96, rand) +
      rowanLeaf(146, 92, 206, 78, rand) +
      '<path d="M262 -6C240 30 206 58 168 78C140 92 118 112 104 140" fill="none" stroke="#5B3A29" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M186 68C188 76 186 84 184 90" fill="none" stroke="#5B3A29" stroke-width="2.4" stroke-linecap="round"/>' +
      rowanLeaf(172, 76, 78, 82, rand) +
      berries(184, 118, 0.72) +
      berries(102, 170, 1) +
      '</g></svg>';
  }

  /* The rowan for narrow heroes: leaves along the top edge and down the
     right edge, berries hanging beside the headline's second line. */
  function rowanSprig(rand) {
    return '<svg class="ht-sprig" viewBox="0 0 140 160">' + pivot(144, -6, 2.5, 6.5, -2) +
      rowanLeaf(138, 6, 188, 76, rand) +
      rowanLeaf(136, 30, 100, 46, rand) +
      '<path d="M144 -6C136 30 126 66 106 98" fill="none" stroke="#5B3A29" stroke-width="3.6" stroke-linecap="round"/>' +
      rowanLeaf(118, 78, 116, 38, rand) +
      berries(104, 122, 0.8) +
      '</g></svg>';
  }

  /* Ground: fallen leaves, fly agarics on the left, chanterelles and a
     lingonberry sprig on the right. Bottom edge = the section's bottom. */
  function pile(rand, x0, x1, y, n) {
    var out = '';
    for (var i = 0; i < n; i++) {
      var type = pick(rand, LEAF_MIX);
      out += leafAt(type, pick(rand, LEAVES[type].colors), between(rand, x0, x1), y + between(rand, -5, 4), between(rand, 50, 130) * (rand() < 0.5 ? 1 : -1), r1(between(rand, 0.6, 0.85)));
    }
    return out;
  }

  function agaric(x, y, s, tilt) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + tilt + ') scale(' + s + ')">' +
      '<path d="M-7 2C-8 -10 -6 -22 -5 -30H5C6 -22 8 -10 7 2Z" fill="#F1F5F9"/>' +
      '<path d="M-7 -21Q0 -16 7 -21L6 -17Q0 -13 -6 -17Z" fill="#CBD5E1"/>' +
      '<ellipse cx="0" cy="-30" rx="20" ry="3.4" fill="#FEF3C7"/>' +
      '<path d="M-22 -30C-22 -46 -12 -54 0 -54S22 -46 22 -30Q0 -25 -22 -30Z" fill="#DC2626"/>' +
      '<path d="M-14 -46C-10 -51 -4 -52 2 -52" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.4" stroke-linecap="round"/>' +
      [[-12, -38, 2.6], [-3, -46, 2.2], [8, -42, 2.8], [15, -34, 2], [0, -35, 1.8], [-17, -32, 1.6], [6, -50, 1.5]].map(function (d) {
        return '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="' + d[2] + '" fill="#fff"/>';
      }).join('') +
      '</g>';
  }

  function chanterelle(x, y, s, tilt) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + tilt + ') scale(' + s + ')">' +
      '<path d="M-4 2C-4 -6 -7 -14 -13 -21C-15 -24 -12 -27 -8 -26C-4 -28 0 -27 3 -28C7 -28 11 -27 14 -24C15 -21 11 -18 8 -14C5 -9 4 -4 4 2Z" fill="#F59E0B"/>' +
      '<path d="M-12 -24C-6 -27 6 -27 13 -24C10 -22 -8 -21 -12 -24Z" fill="#FCD34D"/>' +
      '<path d="M0 -2L-6 -20M0 -2L0 -21M0 -2L6 -20" fill="none" stroke="#B45309" stroke-opacity=".45" stroke-width=".8"/>' +
      '</g>';
  }

  function lingonberry(x, y, s) {
    var leaves = [[-4, -8, -30], [4, -14, 30], [-4, -20, -35], [4, -25, 25], [0, -31, 0]];
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<path d="M0 2C-2 -10 2 -20 0 -30" fill="none" stroke="#7C2D12" stroke-width="1.4"/>' +
      leaves.map(function (l) {
        return '<ellipse cx="' + l[0] + '" cy="' + l[1] + '" rx="5" ry="2.8" fill="#166534" transform="rotate(' + l[2] + ' ' + l[0] + ' ' + l[1] + ')"/>';
      }).join('') +
      [[8, -6], [12, -2], [9, 1], [13, -7]].map(function (b) {
        return '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="3.2" fill="#DC2626" stroke="#991B1B" stroke-width=".6"/>' +
          '<circle cx="' + (b[0] - 1) + '" cy="' + (b[1] - 1) + '" r=".9" fill="#fff" opacity=".6"/>';
      }).join('') +
      '<path d="M2 -14C6 -12 8 -9 9 -6" fill="none" stroke="#7C2D12" stroke-width="1"/>' +
      '</g>';
  }

  function ground(rand) {
    return '<svg class="ht-ground ht-ground-l" viewBox="0 0 120 70">' +
      pile(rand, 0, 104, 64, 7) +
      agaric(46, 66, 0.95, -4) + agaric(74, 68, 0.55, 8) +
      pile(rand, 6, 96, 69, 5) +
      '</svg>' +
      '<svg class="ht-ground ht-ground-r" viewBox="0 0 120 70">' +
      pile(rand, 14, 120, 64, 7) +
      chanterelle(60, 67, 1.3, -8) + chanterelle(82, 68, 1, 10) + chanterelle(42, 69, 0.75, -16) +
      lingonberry(100, 66, 0.95) +
      pile(rand, 24, 118, 69, 5) +
      '</svg>';
  }

  function injectCss() {
    if (document.querySelector('style[data-hero-theme]')) return;
    var style = document.createElement('style');
    style.setAttribute('data-hero-theme', '');
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function pauseOffscreen(section, roots) {
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      roots.forEach(function (root) { root.classList.toggle('ht-paused', !entries[0].isIntersecting); });
    }).observe(section);
  }

  function layer(extra) {
    var el = document.createElement('div');
    el.className = 'ht-root' + (extra ? ' ' + extra : '');
    el.setAttribute('aria-hidden', 'true');
    return el;
  }

  function autumn(section) {
    if (!section || section.querySelector('.ht-root')) return;
    injectCss();
    var rand = rng(2026);

    var back = layer();
    back.innerHTML = birch(rand) + rowan(rand) + birchTwigs(rand) + rowanSprig(rand);
    var count = 18;
    for (var i = 0; i < count; i++) back.appendChild(fallingLeaf(rand, i, count));

    var front = layer('ht-front');
    front.innerHTML = ground(rand);

    section.classList.add('ht-on');
    section.insertBefore(back, section.firstChild);
    section.appendChild(front);
    pauseOffscreen(section, [back, front]);
  }

  window.HeroTheme = { autumn: autumn };
})();
