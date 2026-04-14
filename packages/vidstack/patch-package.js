import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIST = 'src';

const pkgPath = join(DIST, '..', 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const SCOPED = pkg.name;
console.log(SCOPED);

// Patch any internal self-references in JS files
function patchDir(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      patchDir(full);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.d.ts')) {
      const before = readFileSync(full, 'utf8');
      // Only replace bare 'vidstack' and 'vidstack/...' imports, not substrings
      const after = before.replace(
        /([`'"])vidstack(\/[^`'"]*)?([`'"])/g,
        (_, q1, path, q2) => `${q1}${SCOPED}${path ?? ''}${q2}`,
      );
      if (before !== after) writeFileSync(full, after);
    }
  }
}
patchDir(DIST);
console.log('Patched internal self-references');
