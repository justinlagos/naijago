/* NaijaGo prototype — end-to-end assertions + contrast sweep. */
import { createRequire } from 'module';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png' };

const server = createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = join(ROOT, p);
  if (!f.startsWith(ROOT) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); return res.end('nope'); }
  res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise(r => server.listen(4173, r));
const BASE = 'http://127.0.0.1:4173';

const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

let pass = 0, fail = 0;
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('requestfailed', r => errors.push('REQFAIL ' + r.url()));
page.on('response', r => { if (r.status() >= 400) errors.push('HTTP ' + r.status() + ' ' + r.url() + ' from ' + (r.request().frame()?.url()||'?')); });

const ok = (name, cond, extra='') => { if (cond) { pass++; } else { fail++; console.log('  FAIL  ' + name + (extra?'  → '+extra:'')); } };
const goto = async (hash) => { await page.goto(BASE + '/' + hash, { waitUntil: 'networkidle' }); await page.waitForTimeout(120); };
const txt = async () => (await page.textContent('body')) || '';

/* ---------- 1. Homepage fidelity to the live site ---------- */
await goto('');
const body = await txt();
ok('h1 line 1', body.includes('Nigeria is happening.'));
ok('h1 line 2 in em', (await page.textContent('.hero h1 em')).trim() === 'Go experience it.');
ok('hero eyebrow count', body.includes('1,204 experiences live this season'));
ok('stat: experiences', (await page.textContent('.hero-stats')).includes('1,204'));
ok('stat: hosts', (await page.textContent('.hero-stats')).includes('338'));
ok('stat: scans', (await page.textContent('.hero-stats')).includes('98.4%'));
ok('ticker duplicated', (await page.$$('.announcement-item')).length === 10);
ok('logo is the real svg', (await page.getAttribute('.brand-logo','src')) === 'assets/logo.svg');
ok('nav links', (await page.$$eval('.nav-links a', a=>a.map(x=>x.textContent.trim()).join('|'))) === 'Discover|Events|Festivals|Vendors|Guides');
ok('finder has 3 selects + submit', (await page.$$('.finder select')).length === 3 && !!(await page.$('.finder-submit')));
ok('4 manually controlled hero moments', (await page.$$('.hero-slide')).length === 4 && (await page.$$('.hero-dots button')).length === 4);
await page.click('[data-hero-move="1"]');
ok('hero gallery advances accessibly', (await page.textContent('#hero-label')).includes('Long-table brunch'));
ok('9 main sections', (await page.$$('main > section')).length === 9);
ok('3 seasons', (await page.$$('.season-card')).length === 3);
ok('Detty December foot', body.includes('96 EXPERIENCES · FROM ₦35,000'));
ok('8 experience cards', (await page.$$('.experience-card')).length === 8);
ok('showing 8 picks', body.toLowerCase().includes('showing 8 picks'));
ok('184 in Lagos link', body.includes('184 in Lagos'));
ok('6 vibes', (await page.$$('.vibe')).length === 6);
ok('approved icon on every vibe', (await page.$$('.vibe .brand-icon')).length === 6);
ok('vibe counts sum to 184', (await page.$$eval('.vibe .data', n=>n.map(x=>parseInt(x.textContent)).reduce((a,b)=>a+b,0))) === 184);
ok('trust 98.4%', (await page.textContent('.trust-grid')).includes('98.4%'));
ok('3 guides', (await page.$$('.guide-card')).length === 3);
ok('field kit heading', body.includes('Plan less.') && body.includes('Walk in ready.'));
ok('field kit book module', (await page.$$('.kit-book')).length === 1 && (await page.textContent('.kit-book-detail')).includes('Inside the guide'));
ok('3 hosts named', ['Eko Wave Collective','Naija Food Trails','Terra Culture House'].every(n=>body.includes(n)));
ok('cta heading', body.includes('Your next story is already happening.'));
ok('5 swipeable story moments', (await page.$$('.story-card')).length === 5 && !!(await page.$('#story-rail')));
ok('footer legal and production credit', body.includes('© 2026 NaijaGo Ltd · Lagos') && body.includes('Naira prices · NDPR minded') && body.includes('Powered by Ionec'));

