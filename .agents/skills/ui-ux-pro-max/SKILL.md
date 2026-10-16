---
name: ui-ux-pro-max
description: A complete design intelligence system with 57 UI styles, 161 color palettes, 99 UX rules, 8 tech stacks, 24 chart types, and 29 landing page patterns. Use when building any frontend interface to select the optimal design style, palette, and UX pattern for the context.
---

# UI/UX Pro Max — Design Intelligence System

**Purpose:** Provide AI with the full vocabulary of professional UI/UX design so it can make informed, contextual design decisions rather than defaulting to generic patterns.

---

## UI Style Selection Guide

Choose the right style for the project context:

### Glassmorphism (Modern SaaS / Dark Apps)
- Frosted glass surfaces: `backdrop-filter: blur(20px)`
- Background: `rgba(255,255,255,0.05)` on dark
- Border: `1px solid rgba(255,255,255,0.12)`
- Best for: dashboards, fintech, AI tools
- Avoid: e-commerce, children's apps, government

### Neumorphism (Minimal / Premium)
- Same-color shadows: light + dark on same hue
- `box-shadow: 6px 6px 12px #b8b8b8, -6px -6px 12px #ffffff`
- Best for: smart home, health apps, calculators
- Avoid: data-heavy UIs, small components

### Flat Design 2.0 (Productivity / Clean)
- Subtle shadows only for depth cues
- Bold, saturated accent color on white/light grey
- Best for: productivity tools, B2B SaaS, documentation
- The safest default for most products

### Brutalism (Bold / Editorial)
- Raw, intentional "undesigned" aesthetic
- High contrast, visible borders, no shadows
- Unconventional font choices
- Best for: creative agencies, portfolios, music apps

### Aurora / Gradient (Trendy / Consumer)
- Flowing background gradients: mesh or radial
- Best for: consumer apps, AI products, gaming
- Must use smooth, multi-stop gradients (3+ colors)

### Material Design 3 (Android / Google Ecosystem)
- Dynamic color from content
- Motion emphasis with spring animations
- Best for: mobile-first apps, Google integrations

---

## Color Palette System (Top 20 by Context)

### Dark SaaS / Developer Tools
```css
--bg: hsl(222, 47%, 6%);
--surface: hsl(222, 47%, 10%);
--border: rgba(255,255,255,0.08);
--accent: hsl(162, 100%, 42%);    /* Teal */
--text: hsl(210, 40%, 96%);
--muted: hsl(215, 20%, 55%);
```

### Light Professional / B2B
```css
--bg: hsl(0, 0%, 98%);
--surface: hsl(0, 0%, 100%);
--border: hsl(220, 13%, 91%);
--accent: hsl(221, 83%, 53%);     /* Blue */
--text: hsl(222, 47%, 11%);
--muted: hsl(215, 16%, 47%);
```

### Premium / Luxury
```css
--bg: hsl(30, 15%, 8%);
--surface: hsl(30, 15%, 12%);
--border: rgba(212,175,55,0.2);
--accent: hsl(45, 80%, 60%);      /* Gold */
--text: hsl(40, 30%, 96%);
--muted: hsl(30, 10%, 55%);
```

### Health / Wellness
```css
--bg: hsl(150, 20%, 97%);
--surface: hsl(0, 0%, 100%);
--border: hsl(150, 20%, 88%);
--accent: hsl(150, 60%, 40%);     /* Green */
--text: hsl(150, 15%, 15%);
--muted: hsl(150, 10%, 50%);
```

### Creative / Agency
```css
--bg: hsl(0, 0%, 100%);
--surface: hsl(240, 10%, 97%);
--border: hsl(240, 10%, 90%);
--accent: hsl(280, 70%, 55%);     /* Purple */
--text: hsl(240, 15%, 10%);
--muted: hsl(240, 8%, 50%);
```

---

## 99 UX Rules (Core 20)

1. **Fitts's Law** — Make clickable targets at least 44×44px
2. **Hick's Law** — Reduce choices; 5–7 options max per decision point
3. **Miller's Law** — Chunk info into groups of 7±2
4. **Jakob's Law** — Users expect your UI to work like other UIs they know
5. **Progressive Disclosure** — Show only what's needed; hide advanced options
6. **Error Prevention > Error Recovery** — Design to prevent mistakes
7. **Recognition > Recall** — Show options, don't make users memorize
8. **Feedback for Every Action** — Every click/tap must have visual feedback within 100ms
9. **Empty States** — Always design for zero-data states (first use)
10. **Loading States** — Skeleton screens > spinners for content-heavy UI
11. **Mobile First** — Design for 375px width, expand up
12. **Touch Targets** — Minimum 48px on mobile, 32px on desktop
13. **Contrast for Readability** — 4.5:1 minimum for body text
14. **Scroll Cues** — Indicate scrollable content with partial reveal
15. **Sticky Navigation** — Keep primary nav in view on scroll
16. **Form Labels Always Visible** — Float labels, never placeholder-only
17. **One Primary Action Per Screen** — One CTA to rule them all
18. **Destructive Actions Need Confirmation** — Delete = confirm dialog
19. **Search is a Crutch** — Fix navigation before adding search
20. **Don't Make Users Think** — If you need to explain it, redesign it

---

## Tech Stack Design Patterns

### React / Next.js
- Component library: **shadcn/ui** (customizable) or **Radix UI** (headless)
- Styling: CSS Modules or `tailwind` with design tokens
- Animation: `framer-motion` for complex, CSS transitions for simple
- Icons: `lucide-react` (consistent, minimal)

### Vue / Nuxt
- Component: **Vuetify 3** or **Naive UI**
- Animation: `@vueuse/motion`
- Icons: `unplugin-icons`

### Vanilla HTML/CSS/JS
- Reset: `modern-normalize.css`
- Icons: Heroicons SVG inline or font icons
- No build step: CSS custom properties for theming

---

## Landing Page Patterns (Top 5)

### Hero + Social Proof
1. Nav (logo + links + CTA)
2. Hero (headline + subhead + dual CTA + screenshot/mockup)
3. Logo bar (trusted by...)
4. Feature grid (3 or 6 cards)
5. Testimonials carousel
6. Pricing table
7. FAQ accordion
8. Final CTA section
9. Footer

### SaaS Problem-Solution
1. Nav
2. Problem statement (pain point headline)
3. Solution reveal (animated or before/after)
4. How it works (3 steps)
5. Features deep dive
6. Testimonials
7. Pricing
8. CTA

---

## Application

When building any interface:
1. **Identify context** → choose UI style
2. **Select palette** → match to audience and emotion
3. **Apply UX rules** → especially #1, #7, #17
4. **Choose tech patterns** → framework-appropriate components
5. **Test against** → all 99 UX rules mentally

**Source:** Based on [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
