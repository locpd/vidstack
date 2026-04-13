import { readFileSync, writeFileSync } from 'node:fs';

const file = 'node_modules/@maverick-js/cli/dist/cli.js';
let content = readFileSync(file, 'utf8');

if (content.includes('pathToFileURL')) {
  console.log('Already patched, skipping.');
  process.exit(0);
}

// Remove cache-busting query string
content = content.replace(
  'return (await import(transpiledFilePath + `?t=${Date.now()}`))?.default ?? [];',
  'const { pathToFileURL } = await import(\'node:url\');\n'+
  '    return (await import(pathToFileURL(transpiledFilePath).href))?.default ?? [];',
);

writeFileSync(file, content, 'utf8');
console.log('Patched @maverick-js/cli successfully.');
