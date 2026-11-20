// Client sites on subdomains.
// emilyadams.speakerfolio.com/...  ->  /emilyadams/...  (if that folder has the file)
// The main domain, www and *.pages.dev addresses are served as usual.

const SKIP = new Set(['www']);
// Client sites that live only on their subdomain: the folder address on the main domain or pages.dev redirects there.
const CLIENTS = new Set(['aymannassar', 'robertabogany', 'admiraljim', 'anthonybaptiste', 'kudramohammed', 'rudolphmills', 'joshmccartney']);
// Client sites taken down at the client's request: answer 410 Gone so search engines drop them quickly.
const REMOVED = new Set(['emilyadams']);
// Google Analytics: every client page carries the tag in its file; this adds it to any page that is missing it.
const GA_TAG = "<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-FW50KBR0Y7');window.addEventListener('load',function(){setTimeout(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-FW50KBR0Y7';document.head.appendChild(s);},1200);});</script>";
const GONE_PAGE = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page removed</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b0c0e;color:#fff;font-family:system-ui,sans-serif;padding:24px;box-sizing:border-box;text-align:center}</style></head><body><p>This page has been removed.</p></body></html>';

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const labels = host.split('.');

  // Old crawls picked up unrendered template links such as /{{m.href}}: answer 410 Gone so search engines drop them.
  if (url.pathname.includes('{{') || /%7b%7b|%7d%7d/i.test(url.pathname)) {
    return new Response(GONE_PAGE, { status: 410, headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex', 'Cache-Control': 'public, max-age=86400' } });
  }

  // The separate comparison pages were merged into /compare/ (Nov 2026).
  const MERGED = { '/compare/speakerfolio-vs-wix/': '/compare/#builders', '/compare/speakerfolio-vs-squarespace/': '/compare/#builders' };
  const mp = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
  if (MERGED[mp]) return Response.redirect('https://speakerfolio.com' + MERGED[mp], 301);

  // one canonical host: www and plain http go to https://speakerfolio.com
  if (host === 'www.speakerfolio.com' || (url.protocol === 'http:' && host.endsWith('speakerfolio.com'))) {
    return Response.redirect('https://' + host.replace(/^www\./, '') + url.pathname + url.search, 301);
  }
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
  if (res.status === 200 && (res.headers.get('Content-Type') || '').includes('text/html')) {
    const html = await res.text();
    if (!html.includes('G-FW50KBR0Y7')) {
      const out = html.replace(/<head[^>]*>/i, (m) => m + GA_TAG);
      const h = new Headers(res.headers); h.delete('Content-Length'); h.delete('ETag');
      return new Response(out, { status: 200, headers: h });
    }
    return new Response(html, { status: 200, headers: res.headers });
  }
  return res;
}
