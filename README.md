# War Survivors Institute — Website

A static, editorial redesign of [warsurvivors.org](https://warsurvivors.org) deployed on Vercel. Content is editable via a non-technical admin (Pages CMS).

## How content updates work

```
Editor logs into Pages CMS  →  edits a form  →  saves
        ↓
GitHub commit (automatic)
        ↓
Vercel webhook fires
        ↓
Vercel rebuilds and redeploys (~30–60 seconds)
        ↓
Live site shows the change
```

Anyone with edit access in Pages CMS can:
- Add / edit / remove **Events**
- Add / edit / remove **Stories**
- Update **Team & Board** members
- Update the top **announcement ribbon**, **homepage hero**, **mission**, **stats**, and **contact info** (in Site Settings)

See [EDITORS-GUIDE.md](EDITORS-GUIDE.md) for the staff-facing walkthrough.

## Project structure

```
.
├── index.html          # Homepage
├── about.html          # About / Mission / Team / Board
├── programs.html       # Programs, Research, RHS-15
├── events.html         # Events listing (data-driven)
├── stories.html        # Survivor & clinician stories
├── get-involved.html   # Donate, Volunteer, Sponsor
├── contact.html        # Contact form + FAQ
├── data/               # ★ Editable content (managed by Pages CMS)
│   ├── events.json
│   ├── stories.json
│   ├── team.json
│   └── site.json
├── assets/
│   ├── og-image.svg
│   ├── event-og.svg
│   └── uploads/        # Images uploaded via the CMS land here
├── css/styles.css      # Shared design system
├── js/
│   ├── main.js         # Nav, scroll reveals, hero carousel
│   └── content-loader.js  # Fetches data/*.json and renders cards
├── .pages.yml          # Pages CMS schema (defines the editor's forms)
├── DESIGN_SYSTEM.md    # Color palette, typography, component spec
├── vercel.json         # Vercel routing config (clean URLs)
└── README.md
```

## Local development

```bash
# From the project root
python3 -m http.server 8787
# Open http://localhost:8787
```

That's it — no build step, no Node, no dependencies. The site is pure HTML, Tailwind via CDN, and a small JS loader.

## Deployment

The site auto-deploys on every push to `main` via Vercel's GitHub integration.

To deploy manually from your laptop:
```bash
vercel --prod
```

Production URL: https://war-survivors-institute.vercel.app

## Tech stack

- **Hosting:** Vercel (free tier)
- **Source control:** GitHub
- **CMS:** [Pages CMS](https://pagescms.org) (free, git-based)
- **Styling:** Tailwind CSS (via CDN, no build)
- **Fonts:** Google Fonts (Playfair Display + Inter)
- **Donations:** GiveButter (`https://givebutter.com/investinWSI`)
- **External event detail pages:** WordPress at `warsurvivors.org/event/...`

## Adding a new editable field later

1. Add the field to the appropriate `data/*.json` file
2. Add the field definition to `.pages.yml` so it appears in the editor
3. Reference the new field in `js/content-loader.js` (or in the relevant HTML if it's a static page)
4. Commit and push — Vercel redeploys automatically

## Editor access

Editors authenticate via **GitHub OAuth** through Pages CMS at https://app.pagescms.org. They need:
1. A free GitHub account (one-time signup)
2. Read/write access to this repo (or to be members of the WSI GitHub org)

For shared editor access, create a single `wsi-editor@warsurvivors.org` GitHub account and share the password via 1Password / Bitwarden.
