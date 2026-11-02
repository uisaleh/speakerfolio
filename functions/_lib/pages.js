// Server-rendered speaker pages: directory, topic pages and profiles.
import {
  SITE, TOPICS, FORMATS, esc, page, card, avatar, breadcrumbs, photoUrl, youtubeId, country, topicSlug,
  W, WD, EB, H2, BTN, ARROW, ORG, EMPTY_FEATURED
} from './speakers.js';

const TOPIC_INTRO = {
  'Leadership': 'Leadership speakers and trainers for management offsites, leadership summits and new-manager programs: leading through change, building trust, hybrid teams and developing people.',
  'Sales': 'Sales speakers and trainers for sales kickoffs, conferences and team training: prospecting, negotiation, B2B selling and building a high-performing sales culture.',
  'Motivation': 'Motivational speakers for conferences, company events and schools: resilience, mindset, purpose and turning setbacks into action.',
  'HR and culture': 'Speakers on HR and workplace culture: engagement, inclusion, retention, wellbeing at work and building teams people want to stay in.',
  'Technology': 'Technology speakers on AI, digital transformation and the future of work, who explain change in plain language for business audiences.',
  'Health and wellbeing': 'Health and wellbeing speakers and trainers: stress, burnout, resilience, mental health at work and healthy habits that last.',
  'Communication': 'Communication speakers and coaches: public speaking, presentation skills, storytelling, difficult conversations and clear writing.',
  'Entrepreneurship': 'Entrepreneurship speakers: founders and advisers on starting, funding and growing a business, for startup events, incubators and universities.'
};

const ICON = {
  pin: '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e31837" stroke-width="2.4"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  lang: '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e31837" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>',
  plane: '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e31837" stroke-width="2.4"><path d="M3 13l18-8-6 16-3-7-9-1z"/></svg>',
  search: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4.2-4.2"/></svg>'
};

