# Copilot Instructions for Hazel Family Law & Mediation

## Project Overview
This is a **static website built with Astro** for a family law firm in Melbourne, Australia. It serves as a marketing site and information hub with a headless CMS (Decap CMS) for content management.

**Key URLs:**
- Production: `https://hazelfamilylaw.com.au/`
- Netlify deployment: `https://hazel-family-law.netlify.app/`

## Architecture & Technology Stack

### Core Framework
- **Astro 5.17+**: Static site generation with `.astro` component files (HTML+CSS+JavaScript co-located)
- **Package Manager**: pnpm 10.28.2+ (monorepo-ready, faster than npm)
- **Build Target**: Optimized static HTML with gzip compression via `astro-compressor`

### Key Dependencies
- **Decap CMS** (formerly Netlify CMS): Headless CMS for managing blog posts, employees, services, testimonials
- **Sass**: CSS preprocessing (watch for `.scss` patterns)
- **Autoprefixer + cssnano**: CSS optimization in production
- **Prettier + Prettier Astro plugin**: Code formatting standard

### Development Commands
```bash
pnpm dev      # Start dev server at localhost:4321
pnpm build    # Generate static HTML to ./dist/
pnpm preview  # Preview built site locally
```

## Content Collections & Data Model

### Defined Collections (in `src/content.config.ts`)
1. **Blog** (`src/content/blog/*.md`)
   - Schema: title, date, author, hero-image, thumbnail, accreditation-images (optional), useful-links (optional)
   - Dynamic routing: `src/pages/blogs/[slug].astro`
   - Use for legal articles and firm insights

2. **Employees** (`src/content/employees/*.md`)
   - Schema: name, position, pronouns (optional), email, phone, photo, accreditation-images
   - Displayed on About page with headshots from `src/assets/headshots/`

3. **Services** (`src/content/services/*.md`)
   - Schema: title, short-description, image
   - Dynamic pages: `src/pages/services/[slug].astro`
   - Core services: child-support, de-facto-relationship-law, divorce, property-settlement, etc.

4. **Testimonials** (`src/content/testimonials/*.md`)
   - Schema: client name, rating (likely), testimonial text
   - Used in Testimonials component on homepage

5. **Featured Blog** (`src/content/featured-blog/index.md`)
   - Schema: featured-post (slug reference)
   - Highlights a single blog post prominently

### CMS Integration (Decap)
- **Config**: `public/admin/config.yml`
- **Workflow**: Content editors use `/admin` interface to create/edit markdown files
- **Git Sync**: Changes push to repo automatically (Netlify integration)

## Component Architecture

