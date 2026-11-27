import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');
const [routes, connections, readme, html] = await Promise.all([
  read('docs/backend-api.md'), read('docs/backend-connections.md'), read('README.md'), read('public/demo.html'),
]);
const operations = [...routes.matchAll(/^\| \x60([A-Z]+ \/[^\x60]*)\x60 \|/gm)].map(match => match[1]);
assert.equal(operations.length, 323, 'O inventário deve conter 323 declarações HTTP');
assert.equal(new Set(operations).size, operations.length, 'A lista deve ser única por método e caminho');
assert.equal([...routes.matchAll(/#L\d+\)/g)].length, 323, 'Cada declaração deve apontar ao seu código');
assert.equal([...connections.matchAll(/^\| \[.src\//gm)].length, 70, 'O inventário deve conter as 70 origens detectadas');
assert.equal([...readme.matchAll(/^~~~mermaid$/gm)].length, 5, 'O README apresenta cinco diagramas do backend');
const assets = [...html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)].map(match => match[1]);
assert.equal(assets.length, 3);
await Promise.all(assets.map(name => read('public/' + name)));
const landing = await read('public/index.html');
assert.match(landing, /https:\/\/desk\.orbia\.live\/login/);
assert.match(landing, /https:\/\/desk\.orbia\.live\/signup/);
assert.match(landing, /mailto:ativacao@xpay\.expert/);
await read('public/landing.css');
console.log('323 operações HTTP e 70 origens de dependência verificadas.');