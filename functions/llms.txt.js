// /llms.txt  the static file plus the list of published speakers, for AI tools
import { getPublished, SITE } from './_lib/speakers.js';

export async function onRequestGet({ env, next }) {
  const res = await next();
  let txt = await res.text();
  try {
    const list = await getPublished(env);
    if (list.length) {
      txt += '\n## Speakers\n' + list.map((s) => '- [' + s.name + '](' + SITE + '/speakers/' + s.slug + '/): ' + s.headline.replace(/\.?$/, '.') + ((s.topics || []).length ? ' Topics: ' + s.topics.join(', ') + '.' : '') + (s.location ? ' Based in ' + s.location + '.' : '')).join('\n') + '\n';
    }
  } catch (e) { /* static file only */ }
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
}