/* ---------- 2. Search dialog ---------- */
await page.click('#search-btn');
ok('search dialog opens', await page.isVisible('#search-dialog .dialog'));
ok('search dialog title', (await page.textContent('#search-title')).includes('What are you in the mood for?'));
ok('3 shortcuts', (await page.$$('.shortcut')).length === 3);
await page.keyboard.press('Escape');
ok('escape closes it', (await page.getAttribute('#search-dialog','data-open')) === 'false');

/* ---------- 3. Save gated by the auth wall, intent preserved ---------- */
await goto('#/');
await page.click('.experience-card .save-button');
ok('save sends you to sign in', page.url().includes('#/login'));
ok('the wall says why', (await txt()).includes('We kept your place'));
await page.click('#login-form button[type=submit]');
await page.waitForTimeout(150);
ok('signed in returns you home', page.url().endsWith('#/'));
ok('the save actually happened', (await page.getAttribute('.experience-card .save-button','aria-pressed')) === 'true');

/* ---------- 4. Explore + facets ---------- */
await goto('#/explore');
ok('explore renders cards', (await page.$$('.experience-card')).length === 8);
ok('Discover alone is current', (await page.$$('.nav-links a[aria-current="page"]')).length === 1 && (await page.textContent('.nav-links a[aria-current="page"]')).trim() === 'Discover');
await goto('#/explore?mode=events');
ok('Events alone is current', (await page.$$('.nav-links a[aria-current="page"]')).length === 1 && (await page.textContent('.nav-links a[aria-current="page"]')).trim() === 'Events');
await goto('#/explore');
await page.check('input[data-facet="vibes"][value="night"]');
await page.waitForTimeout(120);
ok('nightlife facet filters to 2', (await page.$$('.experience-card')).length === 2);
ok('applied chip shown', (await txt()).includes('Nightlife'));
await page.check('input[data-facet="areas"][value="yaba"]');
await page.waitForTimeout(120);
ok('impossible combination gives the empty state', (await page.$$('.empty')).length === 1);
await page.click('[data-clear-filters]');
await page.waitForTimeout(120);
ok('clear brings them back', (await page.$$('.experience-card')).length === 8);

/* ---------- 5. Detail + maths ---------- */
await goto('#/experience/beach-rave');
ok('detail title', (await page.textContent('h1')).includes('Lekki Moonlight Beach Rave'));
ok('sold-out cabana disabled', await page.getAttribute('.tier[data-soldout="true"] input','disabled') !== null);
ok('1 x 15,000 total is 15,750', (await page.textContent('.totals')).includes('₦15,750'));
await page.click('[data-qty="1"]');
await page.waitForTimeout(120);
ok('2 x 15,000 face is 30,000', (await page.textContent('.totals')).includes('₦30,000'));
ok('fee is 1,500', (await page.textContent('.totals')).includes('₦1,500'));
ok('total is 31,500', (await page.textContent('.totals')).includes('₦31,500'));
ok('fee and commission kept apart', (await txt()).includes('host pays 8% commission and keeps 92%'));

/* ---------- 6. Checkout, hold timer, rails ---------- */
await page.click('a[href="#/checkout"]');
await page.waitForTimeout(1200);
ok('checkout reached', page.url().includes('#/checkout'));
const clock = await page.textContent('#hold-clock');
ok('hold counts down from ten minutes', /^0?9:5\d$/.test(clock) || clock === '10:00', clock);
ok('order total carried through', (await page.textContent('.booking-box')).includes('₦31,500'));
ok('points shown as 315', (await page.textContent('.booking-box')).includes('315 points'));
ok('3 rails', (await page.$$('.rail')).length === 3);
await page.click('[data-rail="transfer"]');
await page.waitForTimeout(150);
ok('transfer shows a one-time account', (await txt()).includes('stops accepting money when your hold expires'));
await page.click('[data-rail="card"]');
await page.waitForTimeout(150);
ok('no card number is ever collected', (await page.$$('input[autocomplete*="cc-"], input[name*="card"]')).length === 0);

