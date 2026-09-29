import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^([.][.][/\\])+/, '');
  const localPath = normalized.replace(/^[/\\]global-tech-byte-website(?=[/\\]|$)/, '');
  return path.join(publicDir, localPath);
}

async function sendFile(res, filePath, statusCode = 200) {
  const data = await readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const isHashedAsset = filePath.includes(`${path.sep}assets${path.sep}`);
  res.writeHead(statusCode, {
    'Content-Type': mime[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html'
      ? 'no-cache'
      : isHashedAsset
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=86400',
  });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
    let target = safePath(urlPath);

    try {
      const info = await stat(target);
      if (info.isDirectory()) target = path.join(target, 'index.html');
      await sendFile(res, target);
      return;
    } catch {
      try {
        const htmlTarget = `${target}.html`;
        const info = await stat(htmlTarget);
        if (!info.isFile()) throw new Error('Not a file');
        await sendFile(res, htmlTarget);
        return;
      } catch {
        await sendFile(res, path.join(publicDir, '404.html'), 404);
      }
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Server error: ${error.message}`);
  }
});

server.listen(port, host, () => {
  console.log(`Global Tech Byte React site running at http://localhost:${port}/`);
});