// ---------------- directory and topic pages ----------------
export function directoryPage({ all, topic, q, format, path }) {
  const published = all.filter((s) => s.published);
  const list = topic ? published.filter((s) => (s.topics || []).includes(topic)) : published;
  const counts = Object.fromEntries(TOPICS.map((t) => [t, published.filter((s) => (s.topics || []).includes(t)).length]));
  const countries = [...new Set(list.map((s) => country(s.location)).filter(Boolean))].sort();
  const title = topic ? topic + ' speakers for your event | Speakerfolio' : 'Find a speaker: keynote speakers, trainers and coaches | Speakerfolio';
  const h1 = topic ? topic + ' speakers' : 'Find a speaker for your event.';
  const desc = topic
    ? (TOPIC_INTRO[topic] + ' Compare talks and send a booking request, free.').slice(0, 300)
    : 'Browse keynote speakers, trainers and coaches by topic and format. Every speaker has a full website with talks and video. Free for event planners, no booking fee.';
  const lead = topic ? TOPIC_INTRO[topic] : 'Every speaker has a full website with talks, video and a booking request form. Narrow the list with the filters.';
  const crumbs = breadcrumbs(topic ? [['Home', '/'], ['Speakers', '/speakers/'], [topic, path]] : [['Home', '/'], ['Speakers', '/speakers/']]);

  const topicLinks = '<a href="/speakers/"' + (!topic ? ' aria-current="page"' : '') + '>All topics<span>' + published.length + '</span></a>'
    + TOPICS.map((t) => '<a href="/speakers/topic/' + topicSlug(t) + '/"' + (t === topic ? ' aria-current="page"' : '') + '>' + esc(t) + '<span>' + counts[t] + '</span></a>').join('');
  const fmtBtns = FORMATS.map((f) => '<button type="button" class="sf-fbtn" data-format="' + esc(f) + '" aria-pressed="' + (format === f ? 'true' : 'false') + '">' + esc(f) + '</button>').join('');
  const SEC_H = 'font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #55585f;';

  const sidebar = '<aside class="sf-side" aria-label="Filters" style="display: flex; flex-direction: column; gap: 24px; border: 1px solid rgba(20,22,26,0.14); background: #ffffff; padding: 20px;">'
    + '<div style="display: flex; flex-direction: column; gap: 8px;"><span style="' + SEC_H + '">Topic</span><nav class="sf-tl" aria-label="Topics" style="display: flex; flex-direction: column;">' + topicLinks + '</nav></div>'
    + '<div style="display: flex; flex-direction: column; gap: 10px;"><span style="' + SEC_H + '">Format</span><div style="display: flex; flex-wrap: wrap; gap: 6px;">' + fmtBtns + '</div></div>'
    + '<label style="display: flex; flex-direction: column; gap: 10px;"><span style="' + SEC_H + '">Location</span><select id="sf-loc" class="sf-in" style="height: 44px;"><option value="">Anywhere</option>'
    + countries.map((c) => '<option>' + esc(c) + '</option>').join('') + '</select></label>'
    + '<button type="button" id="sf-clear" style="align-self: flex-start; border: 0; background: none; padding: 0; font: inherit; font-size: 14px; font-weight: 700; color: #14161a; text-decoration: underline; text-underline-offset: 4px; cursor: pointer;">Clear filters</button>'
    + '</aside>';

  const grid = list.length
    ? '<div class="sf-grid" id="sf-grid" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px;">' + list.map((s) => card(s, 'h2')).join('') + '</div>'
      + '<div id="sf-none" hidden style="padding: 40px; border: 1px solid rgba(20,22,26,0.14); background: #ffffff; display: flex; flex-direction: column; gap: 12px; align-items: flex-start;"><strong style="font-size: 20px; font-weight: 500;">No speakers match these filters.</strong><span style="color: #55585f;">Clear a filter, or send us your brief and we will suggest speakers who fit.</span><a href="/contact/" style="font-weight: 700; color: #14161a;">Send your brief</a></div>'
      + '<button type="button" id="sf-more" hidden style="align-self: center; ' + BTN + ' border: 1px solid rgba(20,22,26,0.32); background: #ffffff; color: #14161a; cursor: pointer; font-family: inherit;">Show more speakers</button>'
    : EMPTY_FEATURED;

  const body = '<main>'
    + '<section style="background: #f8f7f4; border-bottom: 1px dotted rgba(20,22,26,0.16);"><div style="' + W + ' padding-top: 48px; padding-bottom: 48px; display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 28px;">'
    + '<div style="flex: 1 1 520px; display: flex; flex-direction: column; gap: 16px; min-width: 0;">' + crumbs.vis
    + '<h1 style="margin: 0; font-size: clamp(36px, 4.2vw, 56px); line-height: 1.02; font-weight: 500; letter-spacing: -0.034em;">' + esc(h1) + '</h1>'
    + '<p style="margin: 0; max-width: 640px; font-size: 18px; line-height: 1.55; color: #55585f;">' + esc(lead) + '</p></div>'
    + (list.length ? '<label style="flex: 0 1 380px; display: flex; flex-direction: column; gap: 8px; font-size: 14px; font-weight: 700;">Search<span style="position: relative; display: block;"><span style="position: absolute; left: 14px; top: 15px; color: #55585f;">' + ICON.search + '</span><input id="sf-q" class="sf-in" type="search" value="' + esc(q || '') + '" placeholder="Name, topic or city" style="padding-left: 42px;"></span></label>' : '')
    + '</div></section>'
    + '<section style="background: #ffffff;"><div class="sf-dir" style="' + W + ' padding-top: 40px; padding-bottom: 88px; display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 32px; align-items: start;">'
    + sidebar
    + '<div style="display: flex; flex-direction: column; gap: 18px; min-width: 0;">'
    + (list.length ? '<div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;"><span id="sf-count" style="font-size: 15px; font-weight: 700;" aria-live="polite">' + list.length + (list.length === 1 ? ' speaker' : ' speakers') + '</span>'
      + '<label style="display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 700;">Sort<select id="sf-sort" class="sf-in" style="height: 40px; width: auto;"><option value="new">Newest</option><option value="az">Name A to Z</option></select></label></div>' : '')
    + grid + '</div></div></section></main>'
    + (list.length ? DIR_JS : '');

  const graph = [ORG, crumbs.ld, {
    '@type': 'CollectionPage', '@id': SITE + path + '#page', url: SITE + path, name: h1, description: desc, isPartOf: { '@id': SITE + '/#site' },
    mainEntity: { '@type': 'ItemList', numberOfItems: list.length, itemListElement: list.slice(0, 100).map((s, k) => ({ '@type': 'ListItem', position: k + 1, url: SITE + '/speakers/' + s.slug + '/', name: s.name })) }
  }];
  // thin pages (no speakers yet in this topic) stay out of search until they have content
  return page({ title, desc, path, body, ld: { graph }, robots: list.length ? '' : 'noindex, follow' });
}

