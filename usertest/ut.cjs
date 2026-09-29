#!/usr/bin/env node
/**
 * Simulated user test driver.
 *
 * A persona has to read a page, decide in character, act, then read the result —
 * a loop whose decisions are made by a model BETWEEN the steps, so each step is
 * its own process. A normal Playwright script cannot hold that.
 *
 * So Chrome is launched DETACHED with a debugging port, and every later command
 * reconnects over CDP, acts, and disconnects. The page, localStorage, an open
 * modal and a half-typed counter-offer all survive between commands because no
 * command ever owned the browser.
 *
 * Cost note, because it shapes the whole API: the expensive thing is the NUMBER
 * of commands, not the size of any one — every result stays in the runner's
 * context for the rest of the run, so call 90 pays for calls 1-89 again. Hence
 * `state` (compact, structured) rather than dumping innerText, and `do` (a whole
 * step in one call) rather than one call per field.
 *
 *   node ut.cjs start p1 9301 desktop "http://localhost:8080/index.html?mode=test"
 *   node ut.cjs state p1
 *   node ut.cjs do    p1 '[{"fill":"#price-expectation","value":"29900"},{"click":"text=Jatka"}]'
 *   node ut.cjs seed  p1 draft-complete --no-price
 *   node ut.cjs event p1 new-offers
 *   node ut.cjs shot  p1 <dir> 07_decision.png
 *   node ut.cjs stop  p1
 */
const { chromium } = require('playwright');
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');          // the prototype itself
const HOME = path.join(__dirname, '.run');           // profiles + session files
const CHROME = process.env.UT_CHROME ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36';

const [, , cmd, session, ...rest] = process.argv;
const statePath = (s) => path.join(HOME, 'sessions', s + '.json');
const readSession = (s) => JSON.parse(fs.readFileSync(statePath(s), 'utf8'));

/* The prototype must be served over HTTP — file:// breaks Google Fonts and the
   scenario params. A run that starts against a dead server fails page by page in
   ways that read as product bugs, so this is a precondition, not a step someone
   remembers. */
function ensureServer(url) {
  const m = /^https?:\/\/(?:localhost|127\.0\.0\.1):(\d+)/.exec(url || '');
  if (!m) return;
  const port = m[1];
  const up = () => {
    try { execSync(`curl -sf -o /dev/null http://127.0.0.1:${port}/index.html`); return true; }
    catch (e) { return false; }
  };
  if (up()) return;
  spawn('python3', ['-m', 'http.server', port, '--directory', ROOT],
    { detached: true, stdio: 'ignore' }).unref();
  for (let i = 0; i < 20; i++) {
    if (up()) { console.log('started a static server on :' + port); return; }
    execSync('sleep 0.5');
  }
  throw new Error('could not start a static server on :' + port);
}

/* A crashed run leaves Chrome holding the port; the next start would attach to
   the dead run's profile and inherit its localStorage, so a "first-time
   visitor" would arrive mid-funnel. */
function killStale(port) {
  try { execSync(`pkill -f 'remote-debugging-port=${port}' 2>/dev/null`); execSync('sleep 1'); }
  catch (e) {}
}

