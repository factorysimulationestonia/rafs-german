import { cp, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const npmCli = process.env.npm_execpath;
const buildCommand = npmCli ? process.execPath : (process.platform === 'win32' ? 'npm.cmd' : 'npm');
const buildArguments = npmCli ? [npmCli, 'run', 'build'] : ['run', 'build'];
const build = spawnSync(buildCommand, buildArguments, {
  env: {
    ...process.env,
    VITE_CONTACT_ENDPOINT: '/api/contact.php',
    VITE_GOOGLE_MEASUREMENT_ENABLED: 'true'
  },
  stdio: 'inherit'
});

if (build.status !== 0) {
  if (build.error) {
    console.error(build.error);
  }
  process.exit(build.status ?? 1);
}

const destination = path.resolve('dist/api');
await mkdir(destination, { recursive: true });
await cp(path.resolve('server/api'), destination, { recursive: true });

console.log('Zone build includes the contact API at dist/api/contact.php.');