const DIR_JS = '<script>(function(){var g=document.getElementById("sf-grid");if(!g){return;}var cards=[].slice.call(g.children),PER=24,shown=PER,q=document.getElementById("sf-q"),loc=document.getElementById("sf-loc"),sort=document.getElementById("sf-sort"),more=document.getElementById("sf-more"),none=document.getElementById("sf-none"),count=document.getElementById("sf-count"),btns=[].slice.call(document.querySelectorAll(".sf-fbtn"));'
  + 'function fm(){return btns.filter(function(b){return b.getAttribute("aria-pressed")==="true";}).map(function(b){return b.getAttribute("data-format");});}'
  + 'function run(){var f=fm(),t=(q&&q.value||"").toLowerCase().trim(),l=loc.value,ok=cards.filter(function(c){var cf=c.getAttribute("data-formats").split("|");return (!t||c.getAttribute("data-q").indexOf(t)>=0)&&(!l||c.getAttribute("data-loc")===l)&&f.every(function(x){return cf.indexOf(x)>=0;});});'
  + 'if(sort.value==="az"){ok.sort(function(a,b){return a.querySelector(".sp-name").textContent.localeCompare(b.querySelector(".sp-name").textContent);});}else{ok.sort(function(a,b){return b.getAttribute("data-new").localeCompare(a.getAttribute("data-new"));});}'
  + 'cards.forEach(function(c){c.hidden=true;});ok.forEach(function(c,i){g.appendChild(c);c.hidden=i>=shown;});none.hidden=ok.length>0;g.hidden=!ok.length;more.hidden=ok.length<=shown;count.textContent=ok.length+(ok.length===1?" speaker":" speakers");'
  + 'try{var u=new URL(location.href);t?u.searchParams.set("q",t):u.searchParams.delete("q");f.length?u.searchParams.set("format",f.join(",")):u.searchParams.delete("format");history.replaceState(null,"",u.pathname+u.search);}catch(e){}}'
  + 'btns.forEach(function(b){b.addEventListener("click",function(){b.setAttribute("aria-pressed",b.getAttribute("aria-pressed")==="true"?"false":"true");shown=PER;run();});});'
  + 'if(q){q.addEventListener("input",function(){shown=PER;run();});}loc.addEventListener("change",function(){shown=PER;run();});sort.addEventListener("change",run);more.addEventListener("click",function(){shown+=PER;run();});'
  + 'document.getElementById("sf-clear").addEventListener("click",function(){btns.forEach(function(b){b.setAttribute("aria-pressed","false");});if(q){q.value="";}loc.value="";shown=PER;run();});'
  + 'try{var p=new URL(location.href).searchParams.get("format");if(p){p.split(",").forEach(function(x){btns.forEach(function(b){if(b.getAttribute("data-format")===x){b.setAttribute("aria-pressed","true");}});});}}catch(e){}run();})();</script>';

