// Cloudflare Worker entry: runs the form and admin APIs, and serves the site files for everything else.
import * as submit from './functions/api/submit.js';
import * as submissions from './functions/api/submissions.js';

const routes = { '/api/submit': submit, '/api/submissions': submissions };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const mod = routes[url.pathname.replace(/\/$/, '')];
    if (mod) {
      const ctxArg = { request, env, ctx, waitUntil: ctx.waitUntil.bind(ctx) };
      const method = request.method.charAt(0) + request.method.slice(1).toLowerCase();
      const handler = mod['onRequest' + method] || mod.onRequest;
      if (handler) return handler(ctxArg);
      return new Response(JSON.stringify({ ok: false, error: 'Method not allowed.' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }
    return env.ASSETS.fetch(request);
  }
};
