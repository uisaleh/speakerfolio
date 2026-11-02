// Shared code for the speaker directory: storage in KV, admin check, and HTML rendering.
//
// KV (binding SUBMISSIONS):
//   spk:<slug>        full speaker record (JSON)
//   spk-index         list of card summaries for every speaker (JSON array), kept in sync on save/delete
//   photo:<slug>      the speaker photo (WebP bytes), metadata { type, ver }

import { HEAD_BASE, WRAP_OPEN, HEADER, FOOTER, CTA, EMPTY_FEATURED, ARROW } from './shell.js';

export const SITE = 'https://speakerfolio.com';
export const TOPICS = ['Leadership', 'Sales', 'Motivation', 'HR and culture', 'Technology', 'Health and wellbeing', 'Communication', 'Entrepreneurship'];
export const FORMATS = ['Keynote', 'Workshop', 'Training', 'Virtual', 'Panel', 'Emcee'];
export { EMPTY_FEATURED, ARROW };

const TONES = ['#14161a', '#e31837', '#8f1426', '#1b1d22', '#55585f', '#2a0e13'];

export function slugify(t) {
  return String(t || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}
export const topicSlug = slugify;
export function topicFromSlug(s) { return TOPICS.find((t) => slugify(t) === s) || null; }

export function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function initials(name) {
  return String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}
function tone(slug) {
  let h = 0;
  for (const c of String(slug)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TONES[h % TONES.length];
}
function safeUrl(u) {
  u = String(u || '').trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  try { const x = new URL(u); return x.protocol === 'https:' || x.protocol === 'http:' ? x.toString() : ''; } catch (e) { return ''; }
}
export function youtubeId(u) {
  const m = String(u || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : '';
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

// ---------- admin check (same password as the admin panel) ----------
async function sha(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
export async function authorised(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const header = request.headers.get('Authorization') || '';
  const given = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!given) return false;
  return (await sha(given)) === (await sha(env.ADMIN_PASSWORD));
}
// a preview link for an unpublished profile: /speakers/<slug>/?preview=<token>
export async function previewToken(env, slug) {
  return env.ADMIN_PASSWORD ? (await sha(env.ADMIN_PASSWORD + ':preview:' + slug)).slice(0, 24) : '';
}

// ---------- storage ----------
export async function getIndex(env) {
  if (!env.SUBMISSIONS) return [];
  try { return JSON.parse((await env.SUBMISSIONS.get('spk-index')) || '[]'); } catch (e) { return []; }
}
export async function getPublished(env) {
  return (await getIndex(env)).filter((s) => s.published);
}
export async function getSpeaker(env, slug) {
  if (!env.SUBMISSIONS || !slug) return null;
  try { return JSON.parse((await env.SUBMISSIONS.get('spk:' + slug)) || 'null'); } catch (e) { return null; }
}
export function photoUrl(s) {
  return s.photoVer ? '/media/speakers/' + s.slug + '-' + s.photoVer + '.webp' : '';
}
export function summary(s) {
  return {
    slug: s.slug, name: s.name, headline: s.headline, topics: s.topics, formats: s.formats, location: s.location,
    photoVer: s.photoVer || '', featured: !!s.featured, published: !!s.published, createdAt: s.createdAt, updatedAt: s.updatedAt
  };
}
export async function writeIndex(env, list) {
  list.sort((a, b) => (b.featured - a.featured) || String(b.createdAt).localeCompare(String(a.createdAt)));
  await env.SUBMISSIONS.put('spk-index', JSON.stringify(list));
}

const T = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, n);
const lines = (v, max, n) => (Array.isArray(v) ? v : String(v || '').split('\n')).map((x) => T(x, n)).filter(Boolean).slice(0, max);

// Clean and validate a speaker sent by the admin form. Returns { speaker } or { error }.
export function cleanSpeaker(d, existing) {
  const s = {};
  s.name = T(d.name, 80);
  if (!s.name) return { error: 'Add the speaker\'s name.' };
  s.slug = slugify(d.slug || s.name);
  if (!s.slug) return { error: 'The web address can only use letters, numbers and dashes.' };
  s.headline = T(d.headline, 140);
  if (!s.headline) return { error: 'Add a one-line headline, for example "Keynote speaker on leading through change".' };
  s.topics = (Array.isArray(d.topics) ? d.topics : []).filter((t) => TOPICS.includes(t)).slice(0, 4);
  if (!s.topics.length) return { error: 'Pick at least one topic.' };
  s.formats = (Array.isArray(d.formats) ? d.formats : []).filter((t) => FORMATS.includes(t));
  s.speakerType = T(d.speakerType, 40);
  s.location = T(d.location, 80);
  s.languages = T(d.languages, 80);
  s.travel = T(d.travel, 80);
  s.length = T(d.length, 40);
  s.audience = T(d.audience, 40);
  s.fee = T(d.fee, 40);
  s.shortBio = T(d.shortBio, 900);
  s.bio = T(d.bio, 4000);
  s.talks = (Array.isArray(d.talks) ? d.talks : []).slice(0, 4).map((t) => ({
    title: T(t.title, 120), format: T(t.format, 30), length: T(t.length, 30), summary: T(t.summary, 400), takeaways: lines(t.takeaways, 4, 140)
  })).filter((t) => t.title);
  s.video = youtubeId(d.video) ? 'https://www.youtube.com/watch?v=' + youtubeId(d.video) : '';
  s.videoTitle = T(d.videoTitle, 120);
  s.events = (Array.isArray(d.events) ? d.events : []).slice(0, 12).map((e) => ({ event: T(e.event, 100), organizer: T(e.organizer, 100), format: T(e.format, 30), year: T(e.year, 4) })).filter((e) => e.event || e.organizer);
  s.quotes = (Array.isArray(d.quotes) ? d.quotes : []).slice(0, 6).map((q) => ({ quote: T(q.quote, 500), name: T(q.name, 80), role: T(q.role, 120) })).filter((q) => q.quote && q.name);
  s.links = {};
  for (const k of ['website', 'linkedin', 'youtube', 'instagram', 'x', 'facebook']) { const u = safeUrl(d.links && d.links[k]); if (u) s.links[k] = u; }
  s.bookingEmail = T(d.bookingEmail, 120);
  if (s.bookingEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.bookingEmail)) return { error: 'The booking email doesn\'t look right.' };
  s.consent = !!d.consent;
  s.consentNote = T(d.consentNote, 300);
  s.featured = !!d.featured;
  s.published = !!d.published;
  if (s.published && !s.consent) return { error: 'Tick "The speaker agreed to be listed" before publishing.' };
  if (s.published && !s.consentNote) return { error: 'Note how the speaker agreed (for example "Email, 2 Nov 2026") before publishing.' };
  const now = new Date().toISOString();
  s.photoVer = existing ? existing.photoVer || '' : '';
  s.createdAt = existing ? existing.createdAt : now;
  s.updatedAt = now;
  return { speaker: s };
}

// ---------- HTML ----------
const W = 'max-width: 1280px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 48px); box-sizing: border-box; border-left: 1px dotted rgba(20,22,26,0.16); border-right: 1px dotted rgba(20,22,26,0.16);';
const WD = 'max-width: 1280px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 48px); box-sizing: border-box; border-left: 1px dotted rgba(255,255,255,0.26); border-right: 1px dotted rgba(255,255,255,0.26);';
const EB = (t, dark) => '<div style="display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: ' + (dark ? 'rgba(255,255,255,0.72)' : '#55585f') + ';"><span aria-hidden="true" style="width: 6px; height: 6px; background: ' + (dark ? '#ff5a6e' : '#e31837') + ';"></span>' + t + '</div>';
const H2 = 'margin: 0; font-size: clamp(34px, 3.8vw, 53px); line-height: 1.04; font-weight: 400; letter-spacing: -0.036em;';
export const BTN = 'display: inline-flex; align-items: center; gap: 8px; height: 52px; padding: 0 26px; text-decoration: none; font-size: 15px; font-weight: 700;';

const PAGE_CSS = '<style>[hidden]{display:none!important}'
  + '.sf-card{display:flex;flex-direction:column;text-decoration:none;color:#14161a;background:#ffffff;border:1px solid rgba(20,22,26,0.14);transition:border-color .15s ease}.sf-card:hover{border-color:#14161a;color:#14161a}.sf-card:hover .sp-name{color:#e31837}'
  + '.sf-ph{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:64px;font-weight:500;letter-spacing:-0.04em;color:#fff8ef;overflow:hidden}.sf-ph img{width:100%;height:100%;object-fit:cover;display:block}'
  + '.sf-chip{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border:1px solid rgba(20,22,26,0.18);background:#ffffff;font-size:13.5px;color:#14161a}'
  + '.sf-fbtn{display:inline-flex;align-items:center;height:36px;padding:0 12px;border:1px solid rgba(20,22,26,0.24);background:#ffffff;color:#14161a;font:inherit;font-size:13.5px;font-weight:700;cursor:pointer}.sf-fbtn[aria-pressed="true"]{background:#14161a;border-color:#14161a;color:#ffffff}'
  + '.sf-tl a{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 12px;border-left:2px solid transparent;color:#14161a;text-decoration:none;font-size:15px}.sf-tl a:hover{background:#f8f7f4;color:#14161a}.sf-tl a[aria-current="page"]{border-left-color:#e31837;background:#f8f7f4;font-weight:700}.sf-tl a span{font-size:12.5px;color:#55585f}'
  + '.sf-in{width:100%;box-sizing:border-box;height:48px;padding:0 14px;border:1px solid rgba(20,22,26,0.24);background:#ffffff;font:inherit;font-size:16px;color:#14161a;border-radius:0}.sf-in:focus{outline:2px solid #e31837;outline-offset:-1px}'
  + 'textarea.sf-in{height:auto;min-height:110px;padding:12px 14px;resize:vertical}'
  + '.sf-lab{display:flex;flex-direction:column;gap:6px;font-size:14px;font-weight:700;color:#14161a;min-width:0}'
  + '.sf-pro p{margin:0 0 16px;font-size:17px;line-height:1.65;color:#2a2c31}'
  + '.sf-vid{position:relative;display:block;width:100%;aspect-ratio:16/9;background:#14161a;border:0;padding:0;cursor:pointer;overflow:hidden}.sf-vid img{width:100%;height:100%;object-fit:cover;display:block;opacity:.86}.sf-vid iframe{position:absolute;inset:0;width:100%;height:100%;border:0}'
  + '.sf-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:76px;height:56px;background:#e31837;display:flex;align-items:center;justify-content:center}'
  + '.sf-side{position:sticky;top:24px}'
  + '@media (max-width: 900px){.sf-dir{grid-template-columns:minmax(0,1fr) !important}.sf-side{position:static}.sf-hero{grid-template-columns:minmax(0,1fr) !important}.sf-hero .sf-ph{max-width:320px}.sf-stats{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.sf-stats>div{padding:18px 12px 18px 0 !important;border-left:0 !important;border-bottom:1px solid rgba(20,22,26,0.12)}.sf-two{grid-template-columns:minmax(0,1fr) !important}}'
  + '@media (max-width: 760px){.sf-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:8px !important}.sf-grid .sf-ph{font-size:38px}.sf-grid .sf-body{padding:12px !important}.sf-grid .sp-name{font-size:16px !important}.sf-grid .sp-role{font-size:13px !important}.sf-grid .sp-meta{display:none !important}.sf-form{grid-template-columns:minmax(0,1fr) !important}}'
  + '</style>\n';

export function page({ title, desc, path, image, ld, body, robots, status = 200, cache = 'public, max-age=60' }) {
  const url = SITE + path;
  const img = image ? (image.startsWith('http') ? image : SITE + image) : SITE + '/assets/img/speakerfolio-directory-og.jpg';
  const html = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    + '<title>' + esc(title) + '</title>\n<meta name="description" content="' + esc(desc) + '">\n'
    + '<link rel="canonical" href="' + esc(url) + '">\n<meta name="robots" content="' + (robots || 'index, follow, max-image-preview:large') + '">\n'
    + '<meta property="og:site_name" content="Speakerfolio">\n<meta property="og:title" content="' + esc(title) + '">\n<meta property="og:description" content="' + esc(desc) + '">\n'
    + '<meta property="og:type" content="' + (ld && ld.ogType ? ld.ogType : 'website') + '">\n<meta property="og:url" content="' + esc(url) + '">\n<meta property="og:image" content="' + esc(img) + '">\n'
    + (image ? '<meta property="og:image:width" content="800">\n<meta property="og:image:height" content="800">\n' : '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n')
    + '<meta property="og:image:alt" content="' + esc(title.split(' | ')[0]) + '">\n<meta property="og:locale" content="en_US">\n'
    + '<meta name="twitter:card" content="' + (image ? 'summary' : 'summary_large_image') + '">\n<meta name="twitter:title" content="' + esc(title) + '">\n<meta name="twitter:description" content="' + esc(desc) + '">\n'
    + '<link rel="alternate" type="application/rss+xml" title="Speakerfolio articles" href="' + SITE + '/articles/feed.xml">\n'
    + HEAD_BASE + PAGE_CSS
    + (ld && ld.graph ? '<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@graph': ld.graph }).replace(/</g, '\\u003c') + '</script>\n' : '')
    + '</head>\n<body>\n' + WRAP_OPEN + HEADER + body + CTA + FOOTER + '</div>\n</body>\n</html>\n';
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': cache } });
}

