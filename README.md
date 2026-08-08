# NDA Team Portfolio

Premium portfolio website for **NDA** — a senior software and creative technology team.

## Stack

- React 19 + TypeScript + Vite
- Three.js (WebGL) — 3D glass model, refraction materials, HDRI environments
- GSAP + Motion — cinematic animations, scroll-driven effects, page reveal
- Tailwind CSS v4
- lucide-react icons

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

## Deployment

Hosted on **Vercel**, production branch `main`, custom domain: https://nda.work.gd

## Environment

No private environment variables are required. The only variable used at build time is the public site URL for canonical/Open Graph metadata (`https://nda.work.gd`), hardcoded in `index.html`.

## Structure

- `src/App.tsx` — routing shell
- `src/components/ThreeGlassCanvas.tsx` — hero 3D/WebGL canvas
- `src/components/PageReveal.tsx` — first-load cinematic reveal
- `src/pages`-style components under `src/components/` — About, Team, Projects, Services, Technologies, Process, Testimonials, Contact
