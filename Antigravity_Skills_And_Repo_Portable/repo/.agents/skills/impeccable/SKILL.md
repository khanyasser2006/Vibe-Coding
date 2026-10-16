---
name: impeccable
description: A design language system that kills AI slop in UI. Detects bad design decisions (inconsistent gradients, non-standard easing, cramped padding, low contrast, inconsistent border radius) before they ship. Apply when generating or reviewing any UI component, page, or design system.
---

# Impeccable — Design Language for AI

**Purpose:** Make AI-generated UIs indistinguishable from expert human design by enforcing a strict design language.

## Core Principles

### 1. Typography — Hierarchy First
- Use **maximum 3 type sizes** per screen
- Body text: **15–16px**, line-height **1.5–1.6**
- Headings: use **weight contrast** (700–800) not just size
- Never use system fonts for product UI — always specify: `Inter`, `Geist`, `Plus Jakarta Sans`, or `DM Sans`
- Letter-spacing: `-0.02em` for headings, `0` for body

### 2. Color — Intentional Palette Only
- **No raw hex codes** — use semantic tokens or HSL variables
- Dark mode backgrounds: `hsl(222, 47%, 6%)` to `hsl(222, 47%, 10%)`  
- Primary accent: one color only, with **10 defined shades** (50–900)
- Text contrast: minimum **4.5:1** for body, **3:1** for large text (WCAG AA)
- Never mix warm and cool greys in the same UI

### 3. Spacing — 4pt Grid System
- All spacing must be **multiples of 4px**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
- Card padding: `24px` minimum, `32px` comfortable
- Never use arbitrary values like `13px`, `17px`, `23px`
- Section gaps: `64px` minimum on desktop

### 4. Motion — Purposeful Easing
- **No linear easing** for UI transitions
- Use: `cubic-bezier(0.16, 1, 0.3, 1)` (expo out) for entrances
- Use: `cubic-bezier(0.4, 0, 0.2, 1)` (material standard) for state changes
- Duration: `150ms` micro, `250ms` standard, `400ms` complex
- Never animate `width/height` — use `transform: scale()` or `max-height`

### 5. Border Radius — Consistent System
- Define ONE radius scale per project: `4px / 8px / 12px / 16px / 24px / full`
- Buttons: `8px` or `12px` — pick one and never mix
- Cards: `12px` or `16px`
- Never use `3px`, `5px`, `7px`, `9px` — always even numbers from the scale

### 6. Shadows — Depth System
- Use layered shadows, not single hard shadows
- Light: `0 1px 2px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.08)`
- Medium: `0 4px 6px rgba(0,0,0,0.07), 0 12px 24px rgba(0,0,0,0.12)`
- Dark mode: replace opacity-based shadows with subtle border glow

## Anti-Patterns to REJECT

❌ Purple gradients on non-purple branded products  
❌ `bounce` or `elastic` easing on functional UI  
❌ Padding values that aren't multiples of 4  
❌ Mixed font families without purpose  
❌ `border-radius: 50%` on non-circular elements  
❌ Low contrast placeholder text (< 3:1)  
❌ Inconsistent icon sizes on the same screen  
❌ `box-shadow` with 4+ values without a system  

## Audit Checklist

Before shipping any UI, verify:
- [ ] All spacing values are multiples of 4
- [ ] Font family specified (not system default)
- [ ] Color contrast meets WCAG AA
- [ ] All animations use purposeful easing
- [ ] Border radius is consistent from the defined scale
- [ ] No arbitrary magic numbers in CSS
- [ ] Dark mode tested (if applicable)
- [ ] Icon sizes consistent (16/20/24px only)

## Usage

When asked to create or review UI:
1. Apply all principles above automatically
2. Flag any violations with the specific rule broken
3. Suggest the corrected value from the design system
4. Never output arbitrary CSS values — always use the system

**Source:** Based on [pbakaus/impeccable](https://github.com/pbakaus/impeccable)
