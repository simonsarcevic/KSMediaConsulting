import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const api = spawn(process.execPath, ['scripts/dev-api.mjs'], { stdio: 'inherit' });
const client = spawn(
  process.execPath,
  [
    resolve('node_modules/@angular/cli/bin/ng.js'),
    'serve',
    '--proxy-config',
    'proxy.conf.json',
    ...process.argv.slice(2),
  ],
  { stdio: 'inherit' },
);

let stopping = false;
function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  api.kill();
  client.kill();
  process.exitCode = exitCode;
}

api.on('exit', (code, signal) => {
  if (!stopping) {
    console.error(`Local contact API stopped (${signal || code}).`);
    stop(code || 1);
  }
});

client.on('exit', (code, signal) => {
  if (!stopping) stop(signal ? 1 : (code ?? 0));
});

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
