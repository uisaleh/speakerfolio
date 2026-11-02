// POST /api/submit
// Saves a website request or question from the landing page and sends a Telegram notification.
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

export async function onRequestPost({ request, env }) {
  let data;
  try { data = await request.json(); } catch (e) { return json({ ok: false, error: 'Send the form as JSON.' }, 400); }
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

  if (env.SUBMISSIONS) {
    // reverse-time key, so the newest submissions list first
    const key = 'sub:' + String(9999999999999 - now.getTime()).padStart(13, '0') + ':' + id;
    await env.SUBMISSIONS.put(key, JSON.stringify(record));
  }

  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const lines = [(kind === 'Question' ? '❓ New question' : kind === 'Booking request' ? '📅 New booking request' : '🎉 New website request') + ' on Speakerfolio', ''];
    for (const [k, v] of Object.entries(fields)) lines.push(k + ': ' + v);
    if (record.country) lines.push('Country: ' + record.country);
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
