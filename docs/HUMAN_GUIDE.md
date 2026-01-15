# Native Plant Revolution - Human Implementation Guide

A beginner-friendly guide to building a garden showcase site with Astro.

## Overview

**What we're building:**
- Homepage listing all garden sites
- Individual pages for each garden site (address, photos, description)
- About page with contact info
- Simple, mostly-static site with minimal JavaScript

**Tech choices:**
- **Astro** - static site generator (renders to HTML, minimal JS)
- **Content Collections** - Astro's built-in way to manage content (like blog posts)
- **Cloudflare Pages** - hosting
- No framework needed initially (Astro components are enough for this)

---

## Part 1: Understanding the Project Structure

```
src/
├── content/
│   └── sites/           # Your garden site markdown files go here
│       ├── riverside-park.md
│       └── community-garden.md
├── layouts/
│   └── Layout.astro     # Base HTML wrapper (head, nav, footer)
├── pages/
│   ├── index.astro      # Homepage - lists all sites
│   ├── about.astro      # About page
│   └── sites/
│       └── [...slug].astro  # Dynamic page for each garden site
├── components/
│   ├── Header.astro     # Navigation
│   ├── Footer.astro     # Footer
│   └── SiteCard.astro   # Card component for site listings
└── styles/
    └── global.css       # Global styles
public/
└── images/
    └── sites/           # Your garden photos go here
        ├── riverside-park/
        └── community-garden/
```

---

## Part 2: Step-by-Step Implementation

### Step 1: Set up Content Collections

Content Collections let you write garden sites as Markdown files with structured data.

**Create the config file:** `src/content.config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

const sites = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    address: z.string(),
    description: z.string(),
    images: z.array(z.string()),  // paths to images in public/
    plantedDate: z.date().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { sites };
```

**Create your first garden site:** `src/content/sites/riverside-park.md`

```markdown
---
title: "Riverside Park Native Garden"
address: "123 River Road, Portland, OR"
description: "A pollinator-friendly garden featuring Oregon native wildflowers"
images:
  - /images/sites/riverside-park/main.jpg
  - /images/sites/riverside-park/spring.jpg
plantedDate: 2024-03-15
featured: true
---

This garden was planted in partnership with the local parks department...

## Plants Featured
- Oregon Grape
- Red Flowering Currant
- Douglas Aster
```

### Step 2: Create the Base Layout

**Update:** `src/layouts/Layout.astro`

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = "Showcasing native plant gardens" } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title} | Native Plant Revolution</title>
    <link rel="stylesheet" href="/styles/global.css" />
  </head>
  <body>
    <header>
      <nav>
        <a href="/" class="logo">🌿 Native Plant Revolution</a>
        <ul>
          <li><a href="/">Sites</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header>
    
    <main>
      <slot />
    </main>
    
    <footer>
      <p>© 2024 Native Plant Revolution</p>
    </footer>
  </body>
</html>

<style>
  header {
    padding: 1rem 2rem;
    border-bottom: 1px solid #e0e0e0;
  }
  
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .logo {
    font-size: 1.25rem;
    font-weight: bold;
    text-decoration: none;
    color: #2d5016;
  }
  
  ul {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  ul a {
    text-decoration: none;
    color: #333;
  }
  
  ul a:hover {
    color: #2d5016;
  }
  
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  footer {
    text-align: center;
    padding: 2rem;
    border-top: 1px solid #e0e0e0;
    margin-top: 4rem;
  }
</style>
```

### Step 3: Create a Site Card Component

**Create:** `src/components/SiteCard.astro`

```astro
---
interface Props {
  title: string;
  address: string;
  description: string;
  image: string;
  slug: string;
}

const { title, address, description, image, slug } = Astro.props;
---

<article class="site-card">
  <img src={image} alt={title} />
  <div class="content">
    <h2><a href={`/sites/${slug}`}>{title}</a></h2>
    <p class="address">📍 {address}</p>
    <p class="description">{description}</p>
  </div>
</article>

<style>
  .site-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.2s;
  }
  
  .site-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .content {
    padding: 1rem;
  }
  
  h2 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
  }
  
  h2 a {
    color: #2d5016;
    text-decoration: none;
  }
  
  .address {
    color: #666;
    font-size: 0.875rem;
    margin: 0 0 0.5rem;
  }
  
  .description {
    color: #333;
    margin: 0;
  }
</style>
```

### Step 4: Create the Homepage

**Update:** `src/pages/index.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import SiteCard from '../components/SiteCard.astro';
import { getCollection } from 'astro:content';

const allSites = await getCollection('sites');
// Sort by date, newest first
const sortedSites = allSites.sort((a, b) => 
  (b.data.plantedDate?.getTime() ?? 0) - (a.data.plantedDate?.getTime() ?? 0)
);
---

<Layout title="Garden Sites">
  <h1>Native Plant Gardens</h1>
  <p class="intro">Explore our collection of native plant gardens across the region.</p>
  
  <div class="site-grid">
    {sortedSites.map((site) => (
      <SiteCard
        title={site.data.title}
        address={site.data.address}
        description={site.data.description}
        image={site.data.images[0] || '/images/placeholder.jpg'}
        slug={site.id}
      />
    ))}
  </div>
</Layout>

<style>
  h1 {
    color: #2d5016;
    margin-bottom: 0.5rem;
  }
  
  .intro {
    color: #666;
    margin-bottom: 2rem;
  }
  
  .site-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
