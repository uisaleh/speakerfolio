// /api/indexnow  POST (admin): send every URL in the sitemap, plus the client speaker sites, to IndexNow
// (Bing, Yandex, Seznam, Naver). Bing usually crawls submitted URLs within hours.
import { json, authorised } from '../_lib/speakers.js';

const KEY = '22e8e9a3fea1aba3233484e9965a4d69';
const CLIENT_SITES = ['aymannassar', 'robertabogany', 'admiraljim', 'anthonybaptiste', 'kudramohammed', 'rudolphmills', 'joshmccartney', 'peteakennedy'];

export async function onRequestPost({ request, env }) {
  if (!(await authorised(request, env))) return json({ ok: false, error: 'Wrong password.' }, 401);
  const origin = 'https://speakerfolio.com';
  const xml = await (await fetch(origin + '/sitemap.xml', { cf: { cacheTtl: 0 } })).text();
  const urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).filter((u) => u.startsWith(origin)))];
  const results = [];
  const send = async (host, list) => {
    if (!list.length) return;
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key: KEY, keyLocation: 'https://' + host + '/' + KEY + '.txt', urlList: list.slice(0, 10000) })
    });
    results.push({ host, urls: list.length, status: r.status });
  };
  await send('speakerfolio.com', urls);
  for (const c of CLIENT_SITES) await send(c + '.speakerfolio.com', ['https://' + c + '.speakerfolio.com/']);
  const ok = results.every((r) => r.status === 200 || r.status === 202);
  return json({ ok, submitted: urls.length, results });
}

export async function onRequest() {
  return json({ ok: false, error: 'Use POST.' }, 405);
}
