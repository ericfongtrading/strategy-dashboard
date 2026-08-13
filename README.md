# 量化策略仪表盘 · Strategy Dashboard

Next.js + Tailwind static site that introduces the quant strategies currently in research / production. Designed to grow into a real-time performance dashboard.

## Run locally

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

## Build a static site (for GitHub Pages)

```powershell
# If you host at https://<user>.github.io/<repo>/  (project site)
$env:NEXT_PUBLIC_BASE_PATH = "/<repo>"; npm run build

# Or for a user site at https://<user>.github.io/  leave the env var unset:
npm run build
```

The static export is written to `./out`.

## Deploy to GitHub Pages

1. Push this folder to a new GitHub repo.
2. In **Settings → Pages**, set *Source* to **GitHub Actions**.
3. Edit `.github/workflows/deploy.yml` and change `NEXT_PUBLIC_BASE_PATH` to `/your-repo-name` (or remove the line if it's a user/org site).
4. Push to `main`. The workflow builds and deploys automatically.

## Adding / editing strategies

All strategy content lives in [`lib/strategies.ts`](lib/strategies.ts). To add a strategy:

1. Drop the EN/ZH PDF into `public/pdfs/<category>/`.
2. Append an entry to the right category's `strategies` array.

## Project layout

```
app/                Next.js app router (layout, page, globals.css)
components/         StrategyCard, CategorySection
lib/strategies.ts   ← edit this to change content
public/pdfs/        all strategy PDFs, organized by category
```
