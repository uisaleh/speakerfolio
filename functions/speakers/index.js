// /speakers/  the speaker directory (server-rendered from KV)
import { getIndex, topicFromSlug, slugify } from '../_lib/speakers.js';
import { directoryPage } from '../_lib/pages.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const t = url.searchParams.get('topic');
  // old-style ?topic=Leadership links go to the topic page
  if (t) {
    const topic = topicFromSlug(slugify(t));
    if (topic) {
      const rest = new URLSearchParams(url.searchParams); rest.delete('topic');
      return Response.redirect(url.origin + '/speakers/topic/' + slugify(topic) + '/' + (rest.toString() ? '?' + rest : ''), 301);
    }
  }
  const all = await getIndex(env);
  return directoryPage({ all, topic: null, q: url.searchParams.get('q') || '', format: (url.searchParams.get('format') || '').split(',')[0], path: '/speakers/' });
}