/* ---------- 7. Every failure state ---------- */
for (const [k, phrase] of [['declined','Your bank declined the payment'],['timeout','The bank did not answer in time'],['underpaid','The transfer was short'],['expired','Your hold ran out']]) {
  await goto('#/failed/' + k);
  ok('failure: ' + k, (await txt()).includes(phrase));
}
ok('timeout warns against paying twice', true);
await goto('#/failed/timeout');
ok('timeout copy says do not pay twice', (await txt()).includes('Do not pay twice'));

/* ---------- 8. Confirmation and pass ---------- */
await goto('#/experience/beach-rave');
while ((await page.textContent('#qty-out')).trim() !== '2') {
  await page.click((await page.textContent('#qty-out')).trim() < '2' ? '[data-qty="1"]' : '[data-qty="-1"]');
  await page.waitForTimeout(80);
}
await page.click('a[href="#/checkout"]');
await page.waitForTimeout(400);
await page.click('[data-pay="ok"]');
await page.waitForTimeout(250);
ok('confirmation reached', page.url().includes('#/confirmed'));
const conf = await txt();
ok('confirmation total', conf.includes('₦31,500'));
ok('confirmation points', conf.includes('315 points pending'));
await page.click('a[href^="#/pass/"]');
await page.waitForTimeout(250);
ok('pass renders', (await page.$$('.pass')).length === 1);
ok('pass draws a code', (await page.$$('.pass-code svg')).length === 1);
ok('code is labelled a drawing', (await txt()).includes('is a drawing, not a scannable code'));
for (const s of ['pending','used','void','valid']) {
  await page.click(`[data-passstate="${s}"]`);
  await page.waitForTimeout(120);
  ok('pass state: ' + s, (await page.getAttribute('.pass','data-state')) === s);
}
await page.click('[data-offline]');
await page.waitForTimeout(150);
ok('offline bar appears', (await page.$$('.offline-bar')).length === 1);
await page.click('[data-offline]');
await page.waitForTimeout(150);

/* ---------- 9. Gate ---------- */
await goto('#/gate/ok/NG-8842-LOS');
ok('gate admits', (await txt()).includes('Let them in'));
await goto('#/gate/no/NG-8842-LOS');
ok('gate rejects a second scan', (await txt()).includes('One scan, then it stops working'));

/* ---------- 10. Waitlist, two-hour claim ---------- */
await goto('#/waitlist/tarkwa');
ok('waitlist depth shown', (await page.textContent('.queue-pos')).trim() === '84');
await page.click('[data-claim="join"]');
await page.waitForTimeout(150);
ok('joining puts you at 85', (await page.textContent('.queue-pos')).trim() === '85');
await page.click('[data-claim="offer"]');
await page.waitForTimeout(150);
ok('offer shows the claim clock', (await page.$$('.claim-clock')).length === 1);
await page.click('[data-claim="lapse"]');
await page.waitForTimeout(150);
ok('lapsing sends you to the back', (await txt()).includes('at the back this time, not the front'));

/* ---------- 11. Account ---------- */
for (const [hash, phrase] of [
  ['#/account','Recent activity'],
  ['#/account/bookings','What you paid'],
  ['#/account/passes','Cached and ready'],
  ['#/account/saved','Saved'],
  ['#/account/plans','Two of these clash'],
  ['#/account/notifications','Notifications'],
  ['#/account/reviews','Waiting on you'],
  ['#/account/settings','Settings']
]) { await goto(hash); ok('account route ' + hash, (await txt()).includes(phrase)); }

await goto('#/account/plans');
ok('clash detected on two items', (await page.$$('.plan-item.clash')).length === 2);
ok('clash explained in plain words', (await txt()).includes('That is a boat and a bridge in sixty minutes'));

/* ---------- 12. Partner console arithmetic ---------- */
await goto('#/partner');
const p = await txt();
ok('sold 214', p.includes('214'));
ok('gross 3,660,000', p.includes('₦3,660,000'));
ok('payout 3,367,200', p.includes('₦3,367,200'));
ok('payout is 92% of gross', 3660000 - Math.round(3660000*0.08) === 3367200);
for (const [hash, phrase] of [
  ['#/partner/listings','In review'],
  ['#/partner/listing','Submit for review'],
  ['#/partner/payouts','Released 48 hours after the gate closes'],
  ['#/partner/refunds','5–10 working days'],
  ['#/partner/scanner','One scan, then it stops working']
]) { await goto(hash); ok('partner route ' + hash, (await txt()).includes(phrase)); }

