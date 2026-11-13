// /api/submissions  (admin only)
//   GET   list all submissions, newest first
//   POST  { id, status }  change a submission's status
//   POST  { id, delete: true }  delete a submission
// Needs the secret ADMIN_PASSWORD and the KV binding SUBMISSIONS.

const STATUSES = ['New', 'Contacted', 'Building', 'Live', 'Not a fit'];

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

import { authorised } from '../_lib/speakers.js';

async function allKeys(kv) {
  const keys = [];
  let cursor;
  do {
    const page = await kv.list({ prefix: 'sub:', cursor });
    keys.push(...page.keys.map((k) => k.name));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return keys;
}

export async function onRequestGet({ request, env }) {
  if (!(await authorised(request, env))) return json({ ok: false, error: 'Wrong password.' }, 401);
  if (!env.SUBMISSIONS) return json({ ok: false, error: 'The SUBMISSIONS storage is not connected yet.' }, 500);
  const keys = (await allKeys(env.SUBMISSIONS)).sort().slice(0, 500);
  const items = (await Promise.all(keys.map(async (k) => {
    const v = await env.SUBMISSIONS.get(k);
    if (!v) return null;
    try { return Object.assign(JSON.parse(v), { key: k }); } catch (e) { return null; }
  }))).filter(Boolean);
  return json({ ok: true, items, statuses: STATUSES });
}

export async function onRequestPost({ request, env }) {
  if (!(await authorised(request, env))) return json({ ok: false, error: 'Wrong password.' }, 401);
  if (!env.SUBMISSIONS) return json({ ok: false, error: 'The SUBMISSIONS storage is not connected yet.' }, 500);
  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'Bad request.' }, 400); }
  const key = String(body.key || '');
  if (!key.startsWith('sub:')) return json({ ok: false, error: 'Unknown submission.' }, 400);
  if (body.delete) {
    try { const rec = JSON.parse((await env.SUBMISSIONS.get(key)) || '{}'); for (const f of rec.files || []) { if (/^att:/.test(f.key)) await env.SUBMISSIONS.delete(f.key); } } catch (e) { /* still delete the request */ }
    await env.SUBMISSIONS.delete(key); return json({ ok: true });
  }
  const current = await env.SUBMISSIONS.get(key);
  if (!current) return json({ ok: false, error: 'Submission not found.' }, 404);
  const record = JSON.parse(current);
  if (body.status && STATUSES.includes(body.status)) record.status = body.status;
  if (typeof body.note === 'string') record.note = body.note.slice(0, 2000);
  record.updatedAt = new Date().toISOString();
  await env.SUBMISSIONS.put(key, JSON.stringify(record));
  return json({ ok: true, item: Object.assign(record, { key }) });
}
