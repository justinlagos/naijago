/* Create the deploy-safe static output used by Netlify. */
import { cpSync, mkdirSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'dist');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const name of ['index.html', 'assets', 'css', 'js']) {
  cpSync(join(ROOT, name), join(OUT, name), { recursive: true });
}
console.log('built →', OUT);
