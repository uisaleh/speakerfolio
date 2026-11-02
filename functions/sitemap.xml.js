// /sitemap.xml  the static sitemap plus every published speaker and topic page with speakers
import { getPublished, TOPICS, topicSlug, SITE } from './_lib/speakers.js';

export async function onRequestGet({ env, next }) {
  const res = await next();
  let xml = await res.text();
  try {
    const list = await getPublished(env);
    const add = TOPICS.filter((t) => list.some((s) => (s.topics || []).includes(t)))
      .map((t) => '<url><loc>' + SITE + '/speakers/topic/' + topicSlug(t) + '/</loc><priority>0.7</priority></url>\n')
      .concat(list.map((s) => '<url><loc>' + SITE + '/speakers/' + s.slug + '/</loc><lastmod>' + String(s.updatedAt || '').slice(0, 10) + '</lastmod><priority>0.8</priority></url>\n'));
    xml = xml.replace('</urlset>', add.join('') + '</urlset>');
  } catch (e) { /* static sitemap only */ }
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
}
