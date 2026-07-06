# Portfolio Personalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip the sleek-portfolio template of the author's content and immature sections, and personalize it with Hamza Ajmal's experience, projects, and photo migrated from `C:/Users/mhamz/projects/personal/portfolio`.

**Architecture:** The template is config-driven — nearly all identity lives in `src/config/*.tsx` and MDX files in `src/data/`. The work is: (1) migrate image assets, (2) delete removed feature routes/components/config wholesale, (3) rewrite config files with Hamza's content, (4) replace project MDX, (5) simplify contact, (6) rewrite README. No test suite exists; verification is `npm run build` (or `bun run build`) after each task plus a manual dev-server page walk at the end.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind 4, shadcn/ui, MDX.

## Global Constraints

- Old repo content source: `C:/Users/mhamz/projects/personal/portfolio` (constants in `src/constants/index.js`, images in `public/` and `src/assets/`).
- Identity: Hamza Ajmal — GitHub `MoeHamzaA`, LinkedIn `hamza-ajmal-166a8228b`, email `mhamzaajmal9@gmail.com`.
- Removed for good: blog, gears, setup, journey/certificates, AI chat, Telegram contact form, resume page/link, oneko cat, quotes.
- Projects (exactly 5): Elva, CloudPulse-AI, Smart Notes, Trash It, Cloud Monitoring Anomaly Detection.
- Headshot `/assets/hamza.jpg` is the avatar everywhere. No resume link anywhere.
- Follow the template's existing config patterns; commit after every task (husky/lint-staged runs prettier+eslint on commit).

---

### Task 1: Migrate image assets

**Files:**

- Create: `public/assets/hamza.jpg` (copy of old repo `public/hamza_headshot.jpg`)
- Create: `public/company/athenaguard.jpeg`, `public/company/vosyn.jpeg`, `public/company/wouessi.jpeg`, `public/company/santek.jpeg` (from old repo `public/company_logo/*.jpeg`)
- Create: `public/project/smart-notes.png`, `public/project/trash-it.png` (from old repo `src/assets/smart_notes.png`, `trashit.png`)
- Create: `public/project/elva.png`, `public/project/cloudpulse-ai.png`, `public/project/anomaly-detection.png` (generated placeholders, 1200×630 dark PNG with title text)

**Steps:**

- [ ] Copy the files with PowerShell (`Copy-Item`), creating no new dirs (all target dirs exist).
- [ ] Generate the three placeholders with a PowerShell `System.Drawing` script: 1200×630 bitmap, background `#111111`, centered white bold "Segoe UI" 48pt project title.
- [ ] Commit: `feat: add Hamza's photo, company logos, and project images`

### Task 2: Strip template sections

**Files:**

- Delete routes: `src/app/blog/`, `src/app/gears/`, `src/app/setup/`, `src/app/journey/`, `src/app/resume/`, `src/app/api/chat/`, `src/app/api/contact/` (leaves `src/app/api` empty → delete it too)
- Delete components: `src/components/blog/`, `src/components/gears/`, `src/components/landing/Blog.tsx`, `src/components/landing/Setup.tsx`, `src/components/landing/Journey.tsx`, `src/components/common/OnekoCat.tsx`, `src/components/common/Quote.tsx`, `src/components/common/ChatBubble.tsx` (and any chat-only components it imports), `src/components/CertificatesGallery.tsx`
- Delete config: `src/config/Cat.ts`, `src/config/ChatPrompt.ts`, `src/config/Gears.tsx`, `src/config/Setup.tsx`, `src/config/Journey.tsx`, `src/config/Quote.ts`, `src/config/Resume.ts`, `src/config/Achievements.tsx`
- Delete data: `src/data/blog/`, `src/data/journey/`
- Delete lib/types: `src/lib/blog.ts`, `src/lib/journey.ts`, `src/types/blog.ts`, `src/validate/testTelegram.ts`
- Delete public: `public/blog/`, `public/setup/`, `public/oneko/` (grep first; only delete dirs with no remaining references)
- Modify: `src/app/layout.tsx` (drop OnekoCat, Quote, ChatBubble imports + JSX)
- Modify: `src/app/page.tsx` (render Hero, Experience, Work, About, Github, CTA only)
- Modify: `src/config/Navbar.tsx` (nav items: Work `/work-experience`, Projects `/projects`, Contact `/contact`)
- Modify: `src/config/Meta.tsx` (remove `/blog`, `/gears`, `/setup`, `/resume` entries from `pageMetadata`)
- Modify: `src/config/Hero.tsx` (remove the Resume/CV button from `buttons`)
- Modify: `package.json` (remove `test-telegram` script)
- Modify: `.env.example` (keep only `NEXT_PUBLIC_URL` and the two Umami vars)

