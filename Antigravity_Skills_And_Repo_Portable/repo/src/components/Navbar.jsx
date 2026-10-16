import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { isApprovedAdmin, getActiveUser } from '../utils/authUtils';

export default function Navbar({
  flightCount,
  onOpenFlight,
  visible,
  currentRoute = 'home',
  onNavigate,
}) {
  const { brand } = useCms() || {};
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => isApprovedAdmin(getActiveUser()));

  // Synchronize admin privilege strictly with active session
  useEffect(() => {
    const checkAdmin = () => {
      const user = getActiveUser();
      setIsAdmin(isApprovedAdmin(user));
    };

    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    window.addEventListener('cine_auth_change', checkAdmin);

    return () => {
      window.removeEventListener('storage', checkAdmin);
      window.removeEventListener('cine_auth_change', checkAdmin);
    };
  }, [currentRoute]);

  useEffect(() => {
    let lastPast = false;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);

      // Hero animation ends after pinned scrub (+=350%, approx 3.5 * window.innerHeight)
      // Reveal navbar smoothly below the hero animation
      const heroThreshold = window.innerHeight * 3.4;
      const past = scrollY >= heroThreshold;
      if (past !== lastPast) {
        lastPast = past;
        setIsPastHero(past);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#/', route: 'home' },
    { label: 'Flavors', href: '#/flavors', route: 'flavors' },
    { label: "How It's Made", href: '#/how-its-made', route: 'how-its-made' },
    { label: 'Our Photos', href: '#/photos', route: 'photos' },
    { label: 'Our Shops', href: '#/shops', route: 'shops' },
  ];

  const handleLinkClick = (e, link) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(link.route);
      setMobileMenuOpen(false);
    }
  };

  const handleBrandClick = (e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate('home');
      setMobileMenuOpen(false);
    }
  };

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isSolid = currentRoute !== 'home' || isScrolled;
  const isNavbarVisible = visible !== undefined
    ? visible
    : (currentRoute !== 'home' || isPastHero || isScrolled);

  return (
    <>
      <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        !isNavbarVisible
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100'
      } ${
        isSolid
          ? 'py-2.5 sm:py-3.5 bg-terracotta/95 backdrop-blur-xl border-b border-peach/25 shadow-luxury text-white'
          : 'py-3 sm:py-4 bg-terracotta/80 backdrop-blur-md border-b border-peach/20 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
        {/* Brand Monogram & Name */}
        <a
          href="#/"
          onClick={handleBrandClick}
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-tangerine to-peach flex items-center justify-center text-terracotta font-bold text-base sm:text-lg shadow-glow-peach transition-transform duration-300 group-hover:scale-105 shrink-0">
            {brand?.name ? brand.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-widest font-semibold text-white group-hover:text-peach transition-colors uppercase leading-none">
              {brand?.name || 'CINÉ'}
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-peach font-sans font-bold mt-0.5">
              {brand?.tagline || 'Fresh Fruit Ice Cream'}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-sans tracking-wider uppercase text-peach-light font-semibold">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;

            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`relative py-1 transition-colors duration-200 cursor-pointer group ${
                  isActive ? 'text-peach font-bold' : 'hover:text-peach'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-tangerine transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Member Login & Register Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('account');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center justify-center gap-1.5 p-2 sm:px-4 sm:py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              currentRoute === 'account'
                ? 'bg-peach text-terracotta border-peach shadow-glow-peach'
                : 'bg-white/10 text-peach-light border-peach/30 hover:bg-white/20 hover:text-white'
            }`}
            title="Tasting Box Sign In & Register"
          >
            <User className={`w-4 h-4 ${currentRoute === 'account' ? 'text-terracotta' : 'text-peach'}`} />
            <span className="hidden sm:inline">Sign In / Register</span>
          </button>

          {/* Admin CMS Access Button (Strictly Restricted to Approved Admins) */}
          {isAdmin && (
            <button
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-1.5 p-2 sm:px-4 sm:py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                currentRoute === 'admin'
                  ? 'bg-tangerine text-white border-tangerine shadow-glow-tangerine font-bold'
                  : 'bg-white/10 text-peach border-peach/40 hover:bg-white/20 hover:text-white'
              }`}
              title="Live Headless CMS Studio (Admin Only)"
            >
              <ShieldCheck className="w-4 h-4 text-peach" />
              <span className="hidden sm:inline">CMS Studio</span>
            </button>
          )}

          {/* Tasting Flight Box Trigger */}
          <button
            onClick={onOpenFlight}
            className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white font-bold text-xs tracking-wider uppercase shadow-glow-tangerine hover:shadow-glow-peach hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Tasting Box</span>
            {flightCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-peach text-terracotta text-[11px] font-bold flex items-center justify-center ml-0.5">
                {flightCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-white hover:text-peach focus:outline-none rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Drawer Menu - High-End Slide-Over Panel */}
    {mobileMenuOpen && (
      <div
        data-lenis-prevent
        className="md:hidden fixed inset-x-0 top-[52px] sm:top-[60px] bottom-0 bg-terracotta border-t border-peach/25 p-6 flex flex-col justify-between text-white z-50 overflow-y-auto animate-fadeIn shadow-2xl"
      >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`text-2xl font-serif tracking-wider py-3.5 border-b border-peach/15 flex items-center justify-between cursor-pointer transition-colors ${
                    isActive ? 'text-peach font-bold' : 'hover:text-peach text-white/90'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2.5 h-2.5 rounded-full bg-tangerine shadow-glow-tangerine" />}
                </a>
              );
            })}

            <a
              href="#/account"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('account');
                setMobileMenuOpen(false);
              }}
              className={`text-2xl font-serif tracking-wider py-3.5 border-b border-peach/15 flex items-center justify-between cursor-pointer transition-colors ${
                currentRoute === 'account' ? 'text-peach font-bold' : 'hover:text-peach text-white/90'
              }`}
            >
              <span className="flex items-center gap-3">
                <User className="w-5 h-5 text-tangerine" />
                <span>Member Sign In &bull; Register</span>
              </span>
              {currentRoute === 'account' && <span className="w-2.5 h-2.5 rounded-full bg-tangerine shadow-glow-tangerine" />}
            </a>

            {/* Mobile Admin Link (Strictly Restricted to Approved Admins) */}
            {isAdmin && (
              <a
                href="#/admin"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className={`text-2xl font-serif tracking-wider py-3.5 border-b border-peach/15 flex items-center justify-between cursor-pointer transition-colors ${
                  currentRoute === 'admin' ? 'text-peach font-bold' : 'hover:text-peach text-white/90'
                }`}
              >
                <span className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-peach" />
                  <span>Live CMS Admin Studio</span>
                </span>
                {currentRoute === 'admin' && <span className="w-2.5 h-2.5 rounded-full bg-tangerine shadow-glow-tangerine" />}
              </a>
            )}
          </div>

          {/* Drawer Bottom Info */}
          <div className="pt-6 border-t border-peach/20 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-peach">
              <span className="uppercase tracking-widest font-bold">Provence &bull; Valencia &bull; Paris</span>
              <div className="flex items-center gap-1.5 text-tangerine font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Harvest 2026</span>
              </div>
            </div>
            <p className="text-xs text-peach-light/70 font-sans leading-relaxed">
              Haute Glacerie &bull; Handcrafted from sun-ripened fruit and fresh organic cream.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
