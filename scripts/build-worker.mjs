import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const distRoot = join(projectRoot, 'dist');
const clientRoot = join(distRoot, 'client');
const serverRoot = join(distRoot, 'server');
const hostingRoot = join(distRoot, '.openai');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    files.push(...(entry.isDirectory() ? await collectFiles(path) : [path]));
  }
  return files;
}

const assets = {};
for (const file of await collectFiles(clientRoot)) {
  const urlPath = `/${relative(clientRoot, file).split(sep).join('/')}`;
  const contents = await readFile(file);
  assets[urlPath] = {
    contentType: contentTypes[extname(file).toLowerCase()] || 'application/octet-stream',
    base64: contents.toString('base64'),
  };
}

const workerTemplate = await readFile(join(projectRoot, 'worker', 'index.js'), 'utf8');
const workerOutput = workerTemplate.replace('__STATIC_ASSETS__', JSON.stringify(assets));
if (workerOutput === workerTemplate) {
  throw new Error('Static asset placeholder was not found in worker/index.js');
}

await rm(serverRoot, { recursive: true, force: true });
await mkdir(serverRoot, { recursive: true });
await mkdir(hostingRoot, { recursive: true });
await writeFile(join(serverRoot, 'index.js'), workerOutput);
await writeFile(
  join(hostingRoot, 'hosting.json'),
  await readFile(join(projectRoot, '.openai', 'hosting.json')),
);

console.log(`Bundled ${Object.keys(assets).length} client assets into dist/server/index.js`);