**Steps:**

- [ ] Delete the paths above.
- [ ] After deleting, `grep -r` for each removed module name (`blog`, `journey`, `gears`, `setup`, `ChatBubble`, `oneko`, `Quote`, `resume`, `chat`) in `src/` and fix every dangling import (e.g. sitemap/robots files, search/command components, footer links).
- [ ] Run `npm run build` — expect success, zero unresolved imports.
- [ ] Commit: `feat: remove blog, gears, setup, journey, resume, chat bot, and telegram form`

### Task 3: Personalize identity configs

**Files:**

- Create: `src/components/technologies/Python.tsx`, `Docker.tsx`, `Terraform.tsx`, `Kubernetes.tsx`, `GoogleCloud.tsx`, `Flask.tsx`, `Go.tsx` — fetch official SVGs from `https://cdn.simpleicons.org/<slug>` (slugs: `python`, `docker`, `terraform`, `kubernetes`, `googlecloud`, `flask`, `go`), wrap in the existing icon-component pattern (default export returning `<svg viewBox=…>`); for near-black monochrome icons (flask) use `fill="currentColor"` so dark mode works.
- Modify: `src/config/Hero.tsx`, `src/config/About.tsx`, `src/config/Experience.tsx`, `src/config/Github.tsx`, `src/config/Footer.tsx`, `src/config/CTA.tsx`, `src/config/Meta.tsx`, `src/config/Navbar.tsx` (logo → headshot)
- Rewrite: `src/components/landing/CTA.tsx` — remove cal.com embed/dialog; same visual button but a `next/link` to `/contact`.

**Content (from old repo constants, condensed):**

