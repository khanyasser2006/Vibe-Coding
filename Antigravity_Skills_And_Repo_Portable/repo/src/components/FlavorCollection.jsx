import React, { useState, useEffect, useRef } from 'react';
import { useCms } from '../context/CmsContext';
import { Plus, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FlavorCollection({ onAddToFlight, selectedFlavors, onSelectFlavor }) {
  const getSafeWidth = (val) => {
    const num = parseInt(String(val ?? '50'), 10);
    return `${Math.min(100, Math.max(0, isNaN(num) ? 50 : num))}%`;
  };

  const { flavors = [] } = useCms();
  const [filter, setFilter] = useState('all');
  const sectionRef = useRef(null);

  const filteredFlavors =
    filter === 'all'
      ? flavors
      : flavors.filter((f) => f.tone === filter);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.flavor-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.flavor-grid',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredFlavors]);

  return (
    <section
      id="flavors"
      ref={sectionRef}
      className="py-32 md:py-40 bg-gradient-to-b from-peach-200 via-peach to-peach-400 relative overflow-hidden"
    >
      {/* Ambient background glows with floating pulse */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tangerine/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-peach-light/50 rounded-full blur-3xl pointer-events-none animate-float-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl text-terracotta tracking-tight">
              Our Fresh <span className="italic text-tangerine-600">Flavors</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-peach-light/90 border border-tangerine/30 shadow-luxury self-start md:self-auto overflow-x-auto max-w-full scrollbar-none">
            {[
              { id: 'all', label: 'All Flavors' },
              { id: 'peach', label: 'White Peach' },
              { id: 'tangerine', label: 'Fresh Citrus' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-sans uppercase tracking-wider whitespace-nowrap transition-all duration-200 active:scale-95 ${
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
        <div className="flavor-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredFlavors.map((flavor) => {
            const isAdded = selectedFlavors.some((f) => f.id === flavor.id);

            return (
              <div
                key={flavor.id}
                className="flavor-card group relative bg-peach-light/95 rounded-3xl p-5 sm:p-6 border border-tangerine/25 shadow-luxury hover:border-tangerine/60 card-hover-luxury flex flex-col justify-between"
              >
                <div>
                  {/* Clickable Image Container with Badge */}
                  <div
                    onClick={() => onSelectFlavor && onSelectFlavor(flavor)}
                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-peach-200 mb-6 border border-tangerine/20 cursor-pointer"
                    title="Click to view details"
                  >
                    <img
                      src={flavor.image}
                      alt={flavor.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-terracotta/85 backdrop-blur-md text-[10px] uppercase tracking-wider text-peach border border-peach/30 font-semibold">
                      {flavor.badge}
                    </div>

                    {/* View Details Overlay Cue */}
                    <div className="absolute inset-0 bg-terracotta/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3.5 py-1.5 rounded-full bg-peach text-terracotta text-[11px] font-bold tracking-wider uppercase shadow-luxury">
                        View Details &rarr;
                      </span>
                    </div>
                  </div>

                  {/* Flavor Info (Clickable) */}
                  <div
                    onClick={() => onSelectFlavor && onSelectFlavor(flavor)}
                    className="flex flex-col gap-1.5 mb-4 cursor-pointer"
                  >
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
                        style={{ width: getSafeWidth(flavor.sweetness) }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-terracotta font-medium pt-1">
                      <span>Citrus Tartness</span>
                      <span className="font-mono text-tangerine-600 font-bold">{flavor.tartness}</span>
                    </div>
                    <div className="w-full h-1.5 bg-peach-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tangerine-600 rounded-full"
                        style={{ width: getSafeWidth(flavor.tartness) }}
                      />
                    </div>
                  </div>
                </div>

                {/* Price & Action Button */}
                <div className="flex items-center justify-between pt-4 border-t border-tangerine/20">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-terracotta/70 block font-semibold">
                      Per Pint
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
                        <span>In Box</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add To Box</span>
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
