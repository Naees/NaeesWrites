# Blogsite Project Plan

## Overview
A clean, minimalist single-author blogsite built with Astro, deployed to GitHub Pages. Content is managed via markdown files committed to the repository.

## Tech Stack
- **Framework**: Astro (static site generator)
- **Hosting**: GitHub Pages
- **Comments**: giscus (GitHub Discussions-based)
- **Markdown**: Local `.md` files in a `content/` directory
- **Deployment**: GitHub Actions CI/CD to GitHub Pages

## Features
- Blog listing page with all posts
- Individual post pages
- Search functionality (client-side)
- Tags/categories system
- Dark mode support
- SEO optimization (meta tags, sitemap, Open Graph)
- Comments via giscus on each post
- Detailed about page
- Responsive design
- Clean, minimalist aesthetic (inspired by [brutecat.com](https://brutecat.com))

## Content Structure
```
content/
  posts/
    post-1.md
    post-2.md
    ...
```

Each post includes frontmatter:
- `title`
- `date`
- `description`
- `tags`
- `coverImage` (optional)

## Pages
1. **Home** — Blog listing with featured posts, search bar, tag filters
2. **Post** — Individual post page with content, comments, related posts
3. **About** — Detailed bio page
4. **Tags** — Tag index page showing all posts grouped by tag

## Design Direction
- Clean, minimalist layout
- Typography-focused
- Brutalist-inspired elements (inspired by brutecat.com)
- Dark/light mode toggle
- Mobile-first responsive

## Project Structure
```
blogsite/
  public/
    favicon.ico
    og-image.png
  src/
    content/
      config.ts
    configs/
      astro.config.ts
    lib/
      utils.ts
    styles/
      global.css
    pages/
      index.astro
      posts/
        [slug].astro
      about.astro
      tags.astro
      tags/[tag].astro
    components/
      Layout.astro
      Header.astro
      Footer.astro
      PostCard.astro
      SearchBar.astro
      Tag.astro
      GiscusComments.astro
      DarkModeToggle.astro
      SeoHead.astro
  package.json
  tsconfig.json
  .github/
    workflows/
      deploy.yml
  PLAN.md
```

## Development Phases

### Phase 1: Setup & Core
- Initialize Astro project
- Configure TypeScript
- Set up directory structure
- Configure GitHub Actions for deployment

### Phase 2: Content Layer
- Create content collection configuration
- Build markdown parsing utilities
- Create sample posts with frontmatter
- Implement tag system

### Phase 3: Pages & Components
- Build Layout component (Header, Footer, content slot)
- Build Home page with post listing
- Build Post page with rendering
- Build About page
- Build Tags page + tag index page

### Phase 4: Features
- Implement search functionality
- Add dark mode toggle
- Integrate giscus comments
- Add SEO metadata (meta tags, sitemap, Open Graph)

### Phase 5: Styling & Polish
- Apply minimalist design system
- Implement dark/light mode styles
- Responsive design
- Animations/transitions
- Cross-browser testing

### Phase 6: Testing & Deployment
- Test all pages and features
- Verify GitHub Pages deployment
- Final polish and bug fixes

## Subagents

### Subagent 1: Setup & Configuration
- Initialize Astro project
- Configure TypeScript, linting
- Set up GitHub Actions workflow for GitHub Pages
- Configure content collections

### Subagent 2: Content Layer & Data Layer
- Create content collection schema
- Build markdown processing utilities
- Create sample content
- Implement tag/category system
- Build search index generation

### Subagent 3: Pages & Components
- Build Layout, Header, Footer components
- Build Home page with post listing
- Build individual Post page
- Build About page
- Build Tags page and tag index pages
- Build PostCard component

### Subagent 4: Features & Styling
- Implement search functionality
- Add dark mode toggle
- Integrate giscus comments
- Add SEO optimization
- Apply design system and styling
- Responsive design implementation

## Security Considerations
- No server-side code — fully static
- giscus uses GitHub token (stored as GitHub secret)
- No database, no API keys required
- Content managed via git (version controlled)

## Open Questions
- (To be addressed during development)
