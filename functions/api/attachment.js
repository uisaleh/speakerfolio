// GET /api/attachment?key=att:<id>:<n>  (admin only)
// Streams a file someone attached to a website request or question.
import { authorised } from '../_lib/speakers.js';

export async function onRequestGet({ request, env }) {
  if (!(await authorised(request, env))) return new Response('Wrong password.', { status: 401 });
  const key = new URL(request.url).searchParams.get('key') || '';
  if (!/^att:[a-z0-9-]{6,60}:\d$/.test(key) || !env.SUBMISSIONS) return new Response('Unknown file.', { status: 400 });
  const { value, metadata } = await env.SUBMISSIONS.getWithMetadata(key, { type: 'arrayBuffer' });
  if (!value) return new Response('File not found.', { status: 404 });
  const name = (metadata && metadata.name) || 'attachment';
  return new Response(value, { headers: {
    'Content-Type': (metadata && metadata.type) || 'application/octet-stream',
    'Content-Disposition': 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(name),
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'
  } });
}
