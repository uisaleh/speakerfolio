// /media/speakers/<slug>-<version>.webp  ->  the speaker photo stored in KV
export async function onRequestGet({ params, env }) {
  const m = String(params.file || '').match(/^([a-z0-9-]+)-([a-z0-9]+)\.webp$/);
  if (!m || !env.SUBMISSIONS) return new Response('Not found', { status: 404 });
  const got = await env.SUBMISSIONS.getWithMetadata('photo:' + m[1], { type: 'arrayBuffer' });
  if (!got || !got.value) return new Response('Not found', { status: 404 });
  const meta = got.metadata || {};
  const fresh = meta.ver === m[2];
  return new Response(got.value, {
    headers: {
      'Content-Type': meta.type || 'image/webp',
      'Cache-Control': fresh ? 'public, max-age=31536000, immutable' : 'public, max-age=300'
    }
  });
}
