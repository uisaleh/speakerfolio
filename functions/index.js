// /  the home page: static HTML with the featured speakers filled in from KV
import { getIndex, featuredGrid } from './_lib/speakers.js';

export async function onRequestGet({ request, env, next }) {
  const res = await next();
  if (res.status !== 200 || !(res.headers.get('Content-Type') || '').includes('text/html')) return res;
  let html = await res.text();
  try {
    const list = await getIndex(env);
    if (list.some((s) => s.published)) {
      html = html.replace(/<!--FEATURED-->[\s\S]*?<!--\/FEATURED-->/, '<!--FEATURED-->' + featuredGrid(list) + '<!--/FEATURED-->');
    }
  } catch (e) { /* keep the static page */ }
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=60' } });
}
