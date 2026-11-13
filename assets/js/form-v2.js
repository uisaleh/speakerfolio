/*
 * Speakerfolio form sender.
 *
 * Website requests and questions are sent to /api/submit (a Cloudflare Pages Function in /functions),
 * which saves them for the admin page (/admin/) and sends a Telegram message.
 * Nothing opens the visitor's email app. If the first try fails (a network blip), it retries twice.
 * With attachments, the form goes as multipart (a "data" JSON part plus "files").
 * sfSend returns a Promise that resolves to true when the server saved the request.
 */
window.SF_CONFIG = {
  SUBMIT_URL: '/api/submit'
};

window.sfSend = function (kind, data, files) {
  var cfg = window.SF_CONFIG || {};
  var payload = Object.assign({ Type: kind }, data);
  var list = (files || []).filter(Boolean);
  try { if (window.gtag) { window.gtag('event', 'generate_lead', { form_type: kind === 'Question' ? 'question' : 'website_request', plan: data.Plan || '', files: list.length }); } } catch (e) {}
  return new Promise(function (resolve) {
    var attempt = function (n) {
      var opts;
      if (list.length) {
        var fd = new FormData();
        fd.append('data', JSON.stringify(payload));
        list.forEach(function (f) { fd.append('files', f, f.name); });
        opts = { method: 'POST', body: fd };
      } else {
        opts = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true };
      }
      try {
        fetch(cfg.SUBMIT_URL, opts).then(function (r) {
          if (r.ok) { resolve(true); return; }
          if (r.status >= 500 && n < 2) { setTimeout(function () { attempt(n + 1); }, 1500 * (n + 1)); } else { resolve(false); }
        }).catch(function () {
          if (n < 2) { setTimeout(function () { attempt(n + 1); }, 1500 * (n + 1)); } else { resolve(false); }
        });
      } catch (e) { resolve(false); }
    };
    attempt(0);
  });
};