- Hero: name `Hamza Ajmal`, title `Backend, AI & Cloud engineer.`, avatar `/assets/hamza.jpg`; skills: Python, AWS, Docker, Node.js, TypeScript; description: builds scalable backend systems, AI-driven solutions, and cloud infrastructure; socials: GitHub `https://github.com/MoeHamzaA`, LinkedIn `https://www.linkedin.com/in/hamza-ajmal-166a8228b/`, `mailto:mhamzaajmal9@gmail.com` (no X). Buttons: only "Get in touch" → `/contact`.
- About: name `Hamza Ajmal`; description: CS student at Ontario Tech University (President's List), backend/AI/cloud focus, two-time HackHive hackathon podium finisher; `mySkills`: Python, AWS, Docker, Kubernetes, Terraform, NodeJs, TypeScript, ReactIcon, MongoDB.
- Experience (4 entries, exact bullets from old `constants/index.js`):
  1. AthenaGuard — Software Developer, May 2025–Present, `/company/athenaguard.jpeg`, isCurrent, tech: Python, Node.js, Docker, GitHub.
  2. Vosyn — Cloud Engineer, April 2025–June 2025, `/company/vosyn.jpeg`, tech: Google Cloud, Terraform, Kubernetes.
  3. Wouessi Digital — Software Engineer, January 2025–March 2025, `/company/wouessi.jpeg`, tech: Node.js, MongoDB, React, AWS, Figma.
  4. Santek Micro Solutions — Cloud Engineer, January 2024–December 2024, `/company/santek.jpeg`, tech: AWS, Python.
     All `location: 'Ontario, Canada'` unless the old data says otherwise; `website` empty string (verify the component tolerates it, else omit link rendering).
- Github config: `username: 'MoeHamzaA'`.
- Footer: `developer: 'Hamza Ajmal'`.
- CTA config: headshot image, preText "Have a project or role in mind? Let's talk.", linkText "Get in touch".
- Meta: siteConfig title `Hamza Ajmal — Portfolio`, description of his focus, author block (github `MoeHamzaA`, linkedin, email, twitter empty), keywords (backend, AI/ML, cloud, devops, python, aws); page ogImages that pointed at template screenshots → `/assets/hamza.jpg`.

**Steps:**

- [ ] Create icon components; personalize each config; rewrite CTA component.
- [ ] `npm run build` — success.
- [ ] Commit: `feat: personalize hero, about, experience, github, footer, CTA, and metadata`

### Task 4: Replace projects

**Files:**

- Delete: all 12 template MDX in `src/data/projects/`, all template images in `public/project/`
- Rewrite: `src/config/Projects.tsx` with the 5 projects
- Create: `src/data/projects/elva.mdx`, `cloudpulse-ai.mdx`, `smart-notes.mdx`, `trash-it.mdx`, `anomaly-detection.mdx` following the existing frontmatter schema (title, description, image, technologies[], github, live?, timeline, role, team, status, featured, challenges[], learnings[], isPublished)

**Project data (from old repo, professionalized):**

1. **Elva** — AI aid for Alzheimer's/dementia patients; face recognition + object identification via computer vision. 3rd place, HackHive 2025. Python/Flask/OpenCV. `github.com/MoeHamzaA/Elva`.
2. **CloudPulse-AI** — Go observability system for AI model health and system metrics, 92% drift-detection accuracy, CI/CD + IaC + CloudWatch. Go/AWS/Docker/Terraform. `github.com/MoeHamzaA/CloudPulse-AI`.
3. **Smart Notes** — converts lecture videos into searchable notes via multithreaded transcription; flashcards + Gemini chat. Python/Flask/FFmpeg. `github.com/MoeHamzaA/Smart-Notes`.
4. **Trash It** — HackHive 2024 winner; containerized CV app on Azure identifying recyclables. Django/Azure/Docker/OpenCV. `github.com/MoeHamzaA/Trash-It`, live `https://trash-it.azurewebsites.net/`.
5. **Cloud Monitoring Anomaly Detection** — Isolation Forest anomaly detection on real-time resource usage; SageMaker/Lambda/SNS. `github.com/MoeHamzaA/Cloud-Monitoring-Anomaly-Detection`.

Card icons use existing + Task-3 components (Python, Flask, Go, AWS, Docker, Terraform); technologies without icon components appear as strings in the MDX only.

**Steps:**

- [ ] Replace config + MDX + images; `grep -r` old project slugs in `src/` for leftovers.
- [ ] `npm run build` — success (MDX pages generate).
- [ ] Commit: `feat: replace template projects with Hamza's five projects`

### Task 5: Simplify contact page

**Files:**

- Modify: `src/app/contact/page.tsx` — drop `ContactForm`; render email CTA + GitHub/LinkedIn links using existing svg components and shadcn Button styles.
- Modify: `src/config/Contact.tsx` — replace form config with `{ title, description, email, socials[] }`.
- Delete: `src/components/contact/` (form components), any zod contact schema in `src/validate/` or `src/types/` used only by the form.

**Steps:**

- [ ] Rewrite page + config, delete form component tree, fix imports.
- [ ] `npm run build` — success.
- [ ] Commit: `feat: simplify contact page to direct email and socials`

### Task 6: README + final verification

**Files:**

- Rewrite: `README.md` — short: who Hamza is, stack, `bun install` / `bun dev`, env vars (only public URL + optional Umami), credit line "Based on sleek-portfolio template by ramxcodes" (license requires nothing, but credit is professional).

**Steps:**

- [ ] Rewrite README.
- [ ] `npm run build` — success.
- [ ] `npm run dev` in background; fetch `/`, `/work-experience`, `/projects`, `/projects/elva`, `/contact` — all 200, spot-check rendered HTML contains "Hamza" and no "ramxcodes"/"Ram".
- [ ] Global grep for `ramxcodes|Ramkrishna|ramx\.in` in `src/`, `public/`, root configs — zero hits (except README credit).
- [ ] Commit: `docs: rewrite README for Hamza's portfolio`
