---
name: smooth-video-scroll
description: >-
  Automates transforming any uploaded MP4/WEBM video into an ultra-smooth,
  600-frame optical-flow motion interpolated canvas scroll sequence. Drives the
  frames using a decoupled GPU VRAM pre-decoded engine with GSAP ScrollTrigger.
---

# Smooth Video Scroll

## Overview
This skill converts video files into 600 AI optical-flow motion-interpolated image frames (`minterpolate`) and wires them up to a zero-jitter, GPU-accelerated canvas scroll animation system.

## Quick Start
Whenever a user uploads a new `.mp4` or `.webm` video file to a project:

1. **Extract 600 Motion-Interpolated Frames & Generate Manifest:**
   Run the CLI helper script:
   ```bash
   node "C:\Users\123\.gemini\config\skills\smooth-video-scroll\scripts\process_video.cjs" [path_to_video.mp4] [600]
   ```
   *(If no path is provided, it automatically finds the `.mp4` in the project root).*

2. **React Canvas Engine Requirements (`HeroSequence.jsx`):**
   - **GPU Off-Thread Decode:** Use `createImageBitmap(blob)` inside a batch worker array to force GPU VRAM decoding *before* scroll starts.
   - **Decoupled rAF Render Loop:** An independent `requestAnimationFrame` loop paints to canvas at monitor vsync (60hz/120hz), decoupled from GSAP's `onUpdate`.
   - **Integer Pixel Coordinates:** Use bitwise OR `| 0` for all canvas draw coordinates (`(cw - sw) / 2 | 0`) to prevent anti-aliasing shimmer.
   - **GSAP Configuration:** Set `scrub: 1` on ScrollTrigger. **NEVER** use `snap: 'current'` inside GSAP scroll tweens as it causes vibration fighting with scrub interpolation.
   - **Opaque Context:** Initialize 2D context with `{ alpha: false }` for GPU compositing performance.

## Utility Scripts
- `node "C:\Users\123\.gemini\config\skills\smooth-video-scroll\scripts\process_video.cjs" [video_path] [frame_count]`

## Common Mistakes
- **Using simple `-vf fps=60`:** Standard framerate conversion duplicates frames if the source video is 24fps. Always use `minterpolate=fps=60:mi_mode=mci` so every frame is a synthesized, unique intermediate position.
- **Painting inside GSAP `onUpdate`:** GSAP ticks desync from monitor refresh rates. Always use an independent `requestAnimationFrame` tick loop that reads `frameIndexRef.current`.
- **Sub-pixel coordinates:** Drawing at floating point pixels causes sub-pixel anti-aliasing jitter. Always floor coordinates to integers.
