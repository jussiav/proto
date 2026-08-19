/**
 * Simulated user test — full seller journey. Spec: USERTEST.md (spec wins on conflict).
 * Run:  NODE_PATH=<repo>/node_modules node usertest.cjs
 * Headed by default (project rule). Human pacing: slowMo, typing delays, scroll, idle waits.
 */
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = 8123;
const TYPES = { html: 'text/html', js: 'text/javascript', css: 'text/css', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', json: 'application/json' };

const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  try {
    const data = fs.readFileSync(p);
    res.setHeader('Content-Type', TYPES[path.extname(p).slice(1)] || 'application/octet-stream');
    res.end(data);
  } catch (e) { res.statusCode = 404; res.end('not found'); }
});

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rndInt = (min, max) => Math.floor(min + Math.random() * (max - min));

async function banner(page, label) {
  console.log('▶ ' + label);
  await page.evaluate((l) => {
    let b = document.getElementById('__ut-banner');
    if (!b) {
      b = document.createElement('div');
      b.id = '__ut-banner';
      b.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#0B6DFF;color:#fff;font:600 15px monospace;padding:7px 16px;text-align:center;pointer-events:none';
      document.body.appendChild(b);
    }
    b.textContent = 'USER TEST — ' + l;
  }, label).catch(() => {});
}

async function humanScroll(page, ms) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    await page.mouse.wheel(0, rndInt(120, 420));
    await page.waitForTimeout(rndInt(350, 800));
    if (Math.random() < 0.25) { await page.mouse.wheel(0, -rndInt(80, 200)); await page.waitForTimeout(300); }
  }
}

