/*
 * Speakerfolio site settings.
 *
 * FORM_ENDPOINT: paste your Formspree form address here, for example
 *   'https://formspree.io/f/abcdwxyz'
 * Until it is set, website requests and questions open the visitor's email app
 * with the details filled in, addressed to CONTACT_EMAIL.
 */
window.SF_CONFIG = {
  FORM_ENDPOINT: '',
  CONTACT_EMAIL: 'projectui.saleh@gmail.com'
};

window.sfSend = function (kind, data) {
  var cfg = window.SF_CONFIG || {};
  var lines = Object.keys(data).map(function (k) { return k + ': ' + data[k]; });
  if (cfg.FORM_ENDPOINT) {
    var payload = Object.assign({ _subject: 'Speakerfolio: ' + kind + ' from ' + (data.Name || 'website'), Type: kind }, data);
    if (data.Email) { payload._replyto = data.Email; }
    try {
      fetch(cfg.FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function () {});
    } catch (e) {}
    return;
  }
  var subject = 'Speakerfolio: ' + kind + ' from ' + (data.Name || 'website');
  var href = 'mailto:' + cfg.CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
  try { window.location.href = href; } catch (e) {}
};
