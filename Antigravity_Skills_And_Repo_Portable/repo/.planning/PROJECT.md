# Project: Ciné Haute Glacerie

## Overview
**Ciné** is a luxury artisanal French-Mediterranean ice creamery celebrating the golden sun of Provence, hand-picked white peaches, and sun-ripened Valencian tangerines. The web application features an ultra-premium, cinematic digital experience driven by 60fps GPU-accelerated video canvas scroll sequences, smooth parallax, interactive tasting flight drawers, and boutique management.

## Tech Stack
- **Framework:** React 18 + Vite 6 (ESM)
- **Styling:** Tailwind CSS + PostCSS + Strict Design Token adherence (`DESIGN.md`)
- **Animation & Scroll:** GSAP 3 (ScrollTrigger) + Lenis Smooth Scroll
- **Canvas Rendering:** Decoupled 60fps/120fps requestAnimationFrame with `createImageBitmap` GPU offloading
- **Icons & UI:** Lucide React, Canvas Confetti, clsx, tailwind-merge
- **Testing & Quality:** Playwright E2E suite, CodeRabbit AI review guidelines

## Active Skills & Frameworks
1. **Taste & Design Intelligence (`taste`, `impeccable`, `ui-ux-pro-max`)**:
   - Color Restraint: Strict Peach (`#FEC5A8`), Tangerine (`#F4784E`), Terracotta Dark (`#38140B`).
   - Typography: Editorial Playfair Display serif paired with modern Plus Jakarta Sans.
   - Layout: 4pt grid discipline, optical alignment, single focal point per view.
2. **Smooth Video Scroll Engine (`smooth-video-scroll`)**:
   - 600-frame optical-flow interpolation (`minterpolate`).
   - GPU VRAM pre-decoded engine (`createImageBitmap`), integer pixel coordinates (`| 0`), `{ alpha: false }` canvas context.
3. **GSD Framework (`gsd-*`)**:
   - Five-step development loop: Discuss → Plan → Execute → Verify → Ship.
   - Durable planning state in `.planning/`.
4. **Ralph Loop (`ralph-loop`)**:
   - Externalized disk memory (`PRD.md`, `progress.txt`) for autonomous iterations.
