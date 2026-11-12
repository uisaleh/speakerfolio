// /api/speaker-edit  (for speakers, with their private link)
//   GET  ?t=<token>          the speaker's current profile (or their waiting edits)
//   POST { t, data, email, message?, photo? }   send changes for review in the admin panel
import { json, getSpeaker, cleanSpeaker, photoUrl, telegram, SELF_FIELDS, TOPICS, FORMATS } from '../_lib/speakers.js';
import { decodePhoto } from './speakers.js';

async function lookup(env, t) {
  if (!env.SUBMISSIONS || !/^[0-9a-f]{36}$/.test(String(t || ''))) return null;
  const slug = await env.SUBMISSIONS.get('edit-token:' + t);
  if (!slug) return null;
  const s = await getSpeaker(env, slug);
  return s ? s : null;
}
function pick(src) { const o = {}; SELF_FIELDS.forEach((k) => { if (src && k in src) o[k] = src[k]; }); return o; }

export async function onRequestGet({ request, env }) {
  const t = new URL(request.url).searchParams.get('t');
  const s = await lookup(env, t);
  if (!s) return json({ ok: false, error: 'This link is not valid any more. Ask Speakerfolio for a new one.' }, 404);
  const req = await env.SUBMISSIONS.get('edit-req:' + s.slug, 'json');
  const base = Object.assign(pick(s), req ? req.data : {});
  return json({ ok: true, name: s.name, slug: s.slug, published: !!s.published, photo: req && req.photo ? req.photo : photoUrl(s), speaker: base, waiting: !!req, email: req ? req.email : '', topics: TOPICS, formats: FORMATS });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'Bad request.' }, 400); }
  const s = await lookup(env, body && body.t);
  if (!s) return json({ ok: false, error: 'This link is not valid any more. Ask Speakerfolio for a new one.' }, 404);
  const email = String(body.email || '').trim().slice(0, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ ok: false, error: 'Add your email so we can tell you when your changes are live.' }, 400);
  // validate the result exactly as the admin panel would save it
  const merged = Object.assign({}, s, pick(body.data || {}));
  const res = cleanSpeaker(merged, s);
  if (res.error) return json({ ok: false, error: res.error }, 400);
  let photo = '';
  if (body.photo) {
    const p = decodePhoto(body.photo);
    if (!p) return json({ ok: false, error: 'The photo could not be read. Try a JPG or PNG.' }, 400);
    if (p.error) return json({ ok: false, error: p.error }, 400);
    photo = body.photo;
  }
  const prev = await env.SUBMISSIONS.get('edit-req:' + s.slug, 'json');
  const rec = { slug: s.slug, name: s.name, email, message: String(body.message || '').slice(0, 1500), submittedAt: new Date().toISOString(), data: pick(res.speaker), photo: photo || (prev && prev.photo) || '' };
  await env.SUBMISSIONS.put('edit-req:' + s.slug, JSON.stringify(rec));
  await telegram(env, '✏️ ' + s.name + ' sent profile changes on Speakerfolio\nEmail: ' + email + (rec.message ? '\nNote: ' + rec.message : '') + '\n\nReview in admin: ' + new URL(request.url).origin + '/admin/');
  return json({ ok: true });
}
export async function onRequest() { return json({ ok: false, error: 'Use GET or POST.' }, 405); }
