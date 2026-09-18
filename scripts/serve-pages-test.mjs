import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

// Test the actual artifact with Pages-like static directory indexes and 404s.
// Deliberately do not use Vite preview's SPA rewrite: it can hide missing files.
const root = resolve('dist');
const base = '/rafs-german/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  if (pathname === base.slice(0, -1)) {
    response.writeHead(301, { Location: base }); response.end(); return;
  }
  const file = resolve(root, decodeURIComponent(pathname.slice(base.length)));
  if (!pathname.startsWith(base) || (file !== root && !file.startsWith(root + sep))) {
    response.writeHead(404); response.end(); return;
  }
  try {
    const info = await stat(file);
    if (info.isDirectory() && !pathname.endsWith('/')) {
      response.writeHead(301, { Location: `${pathname}/` }); response.end(); return;
    }
    const target = info.isDirectory() ? resolve(file, 'index.html') : file;
    const body = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end(await readFile(resolve(root, '404.html')));
  }
}).listen(4179, '127.0.0.1', () => console.log('Pages artifact test server on port 4179'));
