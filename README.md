# Portfolio

Personal portfolio built with Next.js, React, and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Cloudflare Workers

This repo is configured for Cloudflare Workers using `@opennextjs/cloudflare`.

Useful commands:

```bash
npm run preview
npm run deploy
```

If you deploy from Cloudflare's dashboard, use:

- Build command: `npm run deploy`

Do not use raw `npx wrangler deploy` against the unadapted Next.js source.

## Documents

Place your files in `public/documents/`:

- `CV.pdf`
- `Internship-Certificate-Monet.pdf`
- `Internship-Certificate-Edgage.pdf`

You can also rename the files and update the links in `app/page.tsx`.
