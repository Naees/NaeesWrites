# REFACTOR.md — NaeesWrites Code Review & Refactoring Plan

## Issues Found by Priority

### P0 - Bugs

| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|
| A1 | `Footer.astro` | 138 | `top` variable referenced but never defined in scroll-to-top branch | Define `top = window.scrollY` before using it |
| A2 | `Footer.astro` | 109 | `scrollend` event not reliably supported across browsers | Replace with debounced scroll listener that tracks idle state |
| A3 | `posts/[slug].astro` | 11, 18 | `getCollection('posts')` called twice (in `getStaticPaths` and component body) | Remove redundant call in component body; data is already available from `getStaticPaths` |

### P1 - Performance

| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|
| B1 | `Header.astro` | 241 | MutationObserver + matchMedia listener redundantly call `updateLogo()` | Consolidate into single observer that handles both theme and resize changes |
| B2 | `GiscusComments.astro` | 47-61 | Click listener + MutationObserver both reload Giscus iframe on theme toggle | Merge into single `loadGiscusWithTheme()` function, use only MutationObserver |
| B3 | `Layout.astro` | 44-53 | JS MutationObserver for watermark visibility | Move to CSS with `[data-theme]` selectors |
| B4 | `Layout.astro` | 55-56 | Two SVG images loaded (one hidden) | Keep both but use CSS `display` toggle driven by `[data-theme]` instead of JS |

### P2 - Code Quality

| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|
| C1 | `Header.astro` | 148-301 | 153-line inline script doing too much (scroll nav, dark mode, logos, mobile menu) | Extract to external script file or Astro island for cleaner separation |
| C2 | `Footer.astro` | 106-146 | 40-line inline script for footer nav handling | Extract to external script file |
| C3 | `utils.ts` | 9-29 | Inline type definitions instead of using Astro's collection types | Use proper types from `astro:content` |
| C4 | `rss.xml.ts` | 12, 17 | Duplicate `context.site` fallback logic | Extract to single `SITE` constant |

### P3 - Minor

| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|
| D1 | `index.astro` | 82-91 | Duplicate page card linking to `/posts/` (third card) | Change third card to link to `/posts/?tag=` for tags page |
| D2 | `about.astro` | 69 | "philosophy" tag links to "Active Directory" (mismatched label) | Fix label to "philosophy" |
| D3 | `global.css` | 1329 lines | Could be modularized | **User decision: leave as is** |

---

## Execution Strategy

Each group was handled by a separate agent/subagent. After each group:
1. Run `npm run build` to verify no build errors
2. Launch Playwright to test: page rendering, dark mode toggle, mobile menu, search/filter, footer nav, reading progress bar

## Agent Boundaries

- **Agent 1 (Group A)**: ✅ Fix bugs in Footer.astro and [slug].astro
- **Agent 2 (Group B)**: ✅ Performance — CSS-driven theme toggles, consolidated observers, removed watermark JS
- **Agent 3 (Group C)**: ✅ Code quality — extract scripts, fix types, deduplicate
- **Agent 4 (Group D)**: ✅ Minor fixes — duplicate card, mismatched label

---

## Code Review Summary

### Architecture Notes
- Astro 6.4.7 with sitemap + MDX integrations
- Base path: `/NaeesWrites/` (GitHub Pages deployment)
- Content: 14 posts in `src/content/posts/`
- 18 pages total in build output
- Build time: ~500ms

### Key Findings
- **No critical build errors** — site builds cleanly
- **Footer nav script has a bug** that would cause JS error on click
- **Redundant getCollection calls** in post page (wastes build time)
- **Header has excessive inline JS** (153 lines) — hard to maintain
- **Search/filter works** with debounce (150ms)
- **Dark mode toggle** works with localStorage persistence
- **Mobile menu** has redundant event listeners (click + touchstart for outside click)
- **Giscus integration** reloads iframe on every theme change (could be optimized with Giscus API)
