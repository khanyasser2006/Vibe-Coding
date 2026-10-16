---
name: huashu-design
description: HTML-native design skill for creating high-fidelity prototypes, slides, animations, and visual designs directly in HTML/CSS/JS. Apply 20 design philosophies and 5-dimension review. Use when creating prototypes, presentations, landing pages, or any high-fidelity visual design output.
---

# Huashu Design — High-Fidelity HTML Native Design

**Purpose:** Create stunning, production-quality visual designs as pure HTML/CSS/JS — no design tools needed. Everything renders in the browser.

---

## 20 Design Philosophies

### Foundation Principles
1. **Authentic Aesthetics** — Every element should feel intentional, not generated
2. **Emotional Design** — UI should evoke the intended feeling of the product
3. **System Thinking** — Design with reusable components, not one-offs
4. **Context Awareness** — Design for the user's environment (mobile, desktop, ambient)
5. **Progressive Beauty** — Simple first, then layer complexity

### Visual Principles
6. **Visual Breathing** — Generous whitespace signals confidence and quality
7. **Contrast as Hierarchy** — Use contrast (color, size, weight) to guide attention
8. **Alignment Creates Trust** — Misaligned elements erode credibility subconsciously
9. **Color Tells Stories** — Every color choice communicates brand personality
10. **Typography is Voice** — Font choices literally give the design a voice

### Interaction Principles
11. **Invisible Interactions** — The best UI interactions aren't noticed, they're felt
12. **Delight Through Surprise** — Unexpected micro-moments create emotional connection
13. **Feedback is Respect** — Always acknowledge user actions immediately
14. **Motion Has Meaning** — Animation should inform, not decorate
15. **Reduction is Power** — Remove until it breaks, then add one thing back

### Experience Principles
16. **First 3 Seconds** — Users decide in 3 seconds; design for that moment
17. **Scannable Structure** — Users scan before they read; design for scanners
18. **Error as Opportunity** — Error states are a chance to show personality
19. **Accessibility is Design** — Inclusive design is better design for everyone
20. **Performance is UX** — A slow design is a bad design

---

## 5-Dimension Design Review

Before finalizing any design, score it 1–5 on each dimension:

### Dimension 1: Visual Clarity (1–5)
- Can the user immediately understand what this page/component does?
- Is the hierarchy obvious without reading?
- Are the most important elements the most visually prominent?

### Dimension 2: Aesthetic Quality (1–5)
- Would a designer be proud to put this in their portfolio?
- Is the color palette cohesive and intentional?
- Is typography well-considered (pairing, scale, weight)?

### Dimension 3: Interaction Intelligence (1–5)
- Do all interactive elements have appropriate hover/focus states?
- Are loading and empty states designed?
- Is feedback immediate and meaningful?

### Dimension 4: Emotional Resonance (1–5)
- Does the design feel appropriate for the brand/audience?
- Does it evoke the intended emotion?
- Would a user describe this as "premium", "friendly", or whatever the target is?

### Dimension 5: Technical Excellence (1–5)
- Is the HTML semantic and accessible?
- Does it work across different screen sizes?
- Is it performant (no unnecessary complexity)?

**Target: 4+ on all dimensions before shipping**

---

## HTML-Native Design Techniques

### Glassmorphism Card
```html
<div style="
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
">
```

### Gradient Mesh Background
```css
.mesh-bg {
  background: 
    radial-gradient(ellipse at 20% 50%, hsla(210,100%,56%,0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, hsla(280,80%,60%,0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, hsla(162,100%,42%,0.3) 0%, transparent 50%),
    hsl(222, 47%, 6%);
}
```

### Premium Button
```css
.btn-premium {
  background: linear-gradient(135deg, hsl(162,100%,42%), hsl(162,100%,32%));
  color: hsl(222, 47%, 6%);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 0 0 rgba(0,212,170,0.4);
}

.btn-premium:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,212,170,0.3);
}
```

### Animated Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, #00d4aa, #7c3aed, #f59e0b);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 4s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% center; }
  50% { background-position: 100% center; }
  100% { background-position: 0% center; }
}
```

### Floating Card Animation
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.floating {
  animation: float 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
```

---

## Design Output Formats

### Prototype (Interactive)
- Full HTML page with JavaScript interactions
- All states: default, hover, active, loading, empty, error
- Responsive breakpoints: 375px, 768px, 1280px

### Slide/Presentation
- Each slide as a section with 16:9 aspect ratio container
- Navigation arrows and keyboard support
- Consistent slide template system

### Animation
- CSS keyframe animations only (no JS animation libraries needed)
- Export-ready (can be screenshot or recorded as MP4)

---

## Application

When asked to create a design:
1. Apply all **20 philosophies** as a mental filter
2. Choose the right output format (prototype / slide / animation)
3. Use HTML-native techniques for all visual effects
4. Score with the **5-dimension review** before finalizing
5. Ensure the design passes **Impeccable** and **Taste** checks

**Source:** Based on [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design)
