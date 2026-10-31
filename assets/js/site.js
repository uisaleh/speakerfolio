/*
 * Speakerfolio site settings.
 *
 * Website requests and questions are sent to /api/submit (a Cloudflare Pages Function in /functions),
 * which saves them for the admin page (/admin/) and sends a Telegram message.
 * If that fails, the visitor's email app opens with the details filled in, addressed to CONTACT_EMAIL.
 */
window.SF_CONFIG = {
  SUBMIT_URL: '/api/submit',
  CONTACT_EMAIL: 'projectui.saleh@gmail.com'
};

window.sfSend = function (kind, data) {
  var cfg = window.SF_CONFIG || {};
  var mailto = function () {
    var lines = Object.keys(data).map(function (k) { return k + ': ' + data[k]; });
    var subject = 'Speakerfolio: ' + kind + ' from ' + (data.Name || 'website');
    try { window.location.href = 'mailto:' + cfg.CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n')); } catch (e) {}
  };
  try {
    fetch(cfg.SUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ Type: kind }, data))
    }).then(function (r) { if (!r.ok) { mailto(); } }).catch(mailto);
  } catch (e) { mailto(); }
};
