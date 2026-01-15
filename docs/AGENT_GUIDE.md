# Native Plant Revolution - Agent Implementation Guide

Implementation spec for an AI agent to build a garden showcase site with Astro 5.

## Project Context

- **Framework:** Astro 5.16.9 (fresh install, minimal starter)
- **Package manager:** yarn
- **Deployment target:** Cloudflare Pages (static output)
- **JavaScript policy:** Minimize JS; use Astro components (no framework) unless map feature is added later

## Target Structure

```
src/
├── content/
│   └── sites/                    # Garden site content (markdown)
│       └── example-garden.md
├── content.config.ts             # Content collection schema
├── layouts/
│   └── Layout.astro              # Base layout with nav/footer
├── pages/
│   ├── index.astro               # Homepage - grid of all sites
│   ├── about.astro               # About/contact page
│   └── sites/
│       └── [...slug].astro       # Dynamic route for each site
├── components/
│   ├── Header.astro              # Site header with navigation
│   ├── Footer.astro              # Site footer
│   └── SiteCard.astro            # Card for site listings
└── styles/
    └── global.css                # Optional global styles
public/
├── images/
│   └── sites/                    # Garden photos organized by site
└── styles/
    └── global.css                # If using external stylesheet
```

## Implementation Steps

### 1. Content Collection Setup

Create `src/content.config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const sites = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    address: z.string(),
    description: z.string(),
    images: z.array(z.string()),
    plantedDate: z.date().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { sites };
```

### 2. Create Sample Content

Create `src/content/sites/` directory and add at least one example:

`src/content/sites/example-garden.md`:
```markdown
---
title: "Example Native Garden"
address: "123 Main Street, Portland, OR"
description: "A demonstration garden featuring Pacific Northwest native plants"
images:
  - /images/sites/example-garden/main.jpg
plantedDate: 2024-06-15
featured: true
---

Detailed description of the garden goes here. Supports full markdown.

## Plants Featured
- Oregon Grape
- Red Flowering Currant
```

### 3. Layout Component

Replace `src/layouts/Layout.astro`:

Requirements:
- Accept `title` and optional `description` props
- Include semantic HTML structure: header > nav, main > slot, footer
- Navigation links: Home ("/"), About ("/about")
- Use scoped styles (Astro default)
- Color palette: greens (#2d5016 primary), neutral grays
- Responsive: mobile-friendly without media queries if possible (flexbox/grid)

### 4. SiteCard Component

Create `src/components/SiteCard.astro`:

Props:
- `title: string`
- `address: string`  
- `description: string`
- `image: string`
- `slug: string`

Requirements:
- Card with image, title (linked), address, truncated description
- Hover state with subtle shadow
- Image should use `object-fit: cover`

### 5. Homepage

Replace `src/pages/index.astro`:

Requirements:
- Import and use Layout
- Fetch all sites: `await getCollection('sites')`
- Sort by plantedDate descending (newest first)
- Render in responsive grid using SiteCard component
- Handle empty state gracefully

### 6. Dynamic Site Page

Create `src/pages/sites/[...slug].astro`:

Requirements:
- Use `getStaticPaths()` to generate routes from collection
- Display: title, address, date (formatted), image gallery, rendered markdown content
- Include back link to homepage
- Gallery should be responsive grid

Key code pattern:
```typescript
export async function getStaticPaths() {
  const sites = await getCollection('sites');
  return sites.map((site) => ({
    params: { slug: site.id },
    props: { site },
  }));
}

const { site } = Astro.props;
const { Content } = await render(site);
```

### 7. About Page

Create `src/pages/about.astro`:

Requirements:
- Static content page
- Sections: intro, mission, contact info (placeholder email/phone)
- Use Layout component

### 8. Image Directories

Create directory structure:
- `public/images/sites/` (for garden photos)
- Optionally add a placeholder image

### 9. Cloudflare Pages Config

Update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://nativeplantrevolution.org', // Update with actual domain
});
```

Note: For static sites, no adapter is needed. Cloudflare Pages serves the `dist` folder directly.

## Verification Commands

```bash
# Install dependencies (if needed)
yarn install

# Development server
yarn dev

# Production build (MUST succeed)
yarn build

# Preview production build
yarn preview
```

## Validation Checklist

- [ ] `yarn build` completes without errors
- [ ] Homepage loads and displays site cards
- [ ] Clicking a site card navigates to `/sites/[slug]`
- [ ] Site detail page renders markdown content
- [ ] About page loads
- [ ] Navigation works between all pages
- [ ] No JavaScript errors in console
- [ ] Images display correctly (if present)

## Style Guidelines

- **Primary color:** #2d5016 (dark green)
- **Text:** #333 (body), #666 (secondary)
- **Borders:** #e0e0e0
- **Font:** system-ui stack
- **Spacing:** Use rem units (1rem = 16px base)
- **Max content width:** 1200px
- **Card grid:** `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`

## Content Schema Reference

```typescript
// Site frontmatter fields
{
  title: string;           // Required - display name
  address: string;         // Required - physical location
  description: string;     // Required - short summary for cards
  images: string[];        // Required - array of image paths (from public/)
  plantedDate?: Date;      // Optional - when garden was planted
  featured?: boolean;      // Optional - for future homepage featuring
}
```

## Notes for Agent

1. **Astro 5 specifics:** Use `render()` from `astro:content` to get Content component
2. **File paths:** Content collection uses `site.id` as the slug (filename without extension)
3. **Images:** Store in `public/images/` - served from root (no `/public` prefix)
4. **No client JS needed:** All components are Astro (server-rendered)
5. **TypeScript:** Project uses TypeScript; maintain type safety
6. **Delete starter files:** Remove `src/components/Welcome.astro` and `src/assets/` demo files

## Future: Map Feature

When implementing maps later:
1. Add `latitude: z.number()` and `longitude: z.number()` to schema
2. Use Leaflet.js (no API key required)
3. Create island component with `client:load` or `client:visible`
4. Consider Svelte for the map component (popular Astro integration)

## Future: CMS Integration

For Decap CMS (if needed later):
1. Create `public/admin/index.html` and `config.yml`
2. Configure Git Gateway through Cloudflare/Netlify
3. Define content collections in CMS config matching Astro schema
