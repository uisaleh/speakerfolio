// /speakers/<slug>/  a speaker profile (server-rendered from KV)
import { getSpeaker, getIndex, previewToken } from '../_lib/speakers.js';
import { profilePage } from '../_lib/pages.js';

function notFound(request, env) {
  return env.ASSETS.fetch(new Request(new URL('/404.html', request.url))).then((r) => new Response(r.body, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
}

export async function onRequestGet({ request, env, params }) {
  const url = new URL(request.url);
  const slug = String(params.slug || '').toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) return notFound(request, env);
  if (!url.pathname.endsWith('/')) return Response.redirect(url.origin + url.pathname + '/' + url.search, 301);
  const s = await getSpeaker(env, slug);
  if (!s) return notFound(request, env);
  let preview = false;
  if (!s.published) {
    const tok = url.searchParams.get('preview');
    if (!tok || tok !== (await previewToken(env, slug))) return notFound(request, env);
    preview = true;
  }
  const topic = (s.topics || [])[0];
  const related = (await getIndex(env)).filter((x) => x.published && x.slug !== slug && (x.topics || []).includes(topic)).slice(0, 3);
  return profilePage({ s, related, preview });
}
