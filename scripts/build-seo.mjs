import http from 'node:http';
import { execFile } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(rootDir, 'public');
const port = 4179;
const origin = `http://127.0.0.1:${port}`;
const siteOrigin = 'https://globaltechbyte.com';
const execFileAsync = promisify(execFile);

const pages = [
  { path: '/', file: 'index.html', type: 'WebPage' },
  { path: '/about', file: 'about.html', type: 'AboutPage' },
  { path: '/services', file: 'services.html', type: 'WebPage' },
  { path: '/work', file: 'work.html', type: 'CollectionPage' },
  { path: '/careers', file: 'careers.html', type: 'WebPage' },
  { path: '/internships', file: 'internships.html', type: 'WebPage' },
  { path: '/contact', file: 'contact.html', type: 'ContactPage' },
  { path: '/privacy-policy', file: 'privacy-policy.html', type: 'WebPage' },
  { path: '/terms', file: 'terms.html', type: 'WebPage' },
  { path: '/__seo-404__', file: '404.html', type: null },
];

const titleReplacements = new Map([
  ['Global Tech Byte | Web Applications Development with Modern Technologies', 'Web Application Development Company | Global Tech Byte'],
  ['title:`About Us`', 'title:`About Our Software Development Company`'],
  ['title:`Services`', 'title:`Web App Development Services`'],
  ['title:`Custom Web Application Development Services`', 'title:`Web App Development Services`'],
  ['title:`Work`', 'title:`Software Solutions & Product Concepts`'],
  ['title:`Careers`', 'title:`Software Development Careers`'],
  ['title:`Internships`', 'title:`Technology Internships`'],
  ['title:`Contact`', 'title:`Contact Our Software Development Team`'],
]);

function patchBundles() {
  const assetsDir = path.join(publicDir, 'assets');
  for (const file of ['index-79ECsEKK.js', 'About-GLVYQ1kO.js', 'Services-BQvRuYew.js', 'Work-CtlVAiBX.js', 'Careers-CIy020g6.js', 'Internships-SJsohXsj.js', 'Contact-lSU_TlJe.js', 'usePageMeta-C_nq1uxQ.js']) {
    const filePath = path.join(assetsDir, file);
    let source = readFileSync(filePath, 'utf8');
    const original = source;

    for (const [from, to] of titleReplacements) source = source.replaceAll(from, to);

    source = source.replaceAll('https://www.globaltechbyte.com', siteOrigin);
    source = source.replaceAll(
      'Global Tech Byte helps you turn your ideas into powerful web applications through custom development, a modern technology stack, and a business-focused approach.',
      'Global Tech Byte builds powerful web applications with custom development, modern technology, and a business-focused approach.',
    );

    source = source
      .replaceAll('`${m}/images/hero/hero-person.webp`', '`${m}/og-image.jpg`')
      .replace('c=r?r.startsWith(`http`)?r:_(r):g', 'c=g')
      .replace('return`${m}${e===`/`?``:e}`', 'return`${m}${e===`/`?`/`:e}`')
      .replaceAll('`index, follow`', '`index, follow, max-image-preview:large`')
      .replaceAll('alt:e.title,loading:`lazy`', 'alt:e.title,width:1024,height:768,loading:`lazy`,decoding:`async`');

    if (file === 'index-79ECsEKK.js') {
      source = source
        .replace('var co=[{title:`Software Development Careers`', 'var co=[{title:`Careers`')
        .replace('},{title:`Technology Internships`,description:', '},{title:`Internships`,description:');
    }

    if (source !== original) writeFileSync(filePath, source);
  }
}

function appShell() {
  const html = readFileSync(path.join(publicDir, 'index.html'), 'utf8');
  if (html.includes('<div id="root"></div>')) return html;
  return html.replace(/<div id="root">[\s\S]*?<\/body>/, '<div id="root"></div>\n  </body>');
}

function contentType(filePath) {
  return {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
  }[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean);
  const browser = candidates.find(existsSync);
  if (!browser) throw new Error('Chrome or Edge is required to prerender the site. Set CHROME_PATH and retry.');
  return browser;
}

function injectPageSchema(html, page) {
  if (!page.type || page.path === '/') return html;
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="([^"]*)"/s)?.[1]?.trim();
  const url = `${siteOrigin}${page.path}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': page.type,
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { '@id': `${siteOrigin}/#website` },
    about: { '@id': `${siteOrigin}/#organization` },
  };
  return html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(schema)}</script>\n</head>`);
}

function cleanSnapshot(html, page) {
  let output = html
    .replaceAll(origin, siteOrigin)
    .replaceAll('https://www.globaltechbyte.com', siteOrigin)
    .replace(/<link rel="modulepreload" as="script"[^>]+href="https:\/\/globaltechbyte\.com\/global-tech-byte-website\/assets\/[^"]+"[^>]*>/g, '')
    .replaceAll(`${siteOrigin}/global-tech-byte-website/assets/`, '/assets/')
    .replace(/ style="opacity: 0; transform: translateY\([^)]*\);?"/g, '')
    .replace(/ style="opacity: 0; transform: translateX\([^)]*\);?"/g, '')
    .replace('<!DOCTYPE html>', '<!doctype html>');

  output = injectPageSchema(output, page);
  return `${output.trim()}\n`;
}

function writeSeoDiscoveryFiles() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const excludedPaths = new Set(['/privacy-policy', '/terms', '/__seo-404__']);
  const urls = pages
    .filter((page) => !excludedPaths.has(page.path))
    .map((page) => {
      const url = page.path === '/' ? `${siteOrigin}/` : `${siteOrigin}${page.path}`;
      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    })
    .join('\n');

  writeFileSync(
    path.join(publicDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  writeFileSync(
    path.join(publicDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`,
  );
}

patchBundles();
const shell = appShell();
const routeSet = new Set(pages.map((page) => page.path));

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent(new URL(req.url, origin).pathname);
  if (routeSet.has(requestPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(shell);
    return;
  }

  const normalized = requestPath.replace(/^\/global-tech-byte-website(?=\/|$)/, '');
  const filePath = path.join(publicDir, normalized.replace(/^\//, ''));
  if (!filePath.startsWith(publicDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': contentType(filePath) });
  res.end(readFileSync(filePath));
});

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(port, '127.0.0.1', resolve);
});

try {
  const browser = findChrome();
  const browserProfile = mkdtempSync(path.join(tmpdir(), 'gtb-prerender-'));
  for (const page of pages) {
    const { stdout: html } = await execFileAsync(browser, [
      '--headless=new',
      '--disable-gpu',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-extensions',
      '--no-first-run',
      '--no-sandbox',
      `--user-data-dir=${browserProfile}`,
      '--virtual-time-budget=5000',
      '--dump-dom',
      `${origin}${page.path}`,
    ], { encoding: 'utf8', maxBuffer: 25 * 1024 * 1024, windowsHide: true });

    const snapshot = cleanSnapshot(html, page);
    if (!snapshot.includes('<h1') || !snapshot.includes('<link rel="canonical"')) {
      throw new Error(`Prerender validation failed for ${page.path}`);
    }
    writeFileSync(path.join(publicDir, page.file), snapshot);
    console.log(`Prerendered ${page.path} -> public/${page.file}`);
  }
  rmSync(browserProfile, { recursive: true, force: true });
} finally {
  await new Promise((resolve) => server.close(resolve));
}

writeSeoDiscoveryFiles();
console.log('SEO build completed.');
