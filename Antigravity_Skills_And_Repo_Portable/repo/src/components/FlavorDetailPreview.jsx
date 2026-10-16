import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Plus, Minus, ShoppingBag, Check, Sparkles, Heart, MapPin } from 'lucide-react';

export default function FlavorDetailPreview({ flavor, onClose, onAddToFlight, isAdded }) {
  const getSafeWidth = (val) => {
    const num = parseInt(String(val ?? '50'), 10);
    return `${Math.min(100, Math.max(0, isNaN(num) ? 50 : num))}%`;
  };

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when preview is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!flavor) return null;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToFlight(flavor);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[9999] overflow-y-auto overscroll-contain bg-gradient-to-b from-peach-100 via-peach to-tangerine-200 text-terracotta animate-fadeIn"
    >
      {/* Ambient background glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-tangerine/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-peach-300/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar matching Navbar spacing & design */}
      <header className="sticky top-0 z-50 py-3 sm:py-4 px-4 sm:px-6 md:px-12 bg-peach-light/90 backdrop-blur-xl border-b border-tangerine/25">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onClose}
            className="group flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2 rounded-full bg-peach/60 hover:bg-tangerine text-terracotta hover:text-white border border-tangerine/30 transition-all font-sans text-xs uppercase tracking-wider font-bold"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back To Flavors</span>
            <span className="sm:hidden">Back</span>
          </button>

          {/* Centered Brand Monogram */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-tangerine to-peach flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-glow-tangerine">
              C
            </div>
            <span className="font-serif text-lg sm:text-xl tracking-widest font-semibold text-terracotta">
              CINÉ
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full bg-peach/60 hover:bg-tangerine hover:text-white text-terracotta transition-colors border border-tangerine/30"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Hero Showcase (Copies hero spacing: max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-16 pb-28 sm:pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Visual Hero Stage */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-peach-200 to-tangerine-100 border-2 border-tangerine/30 shadow-2xl group">
              <img
                src={flavor.image}
                alt={flavor.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-tangerine text-white text-[11px] font-sans uppercase tracking-widest font-bold shadow-glow-tangerine">
                  {flavor.badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-terracotta/80 backdrop-blur-md text-peach text-[11px] font-sans font-semibold border border-peach/30">
                  {flavor.fruitPercentage || '68% Real Fruit'}
                </span>
              </div>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                  isLiked
                    ? 'bg-tangerine text-white'
                    : 'bg-peach-light/80 text-terracotta hover:text-tangerine'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-peach-light/90 backdrop-blur-md border border-tangerine/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-terracotta">
                  <MapPin className="w-3.5 h-3.5 text-tangerine" />
                  <span>{flavor.origin || 'Provence & Valencia'}</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-tangerine-700">
                  {flavor.calories || '220 Cal / Scoop'}
                </span>
              </div>
            </div>

            {/* Ingredient Pills */}
            <div className="p-6 rounded-3xl bg-peach-light/90 border border-tangerine/20 shadow-sm flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-tangerine-700 font-bold">
                Natural Ingredients
              </span>
              <div className="flex flex-wrap gap-2">
                {flavor.notes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1.5 rounded-xl bg-peach-200/80 border border-tangerine/30 text-xs font-sans text-terracotta font-semibold"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Typography & Detailed Story */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Category Tag */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-tangerine-700 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-tangerine" />
              <span>{flavor.category} &bull; Fresh Churned Daily</span>
            </div>

            {/* Display Serif Headline (Hero style typography) */}
            <div>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-tight text-terracotta leading-tight">
                {flavor.name}
              </h1>
              <p className="font-serif text-xl sm:text-2xl text-tangerine-700 italic font-normal mt-2">
                {flavor.subtitle}
              </p>
            </div>

            {/* Flavor Story Paragraph */}
            <p className="text-base sm:text-lg text-terracotta/90 font-sans leading-relaxed font-medium">
              {flavor.detailedStory || flavor.description}
            </p>

            {/* Taste Profile Meters */}
            <div className="p-6 md:p-8 rounded-3xl bg-peach-light/95 border-2 border-tangerine/30 shadow-luxury flex flex-col gap-5">
              <span className="text-xs uppercase tracking-widest text-tangerine-700 font-bold">
                Taste &amp; Texture Profile
              </span>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-terracotta mb-1.5">
                    <span>Natural Sweetness</span>
                    <span className="font-mono text-tangerine">{flavor.sweetness}</span>
                  </div>
                  <div className="w-full h-2.5 bg-peach-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-peach-400 to-tangerine rounded-full transition-all duration-700"
                      style={{ width: getSafeWidth(flavor.sweetness) }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-terracotta mb-1.5">
                    <span>Fruit Tartness &amp; Zest</span>
                    <span className="font-mono text-tangerine-700">{flavor.tartness}</span>
                  </div>
                  <div className="w-full h-2.5 bg-peach-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-tangerine rounded-full transition-all duration-700"
                      style={{ width: getSafeWidth(flavor.tartness) }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-terracotta mb-1.5">
                    <span>Creaminess</span>
                    <span className="font-mono text-tangerine-700">95%</span>
                  </div>
                  <div className="w-full h-2.5 bg-peach-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-tangerine to-tangerine-deep rounded-full transition-all duration-700"
                      style={{ width: '95%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Standards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-peach-light/80 border border-tangerine/25 flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-tangerine-700 font-bold">
                  Milk Source
                </span>
                <span className="font-sans text-sm font-semibold text-terracotta">
                  {flavor.dairySource || 'Organic Farm Fresh Cream'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-peach-light/80 border border-tangerine/25 flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-wider text-tangerine-700 font-bold">
                  Serving Idea
                </span>
                <span className="font-sans text-sm font-semibold text-terracotta">
                  {flavor.pairing || 'Warm waffle cone or fruit bowl'}
                </span>
              </div>
            </div>

            {/* Mobile Sticky Floating Action Bar / Desktop Integrated Card */}
            <div className="fixed sm:relative bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-auto p-4 sm:p-6 md:p-8 bg-peach-light/95 backdrop-blur-2xl sm:backdrop-blur-none border-t sm:border-2 border-tangerine/35 shadow-2xl sm:rounded-3xl z-40 flex items-center justify-between gap-3 sm:gap-6">
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-terracotta/70 font-semibold block">
                  Price Per Pint
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-terracotta leading-tight">
                  {flavor.price}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                {/* Quantity Control */}
                <div className="flex items-center border border-tangerine/40 rounded-full bg-peach-200/50 p-0.5 sm:p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-peach text-terracotta transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2.5 sm:px-4 font-mono font-bold text-xs sm:text-sm text-terracotta">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-peach text-terracotta transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Add Action Button */}
                <button
                  onClick={handleAdd}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white font-sans uppercase tracking-widest text-xs font-bold shadow-glow-tangerine hover:scale-105 active:scale-95 transition-all shrink-0"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span>Add To Box</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
