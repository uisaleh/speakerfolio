// Client sites on subdomains.
// emilyadams.speakerfolio.com/...  ->  /emilyadams/...  (if that folder has the file)
// The main domain, www and *.pages.dev addresses are served as usual.

const SKIP = new Set(['www']);
// Client sites that live only on their subdomain: the folder address on the main domain or pages.dev redirects there.
const CLIENTS = new Set(['aymannassar']);
// Client sites taken down at the client's request: answer 410 Gone so search engines drop them quickly.
const REMOVED = new Set(['emilyadams']);
const GONE_PAGE = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page removed</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b0c0e;color:#fff;font-family:system-ui,sans-serif;padding:24px;box-sizing:border-box;text-align:center}</style></head><body><p>This page has been removed.</p></body></html>';

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const labels = host.split('.');

  if (labels.length < 3 || host.endsWith('.pages.dev') || SKIP.has(labels[0]) || url.pathname.startsWith('/api/')) {
    const first = url.pathname.split('/')[1] || '';
    if (CLIENTS.has(first) && !/\.(jpe?g|png|webp|svg|ico)$/i.test(url.pathname)) {
      const rest = url.pathname.slice(first.length + 1);
      const dest = 'https://' + first + '.speakerfolio.com' + (rest === '' || rest === '/' || rest === '/index.html' ? '/' : rest) + url.search;
      return Response.redirect(dest, 301);
    }
    return next();
  }

  const sub = labels[0].replace(/[^a-z0-9-]/g, '');
  if (!sub) return next();
  if (REMOVED.has(sub)) {
    return new Response(GONE_PAGE, { status: 410, headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store' } });
  }

  // Files the client site links to with its own folder prefix, or shared /assets, work as they are.
  if (url.pathname.startsWith('/' + sub + '/') || url.pathname.startsWith('/assets/') || /^\/(favicon|apple-touch-icon)/.test(url.pathname)) {
    return next();
  }

  const target = new URL(url);
  target.pathname = '/' + sub + (url.pathname === '/' ? '/' : url.pathname);
  const res = await env.ASSETS.fetch(new Request(target.toString(), request));
  if (res.status === 404) return next();
  return res;
}
