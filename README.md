# Hamza Ajmal — Portfolio

Personal portfolio of **Hamza Ajmal** — backend, AI/ML, and cloud engineer.
Computer Science student at Ontario Tech University.

- **GitHub:** [MoeHamzaA](https://github.com/MoeHamzaA)
- **LinkedIn:** [hamza-ajmal-166a8228b](https://www.linkedin.com/in/hamza-ajmal-166a8228b/)
- **Email:** mhamzaajmal9@gmail.com

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui
- MDX for project case studies
- Dark/light mode, SEO metadata, Umami analytics (optional)

## Getting Started

```bash
# install dependencies (bun preferred, npm works too)
bun install

# start the dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file (see `.env.example`):

```env
NEXT_PUBLIC_URL="http://localhost:3000"
# Optional — Umami analytics
NEXT_PUBLIC_UMAMI_SRC="your-umami-script-url"
NEXT_PUBLIC_UMAMI_ID="your-umami-website-id"
```

## Content

All content is config-driven:

- `src/config/` — hero, about, experience, projects, contact, metadata
- `src/data/projects/` — MDX case studies for each project
- `public/` — images (headshot, company logos, project screenshots)
