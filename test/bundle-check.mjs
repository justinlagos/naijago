import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUNDLE = process.argv[2] || join(ROOT, 'naijago-prototype.html');
const b = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_PATH ? { executablePath:process.env.PLAYWRIGHT_CHROMIUM_PATH } : {});
const page = await b.newPage({ viewport:{width:1440,height:1000} });
const errs=[]; page.on('pageerror',e=>errs.push(String(e)));
page.on('console',m=>{if(m.type()==='error'&&!/fonts\.|ERR_/.test(m.text()))errs.push(m.text())});
await page.goto(pathToFileURL(BUNDLE).href);
await page.waitForTimeout(800);
const r = await page.evaluate(()=>({
  sections: document.querySelectorAll('main > section').length,
  cards: document.querySelectorAll('.experience-card').length,
  imgsOk: Array.from(document.querySelectorAll('.card-media')).filter(e=>getComputedStyle(e).backgroundImage.startsWith('url("data:')).length,
  logoOk: document.querySelector('.brand-logo').src.startsWith('data:image/svg'),
  ticker: document.querySelectorAll('.announcement-item').length,
  contrast: window.NG.audit(false).length
}));
console.log(JSON.stringify(r));
// walk a full booking in the bundle
await page.evaluate(()=>{location.hash='#/experience/beach-rave'});
await page.waitForTimeout(300);
await page.click('a[href="#/checkout"]'); await page.waitForTimeout(300);
await page.click('#login-form button[type=submit]'); await page.waitForTimeout(600);
await page.click('[data-pay="ok"]'); await page.waitForTimeout(300);
const conf = await page.textContent('body');
console.log('booking completes in bundle:', conf.includes('You are going.') && conf.includes('₦15,750'));
await page.screenshot({path:'/tmp/bundle-check.png'});
console.log('errors:', errs.length ? errs.slice(0,3) : 'none');
await b.close();
