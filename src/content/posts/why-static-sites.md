---
title: "Why I'm Using Static Sites"
description: "Exploring the benefits of static site generation for personal blogs."
date: 2025-02-20
tags: ["technology", "webdev"]
---

Static sites have become my go-to choice for personal websites and blogs. Here's why.

## The Simplicity

Static sites are just files. HTML, CSS, JavaScript — served directly from a server. No database to manage, no server to maintain, no runtime to worry about.

When something breaks, it's usually just a code issue. There's no infrastructure to debug.

## Performance

With no server-side rendering needed, static sites are incredibly fast. The content is pre-built at deploy time, so every page load is just fetching a file.

## Security

Fewer moving parts means fewer attack vectors. No database to compromise, no server to exploit. The attack surface is essentially just the static files themselves.

## Cost

GitHub Pages is free. Really. For personal use, you get unlimited pages with no cost at all.

## The Trade-offs

Of course, static sites aren't perfect:

- No server-side functionality (but giscus solves comments)
- No real-time features (but that's rarely needed for a blog)
- Every change requires a rebuild (but that's fast)

For a personal blog, the trade-offs are absolutely worth it.

## What I'm Using

- **Astro** — The framework
- **GitHub Pages** — Hosting
- **giscus** — Comments
- **Markdown** — Content

That's it. Simple, reliable, and free.
