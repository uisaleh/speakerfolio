# Speakerfolio

Free and Premium portfolio websites for public speakers. This repository is the live site, served by Cloudflare Pages.

## Pages

| Path | What it is |
| --- | --- |
| `/` | Home: overview of how it works, templates, pricing, articles, FAQ and the request form |
| `/templates/` | The 6 free templates with live previews |
| `/pricing/` | Free, Premium and social media design, plus pricing questions |
| `/articles/` | Articles for speakers; each article has its own page at `/articles/<slug>/` |
| `/faq/` | All questions and answers (FAQPage structured data) |
| `/contact/` | Request a free website or ask a question |
| `/terms.html` | Terms of service and privacy policy |
| `/templates/<name>.html` | Template previews used inside the site (not indexed) |

Every page has its own title, description, canonical link, Open Graph image, JSON-LD and pre-rendered HTML,
so search engines and AI tools can read it without running scripts. `sitemap.xml`, `robots.txt` and `llms.txt`
are at the root. Google Analytics (G-FW50KBR0Y7) runs on all public pages and loads after the page.

Speed: fonts are self-hosted in `assets/fonts/`, thumbnails are WebP, and the interactive layer starts on the first scroll, tap or key press (the pre-rendered page is complete before that).

## Cloudflare Pages settings

- Production branch: `main`
- Framework preset: None
- Build command: (leave empty)
- Build output directory: `/`

Every push to `main` goes live in about a minute.

## Requests, admin and Telegram alerts

Form submissions go to `/api/submit` (`functions/api/submit.js`). Each one is saved in Cloudflare KV and sent to Telegram.
See them all at **`/admin/`** (password protected).

Set up once in Cloudflare (Workers & Pages > speakerfolio > Settings):

1. **Storage:** Storage & Databases > KV > Create a namespace called `speakerfolio-submissions`. Then in the Pages project: Settings > Bindings > Add > KV namespace, variable name `SUBMISSIONS`, choose that namespace.
2. **Admin password:** Settings > Variables and Secrets > Add, type Secret, name `ADMIN_PASSWORD`, value your password.
3. **Telegram:** in Telegram, message @BotFather, send `/newbot`, copy the token. Add a Secret `TELEGRAM_BOT_TOKEN` with it. Send any message to your new bot, then open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy `chat.id`. Add a variable `TELEGRAM_CHAT_ID` with it.
4. **Redeploy:** Deployments > latest > Retry deployment, so the settings apply.

The form script is `assets/js/form-v2.js`. It never opens an email app; if a send fails it retries twice.

## Notes

- Pages are rendered by a small script (`assets/js/dc-mini.js`) with `morphdom` (MIT licence). The landing and terms pages also contain pre-rendered HTML, so search engines and AI tools can read them without running scripts.
- Template thumbnails live in `assets/thumbs/`, photos in `assets/img/`.
## Client sites

Each client site lives in its own folder, for example `/emilyadams/index.html` with its photos in `/emilyadams/img/`.
`functions/_middleware.js` serves that folder at `emilyadams.speakerfolio.com`. To put a new one live: add the folder, push, then in Cloudflare Pages go to Custom domains > Set up a custom domain and enter `<name>.speakerfolio.com`.

| Client | Address | Folder |
| --- | --- | --- |
| Emily Adams | removed at the client's request (subdomain returns 410 Gone) | none |
