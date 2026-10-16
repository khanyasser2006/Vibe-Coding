import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import HeroCanvasScroll from './components/HeroCanvasScroll';
import ProcessCanvasScroll from './components/ProcessCanvasScroll';
import ParallaxGallery from './components/ParallaxGallery';
import FlavorCollection from './components/FlavorCollection';
import BoutiqueLocator from './components/BoutiqueLocator';
import Footer from './components/Footer';
import TastingFlightDrawer from './components/TastingFlightDrawer';
import FlavorDetailPreview from './components/FlavorDetailPreview';
import EditorialMarquee from './components/EditorialMarquee';
import SeoHelmet from './components/SeoHelmet';

// Dedicated Subpages
import FlavorsPage from './pages/FlavorsPage';
import HowItsMadePage from './pages/HowItsMadePage';
import PhotosPage from './pages/PhotosPage';
import ShopsPage from './pages/ShopsPage';
import TastingBoxAuthPage from './pages/TastingBoxAuthPage';
import AdminPanelPage from './pages/AdminPanelPage';

// Headless CMS Context
import { CmsProvider } from './context/CmsContext';

// Robust route normalizer that tolerates spaces, hyphens, URL encodings, and synonyms
const normalizeRoute = (hashStr) => {
  if (!hashStr) return 'home';
  let decoded = '';
  try {
    decoded = decodeURIComponent(hashStr);
  } catch {
    decoded = hashStr;
  }
  const clean = decoded
    .replace(/^[#/]+/, '')
    .replace(/\/.*$/, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-');

  if (!clean || clean === 'home') return 'home';
  if (clean.includes('flavor')) return 'flavors';
  if (clean.includes('how') || clean.includes('made') || clean.includes('alchemy') || clean.includes('craft')) return 'how-its-made';
  if (clean.includes('photo') || clean.includes('gallery')) return 'photos';
  if (clean.includes('shop') || clean.includes('boutique')) return 'shops';
  if (clean.includes('account') || clean.includes('login') || clean.includes('register') || clean.includes('auth') || clean.includes('tasting-box') || clean.includes('flight-box') || clean.includes('member')) return 'account';
  if (clean.includes('admin') || clean.includes('cms') || clean.includes('dashboard') || clean.includes('manage')) return 'admin';

  return 'home';
};

export default function App() {
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [isFlightDrawerOpen, setIsFlightDrawerOpen] = useState(false);
  const [activePreviewFlavor, setActivePreviewFlavor] = useState(null);

  const getInitialRoute = () => {
    if (typeof window === 'undefined') return 'home';
    return normalizeRoute(window.location.hash);
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const lenisRef = useRef(null);

  // Synchronize route with window hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = normalizeRoute(window.location.hash);
      setCurrentRoute(nextRoute);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Recalculate dimensions & scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (currentRoute === 'home') {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    }

    const timer = setTimeout(() => {
      lenisRef.current?.resize();
      lenisRef.current?.scrollTo(0, { immediate: true });
    }, 60);

    return () => clearTimeout(timer);
  }, [currentRoute]);

  // Initialize Lenis smooth scroll and synchronize with GSAP ScrollTrigger
  useEffect(() => {
    let animationFrameId = null;
    let isDestroyed = false;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.0,
      prevent: (node) => Boolean(node.closest?.('[data-lenis-prevent]')),
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    import('gsap').then(({ default: gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        if (isDestroyed) return;
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.lagSmoothing(0);
      });
    });

    function raf(time) {
      if (!isDestroyed && lenis) {
        lenis.raf(time);
        animationFrameId = requestAnimationFrame(raf);
      }
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      isDestroyed = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause Lenis smooth scroll on the main window while modal is open
  useEffect(() => {
    if (activePreviewFlavor || isFlightDrawerOpen) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [activePreviewFlavor, isFlightDrawerOpen]);

  // Navigate helper (updates hash as single source of truth)
  const navigateTo = (route) => {
    if (route === 'home') {
      window.location.hash = '#/';
    } else {
      window.location.hash = `#/${route}`;
    }
  };

  const handleAddToFlight = (flavor) => {
    setSelectedFlavors((prev) => {
      const exists = prev.some((f) => f.id === flavor.id);
      if (exists) {
        return prev.filter((f) => f.id !== flavor.id);
      }
      if (prev.length >= 4) {
        setIsFlightDrawerOpen(true);
        return prev;
      }
      return [...prev, flavor];
    });
  };

  const handleRemoveFlavor = (flavorId) => {
    setSelectedFlavors((prev) => prev.filter((f) => f.id !== flavorId));
  };

  const handleClearFlight = () => {
    setSelectedFlavors([]);
  };

  return (
    <CmsProvider>
      <div className="relative min-h-screen bg-peach-50 text-terracotta overflow-x-hidden selection:bg-peach selection:text-terracotta">
        {/* Dynamic Route-Level SEO Meta Management */}
        <SeoHelmet currentRoute={currentRoute} />

        {/* Accessibility Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-5 focus:py-2.5 focus:bg-tangerine focus:text-white focus:rounded-full focus:shadow-luxury focus:font-sans focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Tactile Subtle Film Grain */}
        <div className="film-grain" />

        {/* Fixed Glassmorphic Navbar: hidden during hero scroll animation, appears below it */}
        <Navbar
          flightCount={selectedFlavors.length}
          onOpenFlight={() => setIsFlightDrawerOpen(true)}
          currentRoute={currentRoute}
          onNavigate={navigateTo}
        />

        <main id="main-content">
          {/* Home Sections: Kept mounted in DOM to prevent GSAP pin-spacer removeChild collision and preserve pre-decoded canvas bitmaps */}
          <div className={currentRoute === 'home' ? 'block' : 'hidden'}>
            {/* Act I: Hero 600fps Canvas Scroll */}
            <HeroCanvasScroll />

            {/* Haute Glacerie Infinite Typography Marquee Ribbon */}
            <EditorialMarquee variant="terracotta" />

            {/* Flavor Collection */}
            <FlavorCollection
              onAddToFlight={handleAddToFlight}
              selectedFlavors={selectedFlavors}
              onSelectFlavor={setActivePreviewFlavor}
            />

            {/* Act II: Dual Scroll Alchemy (Peach Commercial Video 2) */}
            <ProcessCanvasScroll />

            {/* Act III: Multi-Plane 3D Parallax Photography Gallery */}
            <ParallaxGallery />

            {/* Mediterranean Harvest Typography Marquee Ribbon */}
            <EditorialMarquee variant="peach" />

            {/* Act IV: Global Flagship Boutiques */}
            <BoutiqueLocator />
          </div>

          {/* Dedicated Subpages with Smooth Cinematic Fade-in-up Transition */}
          {currentRoute !== 'home' && (
            <div key={currentRoute} className="animate-fade-in-up">
              {/* Dedicated Subpage: Flavors */}
              {currentRoute === 'flavors' && (
                <FlavorsPage
                  onSelectFlavor={setActivePreviewFlavor}
                  onAddToFlight={handleAddToFlight}
                  selectedFlavors={selectedFlavors}
                  onOpenFlight={() => setIsFlightDrawerOpen(true)}
                />
              )}

              {/* Dedicated Subpage: How It's Made */}
              {currentRoute === 'how-its-made' && (
                <HowItsMadePage onOpenFlavors={() => navigateTo('flavors')} />
              )}

              {/* Dedicated Subpage: Our Photos */}
              {currentRoute === 'photos' && (
                <PhotosPage />
              )}

              {/* Dedicated Subpage: Our Shops */}
              {currentRoute === 'shops' && (
                <ShopsPage onOpenFlight={() => setIsFlightDrawerOpen(true)} />
              )}

              {/* Dedicated Subpage: Tasting Box Member Access (Login & Register) */}
              {currentRoute === 'account' && (
                <TastingBoxAuthPage
                  selectedFlavors={selectedFlavors}
                  onOpenFlight={() => setIsFlightDrawerOpen(true)}
                  onNavigate={navigateTo}
                />
              )}

              {/* Admin Panel — component-level auth gate renders lockscreen for unauthorized users */}
              {currentRoute === 'admin' && (
                <AdminPanelPage onNavigate={navigateTo} />
              )}
            </div>
          )}
        </main>

        {/* Luxury Editorial Footer */}
        <Footer onNavigate={navigateTo} />

        {/* Slide-over Tasting Flight Drawer */}
        <TastingFlightDrawer
          isOpen={isFlightDrawerOpen}
          onClose={() => setIsFlightDrawerOpen(false)}
          selectedFlavors={selectedFlavors}
          onRemoveFlavor={handleRemoveFlavor}
          onClearFlight={handleClearFlight}
          onNavigate={navigateTo}
        />

        {/* Full-screen Detailed Flavor Preview */}
        {activePreviewFlavor && (
          <FlavorDetailPreview
            flavor={activePreviewFlavor}
            onClose={() => setActivePreviewFlavor(null)}
            onAddToFlight={handleAddToFlight}
            isAdded={selectedFlavors.some((f) => f.id === activePreviewFlavor.id)}
          />
        )}
      </div>
    </CmsProvider>
  );
}
