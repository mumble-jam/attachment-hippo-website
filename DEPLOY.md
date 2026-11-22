# Putting attachmenthippo.com live

This package contains:

- `dist/` — **the finished website**, ready to upload. Nothing to install.
- everything else — the source code, for making changes later (see `README.md`).

The site is fully static (plain HTML, CSS, JS and images). It keeps every existing address
(`/pricing.html`, `/blog/…/`, `/legal/…html`), so links from the Gmail add-on keep working.

---

## Option A — upload the ready-made site (quickest)

### Firebase Hosting (where attachmenthippo.com runs today)

You need the Firebase CLI (`npm install -g firebase-tools`) and access to the site's Firebase project.

```bash
cd attachment-hippo-website
firebase login
firebase deploy --only hosting --project YOUR_FIREBASE_PROJECT_ID
```

`firebase.json` (included) tells Firebase to publish the `dist/` folder **and** sets the site's
security headers — the same ones the live site uses today. Keep that file: the
Content-Security-Policy in it is what allows Paddle checkout and analytics to load.

Not sure of the project ID? `firebase projects:list` shows it, or check the Firebase console.

### Any other static host (Netlify, Cloudflare Pages, Vercel, S3…)

Upload the **contents** of `dist/` as the site root. Then copy the headers from `firebase.json`
(especially `Content-Security-Policy`) into that host's header settings.

---

## Option B — build from the source

Needs **Node.js 22.12 or newer**.

```bash
cd attachment-hippo-website
npm ci            # install exact dependency versions
npm run build     # writes the site to dist/
npm run preview   # optional: check it at http://localhost:4321
firebase deploy --only hosting --project YOUR_FIREBASE_PROJECT_ID
```

---

## Before you go live — please check

1. **Colour picker.** A small "Colours" button (bottom-left) lets you switch between four colour
   themes; it is **switched on** in this build so the team could compare. To hide it from visitors:
   set `themeSwitcher: false` in `src/site.config.ts`, then rebuild (Option B). The default theme
   (Aurora) is what everyone sees either way.
2. **Contact form.** No form service is connected yet, so "Send" opens the visitor's email app
   with the message ready to send to attachmenthippo@gmail.com. To receive messages directly, set
   `contactForm.endpoint` in `src/site.config.ts` (e.g. a Formspree URL), add that address to
   `form-action` and `connect-src` in `firebase.json`, and rebuild.
3. **Payments.** Pricing uses the same live Paddle setup as today (`public/js/pricing.js`) —
   worth one test purchase flow after deploying.
4. **Analytics** (Umami + Google Analytics) are included in this production build with the
   existing IDs.
5. `/lab/aura/` is an internal preview page of the illustrations — not linked anywhere and hidden
   from search engines. Delete `src/pages/lab/` and rebuild if you don't want it online.

## After deploying — quick check

- Home, Pricing, Blog, a blog post and the three legal pages open.
- On Pricing, "Get started" on a paid plan opens the Paddle checkout.
- `https://attachmenthippo.com/pricing.html?plan=pro-monthly` opens checkout directly (this is
  the link the Gmail add-on uses).
