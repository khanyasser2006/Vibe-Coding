const fs = require('fs');

const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-peach: #FEC5A8;
  --color-tangerine: #F4784E;
  --color-peach-light: #FFF2EB;
  --color-tangerine-deep: #DE5F32;
  --color-terracotta: #38140B;
  --color-terracotta-muted: #7D4132;
}

/* Custom Lenis Smooth Scroll */
html.lenis, html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-scrolling iframe {
  pointer-events: none;
}

/* Subtle Film Grain */
.film-grain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* Dual Palette Glassmorphism */
.glass-panel-peach {
  background: rgba(254, 197, 168, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(244, 120, 78, 0.35);
}

.glass-panel-tangerine {
  background: rgba(244, 120, 78, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(254, 197, 168, 0.45);
}

.glass-panel-dark {
  background: rgba(56, 20, 11, 0.82);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(254, 197, 168, 0.28);
}

/* Dual Gradient Backdrops */
.bg-dual-peach-tangerine {
  background: linear-gradient(135deg, #FEC5A8 0%, #F4784E 100%);
}

.bg-dual-tangerine-terracotta {
  background: linear-gradient(145deg, #F4784E 0%, #DE5F32 40%, #38140B 100%);
}

.bg-dual-peach-light {
  background: linear-gradient(180deg, #FEC5A8 0%, #FFF2EB 40%, #FEC5A8 100%);
}

/* Typography styles */
.font-display-hero {
  font-family: 'Italiana', 'Playfair Display', serif;
  letter-spacing: -0.04em;
  line-height: 0.95;
}

.font-editorial {
  font-family: 'Playfair Display', Georgia, serif;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 7px;
}

::-webkit-scrollbar-track {
  background: #38140B;
}

::-webkit-scrollbar-thumb {
  background: #F4784E;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #FEC5A8;
}
`;

fs.writeFileSync('src/index.css', indexCss, 'utf8');
console.log('src/index.css updated');
