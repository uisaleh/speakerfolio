// /api/speakers
//   GET                       public: published speakers (card data)
//   GET  ?admin=1             admin: every speaker, including drafts
//   GET  ?slug=<slug>         admin: one full record + a preview link
//   POST { action: 'save', speaker, oldSlug?, photo?: 'data:image/webp;base64,...', removePhoto? }   admin
//   POST { action: 'delete', slug }                                                                    admin
import { json, authorised, getIndex, getSpeaker, writeIndex, cleanSpeaker, summary, photoUrl, previewToken, TOPICS, FORMATS } from '../_lib/speakers.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const admin = url.searchParams.has('admin') || url.searchParams.has('slug');
  if (!admin) {
    const list = (await getIndex(env)).filter((s) => s.published).map((s) => Object.assign({}, s, { url: '/speakers/' + s.slug + '/', photo: photoUrl(s) }));
    return new Response(JSON.stringify({ ok: true, speakers: list }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' } });
  }
  if (!(await authorised(request, env))) return json({ ok: false, error: 'Wrong password.' }, 401);
  if (!env.SUBMISSIONS) return json({ ok: false, error: 'The SUBMISSIONS storage is not connected yet.' }, 500);
  const slug = url.searchParams.get('slug');
  if (slug) {
    const s = await getSpeaker(env, slug);
    if (!s) return json({ ok: false, error: 'Speaker not found.' }, 404);
    return json({ ok: true, speaker: s, photo: photoUrl(s), preview: '/speakers/' + s.slug + '/?preview=' + (await previewToken(env, s.slug)) });
  }
  const list = (await getIndex(env)).map((s) => Object.assign({}, s, { photo: photoUrl(s) }));
  return json({ ok: true, speakers: list, topics: TOPICS, formats: FORMATS });
}

function decodePhoto(dataUrl) {
  const m = String(dataUrl || '').match(/^data:(image\/(?:webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return null;
  const bin = atob(m[2]);
  if (bin.length > 1500000) return { error: 'The photo is too large. Use one under 1.5 MB.' };
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { type: m[1], bytes };
}

export async function onRequestPost({ request, env }) {
  if (!(await authorised(request, env))) return json({ ok: false, error: 'Wrong password.' }, 401);
  if (!env.SUBMISSIONS) return json({ ok: false, error: 'The SUBMISSIONS storage is not connected yet.' }, 500);
  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'Bad request.' }, 400); }
  const kv = env.SUBMISSIONS;
  let index = await getIndex(env);

  if (body.action === 'delete') {
    const slug = String(body.slug || '');
    await kv.delete('spk:' + slug);
    await kv.delete('photo:' + slug);
    await writeIndex(env, index.filter((s) => s.slug !== slug));
    return json({ ok: true });
  }
  if (body.action !== 'save') return json({ ok: false, error: 'Unknown action.' }, 400);

  const oldSlug = String(body.oldSlug || '');
  const existing = oldSlug ? await getSpeaker(env, oldSlug) : null;
  const res = cleanSpeaker(body.speaker || {}, existing);
  if (res.error) return json({ ok: false, error: res.error }, 400);
  const s = res.speaker;
  if (s.slug !== oldSlug && (await kv.get('spk:' + s.slug))) {
    return json({ ok: false, error: 'Another speaker already uses the address /speakers/' + s.slug + '/. Change the web address.' }, 409);
  }

  // photo
  if (body.removePhoto) { await kv.delete('photo:' + (oldSlug || s.slug)); s.photoVer = ''; }
  if (body.photo) {
    const p = decodePhoto(body.photo);
    if (!p) return json({ ok: false, error: 'The photo could not be read. Try a JPG or PNG.' }, 400);
    if (p.error) return json({ ok: false, error: p.error }, 400);
    s.photoVer = Date.now().toString(36);
    await kv.put('photo:' + s.slug, p.bytes, { metadata: { type: p.type, ver: s.photoVer } });
  } else if (oldSlug && oldSlug !== s.slug && s.photoVer) {
    const old = await kv.getWithMetadata('photo:' + oldSlug, { type: 'arrayBuffer' });
    if (old && old.value) await kv.put('photo:' + s.slug, old.value, { metadata: old.metadata });
  }
  if (oldSlug && oldSlug !== s.slug) { await kv.delete('spk:' + oldSlug); await kv.delete('photo:' + oldSlug); }

  await kv.put('spk:' + s.slug, JSON.stringify(s));
  index = index.filter((x) => x.slug !== oldSlug && x.slug !== s.slug);
  index.push(summary(s));
  await writeIndex(env, index);
  return json({ ok: true, speaker: s, photo: photoUrl(s), preview: '/speakers/' + s.slug + '/?preview=' + (await previewToken(env, s.slug)) });
}

export async function onRequest() {
  return json({ ok: false, error: 'Use GET or POST.' }, 405);
}
