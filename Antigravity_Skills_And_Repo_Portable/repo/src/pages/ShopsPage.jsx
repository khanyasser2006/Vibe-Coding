import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Clock, Phone, Navigation, ArrowUpRight, Compass, Check } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import EditorialMarquee from '../components/EditorialMarquee';

export default function ShopsPage({ onOpenFlight }) {
  const { boutiques = [], pageContent } = useCms();
  const hero = pageContent?.shops || {};
  const [selectedBoutiqueId, setSelectedBoutiqueId] = useState(() => boutiques[0]?.id || 'paris-marais');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clocks for Paris, Tokyo, Milan, New York
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCityTime = (city) => {
    const timeZoneMap = {
      Paris: 'Europe/Paris',
      Tokyo: 'Asia/Tokyo',
      Milan: 'Europe/Rome',
      'New York': 'America/New_York',
    };
    try {
      return currentTime.toLocaleTimeString('en-US', {
        timeZone: timeZoneMap[city] || 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  const selectedBoutique = boutiques.find((b) => (b.id || b.city) === selectedBoutiqueId) || boutiques[0] || {};

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
            <span>{hero.badge || 'Global Flagship Ateliers'}</span>
          </div>

          <h1 className="font-serif font-bold text-4xl sm:text-6xl md:text-8xl tracking-tight text-terracotta leading-[0.95]">
            {hero.title || 'Sunlit Spaces •'} <br />
            <span className="italic font-light text-tangerine">{hero.titleAccent || 'Our Boutiques.'}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-xl text-terracotta/80 font-sans leading-relaxed max-w-2xl">
            {hero.description || 'Step inside our sunlit flagship boutiques where fresh scoops are churned daily and the warm, fruity aromas welcome you from the doorstep.'}
          </p>

          {/* Quick City Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 sm:pt-4">
            {boutiques.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBoutiqueId(b.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                  selectedBoutiqueId === b.id
                    ? 'bg-tangerine text-white shadow-glow-tangerine scale-105'
                    : 'bg-peach-200/60 text-terracotta/80 hover:bg-peach-200 hover:text-terracotta border border-tangerine/20'
                }`}
              >
                <span>{b.city}</span>
                <span className="text-[10px] opacity-80 font-mono">({getCityTime(b.city)})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Boutique Spotlight Card */}
        <div className="relative rounded-3xl overflow-hidden border border-tangerine/30 shadow-luxury mb-14 sm:mb-20 bg-peach-100">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Generated Gemini Boutique Image */}
            <div className="lg:col-span-7 h-64 sm:h-96 lg:h-[520px] relative overflow-hidden">
              <img
                src={selectedBoutique.image}
                alt={`${selectedBoutique.city} Boutique`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-terracotta/70 via-terracotta/20 to-transparent" />
              
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
                <span className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 text-terracotta text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                  {selectedBoutique.city} Flagship Atelier
                </span>
              </div>

              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 text-white">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 -ml-4" />
                  <span className="font-bold">{selectedBoutique.status}</span>
                </div>
                <span className="text-[11px] sm:text-xs font-mono bg-terracotta/80 px-2.5 sm:px-3 py-1 rounded-full text-peach">
                  Local Time: {getCityTime(selectedBoutique.city)}
                </span>
              </div>
            </div>

            {/* Boutique Details Column */}
            <div className="lg:col-span-5 p-6 sm:p-8 md:p-12 flex flex-col justify-between bg-gradient-to-b from-peach-100 to-peach-200">
              <div className="flex flex-col gap-5">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-tangerine-700 font-bold">
                    {selectedBoutique.district}, {selectedBoutique.country}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-terracotta leading-tight">
                    Ciné {selectedBoutique.city}
                  </h2>
                </div>

                <p className="text-sm text-terracotta/85 font-sans leading-relaxed">
                  {selectedBoutique.description}
                </p>

                {/* Practical Visiting Info */}
                <div className="flex flex-col gap-3 pt-2 text-xs border-t border-tangerine/20">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-tangerine shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-terracotta block">{selectedBoutique.address}</span>
                      <span className="text-[11px] text-terracotta/70">{selectedBoutique.metro}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-tangerine shrink-0" />
                    <span className="text-terracotta font-medium">{selectedBoutique.status}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-tangerine shrink-0" />
                    <a href={`tel:${selectedBoutique.phone?.replace(/[^0-9+]/g, '') || ''}`} className="text-terracotta hover:text-tangerine font-mono transition-colors">
                      {selectedBoutique.phone}
                    </a>
                  </div>
                </div>

                {/* Exclusive House Specialty */}
                <div className="p-4 rounded-2xl bg-peach-50/90 border border-tangerine/25 flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-tangerine-700 font-bold">
                    House Specialty
                  </span>
                  <span className="font-serif font-bold text-sm text-terracotta">
                    {selectedBoutique.specialty}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`Cine Ice Cream ${selectedBoutique.city || ''} ${selectedBoutique.address || ''}`.trim())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-full bg-tangerine hover:bg-tangerine-deep text-white font-bold text-xs uppercase tracking-wider text-center shadow-glow-tangerine transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>

                <button
                  onClick={onOpenFlight}
                  className="py-3 px-4 rounded-full bg-peach-200 hover:bg-peach-300 text-terracotta font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Order Tasting Flight
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* All Boutiques Overview Grid */}
        <div className="mb-20">
          <div className="flex flex-col gap-2 mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-tangerine-700 font-bold">
              Global Network
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-terracotta">
              Four Iconic Destinations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {boutiques.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBoutiqueId(b.id)}
                className={`p-6 rounded-3xl border card-hover-luxury cursor-pointer flex flex-col justify-between gap-6 ${
                  selectedBoutiqueId === b.id
                    ? 'bg-peach-100 border-tangerine shadow-glow-peach ring-2 ring-tangerine/40 scale-[1.02]'
                    : 'bg-peach-100/60 hover:bg-peach-100 border-tangerine/20 hover:border-tangerine/40'
                }`}
              >
                <div className="flex flex-col gap-4">
                  {/* Thumbnail */}
                  <div className="h-40 w-full rounded-2xl overflow-hidden relative">
                    <img
                      src={b.image}
                      alt={b.city}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-terracotta backdrop-blur-md">
                      {getCityTime(b.city)}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-tangerine-700 font-bold block">
                      {b.district}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-terracotta">
                      {b.city}
                    </h3>
                  </div>

                  <p className="text-xs text-terracotta/80 font-sans line-clamp-2">
                    {b.address}
                  </p>
                </div>

                <div className="pt-3 border-t border-tangerine/15 flex items-center justify-between text-[11px] font-bold text-tangerine-800 uppercase tracking-wider">
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Boutique Hospitality Principles */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-tangerine to-tangerine-deep text-white shadow-dual">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-serif text-2xl font-bold">Daily Copper Churning</span>
              <p className="text-xs text-peach-light/90 leading-relaxed font-sans">
                Every boutique churns fruit gelato fresh every morning at 7:00 AM so nothing is ever served frozen solid or crystallized.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-serif text-2xl font-bold">Chilled Insulated Pints</span>
              <p className="text-xs text-peach-light/90 leading-relaxed font-sans">
                Traveling or taking home? We pack your pints in zero-plastic biodegradable thermal cases keeping them cellar-cold for up to 3 hours.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-serif text-2xl font-bold">Tasting Flight Salon</span>
              <p className="text-xs text-peach-light/90 leading-relaxed font-sans">
                Sit down at our marble bar for a flight of 4 micro-scoops paired with organic teas and sparkling Provence spring water.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Motion Ribbon */}
      <div className="mt-20">
        <EditorialMarquee variant="peach" />
      </div>
    </div>
  );
}
