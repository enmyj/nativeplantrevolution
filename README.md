# Native Plant Revolution

A website showcasing native plant garden sites. Built with [Astro](https://astro.build).

**Live site:** https://nativeplantrevolution.info

## Project Structure

```
src/
├── content/
│   └── sites/           # Garden site markdown files
├── content.config.ts    # Content collection schema
├── layouts/
│   └── Layout.astro     # Base HTML layout
├── pages/
│   ├── index.astro      # Homepage - lists all sites
│   ├── about.astro      # About page
│   └── sites/
│       └── [...slug].astro  # Dynamic garden site pages
└── components/
    ├── Header.astro
    ├── Footer.astro
    └── SiteCard.astro
public/
└── images/
    └── sites/           # Garden photos
```

## Commands

| Command         | Action                                       |
| :-------------- | :------------------------------------------- |
| `bun install`   | Install dependencies                         |
| `bun dev`       | Start dev server at `localhost:4321`         |
| `bun run build` | Build production site to `./dist/`           |
| `bun run preview` | Preview build locally before deploying     |

## Adding a New Garden Site

1. Create a new file in `src/content/sites/your-site-name.md`
2. Add frontmatter:
   ```yaml
   ---
   title: "Garden Name"
   address: "123 Main St, City, State"
   description: "Short description for the card"
   images:
     - /images/sites/your-site-name/photo1.jpg
   plantedDate: 2024-06-15
   featured: false
   ---
   ```
3. Write the full description in markdown below the frontmatter
4. Add photos to `public/images/sites/your-site-name/`
5. Commit and push—Cloudflare Pages will auto-deploy

## Deployment

Deployed on Cloudflare Pages. Push to `main` to deploy.
