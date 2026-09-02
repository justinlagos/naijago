/* Inline every stylesheet, script and image into one self-contained file. */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = process.argv[2] || join(ROOT, 'naijago-prototype.html');

let html = readFileSync(join(ROOT, 'index.html'), 'utf8');

/* --- images and logo as data URIs ---------------------------------------- */
const data = {};
for (const f of readdirSync(join(ROOT, 'assets/img'))) {
  data['assets/img/' + f] = 'data:image/jpeg;base64,' + readFileSync(join(ROOT, 'assets/img', f)).toString('base64');
}
const logo = 'data:image/svg+xml;base64,' + readFileSync(join(ROOT, 'assets/logo.svg')).toString('base64');
data['assets/logo.svg'] = logo;

/* --- CSS ------------------------------------------------------------------ */
let css = '';
for (const m of html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)) {
  const file = m[1].split('?')[0];
  css += '\n/* ===== ' + file + ' ===== */\n' + readFileSync(join(ROOT, file), 'utf8');
}
html = html.replace(/<link rel="stylesheet" href="[^"]+">\n?/g, '');
html = html.replace('</head>', () => '<style>' + css + '</style>\n</head>');  // function form: $$ in content is literal

/* --- JS ------------------------------------------------------------------- */
let js = '';
for (const m of html.matchAll(/<script src="([^"]+)"><\/script>/g)) {
  const file = m[1].split('?')[0];
  js += '\n/* ===== ' + file + ' ===== */\n' + readFileSync(join(ROOT, file), 'utf8');
}
html = html.replace(/<script src="[^"]+"><\/script>\n?/g, '');
html = html.replace('</body>', () => '<script>' + js + '<\/script>\n</body>');  // function form: $$ in content is literal

/* --- swap every asset reference for its data URI -------------------------- */
let swapped = 0;
for (const [path, uri] of Object.entries(data)) {
  const before = html.length;
  // the data layer holds bare filenames; NG.img() prefixes them
  const bare = path.replace('assets/img/', '');
  html = html.split("'" + bare + "'").join("'" + uri + "'");
  html = html.split('url(' + path + ')').join('url(' + uri + ')');
  html = html.split('"' + path + '"').join('"' + uri + '"');
  if (html.length !== before) swapped++;
}
/* NG.img() must now pass names through untouched */
html = html.replace("NG.img = function (name) { return 'assets/img/' + name; };",
                    () => "NG.img = function (name) { return name; };  /* bundled: names are already data URIs */");
/* the webfont cannot be inlined; keep the link but the fallback stack carries it */

writeFileSync(OUT, html);
console.log('bundled →', OUT);
console.log('  assets inlined:', swapped, '/', Object.keys(data).length);
console.log('  size:', (html.length / 1048576).toFixed(2), 'MB');
console.log('  remaining relative refs:', (html.match(/(?:src|href)="(?!#|https?:|data:)/g) || []).length);
