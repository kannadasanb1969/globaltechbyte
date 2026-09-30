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
  { path: '/web-development-company-chennai', file: 'web-development-company-chennai.html', type: 'WebPage' },
  { path: '/mobile-app-development-company-chennai', file: 'mobile-app-development-company-chennai.html', type: 'WebPage' },
  { path: '/custom-software-development-chennai', file: 'custom-software-development-chennai.html', type: 'WebPage' },
  { path: '/react-development-company-chennai', file: 'react-development-company-chennai.html', type: 'WebPage' },
  { path: '/dotnet-development-company-chennai', file: 'dotnet-development-company-chennai.html', type: 'WebPage' },
  { path: '/software-company-tambaram', file: 'software-company-tambaram.html', type: 'WebPage' },
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
      const seoLandingImport = 'import{WebDevelopment as SeoWebDevelopment,MobileAppDevelopment as SeoMobileAppDevelopment,CustomSoftwareDevelopment as SeoCustomSoftwareDevelopment,ReactDevelopment as SeoReactDevelopment,DotNetDevelopment as SeoDotNetDevelopment,TambaramSoftwareCompany as SeoTambaramSoftwareCompany}from"./SeoLandingPages.js";';
      if (source.startsWith(seoLandingImport)) source = source.slice(seoLandingImport.length);

      if (!source.includes('var SeoWebDevelopment=')) {
        const seoLazyComponents = 'var SeoWebDevelopment=(0,w.lazy)(()=>import(`./SeoLandingPages.js`).then(e=>({default:e.WebDevelopment}))),SeoMobileAppDevelopment=(0,w.lazy)(()=>import(`./SeoLandingPages.js`).then(e=>({default:e.MobileAppDevelopment}))),SeoCustomSoftwareDevelopment=(0,w.lazy)(()=>import(`./SeoLandingPages.js`).then(e=>({default:e.CustomSoftwareDevelopment}))),SeoReactDevelopment=(0,w.lazy)(()=>import(`./SeoLandingPages.js`).then(e=>({default:e.ReactDevelopment}))),SeoDotNetDevelopment=(0,w.lazy)(()=>import(`./SeoLandingPages.js`).then(e=>({default:e.DotNetDevelopment}))),SeoTambaramSoftwareCompany=(0,w.lazy)(()=>import(`./SeoLandingPages.js`).then(e=>({default:e.TambaramSoftwareCompany})));';
        source = source.replace('function bo(){', `${seoLazyComponents}function bo(){`);
      }

      const routeAnchor = '(0,M.jsx)(bn,{path:`/privacy-policy`';
      if (!source.includes('path:`/web-development-company-chennai`')) {
        const seoRoutes = [
          '(0,M.jsx)(bn,{path:`/web-development-company-chennai`,element:(0,M.jsx)(SeoWebDevelopment,{})})',
          '(0,M.jsx)(bn,{path:`/mobile-app-development-company-chennai`,element:(0,M.jsx)(SeoMobileAppDevelopment,{})})',
          '(0,M.jsx)(bn,{path:`/custom-software-development-chennai`,element:(0,M.jsx)(SeoCustomSoftwareDevelopment,{})})',
          '(0,M.jsx)(bn,{path:`/react-development-company-chennai`,element:(0,M.jsx)(SeoReactDevelopment,{})})',
          '(0,M.jsx)(bn,{path:`/dotnet-development-company-chennai`,element:(0,M.jsx)(SeoDotNetDevelopment,{})})',
          '(0,M.jsx)(bn,{path:`/software-company-tambaram`,element:(0,M.jsx)(SeoTambaramSoftwareCompany,{})})',
        ].join(',');
        source = source.replace(routeAnchor, `${seoRoutes},${routeAnchor}`);
      }

      source = source
        .replace('var co=[{title:`Software Development Careers`', 'var co=[{title:`Careers`')
        .replace('},{title:`Technology Internships`,description:', '},{title:`Internships`,description:');
    }

    if (file === 'Services-BQvRuYew.js' && !source.includes('Dedicated Chennai Service Pages')) {
      const serviceLinks = '(0,p.jsx)(`section`,{className:`px-4 py-16 sm:px-6 lg:px-8`,children:(0,p.jsxs)(`div`,{className:`mx-auto max-w-6xl rounded-[2.5rem] bg-[var(--color-peach)] p-8 sm:p-10`,children:[(0,p.jsx)(`p`,{className:`text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-orange)]`,children:`Dedicated Chennai Service Pages`}),(0,p.jsx)(`h2`,{className:`mt-3 text-3xl font-extrabold tracking-tight text-[var(--color-ink)]`,children:`Explore Our Development Expertise`}),(0,p.jsx)(`p`,{className:`mt-4 max-w-3xl text-[var(--color-text-gray)]`,children:`Learn how our focused web, mobile, custom software, React and .NET capabilities apply to businesses in Chennai and Tambaram.`}),(0,p.jsx)(`div`,{className:`mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3`,children:[(0,p.jsx)(`a`,{href:`/web-development-company-chennai`,className:`focus-ring rounded-2xl bg-white p-5 font-semibold text-[var(--color-ink)] hover:text-[var(--color-orange)]`,children:`Web Development Services in Chennai`}),(0,p.jsx)(`a`,{href:`/mobile-app-development-company-chennai`,className:`focus-ring rounded-2xl bg-white p-5 font-semibold text-[var(--color-ink)] hover:text-[var(--color-orange)]`,children:`Mobile App Development in Chennai`}),(0,p.jsx)(`a`,{href:`/custom-software-development-chennai`,className:`focus-ring rounded-2xl bg-white p-5 font-semibold text-[var(--color-ink)] hover:text-[var(--color-orange)]`,children:`Custom Software Development`}),(0,p.jsx)(`a`,{href:`/react-development-company-chennai`,className:`focus-ring rounded-2xl bg-white p-5 font-semibold text-[var(--color-ink)] hover:text-[var(--color-orange)]`,children:`React Development Services`}),(0,p.jsx)(`a`,{href:`/dotnet-development-company-chennai`,className:`focus-ring rounded-2xl bg-white p-5 font-semibold text-[var(--color-ink)] hover:text-[var(--color-orange)]`,children:`.NET Development Services`}),(0,p.jsx)(`a`,{href:`/software-company-tambaram`,className:`focus-ring rounded-2xl bg-white p-5 font-semibold text-[var(--color-ink)] hover:text-[var(--color-orange)]`,children:`Software Development in Tambaram`})]})]})})';
      source = source.replace('(0,p.jsx)(o,{})', `${serviceLinks},(0,p.jsx)(o,{})`);
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
  return candidates.find(existsSync) || null;
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
  if (!browser) {
    console.log('Chrome/Edge not available in build environment; using committed prerendered HTML files.');
  } else {
    const browserProfile = mkdtempSync(path.join(tmpdir(), 'gtb-prerender-'));
    try {
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
    } finally {
      rmSync(browserProfile, { recursive: true, force: true });
    }
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}

writeSeoDiscoveryFiles();
console.log('SEO build completed.');
