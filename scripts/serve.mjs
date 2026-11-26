import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
const assets = new Set(['index.html', 'style.css', 'app.js', 'model.js', 'catalog.js', 'favicon.svg']);
const port = Number(process.env.PORT || 4173);

createServer(async (req, res) => {
  const name = req.url?.split('?')[0].slice(1) || 'index.html';
  if (!['GET', 'HEAD'].includes(req.method) || !assets.has(name)) {
    res.writeHead(404).end('Not found');
    return;
  }
  try {
    const data = await readFile(path.join(root, name));
    res.writeHead(200, {
      'Content-Type': types[path.extname(name)],
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    }).end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(500).end('Could not read application asset');
  }
}).listen(port, '127.0.0.1', () => console.log(`XPay Commerce: http://127.0.0.1:${port}`));
