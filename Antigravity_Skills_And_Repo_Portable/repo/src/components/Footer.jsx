import React, { useState } from 'react';
import { ArrowUp, Sparkles, Send, Check } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export default function Footer({ onNavigate }) {
  const { brand } = useCms();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLink = (e, route) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(route);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-peach-300 via-peach to-tangerine text-terracotta pt-24 pb-12 border-t-2 border-tangerine/30 relative overflow-hidden">
      {/* Massive Brand Marquee in authentic dual palette */}
      <div className="w-full overflow-hidden border-b border-terracotta/15 pb-16">
        <div className="whitespace-nowrap flex select-none animate-marquee text-[12vw] font-serif font-bold text-terracotta/10 leading-none">
          <span className="mx-8 text-terracotta/15">CINÉ GLACE</span>
          <span className="mx-8 text-tangerine-600/30">&bull;</span>
          <span className="mx-8 text-terracotta/15">PROVENCE WHITE PEACH</span>
          <span className="mx-8 text-tangerine-600/30">&bull;</span>
          <span className="mx-8 text-terracotta/15">VALENCIAN TANGERINE</span>
          <span className="mx-8 text-tangerine-600/30">&bull;</span>
          <span className="mx-8 text-terracotta/15">CINÉ GLACE</span>
          <span className="mx-8 text-tangerine-600/30">&bull;</span>
          <span className="mx-8 text-terracotta/15">HAUTE GLACERIE</span>
          <span className="mx-8 text-tangerine-600/30">&bull;</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 pb-12 sm:pb-16 border-b border-terracotta/15">
          {/* Brand Manifesto Col */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <a
              href="#/"
              onClick={(e) => handleLink(e, 'home')}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-tangerine to-peach flex items-center justify-center text-white font-bold text-lg shadow-glow-tangerine group-hover:scale-105 transition-transform">
                {brand?.name ? brand.name.charAt(0) : 'C'}
              </div>
              <span className="font-serif text-3xl tracking-widest text-terracotta font-semibold group-hover:text-tangerine-deep transition-colors uppercase">
                {brand?.name || 'CINÉ'}
              </span>
            </a>
            <p className="text-xs md:text-sm text-terracotta/80 max-w-sm font-sans leading-relaxed font-medium">
              {brand?.manifesto || 'We make honest ice cream with real fruit from sunny Provence and Valencia, fresh farm cream, and zero artificial shortcuts.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-tangerine-700 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-tangerine" />
              <span>{brand?.tagline || 'Provence • Valencia • Paris • Tokyo'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-tangerine-700 font-bold mb-1">
              Explore Ciné
            </span>
            <a
              href="#/flavors"
              onClick={(e) => handleLink(e, 'flavors')}
              className="text-xs text-terracotta/80 hover:text-terracotta font-medium transition-colors"
            >
              Our Flavors
            </a>
            <a
              href="#/how-its-made"
              onClick={(e) => handleLink(e, 'how-its-made')}
              className="text-xs text-terracotta/80 hover:text-terracotta font-medium transition-colors"
            >
              How It's Made
            </a>
            <a
              href="#/photos"
              onClick={(e) => handleLink(e, 'photos')}
              className="text-xs text-terracotta/80 hover:text-terracotta font-medium transition-colors"
            >
              Our Photos
            </a>
            <a
              href="#/shops"
              onClick={(e) => handleLink(e, 'shops')}
              className="text-xs text-terracotta/80 hover:text-terracotta font-medium transition-colors"
            >
              Our Shops
            </a>
            <a
              href="#/account"
              onClick={(e) => handleLink(e, 'account')}
              className="text-xs text-tangerine-800 hover:text-terracotta font-bold transition-colors"
            >
              Member Sign In &bull; Register
            </a>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-tangerine-700 font-bold mb-1">
              Newsletter &amp; Updates
            </span>
            <p className="text-xs text-terracotta/80 font-sans font-medium">
              Get updates on seasonal fresh fruit flavors and special shop events.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2 mt-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-full bg-peach-light/95 border border-tangerine/40 text-xs text-terracotta placeholder:text-terracotta/50 focus:outline-none focus:border-tangerine shadow-sm"
              />
              <button
                type="submit"
                className="p-3 rounded-full bg-tangerine hover:bg-tangerine-deep text-white font-bold shadow-glow-tangerine hover:scale-105 active:scale-95 transition-all shrink-0"
                aria-label="Subscribe"
              >
                {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            {subscribed && (
              <span className="text-[11px] text-tangerine-700 font-bold animate-fadeIn">
                Thank you! You're on the list.
              </span>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-terracotta/70 font-medium">
          <span>&copy; 2026 Ciné Fresh Fruit Ice Cream &bull; All Rights Reserved</span>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-terracotta hover:text-tangerine-700 transition-colors uppercase tracking-widest text-[11px] font-bold"
          >
            <span>Back To Top</span>
            <ArrowUp className="w-4 h-4 text-tangerine" />
          </button>
        </div>
      </div>
    </footer>
  );
}
