# Ciné Design System Specification

## Brand Identity
**Ciné** is a luxury artisanal French-Mediterranean ice creamery celebrating the golden sun of Provence, hand-picked white peaches, and sun-ripened Valencian tangerines.

## Color Tokens

### Authentic Dual Palette (Strict Primary Palette)
- `--color-peach`: `#FEC5A8` (RGB: 255, 197, 169) - Main warm peach canvas, card surfaces, ambient peach glow
- `--color-tangerine`: `#F4784E` (RGB: 244, 120, 78) - Main tangerine canvas, vibrant buttons, gradient pairing, active states

### Complementary Warm Tone Spectrum
- `--color-peach-light`: `#FFF0E8` - Soft peach highlight
- `--color-peach-deep`: `#FDB08B` - Saturated peach tone
- `--color-tangerine-deep`: `#DE5F32` - Deep roasted citrus accent
- `--color-terracotta-dark`: `#38140B` - Deep roasted cocoa/terracotta for luxury typography & high contrast
- `--color-terracotta-muted`: `#7D4132` - Muted editorial copy on peach backgrounds
- `--color-border-peach`: `rgba(244, 120, 78, 0.25)`
- `--color-border-tangerine`: `rgba(254, 197, 168, 0.45)`

## Typography System
- **Display Serif:** `'Playfair Display', 'Italiana', Georgia, serif`
  - Used for brand hero titles, section headlines, editorial pull-quotes.
- **Body & Sans:** `'Plus Jakarta Sans', 'Inter', system-ui, sans-serif`
  - Used for interface labels, captions, tasting notes, buttons, body copy.

### Type Scale
- `text-xs`: 12px / 1.4 / letter-spacing: 0.05em (caps)
- `text-sm`: 14px / 1.5 / letter-spacing: 0.02em
- `text-base`: 16px / 1.6 / letter-spacing: 0
- `text-lg`: 18px / 1.5 / letter-spacing: -0.01em
- `text-xl`: 24px / 1.3 / letter-spacing: -0.02em
- `text-2xl`: 32px / 1.2 / letter-spacing: -0.02em
- `text-3xl`: 48px / 1.1 / letter-spacing: -0.03em
- `text-4xl`: 64px / 1.0 / letter-spacing: -0.04em
- `text-5xl`: 84px / 0.95 / letter-spacing: -0.05em
- `text-hero`: 110px / 0.9 / letter-spacing: -0.05em

## Spacing & Grid (Strict 4pt Grid)
- Multiples of 4: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px
- Layout Max Width: `1440px`
- Section Padding: `py-20 md:py-32`
- Card Padding: `p-6 md:p-8`

## Border Radius
- `rounded-sm`: 4px
- `rounded-md`: 8px
- `rounded-lg`: 12px
- `rounded-xl`: 16px
- `rounded-2xl`: 24px
- `rounded-full`: 9999px

## Motion & Transitions
- Canvas Frame Loop: Decoupled 60fps / 120fps `requestAnimationFrame` with GPU `createImageBitmap` offloading.
- GSAP ScrollTrigger Scrub: `scrub: 1`
- Standard Transition Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Micro Interaction Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Durations: `150ms` (micro), `250ms` (standard), `400ms` (expanded)
