// IndexNow: tells Bing (and Yandex, Seznam, Naver) about new or changed pages so they crawl them within hours.
export const INDEXNOW_KEY = '22e8e9a3fea1aba3233484e9965a4d69';
export function pingIndexNow(urls, host = 'speakerfolio.com') {
  const list = [...new Set(urls.filter(Boolean))];
  if (!list.length) return Promise.resolve();
  return fetch('https://api.indexnow.org/indexnow', {
    method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: 'https://' + host + '/' + INDEXNOW_KEY + '.txt', urlList: list })
  }).catch(() => {});
}
// a saved or changed speaker: their profile, the directory and its topic pages
export function speakerUrls(s, topicSlug) {
  const base = 'https://speakerfolio.com';
  return [base + '/speakers/' + s.slug + '/', base + '/speakers/', base + '/sitemap.xml'].concat((s.topics || []).map((t) => base + '/speakers/topic/' + topicSlug(t) + '/'));
}
