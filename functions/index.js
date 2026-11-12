// /  the home page: static HTML with the featured speakers and the hero avatars filled in from KV
import { getIndex, featuredGrid, photoUrl, esc } from './_lib/speakers.js';

// The visitor's country (from Cloudflare) as the names speakers type in their location.
const ALIASES = {
  US: ['united states', 'usa', 'u.s.a.', 'us', 'america', 'united states of america'],
  GB: ['united kingdom', 'uk', 'england', 'scotland', 'wales', 'northern ireland', 'great britain', 'britain'],
  AE: ['united arab emirates', 'uae', 'dubai', 'abu dhabi'],
  KR: ['south korea', 'korea'], NL: ['netherlands', 'holland'], CZ: ['czech republic', 'czechia']
};
function countryNames(code) {
  code = String(code || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || code === 'XX' || code === 'T1') return [];
  const names = (ALIASES[code] || []).slice();
  try { const n = new Intl.DisplayNames(['en'], { type: 'region' }).of(code); if (n) names.push(n.toLowerCase()); } catch (e) { /* no ICU */ }
  return names;
}
function fromCountry(s, names) {
  if (!names.length) return false;
  const parts = String(s.location || '').toLowerCase().split(',').map((x) => x.trim()).filter(Boolean);
  return parts.some((p) => names.includes(p));
}
// Speakers from the visitor's country first, then featured, then newest.
function localFirst(list, names) {
  return list.slice().sort((a, b) => (fromCountry(b, names) - fromCountry(a, names)) || (b.featured - a.featured) || String(b.createdAt).localeCompare(String(a.createdAt)));
}

// Put real speaker photos into the three hero avatar slots (pixel faces stay when nobody has a photo yet).
// "Watch, compare, shortlist" card: three real speaker photos instead of initials
function shortlistAvatars(html, list) {
  // speakers with a photo first, then other published speakers (shown with their own initials)
  const pub = list.filter((s) => s.published);
  const people = pub.filter((s) => s.photoVer).concat(pub.filter((s) => !s.photoVer)).slice(0, 3);
  if (!people.length) return html;
  let i = 0;
  return html.replace(/<span style="width: 34px; height: 34px; background: (#[0-9a-f]{6}); color: #fff8ef; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">[A-Z]{2}<\/span>/g, (m, bg) => {
    const s = people[i++];
    if (!s) return '';
    if (s.photoVer) return '<img src="' + photoUrl(s) + '" alt="" width="34" height="34" loading="lazy" decoding="async" style="width: 34px; height: 34px; object-fit: cover; display: block;">';
    const ini = String(s.name || '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
    return '<span style="width: 34px; height: 34px; background: ' + bg + '; color: #fff8ef; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">' + esc(ini) + '</span>';
  }).replace('>3 on your shortlist<', '>' + people.length + ' on your shortlist<');
}

function heroAvatars(html, list) {
  const people = list.filter((s) => s.published && s.photoVer);
  if (!people.length) return html;
  // the design has three avatar slots; add two more spots on the pixel grid
  const first = html.match(/<a href="\/speakers\/" class="pxav" aria-label="Browse speakers" tabindex="-1" style="[^"]*">[\s\S]*?<\/a>/);
  if (first) {
    const extra = [['2', '3'], ['5', '10']].map(([c, r]) => first[0].replace(/grid-column: \d+ \/ span 3; grid-row: \d+ \/ span 3;/, 'grid-column: ' + c + ' / span 3; grid-row: ' + r + ' / span 3;')).join('');
    html = html.replace(first[0], extra + first[0]);
  }
  let i = 0;
  html = html.replace(/<a href="\/speakers\/" class="pxav" aria-label="Browse speakers" tabindex="-1" style="([^"]*)">[\s\S]*?<\/a>/g, (m, style) => {
    const s = people[i % people.length];
    const slot = i++;
    if (slot >= people.length) return m; // fewer speakers than slots: keep the pixel face
    return '<a href="/speakers/' + s.slug + '/" class="pxav pxreal" data-slot="' + slot + '" aria-label="' + esc(s.name + ', ' + ((s.topics || [])[0] || 'speaker') + ' speaker') + '" style="' + style.replace('pointer-events: auto;', '') + ' pointer-events: auto; display: block;">'
      + '<img src="' + photoUrl(s) + '" alt="" width="200" height="200" decoding="async" style="display: block; width: 100%; height: 100%; object-fit: cover;">'
      + '<span class="pxname">' + esc(s.name) + '</span></a>';
  });
  // more speakers than slots: rotate through them
  if (people.length > 5) {
    const data = people.map((s) => ({ u: '/speakers/' + s.slug + '/', p: photoUrl(s), n: s.name, t: ((s.topics || [])[0] || 'speaker') + ' speaker' }));
    html = html.replace('</body>', '<script>(function(){var P=' + JSON.stringify(data).replace(/</g, '\\u003c') + ',next=5;var slots=[].slice.call(document.querySelectorAll(".pxreal"));if(slots.length<5||window.matchMedia("(prefers-reduced-motion: reduce)").matches){return;}'
      + 'var k=0;setInterval(function(){var a=slots[k%slots.length],s=P[next%P.length];next++;k++;a.style.opacity="0";setTimeout(function(){a.href=s.u;a.setAttribute("aria-label",s.n+", "+s.t);a.querySelector("img").src=s.p;a.querySelector(".pxname").textContent=s.n;a.style.opacity="1";},500);},3500);})();</script></body>');
  }
  return html;
}

export async function onRequestGet({ request, env, next }) {
  const res = await next();
  if (res.status !== 200 || !(res.headers.get('Content-Type') || '').includes('text/html')) return res;
  let html = await res.text();
  try {
    const list = localFirst(await getIndex(env), countryNames(request.cf && request.cf.country));
    if (list.some((s) => s.published)) {
      html = html.replace(/<!--FEATURED-->[\s\S]*?<!--\/FEATURED-->/, '<!--FEATURED-->' + featuredGrid(list) + '<!--/FEATURED-->');
      html = heroAvatars(html, list);
      html = shortlistAvatars(html, list);
    }
  } catch (e) { /* keep the static page */ }
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, max-age=60', 'Vary': 'CF-IPCountry' } });
}