export const ORG = { '@type': 'Organization', '@id': SITE + '/#org', name: 'Speakerfolio', url: SITE + '/', logo: SITE + '/apple-touch-icon.png' };
export function breadcrumbs(items) {
  const vis = '<nav aria-label="Breadcrumb" style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 14px; color: #55585f;">'
    + items.map(([n, u], k) => k < items.length - 1
      ? '<a href="' + u + '" style="color: #55585f; text-decoration: none;">' + esc(n) + '</a><span aria-hidden="true" style="color: #a3a5ab;">/</span>'
      : '<span aria-current="page" style="color: #14161a; font-weight: 700;">' + esc(n) + '</span>').join('') + '</nav>';
  const ld = { '@type': 'BreadcrumbList', itemListElement: items.map(([n, u], k) => ({ '@type': 'ListItem', position: k + 1, name: n, item: SITE + u })) };
  return { vis, ld };
}

export function avatar(s, size) {
  const p = photoUrl(s);
  return '<div class="sf-ph" aria-hidden="' + (p ? 'false' : 'true') + '" style="background: ' + tone(s.slug) + ';' + (size ? 'font-size: ' + size + 'px;' : '') + '">'
    + (p ? '<img src="' + p + '" alt="' + esc(s.name) + '" width="800" height="800" loading="lazy" decoding="async">' : esc(initials(s.name))) + '</div>';
}

