// /  the home page: static HTML with the featured speakers and the hero avatars filled in from KV
import { getIndex, featuredGrid, photoUrl, esc } from './_lib/speakers.js';

// Put real speaker photos into the three hero avatar slots (pixel faces stay when nobody has a photo yet).
function heroAvatars(html, list) {
  const people = list.filter((s) => s.published && s.photoVer);
  if (!people.length) return html;
  // featured speakers first, then the newest
  people.sort((a, b) => (b.featured - a.featured) || String(b.createdAt).localeCompare(String(a.createdAt)));
  let i = 0;
  html = html.replace(/<a href="\/speakers\/" class="pxav" aria-label="Browse speakers" tabindex="-1" style="([^"]*)">[\s\S]*?<\/a>/g, (m, style) => {
    const s = people[i % people.length];
    const slot = i++;
    if (slot >= people.length) return m; // fewer speakers than slots: keep the pixel face
    return '<a href="/speakers/' + s.slug + '/" class="pxav pxreal" data-slot="' + slot + '" aria-label="' + esc(s.name + ', ' + ((s.topics || [])[0] || 'speaker') + ' speaker') + '" style="' + style.replace('pointer-events: auto;', '') + ' pointer-events: auto; display: block;">'
      + '<img src="' + photoUrl(s) + '" alt="" width="200" height="200" decoding="async" style="display: block; width: 100%; height: 100%; object-fit: cover;">'
      + '<span class="pxname">' + esc(s.name) + '</span></a>';
  });
  // more than three speakers: rotate through them
  if (people.length > 3) {
    const data = people.map((s) => ({ u: '/speakers/' + s.slug + '/', p: photoUrl(s), n: s.name, t: ((s.topics || [])[0] || 'speaker') + ' speaker' }));
    html = html.replace('</body>', '<script>(function(){var P=' + JSON.stringify(data).replace(/</g, '\\u003c') + ',next=3;var slots=[].slice.call(document.querySelectorAll(".pxreal"));if(slots.length<3||window.matchMedia("(prefers-reduced-motion: reduce)").matches){return;}'
      + 'var k=0;setInterval(function(){var a=slots[k%slots.length],s=P[next%P.length];next++;k++;a.style.opacity="0";setTimeout(function(){a.href=s.u;a.setAttribute("aria-label",s.n+", "+s.t);a.querySelector("img").src=s.p;a.querySelector(".pxname").textContent=s.n;a.style.opacity="1";},500);},3500);})();</script></body>');
  }
  return html;
}

export async function onRequestGet({ request, env, next }) {
  const res = await next();
  if (res.status !== 200 || !(res.headers.get('Content-Type') || '').includes('text/html')) return res;
  let html = await res.text();
  try {
    const list = await getIndex(env);
    if (list.some((s) => s.published)) {
      html = html.replace(/<!--FEATURED-->[\s\S]*?<!--\/FEATURED-->/, '<!--FEATURED-->' + featuredGrid(list) + '<!--/FEATURED-->');
      html = heroAvatars(html, list);
    }
  } catch (e) { /* keep the static page */ }
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=60' } });
}
