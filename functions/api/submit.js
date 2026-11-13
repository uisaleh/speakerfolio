// POST /api/submit
// Saves a website request or question from the landing page and sends a Telegram notification.
// Accepts JSON, or multipart with a "data" JSON part and up to 3 "files" (10 MB each), stored in KV as att:<id>:<n>.
//
// Cloudflare Pages settings needed:
//   KV binding         SUBMISSIONS          (Settings > Bindings > KV namespace)
//   Secret             TELEGRAM_BOT_TOKEN   (from @BotFather)
//   Variable           TELEGRAM_CHAT_ID     (your chat id)

const MAX_FIELD = 2000;

function clean(v) {
  return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, MAX_FIELD);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

// Optional attachments (multipart form: a "data" JSON part plus "files").
const MAX_FILES = 3;
const MAX_FILE = 10 * 1024 * 1024;
const FILE_EXT = /\.(pdf|docx?|pptx?|key|pages|txt|rtf|odt|jpe?g|png|webp|gif|heic)$/i;

export async function onRequestPost({ request, env }) {
  let data, files = [];
  const ctype = request.headers.get('Content-Type') || '';
  if (ctype.includes('multipart/form-data')) {
    let form;
    try { form = await request.formData(); } catch (e) { return json({ ok: false, error: 'Could not read the form.' }, 400); }
    try { data = JSON.parse(String(form.get('data') || '{}')); } catch (e) { return json({ ok: false, error: 'Bad form data.' }, 400); }
    files = form.getAll('files').filter((f) => f && typeof f === 'object' && typeof f.arrayBuffer === 'function' && f.size > 0);
    if (files.length > MAX_FILES) return json({ ok: false, error: 'Attach up to ' + MAX_FILES + ' files.' }, 400);
    for (const f of files) {
      if (f.size > MAX_FILE) return json({ ok: false, error: f.name + ' is larger than 10 MB.' }, 400);
      if (!FILE_EXT.test(f.name || '')) return json({ ok: false, error: f.name + ' is not a supported file type.' }, 400);
    }
  } else {
    try { data = await request.json(); } catch (e) { return json({ ok: false, error: 'Send the form as JSON.' }, 400); }
  }
  if (!data || typeof data !== 'object') { return json({ ok: false, error: 'Empty form.' }, 400); }
  if (data._hp) { return json({ ok: true }); } // spam bots fill the hidden field

  const type = clean(data.Type);
  const kind = type === 'Question' ? 'Question' : type === 'Booking request' ? 'Booking request' : 'Website request';
  const fields = {};
  for (const [k, v] of Object.entries(data)) {
    if (k.startsWith('_') || k === 'Type') continue;
    fields[clean(k).slice(0, 60)] = clean(v);
  }
  if (!fields.Email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.Email)) {
    return json({ ok: false, error: 'A valid email is required.' }, 400);
  }

  // booking requests from a speaker profile: add the speaker's booking email so the request can be forwarded
  if (kind === 'Booking request' && env.SUBMISSIONS && /^[a-z0-9-]{1,60}$/.test(String(data._speaker || ''))) {
    try {
      const sp = JSON.parse((await env.SUBMISSIONS.get('spk:' + data._speaker)) || 'null');
      if (sp) { fields.Speaker = sp.name; fields['Speaker profile'] = new URL(request.url).origin + '/speakers/' + sp.slug + '/'; if (sp.bookingEmail) fields['Forward to'] = sp.bookingEmail; }
    } catch (e) { /* keep going */ }
  }

  const now = new Date();
  const id = now.getTime().toString(36) + '-' + crypto.randomUUID().slice(0, 8);
  const record = {
    id, kind, status: 'New', createdAt: now.toISOString(), fields,
    country: (request.cf && request.cf.country) || '', page: clean(request.headers.get('Referer') || '')
  };

  if (files.length && env.SUBMISSIONS) {
    record.files = [];
    for (let n = 0; n < files.length; n++) {
      const f = files[n];
      const name = clean(f.name).replace(/[\\/]/g, '_').slice(0, 120) || ('file-' + (n + 1));
      const key = 'att:' + id + ':' + n;
      await env.SUBMISSIONS.put(key, await f.arrayBuffer(), { metadata: { name, type: String(f.type || 'application/octet-stream').slice(0, 100), size: f.size } });
      record.files.push({ key, name, type: f.type || '', size: f.size });
    }
  }

  if (env.SUBMISSIONS) {
    // reverse-time key, so the newest submissions list first
    const key = 'sub:' + String(9999999999999 - now.getTime()).padStart(13, '0') + ':' + id;
    await env.SUBMISSIONS.put(key, JSON.stringify(record));
  }

  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const lines = [(kind === 'Question' ? '❓ New question' : kind === 'Booking request' ? '📅 New booking request' : '🎉 New website request') + ' on Speakerfolio', ''];
    for (const [k, v] of Object.entries(fields)) lines.push(k + ': ' + v);
    if (record.country) lines.push('Country: ' + record.country);
    if (record.files && record.files.length) lines.push('Files: ' + record.files.map((f) => f.name + ' (' + Math.max(1, Math.round(f.size / 1024)) + ' KB)').join(', '));
    const origin = new URL(request.url).origin;
    lines.push('', 'Open admin: ' + origin + '/admin/');
    try {
      await fetch('https://api.telegram.org/bot' + env.TELEGRAM_BOT_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: lines.join('\n').slice(0, 4000), disable_web_page_preview: true })
      });
    } catch (e) { /* the request is saved even if Telegram is down */ }
  }

  return json({ ok: true, id });
}

export async function onRequest() {
  return json({ ok: false, error: 'Use POST.' }, 405);
}