</style>
```

### Step 5: Create the Dynamic Site Page

**Create:** `src/pages/sites/[...slug].astro`

```astro
---
import Layout from '../../layouts/Layout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const sites = await getCollection('sites');
  return sites.map((site) => ({
    params: { slug: site.id },
    props: { site },
  }));
}

const { site } = Astro.props;
const { Content } = await render(site);
---

<Layout title={site.data.title} description={site.data.description}>
  <article>
    <a href="/" class="back">← Back to all sites</a>
    
    <h1>{site.data.title}</h1>
    <p class="address">📍 {site.data.address}</p>
    
    {site.data.plantedDate && (
      <p class="date">Planted: {site.data.plantedDate.toLocaleDateString()}</p>
    )}
    
    <div class="gallery">
      {site.data.images.map((img) => (
        <img src={img} alt={site.data.title} />
      ))}
    </div>
    
    <div class="content">
      <Content />
    </div>
  </article>
</Layout>

<style>
  .back {
    color: #666;
    text-decoration: none;
  }
  
  .back:hover {
    color: #2d5016;
  }
  
  h1 {
    color: #2d5016;
    margin: 1rem 0 0.5rem;
  }
  
  .address {
    color: #666;
    margin: 0 0 0.5rem;
  }
  
  .date {
    color: #888;
    font-size: 0.875rem;
  }
  
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
  }
  
  .gallery img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .content {
    line-height: 1.7;
  }
  
  .content :global(h2) {
    color: #2d5016;
    margin-top: 2rem;
  }
</style>
```

### Step 6: Create the About Page

**Create:** `src/pages/about.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="About">
  <h1>About Native Plant Revolution</h1>
  
  <div class="content">
    <p>
      We're dedicated to restoring native plant habitats in urban and 
      suburban spaces across the region.
    </p>
    
    <h2>Our Mission</h2>
    <p>
      Every garden we plant supports local pollinators, birds, and 
      beneficial insects while reducing water usage and maintenance needs.
    </p>
    
    <h2>Contact</h2>
    <p>
      <strong>Email:</strong> hello@nativeplantrevolution.org<br />
      <strong>Phone:</strong> (555) 123-4567
    </p>
    
    <h2>Get Involved</h2>
    <p>
      Interested in having us design a native plant garden? 
      Reach out via email to schedule a consultation.
    </p>
  </div>
</Layout>

<style>
  h1 {
    color: #2d5016;
  }
  
  .content {
    max-width: 700px;
    line-height: 1.7;
  }
  
  h2 {
    color: #2d5016;
    margin-top: 2rem;
  }
</style>
```

### Step 7: Add Global Styles (optional)

**Create:** `public/styles/global.css`

```css
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  color: #333;
  line-height: 1.5;
}

img {
  max-width: 100%;
  height: auto;
}
```

---

## Part 3: Cloudflare Pages Deployment

### Option A: Connect to Git (Recommended)

1. Push your code to GitHub/GitLab
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Create a new project → Connect to Git
4. Select your repository
5. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `yarn build`
   - **Build output directory:** `dist`
6. Deploy!

Every push to main will auto-deploy.

### Option B: Direct Upload

```bash
yarn build
# Then upload the `dist` folder to Cloudflare Pages dashboard
```

---

## Part 4: Adding New Garden Sites

To add a new site, just create a new markdown file:

1. Create `src/content/sites/your-site-name.md`
2. Add your frontmatter (title, address, images, etc.)
3. Write the description in markdown below
4. Add images to `public/images/sites/your-site-name/`
5. Commit and push → site auto-deploys

---

## Part 5: CMS Options (For Your Sister)

### Option 1: Decap CMS (formerly Netlify CMS)
- Free, open-source
- Git-based (edits create commits)
- Works with Cloudflare Pages
- Adds a `/admin` page where she can edit content visually
- **Setup:** ~30 min, requires some config

### Option 2: TinaCMS
- Free tier available
- Visual editing with live preview
- Git-based
- Very beginner-friendly interface

### Option 3: Notion + Notion API
- She might already use Notion
- Can sync Notion pages to your site at build time

### Option 4: You Just Do It
- Honestly the simplest for a small site
- She sends you text + photos
- You paste into markdown file, commit, done

**Recommendation:** Start without a CMS. If she finds it frustrating to send you content, set up Decap CMS later.

---

## Part 6: Future Map Feature

When you're ready to add a map:

1. Add `latitude` and `longitude` to your site schema
2. Use Leaflet.js (free, no API key needed) 
3. Create a Map component that renders only on the client:

```astro
---
// src/components/Map.astro
---
<div id="map"></div>

<script>
  // Leaflet code runs only in browser
  import L from 'leaflet';
  // ... initialize map
</script>
```

This keeps the site mostly static while adding interactivity where needed.

---

## Quick Reference: Common Tasks

| Task | Command |
|------|---------|
| Start dev server | `yarn dev` |
| Build for production | `yarn build` |
| Preview production build | `yarn preview` |
| Add a new garden site | Create `src/content/sites/name.md` |
| Add images | Put in `public/images/sites/` |

---

## Troubleshooting

**"Cannot find module 'astro:content'"**
- Make sure you created `src/content.config.ts` (not `.js`)
- Restart the dev server

**Images not showing**
- Images in `public/` are served from root: `/images/...` not `public/images/...`
- Check file extensions match exactly (case-sensitive)

**Styles not applying**
- Astro scopes styles by default
- Use `:global()` for styles that should apply to rendered markdown

---

That's it! You have a fully functional garden showcase site. 🌿