export function card(s, h = 'h3') {
  return '<a class="sf-card" href="/speakers/' + s.slug + '/" data-topics="' + esc((s.topics || []).join('|')) + '" data-formats="' + esc((s.formats || []).join('|'))
    + '" data-q="' + esc([s.name, s.headline, s.location, (s.topics || []).join(' ')].join(' ').toLowerCase()) + '" data-loc="' + esc(country(s.location)) + '" data-new="' + esc(s.createdAt || '') + '">'
    + avatar(s)
    + '<div class="sf-body sp-body" style="padding: 20px; display: flex; flex-direction: column; gap: 6px;">'
    + '<span style="font-size: 12px; font-weight: 700; letter-spacing: 0.02em; color: #e31837;">' + esc((s.topics || [])[0] || '') + '</span>'
    + '<' + h + ' class="sp-name" style="margin: 0; font-size: 21px; font-weight: 500; letter-spacing: -0.015em; line-height: 1.15;">' + esc(s.name) + '</' + h + '>'
    + '<span class="sp-role" style="font-size: 15px; line-height: 1.35; color: #55585f;">' + esc(s.headline) + '</span>'
    + '<span class="sp-meta" style="display: flex; justify-content: space-between; gap: 10px; font-size: 13px; line-height: 1.35; color: #55585f; padding-top: 6px;"><span>' + esc((s.formats || []).slice(0, 2).join(' · ')) + '</span><span>' + esc(s.location || '') + '</span></span>'
    + '</div></a>';
}
export function country(loc) {
  const parts = String(loc || '').split(',').map((x) => x.trim()).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : '';
}

export function featuredGrid(list) {
  const pick = list.filter((s) => s.published).slice(0, 8);
  return pick.length ? pick.map((s) => card(s)).join('') : EMPTY_FEATURED;
}

export { W, WD, EB, H2 };
