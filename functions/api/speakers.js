// /api/speakers
//   GET                       public: published speakers (card data)
//   GET  ?admin=1             admin: every speaker, including drafts
//   GET  ?slug=<slug>         admin: one full record + a preview link
//   POST { action: 'save', speaker, oldSlug?, photo?: 'data:image/webp;base64,...', removePhoto? }   admin
//   POST { action: 'delete', slug }                                                                    admin
import { SEEDS, PATCHES } from '../_lib/seed.js';
import { json, authorised, getIndex, getSpeaker, writeIndex, cleanSpeaker, summary, photoUrl, previewToken, TOPICS, FORMATS, applyPatches, SELF_FIELDS } from '../_lib/speakers.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const admin = url.searchParams.has('admin') || url.searchParams.has('slug') || url.searchParams.has('review');
  if (!admin) {
    const list = (await getIndex(env)).filter((s) => s.published).map((s) => Object.assign({}, s, { url: '/speakers/' + s.slug + '/', photo: photoUrl(s) }));
    return new Response(JSON.stringify({ ok: true, speakers: list }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' } });
  }
  if (!(await authorised(request, env))) return json({ ok: false, error: 'Wrong password.' }, 401);
  if (!env.SUBMISSIONS) return json({ ok: false, error: 'The SUBMISSIONS storage is not connected yet.' }, 500);
  const review = url.searchParams.get('review');
  if (review) {
    const s = await getSpeaker(env, review);
    const req = await env.SUBMISSIONS.get('edit-req:' + review, 'json');
    if (!s || !req) return json({ ok: false, error: 'No edits waiting for this speaker.' }, 404);
    return json({ ok: true, speaker: s, photo: photoUrl(s), request: req, fields: SELF_FIELDS });
  }
  const slug = url.searchParams.get('slug');
  if (slug) {
    const s = await getSpeaker(env, slug);
    if (!s) return json({ ok: false, error: 'Speaker not found.' }, 404);
    return json({ ok: true, speaker: s, photo: photoUrl(s), preview: '/speakers/' + s.slug + '/?preview=' + (await previewToken(env, s.slug)) });
  }
  const added = await addSeeds(env);
  await applyPatches(env, PATCHES);
  const pending = new Set();
  const links = new Set();
  for (const [prefix, set] of [['edit-req:', pending], ['edit-link:', links]]) {
    let c;
    do { const r = await env.SUBMISSIONS.list({ prefix, cursor: c }); r.keys.forEach((k) => set.add(k.name.slice(prefix.length))); c = r.list_complete ? null : r.cursor; } while (c);
  }
  const list = (await syncIndex(env, added)).map((s) => Object.assign({}, s, { photo: photoUrl(s), pending: pending.has(s.slug), hasLink: links.has(s.slug) }));
  return json({ ok: true, speakers: list, topics: TOPICS, formats: FORMATS });
}

// Rebuild the speaker list from the stored speaker records, so the list can never lose anyone
// (KV can serve an old copy of the list for up to a minute after a change).
async function syncIndex(env, extra = []) {
  const kv = env.SUBMISSIONS;
  const keys = [];
  let cursor;
  do {
    const r = await kv.list({ prefix: 'spk:', cursor });
    r.keys.forEach((k) => keys.push(k.name));
    cursor = r.list_complete ? null : r.cursor;
  } while (cursor);
  const recs = (await Promise.all(keys.map((k) => kv.get(k, 'json').catch(() => null)))).filter((x) => x && x.slug);
  // records just written may not be listed yet
  extra.forEach((x) => { if (!recs.some((r) => r.slug === x.slug)) recs.push(x); });
  const fresh = recs.map(summary);
  const old = await getIndex(env);
  const sig = (l) => l.map((x) => x.slug + '@' + x.updatedAt + '@' + x.published + '@' + x.featured + '@' + x.photoVer).sort().join('|');
  if (sig(fresh) !== sig(old)) await writeIndex(env, fresh);
  else fresh.sort((a, b) => (b.featured - a.featured) || String(b.createdAt).localeCompare(String(a.createdAt)));
  return fresh;
}

async function addSeeds(env) {
  const kv = env.SUBMISSIONS;
  const added = [];
  for (const d of SEEDS) {
    const slug = d.slug;
    if (await kv.get('seed-done:' + slug, { cacheTtl: 60 })) continue;
    if (!(await kv.get('spk:' + slug))) {
      const res = cleanSpeaker(d, null);
      if (res.error) continue;
      // a photo shipped with the site (assets/seed/) goes into storage like an uploaded one
      if (d.photo && env.ASSETS) {
        try {
          const r = await env.ASSETS.fetch(new Request(new URL(d.photo, 'https://speakerfolio.com')));
          if (r.ok) {
            res.speaker.photoVer = Date.now().toString(36);
            await kv.put('photo:' + slug, await r.arrayBuffer(), { metadata: { type: 'image/webp', ver: res.speaker.photoVer } });
          }
        } catch (e) { /* draft without a photo */ }
      }
      await kv.put('spk:' + slug, JSON.stringify(res.speaker));
      added.push(res.speaker);
    }
    await kv.put('seed-done:' + slug, '1');
  }
  return added;
}


export function decodePhoto(dataUrl) {
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
  let index = await syncIndex(env);

  if (body.action === 'delete') {
    const slug = String(body.slug || '');
    await kv.delete('spk:' + slug);
    await kv.delete('photo:' + slug);
    const tok = await kv.get('edit-link:' + slug);
    if (tok) await kv.delete('edit-token:' + tok);
    await kv.delete('edit-link:' + slug);
    await kv.delete('edit-req:' + slug);
    await writeIndex(env, index.filter((s) => s.slug !== slug));
    return json({ ok: true });
  }
  if (body.action === 'editlink' || body.action === 'newlink') {
    const slug = String(body.slug || '');
    if (!(await kv.get('spk:' + slug))) return json({ ok: false, error: 'Speaker not found.' }, 404);
    let tok = body.action === 'editlink' ? await kv.get('edit-link:' + slug) : null;
    if (body.action === 'newlink') { const old = await kv.get('edit-link:' + slug); if (old) await kv.delete('edit-token:' + old); }
    if (!tok) {
      const b = new Uint8Array(18); crypto.getRandomValues(b);
      tok = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
      await kv.put('edit-token:' + tok, slug);
      await kv.put('edit-link:' + slug, tok);
    }
    return json({ ok: true, url: new URL(request.url).origin + '/update-profile/?t=' + tok });
  }
  if (body.action === 'acceptEdit' || body.action === 'rejectEdit') {
    const slug = String(body.slug || '');
    const existing = await getSpeaker(env, slug);
    const req = await kv.get('edit-req:' + slug, 'json');
    if (!existing || !req) return json({ ok: false, error: 'No edits waiting for this speaker.' }, 404);
    const note = String(body.note || '').slice(0, 2000);
    let saved = existing;
    if (body.action === 'acceptEdit') {
      const merged = Object.assign({}, existing);
      SELF_FIELDS.forEach((k) => { if (req.data && k in req.data) merged[k] = req.data[k]; });
      const res = cleanSpeaker(merged, existing);
      if (res.error) return json({ ok: false, error: res.error }, 400);
      saved = res.speaker;
      if (req.photo) {
        const p = decodePhoto(req.photo);
        if (p && !p.error) { saved.photoVer = Date.now().toString(36); await kv.put('photo:' + slug, p.bytes, { metadata: { type: p.type, ver: saved.photoVer } }); }
      }
      await kv.put('spk:' + slug, JSON.stringify(saved));
      index = index.filter((x) => x.slug !== slug); index.push(summary(saved)); await writeIndex(env, index);
    }
    const log = (await kv.get('edit-log:' + slug, 'json')) || [];
    log.unshift({ at: new Date().toISOString(), result: body.action === 'acceptEdit' ? 'accepted' : 'rejected', note, email: req.email });
    await kv.put('edit-log:' + slug, JSON.stringify(log.slice(0, 20)));
    await kv.delete('edit-req:' + slug);
    return json({ ok: true, speaker: saved, email: req.email || saved.bookingEmail || '', name: saved.name });
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
