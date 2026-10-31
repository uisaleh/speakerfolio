// Client sites on subdomains.
// emilyadams.speakerfolio.com/...  ->  /emilyadams/...  (if that folder has the file)
// The main domain, www and *.pages.dev addresses are served as usual.

const SKIP = new Set(['www']);

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const labels = host.split('.');

  if (labels.length < 3 || host.endsWith('.pages.dev') || SKIP.has(labels[0]) || url.pathname.startsWith('/api/')) {
    return next();
  }

  const sub = labels[0].replace(/[^a-z0-9-]/g, '');
  if (!sub) return next();

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
