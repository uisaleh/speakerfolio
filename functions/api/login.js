// /api/login  POST { password }  ->  a session token for the admin panel, valid for 7 days
import { json, sha, sessionToken } from '../_lib/speakers.js';

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD) return json({ ok: false, error: 'ADMIN_PASSWORD is not set in Cloudflare.' }, 500);
  let body = {};
  try { body = await request.json(); } catch (e) { /* empty */ }
  const given = String(body.password || '');
  if (!given || (await sha(given)) !== (await sha(env.ADMIN_PASSWORD))) {
    await new Promise((r) => setTimeout(r, 600));
    return json({ ok: false, error: 'Wrong password.' }, 401);
  }
  return json(Object.assign({ ok: true }, await sessionToken(env, 7)));
}
export async function onRequest() { return json({ ok: false, error: 'Use POST.' }, 405); }
