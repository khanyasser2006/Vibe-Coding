import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Maximize2, X, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxGallery() {
  const containerRef = useRef(null);
  const [activeModalImage, setActiveModalImage] = useState(null);
  const [likedCount, setLikedCount] = useState({
    sunset: 1420,
    storefront: 1980,
    cone: 2340,
    bowl: 3120,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const layers = containerRef.current.querySelectorAll('.parallax-layer');
      layers.forEach((layer) => {
        const speed = parseFloat(layer.getAttribute('data-speed') || '0.2');
        gsap.to(layer, {
          y: () => -120 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: layer,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });

      gsap.to('.floating-chip', {
        y: -12,
        rotation: 2,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.4,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleLike = (id, e) => {
    e.stopPropagation();
    setLikedCount((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative w-full py-20 sm:py-28 md:py-32 bg-gradient-to-b from-peach-300 via-tangerine to-terracotta text-white overflow-hidden"
    >
      {/* Sunburst radial lighting overlays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-peach-light/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-tangerine-deep/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-20">
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl text-terracotta-dark tracking-tight">
              Our Story <span className="italic text-white drop-shadow-md">In Pictures</span>
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm md:text-base text-terracotta font-sans leading-relaxed font-medium bg-peach-light/60 p-4 rounded-2xl border border-peach/50 backdrop-blur-sm shadow-sm">
            From sunny peach orchards to your favorite scoop, take a look behind the scenes at Ciné.
          </p>
        </div>

        {/* Multi-Plane Parallax Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Item 1: Sunset Highway Billboard (Span 8 Cols) */}
          <div
            className="md:col-span-8 parallax-layer group relative rounded-3xl overflow-hidden border-2 border-peach-200 bg-terracotta/90 shadow-2xl cursor-pointer"
            data-speed="0.15"
            onClick={() => setActiveModalImage({
              src: '/assets/cine-billboard-sunset.png',
              title: 'The Sunset Billboard Campaign',
              caption: 'Ciné Grand Horizon &bull; Provence Sunset Overpass'
            })}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img
                src="/assets/cine-billboard-sunset.png"
                alt="Ciné Sunset Billboard"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-terracotta/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            </div>

            {/* Hover Floating Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-peach font-bold">
                  Campaign 01 / Monumental
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-white mt-1 drop-shadow">
                  Sweet Moments Always
                </h3>
                <p className="text-xs text-peach-light/90 mt-1 max-w-sm">
                  Real fruits. Happier days. Peach in every scoop.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleLike('sunset', e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-terracotta/80 backdrop-blur-md border border-peach/30 text-xs text-peach hover:text-white transition-all font-semibold"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{likedCount.sunset}</span>
                </button>
                <div className="p-2.5 rounded-full bg-peach/30 text-white group-hover:bg-tangerine group-hover:text-terracotta transition-all">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Item 2: Double Scoop Artisanal Cone (Span 4 Cols) */}
          <div
            className="md:col-span-4 parallax-layer group relative rounded-3xl overflow-hidden border-2 border-peach-200 bg-terracotta/90 shadow-2xl cursor-pointer md:translate-y-16"
            data-speed="0.35"
            onClick={() => setActiveModalImage({
              src: '/assets/cine-cone-hero.png',
              title: 'The Artisanal Double Cone',
              caption: 'Cavaillon White Peach with Warm Tangerine Glaze'
            })}
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <img
                src="/assets/cine-cone-hero.png"
                alt="Ciné Artisanal Cone"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-terracotta/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            </div>

            <div className="floating-chip absolute top-6 right-6 px-3.5 py-1 rounded-full bg-terracotta/85 backdrop-blur-md border border-peach/50 text-[11px] text-peach tracking-wider uppercase font-semibold">
              Hand-Rolled Waffle
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-peach font-bold">
                  Studio Focus 02
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-white mt-1 drop-shadow">
                  Double Scoop Velvet
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleLike('cone', e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-terracotta/80 backdrop-blur-md border border-peach/30 text-xs text-peach font-semibold"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{likedCount.cone}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Item 3: Ceramic Bowl Signature (Span 5 Cols) */}
          <div
            className="md:col-span-5 parallax-layer group relative rounded-3xl overflow-hidden border-2 border-peach-200 bg-terracotta/90 shadow-2xl cursor-pointer"
            data-speed="0.25"
            onClick={() => setActiveModalImage({
              src: '/assets/cine-bowl-signature.png',
              title: 'The Signature Ceramic Bowl',
              caption: 'Fresh Sliced White Peaches, Tangerine Segments & Candied Blossoms'
            })}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src="/assets/cine-bowl-signature.png"
                alt="Ciné Ceramic Bowl Presentation"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-terracotta/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-peach font-bold">
                  Plated Glacerie 03
                </span>
                <h3 className="font-serif text-2xl text-white mt-1 drop-shadow">
                  Ceramic Degustation
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleLike('bowl', e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-terracotta/80 backdrop-blur-md border border-peach/30 text-xs text-peach font-semibold"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{likedCount.bowl}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Item 4: Flagship Storefront Billboard (Span 7 Cols) */}
          <div
            className="md:col-span-7 parallax-layer group relative rounded-3xl overflow-hidden border-2 border-peach-200 bg-terracotta/90 shadow-2xl cursor-pointer"
            data-speed="0.2"
            onClick={() => setActiveModalImage({
              src: '/assets/cine-billboard-storefront.png',
              title: 'The Nocturnal Flagship Pavilion',
              caption: 'Warm Illuminations & Night Tasting Flight Salon'
            })}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src="/assets/cine-billboard-storefront.png"
                alt="Ciné Flagship Storefront Billboard"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-terracotta/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            </div>

            <div className="floating-chip absolute top-6 left-6 px-3.5 py-1 rounded-full bg-terracotta/85 backdrop-blur-md border border-peach/50 text-[11px] text-peach tracking-wider uppercase font-semibold">
              A Sweeter Tomorrow
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-peach font-bold">
                  Flagship Storefront 04
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-white mt-1 drop-shadow">
                  Good Ice Cream, Brighter Days
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleLike('storefront', e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-terracotta/80 backdrop-blur-md border border-peach/30 text-xs text-peach font-semibold"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{likedCount.storefront}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeModalImage && (
        <div
          className="fixed inset-0 z-[9990] bg-terracotta/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 md:p-12 animate-fadeIn"
          onClick={() => setActiveModalImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-terracotta-card rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-peach shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 sm:p-4 md:p-6 border-b border-peach/20 flex items-center justify-between bg-terracotta">
              <div>
                <h4 className="font-serif text-lg sm:text-xl md:text-2xl text-white">
                  {activeModalImage.title}
                </h4>
                <p className="text-xs text-peach mt-0.5 font-sans">
                  {activeModalImage.caption}
                </p>
              </div>

              <button
                onClick={() => setActiveModalImage(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shrink-0 ml-2"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative max-h-[60vh] sm:max-h-[70vh] overflow-hidden flex items-center justify-center bg-black/40 p-3 sm:p-4">
              <img
                src={activeModalImage.src}
                alt={activeModalImage.title}
                className="max-h-[55vh] sm:max-h-[65vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
