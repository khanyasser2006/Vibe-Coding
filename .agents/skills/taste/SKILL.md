---
name: taste
description: Gives Antigravity actual design taste — separates good from generic through layout intelligence, typography choices, color restraint, and purposeful motion. Use when building any frontend UI to ensure the output feels premium and intentional, not AI-generated slop.
---

# Taste — Design Intelligence for Frontend

**Purpose:** Eliminate generic AI-generated UI by applying the design instincts of an experienced product designer.

## What "Taste" Means in Practice

Good taste = knowing what NOT to do.  
Generic AI UI = everything enabled at once.  
Tasteful UI = restraint + intentionality.

---

## Layout Intelligence

### Visual Weight & Balance
- Every page needs a **single focal point** — one thing the eye goes to first
- Use **asymmetry intentionally** — centered layouts for landing pages, left-aligned for apps
- Whitespace is not empty — it's breathing room that signals confidence
- **F-pattern and Z-pattern** reading flows — place CTAs accordingly

### Grid Discipline
- 12-column grid for complex layouts, 4-column for mobile
- Never break the grid without a strong reason
- Align elements to **optical center**, not mathematical center, for visual harmony
- Content width: `680px` for reading (editorial), `1200px` max for UI layouts

### Component Hierarchy
- Primary action: ONE per screen — high contrast, prominent size
- Secondary actions: subdued — outline or ghost style
- Tertiary: text-only links or icon buttons
- Never put 3 primary buttons on the same screen

---

## Typography with Taste

### Font Pairing Rules
- Display + Body: pair **geometric sans** (Outfit, DM Sans) with **humanist sans** (Inter, Plus Jakarta)
- Maximum **2 font families** per product
- Monospace only for code, data, or intentional effect
- Recommended pairings:
  - `Outfit` (display) + `Inter` (body) — Modern SaaS
  - `Playfair Display` (heading) + `DM Sans` (body) — Editorial/Luxury  
  - `Space Grotesk` (heading) + `Inter` (body) — Tech/Developer

### Type Scale (Tasteful)
```
xs:   12px / 1.4 / normal
sm:   14px / 1.5 / normal  
base: 16px / 1.6 / normal
lg:   18px / 1.5 / normal
xl:   24px / 1.3 / -0.01em
2xl:  32px / 1.2 / -0.02em
3xl:  48px / 1.1 / -0.03em
4xl:  64px / 1.0 / -0.04em
```

### Text Hierarchy
- Use **weight** for hierarchy: 400 body, 500 labels, 600 subheads, 700 headings
- **Never use bold for body text** — it destroys rhythm
- Limit headings to 2 sizes visible at once

---

## Color with Taste

### The Rule of Three
- **Background**: 1–2 tones (base + subtle)
- **Content**: foreground text in 2 weights (primary + muted)
- **Accent**: ONE brand color with purpose

### Color Restraint
- Maximum **5 colors** in any UI (excluding shades)
- `success`, `warning`, `error`, `info` — use sparingly, only for semantic meaning
- Never use color as the ONLY indicator (accessibility)
- Dark backgrounds: desaturate slightly (`hsl(220, 20%, 8%)` not `hsl(220, 50%, 8%)`)

### Tasteful Dark Mode
- Background: `hsl(222, 20%, 8%)` — cool dark, not pure black
- Surface: `hsl(222, 20%, 12%)` — subtle elevation
- Border: `rgba(255,255,255,0.08)` — almost invisible
- Text primary: `hsl(210, 40%, 96%)` — not pure white
- Text muted: `hsl(215, 20%, 55%)` — enough contrast without harshness

---

## Motion with Taste

### When to Animate (and When NOT To)
✅ Page transitions  
✅ Menu open/close  
✅ Toast/notification entrance  
✅ Loading states  
❌ **Never animate** static decorative elements on loop  
❌ **Never** parallax scroll effects on content pages  
❌ **Never** fade-in text as you scroll (overused, now looks dated)

### Animation Values That Feel Premium
```css
/* Entrance — snappy deceleration */
transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);

/* Exit — gentle acceleration */  
transition: all 200ms cubic-bezier(0.4, 0, 1, 1);

/* Hover — instant but smooth */
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Complex/Spring feel */
transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## The "Good from Generic" Test

Ask yourself before shipping:

1. **Could this be any product?** → If yes, it needs more brand voice
2. **Does every element have a reason to exist?** → Remove anything decorative without purpose
3. **Would a designer be proud of this?** → If you'd hide it in a portfolio, fix it
4. **Is anything animated that shouldn't be?** → Remove animations that don't aid understanding
5. **Does the hierarchy communicate itself?** → User should know what to do without reading labels

---

## Application

When building UI with this skill active:
1. Always ask "what's the hierarchy?" before placing elements
2. Choose restraint over expression when unsure  
3. Apply type scale from the defined system
4. Limit colors to the rule of three
5. Only animate with purpose and tasteful easing

**Source:** Based on [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
