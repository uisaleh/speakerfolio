// /speakers/topic/<topic>/  a topic page, e.g. /speakers/topic/leadership/
import { getIndex, topicFromSlug } from '../../_lib/speakers.js';
import { directoryPage } from '../../_lib/pages.js';

export async function onRequestGet({ request, env, params }) {
  const topic = topicFromSlug(String(params.topic || ''));
  if (!topic) return env.ASSETS.fetch(new Request(new URL('/404.html', request.url))).then((r) => new Response(r.body, { status: 404, headers: r.headers }));
  const url = new URL(request.url);
  const all = await getIndex(env);
  return directoryPage({ all, topic, q: url.searchParams.get('q') || '', format: (url.searchParams.get('format') || '').split(',')[0], path: '/speakers/topic/' + params.topic + '/' });
}