(async () => {
  await new Promise((r) => server.listen(PORT, r));
  const browser = await chromium.launch({ channel: 'chrome', headless: false, slowMo: 120 });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const B = `http://localhost:${PORT}`;
  let step = 'init';

  try {
    // ── 1. Front page: look around ~10 s, then start ─────────────────────
    step = '1 Etusivu';
    await page.goto(`${B}/index.html`);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await banner(page, '1/10 Etusivu — käyttäjä katselee sivua');
    await page.waitForTimeout(3000);
    await humanScroll(page, 5000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    const plate = rnd(['KLM-241', 'JTP-88', 'BOT-423', 'XRV-512']);
    const km = String(rndInt(40, 190) * 1000);
    await page.locator('#plate').pressSequentially(plate, { delay: 110 });
    await page.locator('#mileage').pressSequentially(km, { delay: 90 });
    await page.getByRole('button', { name: 'Hae auton tiedot' }).click();
    await page.waitForURL(/details\.html/);

    // ── 2. Funnel: car details ────────────────────────────────────────────
    step = '2 Tiedot';
    await banner(page, '2/10 Tiedot — satunnaiset autotiedot');
    await page.waitForTimeout(1500);
    await page.locator('#sijainti').pressSequentially(String(rndInt(10, 99)) + '100', { delay: 90 });
    for (const group of ['kesarenkaat', 'kesavanteet', 'talvirenkaat', 'talvivanteet', 'avaimet']) {
      const radios = page.locator(`input[name="${group}"]`);
      await radios.nth(rndInt(0, await radios.count())).check({ force: true });
      await page.waitForTimeout(250);
    }
    await humanScroll(page, 2000);
    await page.locator('#details-cta').click();
    await page.waitForURL(/services\.html/);

    step = '2b Huollot';
    await banner(page, '2/10 Huollot — huoltohistoria ja kunto');
    await page.waitForTimeout(1200);
    const pick = async (groupIdx, texts) => {
      const g = page.locator('.radio-group').nth(groupIdx);
      await g.locator('.radio-btn', { hasText: rnd(texts) }).first().click();
      await page.waitForTimeout(300);
    };
    await pick(0, ['Paperinen huoltokirja', 'En tiedä']); // avoids Tiedot fetch branch
    await pick(1, ['Täydellinen merkkiliikkeen historia', 'Osittainen']);
    await pick(2, ['Viimeisen 6 kuukauden aikana']);
    const tuulilasi = rnd(['Ehjä', 'Kiveniskemiä']);
    await pick(3, [tuulilasi]);
    if (tuulilasi !== 'Ehjä') await pick(4, ['Kyllä', 'Ei', 'En tiedä']);
    await page.locator('#korjaukset').pressSequentially(rnd(['Ei tiedossa olevia vikoja.', 'Pieni naarmu takapuskurissa.']), { delay: 40 });
    await humanScroll(page, 1500);
    await page.locator('#services-cta').click();
    await page.waitForURL(/photos\.html/);

    // ── 3. Photos: wait 5 s, then trigger "filled" via the page's own panel ─
    step = '3 Kuvat';
    await banner(page, '3/10 Kuvat — 5 s, sitten skenaario "filled"');
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Scenario' }).click();
    await page.getByRole('link', { name: 'Photos filled' }).click();
    await banner(page, '3/10 Kuvat — täytetään automaattisesti…');
    await page.waitForFunction(() => window.photosReady && photosReady(), null, { timeout: 90000 });
    await page.waitForTimeout(1500);
    await humanScroll(page, 2500);
    await page.locator('#cta-btn').click();
    await page.waitForURL(/price\.html/);

    // ── 4. Price: enter a value or skip — user's coin flip ───────────────
    step = '4 Hinta';
    const givesPrice = Math.random() < 0.5;
    await banner(page, `4/10 Hinta — ${givesPrice ? 'antaa arvion' : 'jättää tyhjäksi'}`);
    await page.waitForTimeout(2500);
    if (givesPrice) {
      await page.locator('#price-expectation').pressSequentially(String(rndInt(50, 250) * 100), { delay: 100 });
    }
    await page.getByRole('button', { name: 'Jatka' }).click();
    await page.waitForURL(/contact\.html/);

    // ── 5. Contact: mock details + terms ─────────────────────────────────
    step = '5 Yhteystiedot';
    await banner(page, '5/10 Yhteystiedot — mock-tiedot + ehdot');
    await page.waitForTimeout(1500);
    await page.locator('#koko-nimi').pressSequentially(rnd(['Testi Testinen', 'Maija Mallikas', 'Kalle Kokeilija']), { delay: 70 });
    await page.locator('#puhelin').pressSequentially('+35840' + rndInt(1000000, 9999999), { delay: 50 });
    await page.locator('#sahkoposti').pressSequentially('testi' + rndInt(10, 99) + '@example.fi', { delay: 60 });
    await page.locator('#kayttoehdot').check({ force: true });
    await page.getByRole('button', { name: 'Lähetä tarkastukseen' }).click();
    await page.waitForURL(/success\.html/);

    // ── 6. Email verification via the provided email + its link ──────────
    step = '6 Sähköpostivahvistus';
    await banner(page, '6/10 Sähköposti — avaa viesti ja vahvistaa');
    const toast = page.locator('#email-toast-view');
    try {
      await toast.waitFor({ state: 'visible', timeout: 15000 });
      await page.waitForTimeout(1200);
      await toast.click();
    } catch (e) {
      await page.evaluate(() => window.muwOpenVerifyFrame()); // fallback: open the same email preview
    }
    const mail = page.frameLocator('#muw-iframe');
    await mail.locator('#muw-verify-cta').click({ timeout: 15000 }); // "Vahvista sähköposti tästä"
    await page.locator('#success-offers-btn').waitFor({ state: 'visible', timeout: 15000 });

    // ── 7. Success → view the tarjouspyyntö ───────────────────────────────
    step = '7 Success';
    await banner(page, '7/10 Vahvistettu — siirtyy tarjouspyyntöön');
    await page.waitForTimeout(2500);
    await page.locator('#success-offers-btn').click();
    await page.waitForURL(/offers\.html/);

    // ── 8. Offers: 5 s → auction-live → scroll 5 s → new-offers → scroll ──
    step = '8 Tarjoukseni';
    await banner(page, '8/10 Tarjoukseni — huutokauppa käynnissä');
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Scenario' }).click();
    await page.getByRole('link', { name: 'Live, 2 bids' }).click(); // scenario: auction-live
    await page.waitForURL(/scenario=auction-live/);
    await banner(page, '8/10 Tarjoukseni — auction-live, käyttäjä selaa');
    await humanScroll(page, 5000);
    await page.getByRole('button', { name: 'Scenario' }).click();
    await page.getByRole('link', { name: 'Ended, new offers' }).click(); // scenario: new-offers
    await page.waitForURL(/scenario=new-offers/);
    await banner(page, '8/10 Tarjoukseni — uudet tarjoukset, käyttäjä selaa');
    await humanScroll(page, 5000);
    await page.getByRole('link', { name: 'Näytä tarjouskaupan tulokset' }).first().click();
    await page.waitForURL(/decision\.html/);

    // ── 9. Decision: warm-up → counter → dealer reply → counter+msg → accept ─
    step = '9 Tarjouspäätös';
    await banner(page, '9/10 Päätössivu — tulosten paljastus');
    const reveal = page.getByRole('button', { name: 'Katso tulokset' });
    if (await reveal.isVisible().catch(() => false)) { await page.waitForTimeout(1500); await reveal.click(); }
    await banner(page, '9/10 Päätössivu — käyttäjä tutkii tarjouksia');
    await humanScroll(page, 5000);

    // first counter offer (amount only)
    const highest = await page.evaluate(() => {
      const m = document.body.innerText.match(/(\d[\d\s  ]*)€/);
      return m ? parseInt(m[1].replace(/\D/g, ''), 10) : 12000;
    });
    await page.getByRole('button', { name: 'Tee vastatarjous' }).first().click();
    await banner(page, '9/10 Vastatarjous #1');
    await page.locator('#modal-neg-amount').fill(String(highest + rndInt(3, 9) * 100));
    await page.locator('#modal-btn-send-neg').click();
    await page.waitForTimeout(1500);
    await page.keyboard.press('Escape'); // close "waiting for dealer" view, user browses on

    await banner(page, '9/10 Odottaa liikkeen vastausta…');
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Scenario' }).click();
    await page.getByRole('button', { name: 'Simulate dealer reply' }).click(); // opens the reply modal

    // second counter offer (amount + message)
    await banner(page, '9/10 Vastatarjous #2 + viesti');
    await page.waitForTimeout(2000);
    await page.locator('#modal-neg-amount').fill(String(highest + rndInt(1, 4) * 100));
    const msg = page.locator('#modal-neg-message');
    if (await msg.count()) await msg.fill('Auto on erittäin hyvässä kunnossa, huollot tehty ajallaan.');
    await page.locator('#modal-btn-send-neg').click();
    await page.waitForTimeout(1500);
    await page.keyboard.press('Escape');

    await banner(page, '9/10 Odottaa liikkeen vastausta…');
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Scenario' }).click();
    await page.getByRole('button', { name: 'Simulate dealer reply' }).click();

    // accept from the negotiation modal → confirm in accept modal
    await banner(page, '9/10 Hyväksyy tarjouksen');
    await page.waitForTimeout(2000);
    await page.locator('#modal-btn-accept-from-neg').click();
    await page.locator('#modal-btn-accept').click();
    await page.waitForURL(/scenario=accepted/, { timeout: 15000 });

    // ── 10. End state ─────────────────────────────────────────────────────
    step = '10 Hyväksytty';
    await banner(page, '10/10 TARJOUS HYVÄKSYTTY ✓ — testi läpi');
    await page.waitForTimeout(6000);
    console.log('\nUSER TEST PASSED — all 10 journey steps completed.');
  } catch (err) {
    console.error(`\nUSER TEST FAILED at step "${step}": ${err.message}`);
    const shot = path.join(__dirname, 'usertest-failure.png');
    await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
    console.error('Screenshot: ' + shot + ' — browser stays open 30 s for inspection.');
    await banner(page, 'FAILED @ ' + step);
    await page.waitForTimeout(30000);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
})();