async function attach(s) {
  const st = readSession(s);
  const browser = await chromium.connectOverCDP('http://127.0.0.1:' + st.cdp);
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find((p) => !p.url().startsWith('chrome://')) || ctx.pages()[0];
  await page.bringToFront().catch(() => {});
  /* macOS Chrome refuses a window narrower than ~500px, so a phone viewport can
     only come from a metrics override — and CDP reverts overrides when the
     session detaches, which is every command here. Re-applied on each attach. */
  if (st.device === 'mobile') {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setDeviceMetricsOverride',
      { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await page.waitForTimeout(120);
  }
  return { browser, page, st };
}

/* Compact, structured page state. This is the single biggest cost lever in the
   harness: a full innerText dump is mostly nav, FAQ and footer the persona has
   already read, and it is re-paid on every later call because it never leaves
   the context. */
const STATE_FN = (maxText) => `(() => {
  const vis = (e) => { const r = e.getBoundingClientRect();
    return r.width > 1 && r.height > 1 && getComputedStyle(e).visibility !== 'hidden'; };
  const t = (e) => (e.innerText || e.textContent || '').trim().replace(/\\s+/g, ' ');
  const out = [];
  out.push('URL ' + location.pathname + location.search);
  document.querySelectorAll('h1,h2,h3').forEach((h) => {
    if (vis(h) && t(h)) out.push(h.tagName + ': ' + t(h).slice(0, 90));
  });
  const seen = new Set();
  document.querySelectorAll('button,a[href],[role=button]').forEach((b) => {
    if (!vis(b)) return;
    const label = (t(b) || b.getAttribute('aria-label') || '').slice(0, 60);
    if (!label || seen.has(label)) return;
    seen.add(label);
    out.push('[' + (b.disabled ? 'btn-disabled' : 'btn') + '] ' + label);
  });
  document.querySelectorAll('input,select,textarea').forEach((f) => {
    if (!vis(f) || f.type === 'hidden') return;
    const id = f.id ? '#' + f.id : (f.name ? '[name=' + f.name + ']' : f.tagName.toLowerCase());
    if (f.type === 'radio' || f.type === 'checkbox') {
      out.push('[' + f.type + '] ' + id + ' value=' + (f.value || '').slice(0, 30) +
        (f.checked ? ' CHECKED' : ''));
    } else {
      out.push('[field] ' + id + (f.placeholder ? ' ph="' + f.placeholder.slice(0, 40) + '"' : '') +
        ' value="' + (f.value || '').slice(0, 40) + '"' + (f.required ? ' required' : ''));
    }
  });
  const main = document.querySelector('main') || document.body;
  const clone = main.cloneNode(true);
  clone.querySelectorAll('nav,footer,script,style,#proto-bar,header').forEach((n) => n.remove());
  const body = (clone.innerText || '').split('\\n').map((l) => l.trim()).filter(Boolean).join('\\n');
  out.push('--- text ---');
  out.push(body.slice(0, ${maxText}));
  return out.join('\\n');
})()`;

/* One step, one call. Filling a funnel step used to cost four or five commands;
   the content of those steps is mechanical and is never the finding. */
async function runSteps(page, steps) {
  const log = [];
  for (const s of steps) {
    if (s.goto)    { await page.goto(s.goto, { waitUntil: 'domcontentloaded' }); log.push('goto ' + s.goto); }
    if (s.fill)    { await page.locator(s.fill).first().fill(String(s.value ?? '')); log.push('fill ' + s.fill); }
    if (s.type)    { await page.locator(s.type).first().pressSequentially(String(s.value ?? ''), { delay: 60 }); log.push('type ' + s.type); }
    if (s.click)   { await page.locator(s.click).first().click({ timeout: 8000 }); log.push('click ' + s.click); }
    if (s.check)   { await page.locator(s.check).first().check({ force: true }); log.push('check ' + s.check); }
    if (s.select)  { await page.locator(s.select).first().selectOption(String(s.value)); log.push('select ' + s.select); }
    if (s.press)   { await page.keyboard.press(s.press); log.push('press ' + s.press); }
    if (s.scroll)  { await page.mouse.wheel(0, Number(s.scroll)); log.push('scroll ' + s.scroll); }
    if (s.eval)    { log.push('eval → ' + JSON.stringify(await page.evaluate(s.eval)).slice(0, 200)); }
    if (s.wait)    { await page.waitForTimeout(Number(s.wait)); }
    else           { await page.waitForTimeout(400); }
  }
  return log;
}

/* World events simulate the BACKEND, never the seller, and they are
   deterministic — no model in the loop. Dealer responses go through the page's
   own action closures: the underlying function is declared inside decision.html's
   IIFE and is unreachable from page.evaluate, but `window.protoPage.actions`
   holds the same closures and works in test mode too. */
const EVENTS = {
  'photos-filled':  { goto: 'photos.html?scenario=filled' },
  'auction-live':   { goto: 'offers.html?scenario=auction-live' },
  'new-offers':     { goto: 'offers.html?scenario=new-offers' },
  'dealer-reply':   { action: 0 },
  'dealer-close':   { action: 1 },
  'dealer-close-silent': { action: 2 },
  'auto-close':     { action: 3 },
  'reset-negotiation': { action: 4 },
};

async function main() {
  if (cmd === 'start') {
    // start <session> <cdpPort> <desktop|mobile> <url> [winX] [winY]
    const [cdp, device, url, wx = '40', wy = '40'] = rest;
    ensureServer(url);
    killStale(cdp);
    const prof = path.join(HOME, 'profiles', session);
    fs.mkdirSync(path.join(HOME, 'sessions'), { recursive: true });
    fs.rmSync(prof, { recursive: true, force: true });
    fs.mkdirSync(prof, { recursive: true });
    const args = [
      '--remote-debugging-port=' + cdp, '--user-data-dir=' + prof,
      '--no-first-run', '--no-default-browser-check', '--disable-session-crashed-bubble',
      '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding',
      '--disable-features=Translate,MediaRouter',
      '--window-size=' + (device === 'mobile' ? '390,930' : '1440,980'),
      '--window-position=' + wx + ',' + wy, url,
    ];
    if (device === 'mobile') args.push('--user-agent=' + MOBILE_UA, '--touch-events=enabled');
    spawn(CHROME, args, { detached: true, stdio: 'ignore' }).unref();
    fs.writeFileSync(statePath(session),
      JSON.stringify({ cdp: Number(cdp), device, prof, started: new Date().toISOString() }, null, 2));
    for (let i = 0; i < 40; i++) {
      try { execSync('curl -sf http://127.0.0.1:' + cdp + '/json/version >/dev/null'); break; }
      catch (e) { execSync('sleep 0.5'); }
    }
    const { page } = await attach(session);
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    const vp = await page.evaluate(() => ({ w: innerWidth, h: innerHeight }));
    console.log(`started ${session} cdp=${cdp} ${vp.w}x${vp.h} ${page.url()}`);
    process.exit(0);
  }

  if (cmd === 'stop') {
    try { execSync(`pkill -f 'remote-debugging-port=${readSession(session).cdp}'`); } catch (e) {}
    console.log('stopped ' + session);
    process.exit(0);
  }

  const { browser, page } = await attach(session);
  try {
    if (cmd === 'state') {
      console.log(await page.evaluate(STATE_FN(Number(rest[0] || 1200))));

    } else if (cmd === 'text') {                      // escape hatch: raw, capped
      const t = await page.evaluate(() => document.body.innerText.replace(/\n{3,}/g, '\n\n'));
      console.log('URL ' + page.url() + '\n---\n' + t.slice(0, Number(rest[0] || 3000)));

    } else if (cmd === 'do') {
      const steps = JSON.parse(rest[0]);
      const log = await runSteps(page, Array.isArray(steps) ? steps : [steps]);
      console.log(log.join('\n') + '\n--- state ---\n' +
        await page.evaluate(STATE_FN(Number(rest[1] || 900))));

    } else if (cmd === 'goto') {
      await page.goto(rest[0], { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(700);
      console.log('at ' + page.url());

    } else if (cmd === 'seed') {
      /* Deterministic funnel state, so a test aimed at one surface can skip the
         steps before it. --no-price clears the seller's own figure, which is the
         counter-offer ceiling: leave it out and the persona sets it themselves. */
      const stateName = rest[0] || 'draft-complete';
      const noPrice = rest.includes('--no-price');
      const res = await page.evaluate(([name, clear]) => {
        if (!window.PROTO_MOCK) return 'PROTO_MOCK missing — is this a proto page?';
        window.PROTO_MOCK.seed(name);
        const f = JSON.parse(localStorage.getItem('autovex_funnel') || '{}');
        if (clear) { delete f.priceExpectation; delete f.priceVisited;
          localStorage.setItem('autovex_funnel', JSON.stringify(f)); }
        return name + ' · ' + ((f.details || {}).merkki || '?') + ' ' + ((f.details || {}).malli || '') +
          ' · ' + ((f.hero || {}).km || '?') + ' km · reviewable=' + f.reviewable +
          ' · price=' + (clear ? '(cleared)' : f.priceExpectation || '(none)');
      }, [stateName, noPrice]);
      console.log(res);

    } else if (cmd === 'event') {
      const ev = EVENTS[rest[0]];
      if (!ev) { console.error('unknown event. known: ' + Object.keys(EVENTS).join(', ')); process.exitCode = 2; }
      else if (ev.goto) {
        const u = new URL(page.url()); const target = new URL(ev.goto, u.origin);
        ['mode', 'informed-decision', 'enhanced-negotiations'].forEach((k) => {
          if (u.searchParams.get(k)) target.searchParams.set(k, u.searchParams.get(k));
        });
        await page.goto(target.toString(), { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(800);
        console.log('event ' + rest[0] + ' → ' + page.url());
      } else {
        const r = await page.evaluate((i) => {
          if (!window.protoPage || !window.protoPage.actions) return 'no protoPage.actions here';
          window.protoPage.actions[i].run();
          return 'ran: ' + window.protoPage.actions[i].label;
        }, ev.action);
        await page.waitForTimeout(600);
        console.log('event ' + rest[0] + ' → ' + r);
      }

    } else if (cmd === 'shot') {
      const [dir, name, full] = rest;
      fs.mkdirSync(dir, { recursive: true });
      await page.screenshot({ path: path.join(dir, name), fullPage: full === 'full' });
      console.log('saved ' + name);

    } else if (cmd === 'say') {
      await page.evaluate((msg) => {
        let b = document.getElementById('__ut-banner');
        if (!b) {
          b = document.createElement('div');
          b.id = '__ut-banner';
          b.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:2147483647;background:#111;' +
            'color:#0f0;font:12px/1.4 ui-monospace,monospace;padding:6px 10px;white-space:pre-wrap;' +
            'pointer-events:none;opacity:.92';
          document.documentElement.appendChild(b);
        }
        b.textContent = msg;
      }, rest.join(' '));
      console.log('banner set');

    } else if (cmd === 'run') {
      const fn = require(path.resolve(rest[0]));
      const out = await fn(page, page.context());
      console.log(typeof out === 'string' ? out : JSON.stringify(out, null, 2));

    } else {
      console.error('commands: start|stop|state|text|do|goto|seed|event|shot|say|run');
      process.exitCode = 2;
    }
  } finally {
    await browser.close().catch(() => {});   // detaches CDP; Chrome keeps running
  }
}

main().catch((e) => { console.error('ERR ' + e.message); process.exit(1); });