### Page Structure
All pages use the **Main layout** (`src/layouts/Main.astro`) which defines:
- Global `<head>` with Open Graph meta tags for SEO
- CSS custom properties (variables) for the Hazel brand color palette:
  - `--burnt-umber` (#2a1708): Primary text
  - `--hazelwood` (#a15834): Primary highlight
  - `--autumn-blush` (#bf8c69): Secondary highlight
  - `--oat-husk` (#e3dfcc): Light backgrounds
  - `--morning-fog` (#ffffff): White/clean
  - `--deep-coal` (#000000): Black accents

### Reusable Components
- **Header**: Navigation across all pages
- **Footer**: Site footer with links and contact info
- **Hero**: Large banner sections (multiple variants in subdirectories for specific pages)
- **Services**: Grid of service offerings on homepage
- **Testimonials**: Client testimonial carousel/list
- **Pricing**: Service pricing information
- **Contact**: Contact form (check for form submission handling)
- **QuickExit**: Accessibility feature (likely a quick-exit button for safety)

**Component Pattern**: Astro components have frontmatter (`---`) for imports/logic, HTML template, and `<style>` scoped to that component.

### Page-Specific Variants
- Components in `src/components/{about,pricing,resources,services,site-legal}/` are page-specific
- Example: `Hero.astro` exists in `about/`, `pricing/`, `resources/`, and `services/` subdirectories
- Each tailors the hero section to that page's context

## Site Pages & Routing

### Main Pages (`src/pages/`)
- **index.astro**: Homepage (composes Hero, Intro, Services, Testimonials, Pricing, Contact)
- **about.astro**: Team, credentials, firm story
- **services.astro**: Overview of all services
- **services/[slug].astro**: Dynamic service detail pages
- **blogs/[slug].astro**: Dynamic blog post pages
- **pricing.astro**: Service pricing
- **resources.astro**: Blog archive and resource hub
- **disclaimer.astro, privacy-policy.astro, terms-of-use.astro**: Legal pages

### Special Pages
- **admin.html**: Decap CMS admin interface (deployed to `/admin`)
- Legal content pages use components from `src/components/site-legal/`

## Development Patterns

### Adding New Blog Posts
1. Create `.md` file in `src/content/blog/` with required frontmatter
2. Deploy to trigger Netlify rebuild
3. Automatically routable via `/blogs/[slug]` dynamic route

### Adding New Services
1. Create `.md` file in `src/content/services/`
2. Add to Services grid component (check rendering logic in `src/components/services/`)
3. Dynamic detail page auto-generated via `src/pages/services/[slug].astro`

### Styling
- Global styles in `Main.astro` `<style is:global>`
- Component-scoped styles in each `.astro` file's `<style>` block
- Use CSS custom properties for theme consistency
- Sass supported (can use `.scss` in style blocks with `lang="scss"`)

### Static Assets
- **Images**: `src/assets/{accreditations,headshots,svgs,uploads,videos}/`
- **Public files**: `public/` (served as-is, includes admin config and quick-exit assets)
- Reference with relative paths or Astro image imports for optimization

## Critical Developer Workflows

### Local Development
```bash
pnpm install          # First-time setup
pnpm dev              # Start dev server, hot reload enabled
# Edit .astro or .md files; changes reflect in browser immediately
```

### Building & Deployment
```bash
pnpm build            # Creates ./dist/ with optimized static HTML
pnpm preview          # Test built output locally before deploying
# Push to main/deploy branch → Netlify auto-builds and deploys
```

### Editing Content via CMS
- Navigate to `https://hazelfamilylaw.com.au/admin` (production) or `/admin` (local)
- Decap CMS UI provides visual editor for blog, services, employees, testimonials
- Changes commit to git repo automatically

## Common Gotchas & Best Practices

1. **Content Collections are Type-Safe**: Always match the Zod schema in `content.config.ts` when creating new content files. Missing required fields will break builds.

2. **Dynamic Routes**: Check if a `[slug].astro` page exists before assuming dynamic routing works. Currently blogs and services use this pattern.

3. **Image Paths**: Use relative paths from `src/` for assets in components. Example: `../../assets/headshots/filename.jpg`

4. **Color Scheme**: Always reference CSS custom properties (`var(--burnt-umber)`, etc.) rather than hardcoding hex values to maintain brand consistency.

5. **Astro Frontmatter**: Anything in the `---` block runs on the server. Use it for imports, data fetching from collections, and passing props to components.

6. **Meta Tags**: The Main layout includes comprehensive Open Graph tags. Update `og:image` paths when changing brand assets.

7. **No Build Folder**: `.github/` workflows may not exist yet. If adding CI/CD, follow Netlify's Astro integration patterns.

## File References for Key Patterns

- **Page composition**: [src/pages/index.astro](src/pages/index.astro) - see how components combine
- **Content schema**: [src/content.config.ts](src/content.config.ts) - defines all collection types
- **Layout & globals**: [src/layouts/Main.astro](src/layouts/Main.astro) - base HTML, colors, fonts
- **Component example**: [src/components/Intro.astro](src/components/Intro.astro) - service details with local styles
- **CMS config**: [public/admin/config.yml](public/admin/config.yml) - collection and field definitions

## Questions for Iteration

- Should I document the Contact form submission handler (email/backend)?
- Are there specific Netlify environment variables or build configs beyond the standard Astro setup?
- Does the Quick Exit button have special integration patterns (safety/accessibility)?
