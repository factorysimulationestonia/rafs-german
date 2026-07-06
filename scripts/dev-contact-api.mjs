import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';

const bundledPhp = process.platform === 'win32'
  ? path.resolve('.tools/php/php.exe')
  : path.resolve('.tools/php/bin/php');
const phpCommand = existsSync(bundledPhp) ? bundledPhp : 'php';
const host = process.env.CONTACT_API_HOST || '127.0.0.1';
const port = process.env.CONTACT_API_PORT || '8787';

const server = spawn(phpCommand, ['-S', `${host}:${port}`, '-t', 'server'], {
  env: {
    ...process.env,
    CONTACT_ENV: 'development',
    CONTACT_RATE_LIMIT: process.env.CONTACT_RATE_LIMIT || '0'
  },
  stdio: 'inherit'
});

server.on('error', (error) => {
  if (error.code === 'ENOENT') {
    console.error('PHP was not found. Install PHP or place the portable runtime in .tools/php.');
  } else {
    console.error(error);
  }
  process.exit(1);
});

server.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