// ---------------- profile ----------------
export function profilePage({ s, related, preview }) {
  const first = s.name.split(/\s+/)[0];
  const path = '/speakers/' + s.slug + '/';
  const topic = (s.topics || [])[0] || '';
  const photo = photoUrl(s);
  const crumbs = breadcrumbs([['Speakers', '/speakers/'], [topic, '/speakers/topic/' + topicSlug(topic) + '/'], [s.name, path]]);
  const L = s.links || {};
  const linkNames = { linkedin: 'LinkedIn', youtube: 'YouTube', instagram: 'Instagram', x: 'X', facebook: 'Facebook' };
  const social = Object.keys(linkNames).filter((k) => L[k]).map((k) => '<a href="' + esc(L[k]) + '" rel="noopener me" target="_blank" style="font-size: 14px; font-weight: 700; color: #14161a; text-underline-offset: 4px;">' + linkNames[k] + ARROW + '</a>').join('');
  const chips = [[ICON.pin, s.location], [ICON.lang, s.languages], [ICON.plane, s.travel]].filter((c) => c[1]).map((c) => '<span class="sf-chip">' + c[0] + esc(c[1]) + '</span>').join('');
  const eyebrow = [topic, s.speakerType || (s.formats || [])[0] ? (s.speakerType || ((s.formats || [])[0] + ' speaker')) : ''].filter(Boolean).join(' · ');

  let out = '<main>';
  if (preview) out += '<div role="status" style="background: #e31837; color: #ffffff; text-align: center; padding: 10px 16px; font-size: 14px; font-weight: 700;">Preview: this profile is not public yet. Only people with this link can see it.</div>';
  // hero
  out += '<section style="background: #f8f7f4;"><div style="' + W + ' padding-top: 36px; padding-bottom: 56px; display: flex; flex-direction: column; gap: 28px;">' + crumbs.vis
    + '<div class="sf-hero" style="display: grid; grid-template-columns: 340px minmax(0, 1fr); gap: clamp(28px, 4vw, 56px); align-items: center;">'
    + avatar(s, 96).replace('loading="lazy"', 'loading="eager" fetchpriority="high"')
    + '<div style="display: flex; flex-direction: column; gap: 18px; min-width: 0;">'
    + (eyebrow ? EB(esc(eyebrow)) : '')
    + '<h1 style="margin: 0; font-size: clamp(40px, 5vw, 68px); line-height: 1; font-weight: 500; letter-spacing: -0.04em;">' + esc(s.name) + '</h1>'
    + '<p style="margin: 0; max-width: 620px; font-size: clamp(18px, 1.6vw, 21px); line-height: 1.45; color: #2a2c31;">' + esc(s.headline) + '</p>'
    + (chips ? '<div style="display: flex; flex-wrap: wrap; gap: 8px;">' + chips + '</div>' : '')
    + '<div style="display: flex; flex-wrap: wrap; gap: 10px; padding-top: 4px;"><a href="#book" style="' + BTN + ' background: #e31837; color: #ffffff;">Request to book</a>'
    + (L.website ? '<a href="' + esc(L.website) + '" rel="noopener" target="_blank" style="' + BTN + ' border: 1px solid rgba(20,22,26,0.32); background: #ffffff; color: #14161a;">Visit website' + ARROW + '</a>' : '') + '</div>'
    + (social ? '<div style="display: flex; flex-wrap: wrap; gap: 18px;">' + social + '</div>' : '')
    + '</div></div></div></section>';

  // stats
  const stats = [['Formats', (s.formats || []).join(', ')], ['Typical length', s.length], ['Audience size', s.audience], ['Fee range', s.fee]].filter((x) => x[1]);
  if (stats.length) {
    out += '<section style="background: #ffffff; border-top: 1px solid rgba(20,22,26,0.12); border-bottom: 1px solid rgba(20,22,26,0.12);"><dl class="sf-stats" style="' + W + ' margin-top: 0; margin-bottom: 0; display: grid; grid-template-columns: repeat(' + stats.length + ', minmax(0, 1fr));">'
      + stats.map((x, k) => '<div style="padding: 24px ' + (k ? '24px' : '0') + '; ' + (k ? 'border-left: 1px solid rgba(20,22,26,0.12);' : '') + ' display: flex; flex-direction: column; gap: 6px;"><dt style="font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #55585f;">' + x[0] + '</dt><dd style="margin: 0; font-size: 19px; font-weight: 500; letter-spacing: -0.01em;">' + esc(x[1]) + '</dd></div>').join('')
      + '</dl></section>';
  }

  // talks
  if ((s.talks || []).length) {
    out += '<section style="background: #ffffff;"><div style="' + W + ' padding-top: 88px; padding-bottom: 88px; display: flex; flex-direction: column; gap: 36px;">' + EB('Talks')
      + '<h2 style="' + H2 + '">What ' + esc(first) + ' speaks about.</h2>'
      + '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 10px;">'
      + s.talks.map((t) => '<article style="background: #f8f7f4; border: 1px solid rgba(20,22,26,0.12); padding: 26px; display: flex; flex-direction: column; gap: 14px;">'
        + '<div style="display: flex; flex-wrap: wrap; gap: 6px;">' + (t.format ? '<span style="padding: 4px 9px; background: #14161a; color: #ffffff; font-size: 12px; font-weight: 700;">' + esc(t.format) + '</span>' : '') + (t.length ? '<span style="padding: 4px 9px; border: 1px solid rgba(20,22,26,0.24); font-size: 12px; font-weight: 700;">' + esc(t.length) + '</span>' : '') + '</div>'
        + '<h3 style="margin: 0; font-size: 25px; line-height: 1.12; font-weight: 400; letter-spacing: -0.024em;">' + esc(t.title) + '</h3>'
        + (t.summary ? '<p style="margin: 0; font-size: 16px; line-height: 1.5; color: #55585f;">' + esc(t.summary) + '</p>' : '')
        + (t.takeaways.length ? '<div style="display: flex; flex-direction: column; gap: 8px; padding-top: 12px; border-top: 1px solid rgba(20,22,26,0.14);"><span style="font-size: 12px; font-weight: 700; letter-spacing: 0.14em; color: #55585f;">AUDIENCE TAKEAWAYS</span><ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px;">'
          + t.takeaways.map((k) => '<li style="display: flex; gap: 10px; font-size: 15px; line-height: 1.4;"><span aria-hidden="true" style="flex: none; width: 6px; height: 6px; margin-top: 7px; background: #e31837;"></span>' + esc(k) + '</li>').join('') + '</ul></div>' : '')
        + '</article>').join('')
      + '</div></div></section>';
  }

  // video
  const vid = youtubeId(s.video);
  if (vid) {
    out += '<section style="background: #0b0c0e; color: #fff8ef;"><div style="' + WD + ' padding-top: 88px; padding-bottom: 88px; display: flex; flex-direction: column; gap: 32px;">'
      + '<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 16px;"><div style="display: flex; flex-direction: column; gap: 16px;">' + EB('On stage', true)
      + '<h2 style="' + H2 + ' color: #fff8ef;">See ' + esc(first) + ' live.</h2></div>' + (s.videoTitle ? '<span style="font-size: 15px; color: rgba(255,255,255,0.72);">' + esc(s.videoTitle) + '</span>' : '') + '</div>'
      + '<button type="button" class="sf-vid" data-yt="' + vid + '" aria-label="Play video: ' + esc(s.videoTitle || s.name + ' speaking') + '"><img src="https://i.ytimg.com/vi/' + vid + '/hqdefault.jpg" alt="" width="480" height="360" loading="lazy"><span class="sf-play"><svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true"><path d="M7 4l14 8-14 8z"/></svg></span></button>'
      + '</div></section>'
      + '<script>(function(){var b=document.querySelector(".sf-vid");if(!b){return;}b.addEventListener("click",function(){var f=document.createElement("iframe");f.src="https://www.youtube-nocookie.com/embed/"+b.getAttribute("data-yt")+"?autoplay=1&rel=0";f.title=b.getAttribute("aria-label").replace("Play video: ","");f.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";f.allowFullscreen=true;b.replaceWith(f);f.style.cssText="display:block;width:100%;aspect-ratio:16/9;border:0";});})();</script>';
  }

  // about
  if (s.shortBio || s.bio) {
    const paras = String(s.bio || '').split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean);
    out += '<section style="background: #ffffff;"><div class="sf-two" style="' + W + ' padding-top: 88px; padding-bottom: 88px; display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(28px, 4vw, 64px); align-items: start;">'
      + '<div style="display: flex; flex-direction: column; gap: 16px;">' + EB('About') + '<h2 style="' + H2 + '">About ' + esc(first) + '.</h2></div>'
      + '<div style="display: flex; flex-direction: column; gap: 24px; min-width: 0;">'
      + (s.shortBio ? '<div style="background: #f8f7f4; border: 1px solid rgba(20,22,26,0.14); padding: 24px; display: flex; flex-direction: column; gap: 14px;"><div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;"><span style="display: flex; flex-direction: column; gap: 2px;"><strong style="font-size: 14px;">Short bio for event programs</strong><span style="font-size: 13px; color: #55585f;">Use it in your agenda, website or host introduction.</span></span>'
        + '<button type="button" id="sf-copy" style="flex: none; height: 36px; padding: 0 12px; border: 1px solid rgba(20,22,26,0.32); background: #ffffff; font: inherit; font-size: 13.5px; font-weight: 700; cursor: pointer;">Copy bio</button></div>'
        + '<p id="sf-bio" style="margin: 0; font-size: 17px; line-height: 1.6;">' + esc(s.shortBio) + '</p></div>'
        + '<script>(function(){var b=document.getElementById("sf-copy");b.addEventListener("click",function(){var t=document.getElementById("sf-bio").textContent;var d=function(){b.textContent="Copied";setTimeout(function(){b.textContent="Copy bio";},2000);};try{navigator.clipboard.writeText(t).then(d,d);}catch(e){d();}});})();</script>' : '')
      + (paras.length ? '<div class="sf-pro">' + paras.map((p) => '<p>' + esc(p) + '</p>').join('') + '</div>' : '')
      + '</div></div></section>';
  }

  // events
  if ((s.events || []).length) {
    out += '<section style="background: #f8f7f4;"><div style="' + W + ' padding-top: 88px; padding-bottom: 88px; display: flex; flex-direction: column; gap: 32px;">' + EB('Clients and events')
      + '<h2 style="' + H2 + '">Past events.</h2><div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: 15px; min-width: 520px;"><thead><tr>'
      + ['Event', 'Organizer', 'Format', 'Year'].map((h, k) => '<th scope="col" style="text-align: ' + (k === 3 ? 'right' : 'left') + '; padding: 0 12px 12px 0; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #55585f; border-bottom: 1px solid #14161a;">' + h + '</th>').join('')
      + '</tr></thead><tbody>' + s.events.map((e) => '<tr>' + [e.event, e.organizer, e.format, e.year].map((v, k) => '<td style="padding: 14px 12px 14px 0; border-bottom: 1px solid rgba(20,22,26,0.14); ' + (k === 0 ? 'font-weight: 700;' : 'color: #2a2c31;') + (k === 3 ? ' text-align: right;' : '') + '">' + esc(v) + '</td>').join('') + '</tr>').join('')
      + '</tbody></table></div></div></section>';
  }

  // testimonials
  if ((s.quotes || []).length) {
    out += '<section style="background: #ffffff;"><div style="' + W + ' padding-top: 88px; padding-bottom: 88px; display: flex; flex-direction: column; gap: 32px;">' + EB('Testimonials')
      + '<h2 style="' + H2 + '">What organizers say.</h2><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 10px;">'
      + s.quotes.map((q) => '<figure style="margin: 0; background: #f8f7f4; border: 1px solid rgba(20,22,26,0.12); padding: 28px; display: flex; flex-direction: column; justify-content: space-between; gap: 24px;"><blockquote style="margin: 0; font-size: 20px; line-height: 1.35; letter-spacing: -0.012em;">&ldquo;' + esc(q.quote) + '&rdquo;</blockquote>'
        + '<figcaption style="display: flex; flex-direction: column; gap: 2px; padding-top: 16px; border-top: 1px solid rgba(20,22,26,0.14);"><strong style="font-size: 15px;">' + esc(q.name) + '</strong><span style="font-size: 13.5px; color: #55585f;">' + esc(q.role) + '</span></figcaption></figure>').join('')
      + '</div></div></section>';
  }

  // booking request
  const sel = (name, opts) => '<select name="' + name + '" class="sf-in">' + opts.map((o) => '<option>' + o + '</option>').join('') + '</select>';
  out += '<section id="book" style="background: #0b0c0e; color: #fff8ef; scroll-margin-top: 20px;"><div class="sf-two" style="' + WD + ' padding-top: 88px; padding-bottom: 88px; display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: clamp(28px, 4vw, 64px); align-items: start;">'
    + '<div style="display: flex; flex-direction: column; gap: 18px;">' + EB('Booking request', true) + '<h2 style="' + H2 + ' color: #fff8ef;">Book ' + esc(first) + ' for your event.</h2>'
    + '<p style="margin: 0; font-size: 17px; line-height: 1.55; color: rgba(255,255,255,0.72);">Send your event details. We pass your request to ' + esc(first) + ' the same working day, and you agree the fee and details directly. No booking fee.</p>'
    + (L.website ? '<a href="' + esc(L.website) + '" rel="noopener" target="_blank" style="align-self: flex-start; color: #ffffff; font-size: 15px; font-weight: 700; text-underline-offset: 4px;">Or visit ' + esc(first) + '\'s own website' + ARROW + '</a>' : '')
    + '</div>'
    + '<form id="sf-book" style="background: #ffffff; color: #14161a; padding: clamp(20px, 3vw, 32px); display: flex; flex-direction: column; gap: 16px;" novalidate>'
    + '<input type="text" name="_hp" tabindex="-1" autocomplete="off" aria-hidden="true" style="position: absolute; left: -9999px; width: 1px; height: 1px;">'
    + '<div class="sf-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">'
    + '<label class="sf-lab">Your name<input class="sf-in" name="Name" autocomplete="name" required></label>'
    + '<label class="sf-lab">Your email<input class="sf-in" name="Email" type="email" autocomplete="email" required></label>'
    + '<label class="sf-lab">Event name<input class="sf-in" name="Event" placeholder="Annual sales kickoff"></label>'
    + '<label class="sf-lab">Event date<input class="sf-in" name="Date" type="date"></label>'
    + '<label class="sf-lab">Location<input class="sf-in" name="Location" placeholder="City, or Virtual"></label>'
    + '<label class="sf-lab">Audience size' + sel('Audience', ['Under 50', '50 to 200', '200 to 500', '500 to 2,000', 'Over 2,000']) + '</label>'
    + '<label class="sf-lab" style="grid-column: 1 / -1;">Budget range' + sel('Budget', ['Not sure yet', 'Under $2,500', '$2,500 to $5,000', '$5,000 to $10,000', '$10,000 to $25,000', 'Over $25,000']) + '</label>'
    + '<label class="sf-lab" style="grid-column: 1 / -1;">Message<textarea class="sf-in" name="Message" placeholder="Tell us about the audience and what you want them to leave with."></textarea></label>'
    + '</div><div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;"><span id="sf-msg" role="status" style="font-size: 14px; color: #55585f;">Free, with no booking fee.</span>'
    + '<button type="submit" style="' + BTN + ' border: 0; background: #e31837; color: #ffffff; cursor: pointer; font-family: inherit;">Send booking request</button></div></form>'
    + '</div></section>'
    + '<script>(function(){var f=document.getElementById("sf-book"),m=document.getElementById("sf-msg");f.addEventListener("submit",function(e){e.preventDefault();var d={Type:"Booking request",Speaker:' + JSON.stringify(s.name).replace(/</g, '\\u003c') + ',_speaker:' + JSON.stringify(s.slug) + '};'
    + 'new FormData(f).forEach(function(v,k){d[k]=v;});if(!d.Name||!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(d.Email||"")){m.textContent="Add your name and a valid email.";m.style.color="#c4122d";return;}'
    + 'var b=f.querySelector("button[type=submit]");b.disabled=true;b.textContent="Sending...";fetch("/api/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}).then(function(r){return r.json();}).then(function(r){if(!r.ok){throw new Error(r.error||"");}'
    + 'f.innerHTML="<div style=\\"display:flex;flex-direction:column;gap:10px;padding:12px 0\\"><strong style=\\"font-size:24px;font-weight:500\\">Request sent.</strong><span style=\\"color:#55585f;font-size:16px;line-height:1.5\\">We pass it to ' + esc(first) + ' today. You will hear back at the email you gave.</span></div>";try{gtag("event","generate_lead",{form:"booking_request"});}catch(x){}})'
    + '.catch(function(){b.disabled=false;b.textContent="Send booking request";m.textContent="Something went wrong. Please email projectui.saleh@gmail.com.";m.style.color="#c4122d";});});})();</script>';

  // related
  if (related.length) {
    out += '<section style="background: #ffffff;"><div style="' + W + ' padding-top: 88px; padding-bottom: 88px; display: flex; flex-direction: column; gap: 32px;">'
      + '<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 16px;"><div style="display: flex; flex-direction: column; gap: 16px;">' + EB('Related speakers') + '<h2 style="' + H2 + '">More ' + esc(topic.toLowerCase()) + ' speakers.</h2></div>'
      + '<a href="/speakers/topic/' + topicSlug(topic) + '/" style="font-size: 15px; font-weight: 700; color: #14161a; text-underline-offset: 4px;">All ' + esc(topic.toLowerCase()) + ' speakers' + ARROW + '</a></div>'
      + '<div class="sf-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px;">' + related.map((r) => card(r)).join('') + '</div></div></section>';
  }
  out += '</main>';

  const desc = (s.headline + '. ' + (s.shortBio || '')).replace(/\s+/g, ' ').slice(0, 158);
  const sameAs = Object.values(L).filter(Boolean);
  const person = {
    '@type': 'Person', '@id': SITE + path + '#person', name: s.name, url: SITE + path, description: s.shortBio || s.headline, jobTitle: s.headline,
    knowsAbout: (s.topics || []).concat((s.talks || []).map((t) => t.title)), knowsLanguage: s.languages ? s.languages.split(/,\s*/) : undefined,
    image: photo ? SITE + photo : undefined, sameAs: sameAs.length ? sameAs : undefined,
    homeLocation: s.location ? { '@type': 'Place', name: s.location } : undefined
  };
  const graph = [ORG, crumbs.ld, { '@type': 'ProfilePage', '@id': SITE + path, url: SITE + path, name: s.name + ', ' + topic.toLowerCase() + ' speaker', dateModified: s.updatedAt, mainEntity: { '@id': SITE + path + '#person' } }, person];
  if (vid) graph.push({ '@type': 'VideoObject', name: s.videoTitle || s.name + ' speaking', description: s.headline, thumbnailUrl: 'https://i.ytimg.com/vi/' + vid + '/hqdefault.jpg', embedUrl: 'https://www.youtube.com/embed/' + vid, contentUrl: 'https://www.youtube.com/watch?v=' + vid, uploadDate: (s.createdAt || '').slice(0, 10) });
  return page({
    title: s.name + ': ' + s.headline + ' | Speakerfolio', desc, path, image: photo || '', body: out,
    ld: { graph, ogType: 'profile' }, robots: preview ? 'noindex, nofollow' : '', cache: preview ? 'no-store' : 'public, max-age=60'
  });
}
