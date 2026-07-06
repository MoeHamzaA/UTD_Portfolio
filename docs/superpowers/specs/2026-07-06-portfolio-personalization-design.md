# Portfolio Personalization — Design

**Date:** 2026-07-06
**Status:** Approved by Hamza

## Goal

Turn the cloned `sleek-portfolio` template (by ramxcodes) into Hamza Ajmal's
professional portfolio: strip the template author's content and the immature /
personal-lifestyle sections, and migrate Hamza's real experience, projects, and
photo from the old portfolio repo at `../portfolio`.

## Decisions (confirmed with user)

- Remove: blogs, gears, setup, journey + certificates, AI chat bot (may return
  later), Telegram contact form, resume page, easter eggs (cat, quotes).
- Keep: Hero, Work Experience, Projects, About, GitHub activity graph, CTA,
  Contact (simplified to email + socials).
- Projects: top 5 — Elva, CloudPulse-AI, Smart Notes, Trash It, Cloud
  Monitoring Anomaly Detection.
- Use `hamza_headshot.jpg` as avatar/profile image.
- No resume link anywhere.

## Content sources (old repo: `C:/Users/mhamz/projects/personal/portfolio`)

- `src/constants/index.js` — experiences (AthenaGuard, Vosyn, Wouessi Digital,
  Santek), project descriptions, awards, social links.
- `public/hamza_headshot.jpg`, `public/company_logo/*.jpeg` — images.
- `src/assets/smart_notes.png`, `trashit.png`, `asinc.png` — project images.

## Changes in this repo

### Delete

- Routes: `src/app/blog`, `src/app/gears`, `src/app/setup`, `src/app/journey`,
  `src/app/resume`, `src/app/api/chat`, `src/app/api/contact`.
- Components: blog/, gears/, landing/Blog, landing/Setup, landing/Journey, and
  anything only used by deleted routes.
- Config: `Cat.ts`, `ChatPrompt.ts`, `Gears.tsx`, `Setup.tsx`, `Journey.tsx`,
  `Quote.ts`, `Resume.ts`, `Achievements.tsx`.
- Data: `src/data/blog`, `src/data/journey`, all template project MDX files.
- Dependencies/scripts that only served removed features (Gemini SDK,
  telegram test script) and their env vars in `.env.example`.

### Personalize

- `Hero.tsx`: name Hamza Ajmal, backend/AI/cloud title + description, headshot
  avatar, real skill icons (from icons the template ships), socials: GitHub
  (MoeHamzaA), LinkedIn (hamza-ajmal-166a8228b), email. Buttons: Get in touch
  (no resume button).
- `Experience.tsx`: 4 roles with logos copied to `public/company/`.
- `Projects.tsx` + new MDX per project; screenshots where they exist, clean
  placeholders for Elva / CloudPulse-AI / Anomaly Detection.
- `About.tsx`, `Github.tsx` (username MoeHamzaA), `Meta.tsx` (SEO/site config),
  `Navbar.tsx` (Work, Projects, Contact), `Footer.tsx`, `CTA.tsx`, landing
  `page.tsx` (Hero → Experience → Projects → About → GitHub → CTA), `README.md`.
- Contact page: email + social links only, no form/backend.

## Verification

`bun run build` (or `npm run build`) passes with no references to deleted
modules; manual check of every remaining page in dev server.

## Out of scope

AI chat bot re-integration (later), real screenshots for the three projects
missing images, custom visual redesign beyond the template's existing style.
