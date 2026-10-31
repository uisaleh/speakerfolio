/*
 * Speakerfolio form sender.
 *
 * Website requests and questions are sent to /api/submit (a Cloudflare Pages Function in /functions),
 * which saves them for the admin page (/admin/) and sends a Telegram message.
 * Nothing opens the visitor's email app. If the first try fails (a network blip), it retries twice.
 */
window.SF_CONFIG = {
  SUBMIT_URL: '/api/submit'
};

window.sfSend = function (kind, data) {
  var cfg = window.SF_CONFIG || {};
  var body = JSON.stringify(Object.assign({ Type: kind }, data));
  var attempt = function (n) {
    try {
      fetch(cfg.SUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        keepalive: true
      }).then(function (r) {
        if (!r.ok && r.status >= 500 && n < 2) { setTimeout(function () { attempt(n + 1); }, 1500 * (n + 1)); }
      }).catch(function () {
        if (n < 2) { setTimeout(function () { attempt(n + 1); }, 1500 * (n + 1)); }
      });
    } catch (e) {}
  };
  attempt(0);
};
