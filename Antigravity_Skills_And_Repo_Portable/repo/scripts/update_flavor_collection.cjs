const fs = require('fs');

const flavorCollectionJsx = `import React, { useState } from 'react';
import { flavorList } from '../data/iceCreamData';
import { Sparkles, Plus, Check } from 'lucide-react';

export default function FlavorCollection({ onAddToFlight, selectedFlavors }) {
  const [filter, setFilter] = useState('all');

  const filteredFlavors =
    filter === 'all'
      ? flavorList
      : flavorList.filter((f) => f.tone === filter);

  return (
    <section id="flavors" className="py-28 bg-gradient-to-b from-peach-200 via-peach to-peach-400 text-terracotta relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tangerine/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-peach-light/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-tangerine-600 font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-tangerine-600" />
              <span>Grand Cru Glacerie 2026</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl text-terracotta tracking-tight">
              The Dual <span className="italic text-tangerine-600">Harvest Flight</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-peach-light/90 border border-tangerine/30 shadow-luxury self-start md:self-auto">
            {[
              { id: 'all', label: 'All Creations' },
              { id: 'peach', label: 'White Peach' },
              { id: 'tangerine', label: 'Valencian Citrus' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-5 py-2 rounded-full text-xs font-sans uppercase tracking-wider transition-all duration-200 ${
                  filter === tab.id
                    ? 'bg-tangerine text-white shadow-glow-tangerine font-bold'
                    : 'text-terracotta/80 hover:text-terracotta font-medium'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Flavors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredFlavors.map((flavor) => {
            const isAdded = selectedFlavors.some((f) => f.id === flavor.id);

            return (
              <div
                key={flavor.id}
                className="group relative bg-peach-light/95 rounded-3xl p-6 border border-tangerine/25 shadow-luxury hover:shadow-2xl hover:border-tangerine/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badge */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-peach-200 mb-6 border border-tangerine/20">
                    <img
                      src={flavor.image}
                      alt={flavor.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-terracotta/85 backdrop-blur-md text-[10px] uppercase tracking-wider text-peach border border-peach/30 font-semibold">
                      {flavor.badge}
                    </div>
                  </div>

                  {/* Flavor Info */}
                  <div className="flex flex-col gap-1.5 mb-4">
                    <span className="text-[11px] uppercase tracking-widest text-tangerine-600 font-bold">
                      {flavor.category}
                    </span>
                    <h3 className="font-serif text-2xl text-terracotta group-hover:text-tangerine-600 transition-colors">
                      {flavor.name}
                    </h3>
                    <p className="text-xs text-terracotta/75 line-clamp-2 mt-1 font-sans leading-relaxed">
                      {flavor.description}
                    </p>
                  </div>

                  {/* Sensory Notes Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {flavor.notes.slice(0, 3).map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-sans uppercase tracking-wider bg-peach/50 text-terracotta font-semibold border border-tangerine/20"
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Flavor Meters */}
                  <div className="space-y-2 mb-6 p-3.5 rounded-xl bg-peach-50/90 border border-tangerine/20">
                    <div className="flex items-center justify-between text-[11px] text-terracotta font-medium">
                      <span>Sweetness</span>
                      <span className="font-mono text-tangerine font-bold">{flavor.sweetness}</span>
                    </div>
                    <div className="w-full h-1.5 bg-peach-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tangerine-400 rounded-full"
                        style={{ width: flavor.sweetness }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-terracotta font-medium pt-1">
                      <span>Citrus Tartness</span>
                      <span className="font-mono text-tangerine-600 font-bold">{flavor.tartness}</span>
                    </div>
                    <div className="w-full h-1.5 bg-peach-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tangerine-600 rounded-full"
                        style={{ width: flavor.tartness }}
                      />
                    </div>
                  </div>
                </div>

                {/* Price & Action Button */}
                <div className="flex items-center justify-between pt-4 border-t border-tangerine/20">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-terracotta/70 block font-semibold">
                      Single Pint
                    </span>
                    <span className="font-serif text-xl font-bold text-terracotta">
                      {flavor.price}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddToFlight(flavor)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-sans uppercase tracking-wider font-bold transition-all duration-200 ${
                      isAdded
                        ? 'bg-tangerine-700 text-white'
                        : 'bg-gradient-to-r from-tangerine to-tangerine-deep text-white shadow-glow-tangerine hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Flight</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Flight</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync('src/components/FlavorCollection.jsx', flavorCollectionJsx, 'utf8');
console.log('FlavorCollection.jsx updated with authentic Peach & Tangerine palette');
