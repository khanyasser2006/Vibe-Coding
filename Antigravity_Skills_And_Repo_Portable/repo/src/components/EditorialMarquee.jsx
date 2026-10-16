import React from 'react';

export default function EditorialMarquee({ variant = 'terracotta' }) {
  const items = [
    'Hand-Picked Provence White Peaches',
    'Sun-Ripened Valencian Citrus',
    'Artisanal Slow-Churned Glacerie',
    'Organic French Farm Cream',
    'Zero Artificial Dyes & Syrups',
    'Pure Mediterranean Harvest',
    'Summer Edition 2026',
  ];

  const isTerracotta = variant === 'terracotta';

  return (
    <div
      className={`relative w-full overflow-hidden py-4 border-y select-none transition-colors duration-200 ${
        isTerracotta
          ? 'bg-terracotta border-peach/20 text-peach'
          : 'bg-peach-100/90 border-tangerine/30 text-terracotta'
      }`}
    >
      {/* Edge gradient masks for seamless fade out */}
      <div
        className={`pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 ${
          isTerracotta
            ? 'bg-gradient-to-r from-terracotta to-transparent'
            : 'bg-gradient-to-r from-peach-100 to-transparent'
        }`}
      />
      <div
        className={`pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 ${
          isTerracotta
            ? 'bg-gradient-to-l from-terracotta to-transparent'
            : 'bg-gradient-to-l from-peach-100 to-transparent'
        }`}
      />

      {/* Marquee Track */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-6 px-4">
            <span className="font-serif text-sm md:text-base tracking-[0.25em] uppercase font-medium">
              {text}
            </span>
            <span className="text-tangerine text-xs opacity-75">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
