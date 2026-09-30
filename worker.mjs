const CANONICAL_HOST = 'globaltechbyte.com';
const WWW_HOST = `www.${CANONICAL_HOST}`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();
    const forwardedProtocol = request.headers.get('x-forwarded-proto');
    const isProductionHost = host === CANONICAL_HOST || host === WWW_HOST;
    const needsCanonicalHost = host === WWW_HOST;
    const needsHttps = isProductionHost && (url.protocol !== 'https:' || forwardedProtocol === 'http');
    let canonicalPath = url.pathname;

    if (canonicalPath === '/index.html') canonicalPath = '/';
    else if (canonicalPath.endsWith('.html')) canonicalPath = canonicalPath.slice(0, -5);
    if (canonicalPath.length > 1) canonicalPath = canonicalPath.replace(/\/+$/, '');

    const needsCanonicalPath = canonicalPath !== url.pathname;

    if (needsCanonicalHost || needsHttps || needsCanonicalPath) {
      const destination = isProductionHost
        ? `https://${CANONICAL_HOST}${canonicalPath}${url.search}`
        : `${url.protocol}//${url.host}${canonicalPath}${url.search}`;
      return Response.redirect(destination, 308);
    }

    return env.ASSETS.fetch(request);
  },
};
