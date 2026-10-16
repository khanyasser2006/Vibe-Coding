import React, { useState } from 'react';
import { Sparkles, Plus, Check, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import EditorialMarquee from '../components/EditorialMarquee';

export default function FlavorsPage({ onSelectFlavor, onAddToFlight, selectedFlavors = [], onOpenFlight }) {
  const { flavors = [], pageContent } = useCms();
  const hero = pageContent?.flavors || {};
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Signature Flavors', 'Seasonal Specials'];

  const filteredFlavors = activeCategory === 'All'
    ? flavors
    : flavors.filter((f) => f.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-peach-50 text-terracotta pt-24 pb-20 sm:pt-32 sm:pb-24 md:pt-40 md:pb-32 overflow-hidden">
      {/* Floating Ambient Glows */}
      <div className="absolute top-24 right-10 w-96 h-96 bg-tangerine/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-peach-300/30 rounded-full blur-3xl pointer-events-none animate-float-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Page Hero Header - Copying Hero Spacing, Typography & Hierarchy */}
        <div className="flex flex-col gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 self-start px-3.5 sm:px-4 py-1.5 rounded-full bg-peach/40 border border-tangerine/30 text-terracotta text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-tangerine" />
            <span>{hero.badge || 'Summer Harvest 2026 Collection'}</span>
          </div>

          <h1 className="font-serif font-bold text-4xl sm:text-6xl md:text-8xl tracking-tight text-terracotta leading-[0.95]">
            {hero.title || 'Tree-Ripened •'} <br />
            <span className="italic font-light text-tangerine">{hero.titleAccent || 'Our Fresh Flavors.'}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-xl text-terracotta/80 font-sans leading-relaxed max-w-2xl">
            {hero.description || 'Every scoop begins in sunlit French peach orchards and Valencian citrus groves. We never use artificial syrups or dyes—only pure fruit, fresh farm cream, and slow, artisanal churning.'}
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 sm:pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-tangerine text-white shadow-glow-tangerine scale-105'
                    : 'bg-peach-200/60 text-terracotta/80 hover:bg-peach-200 hover:text-terracotta border border-tangerine/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Flavors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredFlavors.map((flavor) => {
            const isAdded = selectedFlavors.some((f) => f.id === flavor.id);

            return (
              <div
                key={flavor.id}
                className="group relative flex flex-col rounded-3xl bg-peach-100/70 border border-tangerine/20 overflow-hidden shadow-sm card-hover-luxury hover:border-tangerine/50"
              >
                {/* Visual Header with Real Image */}
                <div
                  onClick={() => onSelectFlavor(flavor)}
                  className="relative h-72 w-full bg-gradient-to-b from-peach-200/50 to-peach-100/30 overflow-hidden cursor-pointer flex items-center justify-center p-6"
                >
                  {/* Subtle Background Glow */}
                  <div
                    className={`absolute inset-0 opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-75 ${
                      flavor.tone === 'tangerine' ? 'bg-tangerine/30' : 'bg-peach-300/40'
                    }`}
                  />

                  {/* Flavor Scoop Image */}
                  <img
                    src={flavor.image}
                    alt={flavor.name}
                    className="relative z-10 max-h-56 object-contain transition-transform duration-500 ease-out group-hover:scale-110 drop-shadow-xl"
                  />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-terracotta/85 text-peach backdrop-blur-md shadow-sm">
                      {flavor.badge}
                    </span>
                  </div>

                  {/* Origin Tag */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/80 text-terracotta backdrop-blur-md border border-peach/50">
                      {flavor.origin}
                    </span>
                  </div>

                  {/* Hover Quick View Overlay */}
                  <div className="absolute inset-0 z-20 bg-terracotta/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-terracotta font-bold text-xs shadow-lg uppercase tracking-wider transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye className="w-3.5 h-3.5 text-tangerine" />
                      <span>View Full Profile</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3
                        onClick={() => onSelectFlavor(flavor)}
                        className="font-serif text-2xl font-bold text-terracotta hover:text-tangerine transition-colors cursor-pointer"
                      >
                        {flavor.name}
                      </h3>
                      <span className="font-serif text-xl font-bold text-tangerine shrink-0">
                        {flavor.price}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-tangerine-700 tracking-wide uppercase">
                      {flavor.subtitle}
                    </p>

                    <p className="text-sm text-terracotta/80 font-sans leading-relaxed">
                      {flavor.description}
                    </p>

                    {/* Tasting Notes Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {flavor.notes.map((note) => (
                        <span
                          key={note}
                          className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-peach-200/70 text-terracotta/90 border border-tangerine/15"
                        >
                          {note}
                        </span>
                      ))}
                    </div>

                    {/* Fruit Percentage & Texture Metric */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-tangerine/15 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-terracotta/60 block">Fruit Purity</span>
                        <span className="font-bold text-terracotta">{flavor.fruitPercentage}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-terracotta/60 block">Texture</span>
                        <span className="font-bold text-terracotta">{flavor.intensity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onAddToFlight(flavor)}
                      className={`flex-1 py-3 px-4 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
                        isAdded
                          ? 'bg-peach-300 text-terracotta border border-tangerine'
                          : 'bg-tangerine text-white shadow-glow-tangerine hover:bg-tangerine-deep hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-tangerine-800" />
                          <span>In Your Box</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Tasting Box</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onSelectFlavor(flavor)}
                      className="p-3 rounded-full bg-peach-200/80 hover:bg-peach-300 text-terracotta transition-colors"
                      title="Inspect Tasting Notes"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tasting Box Callout Banner */}
        <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-tangerine to-tangerine-deep text-white shadow-dual flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-3 max-w-xl">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-peach">
              Curate Your Custom Flight
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
              Pick Any 4 Flavors for a Chilled Insulated Box
            </h2>
            <p className="text-sm text-peach-light/90 font-sans leading-relaxed">
              We ship our tasting flights overnight in biodegradable chilled containers so every pint arrives cellar-cold at -11°C, ready for immediate tasting.
            </p>
          </div>

          <button
            onClick={onOpenFlight}
            className="px-8 py-4 rounded-full bg-white text-terracotta font-bold text-xs uppercase tracking-widest hover:bg-peach-light hover:scale-105 active:scale-95 transition-all shadow-lg shrink-0 flex items-center gap-3"
          >
            <span>Open Tasting Box ({selectedFlavors.length}/4)</span>
            <ArrowRight className="w-4 h-4 text-tangerine" />
          </button>
        </div>
      </div>

      {/* Luxury Motion Ribbon */}
      <div className="mt-20">
        <EditorialMarquee variant="peach" />
      </div>
    </div>
  );
}