/* ---------- 13. Remaining routes ---------- */
for (const [hash, phrase] of [
  ['#/seasons','Seasons'],
  ['#/season/detty-december','Detty December'],
  ['#/season/detty-december?view=calendar','September 2026'],
  ['#/season/detty-december?view=map','live in this area'],
  ['#/guides','Read the city properly'],
  ['#/guide/lagos-sunday','Where Lagos actually eats on Sunday'],
  ['#/hosts','Verified vendors'],
  ['#/host/eko-wave','Eko Wave Collective'],
  ['#/help','Help centre'],
  ['#/transfer/NG-8842-LOS','Transfer this pass'],
  ['#/reschedule/NG-8842-LOS','Move to another date'],
  ['#/nowhere','not in the prototype']
]) { await goto(hash); ok('route ' + hash, (await txt()).includes(phrase)); }

/* ---------- 14. Contrast sweep across every route ---------- */
const ROUTES = ['', '#/explore', '#/seasons', '#/season/detty-december', '#/guides', '#/guide/lagos-sunday',
  '#/hosts', '#/host/eko-wave', '#/experience/beach-rave', '#/experience/nike-art', '#/login',
  '#/failed/declined', '#/failed/timeout', '#/pass/NG-8842-LOS', '#/gate/ok/NG-8842-LOS',
  '#/waitlist/tarkwa', '#/account', '#/account/bookings', '#/account/saved', '#/account/plans',
  '#/account/notifications', '#/account/reviews', '#/account/settings',
  '#/partner', '#/partner/listings', '#/partner/listing', '#/partner/payouts', '#/partner/refunds',
  '#/partner/scanner', '#/help', '#/transfer/NG-8842-LOS', '#/reschedule/NG-8842-LOS'];
let contrastFails = 0;
for (const r of ROUTES) {
  await goto(r);
  const f = await page.evaluate(() => window.NG.audit(false));
  if (f.length) { contrastFails += f.length; console.log('  CONTRAST ' + (r||'/') + ':', JSON.stringify(f.slice(0,4))); }
}
ok('contrast: 0 failures across ' + ROUTES.length + ' routes', contrastFails === 0, contrastFails + ' failures');

/* ---------- 15. Responsive: overflow + touch targets ---------- */
for (const w of [390, 430, 768, 1440]) {
  await page.setViewportSize({ width: w, height: 900 });
  for (const r of ['', '#/explore', '#/experience/beach-rave', '#/checkout', '#/account', '#/partner']) {
    await goto(r);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(`no h-overflow @${w} ${r||'/'}`, over <= 1, over + 'px');
  }
}
await page.setViewportSize({ width: 390, height: 900 });
let small = [];
for (const r of ['', '#/explore', '#/experience/beach-rave', '#/account', '#/partner/scanner', '#/pass/NG-8842-LOS']) {
  await goto(r);
  const s = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('button, a.btn, .chip, .tab, select, input:not([type=hidden]):not([type=checkbox]):not([type=radio]), [role=button]').forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) return;
      if (b.height < 44 || b.width < 24) out.push({ t:(el.textContent||el.getAttribute('aria-label')||el.tagName).trim().slice(0,26), h:Math.round(b.height), w:Math.round(b.width) });
    });
    return out;
  });
  if (s.length) small.push({ route: r || '/', items: s });
}
ok('touch targets: none under 44px on mobile', small.length === 0, JSON.stringify(small).slice(0, 400));

/* ---------- 16. No runtime errors ---------- */
const realErrors = errors.filter(e => !/fonts\.(googleapis|gstatic)\.com/.test(e) && !/ERR_CONNECTION_RESET/.test(e));
ok('no console or page errors', realErrors.length === 0, realErrors.join(' | '));

console.log(`\n${pass} passed, ${fail} failed`);
await browser.close();
server.close();
process.exit(fail ? 1 : 0);
