# Speakerfolio

Free and Premium portfolio websites for public speakers. This repository is the live site, served by Cloudflare Pages.

## Pages

| Path | What it is |
| --- | --- |
| `/` (`index.html`) | Landing page: how it works, templates, pricing, tips, FAQ, request form |
| `/terms.html` | Terms of service and privacy policy |
| `/templates/<name>.html` | Live demos of the 6 templates (headliner, ignite, coach, trainer, studio, spotlight). Not indexed by search engines. |
| `/404.html` | Page shown for broken links |

## Cloudflare Pages settings

- Production branch: `main`
- Framework preset: None
- Build command: (leave empty)
- Build output directory: `/`

Every push to `main` goes live in about a minute.

## Receiving form submissions

Website requests and questions from the landing page are sent to the address set in `assets/js/site.js`:

```js
window.SF_CONFIG = {
  FORM_ENDPOINT: '',                      // paste your Formspree form address here
  CONTACT_EMAIL: 'projectui.saleh@gmail.com'
};
```

1. Create a free form at formspree.io and copy its address (it looks like `https://formspree.io/f/abcdwxyz`).
2. Paste it into `FORM_ENDPOINT` and push.

Until `FORM_ENDPOINT` is set, the forms open the visitor's email app with the details filled in, addressed to `CONTACT_EMAIL`.

## Notes

- Pages are rendered by a small script (`assets/js/dc-mini.js`) with `morphdom` (MIT licence). The landing and terms pages also contain pre-rendered HTML, so search engines and AI tools can read them without running scripts.
- Template thumbnails live in `assets/thumbs/`, photos in `assets/img/`.
- Client sites can be added as folders (for example `/rina/index.html`) and connected as `rina.speakerfolio.com` under Custom domains in Cloudflare Pages.
