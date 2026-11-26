// /speakers/<slug>/  a speaker profile (server-rendered from KV)
import { getSpeaker, getIndex, previewToken, applyPatches } from '../_lib/speakers.js';
import { PATCHES } from '../_lib/seed.js';
import { profilePage } from '../_lib/pages.js';

function notFound(request, env) {
  return env.ASSETS.fetch(new Request(new URL('/404.html', request.url))).then((r) => new Response(r.body, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
}

export async function onRequestGet({ request, env, params }) {
  const url = new URL(request.url);
  const slug = String(params.slug || '').toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) return notFound(request, env);
  if (!url.pathname.endsWith('/')) return Response.redirect(url.origin + url.pathname + '/' + url.search, 301);
  try { await applyPatches(env, PATCHES); } catch (e) { /* show the stored record */ }
  const s = await getSpeaker(env, slug);
  if (!s) return notFound(request, env);
  let preview = false;
  if (!s.published) {
    const tok = url.searchParams.get('preview');
    if (!tok || tok !== (await previewToken(env, slug))) return notFound(request, env);
    preview = true;
  }
  const topic = (s.topics || [])[0];
  // 4 related speakers: same main topic first, then any shared topic, then other published speakers
  const pool = (await getIndex(env)).filter((x) => x.published && x.slug !== slug);
  const mine = s.topics || [];
  const rank = (x) => ((x.topics || []).includes(topic) ? 0 : (x.topics || []).some((t) => mine.includes(t)) ? 1 : 2);
  const related = pool.map((x, i) => [rank(x), i, x]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).slice(0, 4).map((r) => r[2]);
  return profilePage({ s, related, preview });
}
