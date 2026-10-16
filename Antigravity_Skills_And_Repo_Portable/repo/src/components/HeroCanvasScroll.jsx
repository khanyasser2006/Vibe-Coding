import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


import heroFramesList from '../data/hero_frames.json';

gsap.registerPlugin(ScrollTrigger);

export default function HeroCanvasScroll({ onScrollComplete }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const frameIndexRef = useRef(0);
  const imagesRef = useRef([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  const totalFrames = heroFramesList.length > 0 ? heroFramesList.length : 300;

  // 1. Off-Thread GPU Pre-decode with createImageBitmap
  useEffect(() => {
    let isCancelled = false;
    imagesRef.current = new Array(totalFrames);

    const loadBatch = async () => {
      const batchSize = 12;
      for (let i = 0; i < totalFrames; i += batchSize) {
        if (isCancelled) break;
        const currentBatch = [];
        for (let j = i; j < Math.min(i + batchSize, totalFrames); j++) {
          const frameFile = heroFramesList[j] || `hero_${String(j + 1).padStart(4, '0')}.jpg`;
          const url = `/hero_frames/${frameFile}`;
          const promise = fetch(url)
            .then((res) => {
              if (!res.ok) throw new Error(`HTTP error ${res.status}`);
              return res.blob();
            })
            .then((blob) => createImageBitmap(blob))
            .then((bitmap) => {
              if (!isCancelled) {
                imagesRef.current[j] = bitmap;
                setLoadedCount((c) => c + 1);
              }
            })
            .catch(() => {
              // Fallback to Image element if createImageBitmap is unavailable
              return new Promise((resolve) => {
                const img = new Image();
                img.src = url;
                img.onload = () => {
                  if (!isCancelled) {
                    imagesRef.current[j] = img;
                    setLoadedCount((c) => c + 1);
                  }
                  resolve();
                };
                img.onerror = () => resolve();
              });
            });
          currentBatch.push(promise);
        }
        await Promise.all(currentBatch);
      }
      if (!isCancelled) {
        setIsLoaded(true);
      }
    };

    loadBatch();

    return () => {
      isCancelled = true;
    };
  }, [totalFrames]);

  // 2. Decoupled rAF Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = (window.innerWidth * dpr) | 0;
      canvas.height = (window.innerHeight * dpr) | 0;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const targetIndex = frameIndexRef.current | 0;
      const img = imagesRef.current[targetIndex] || imagesRef.current[0];

      if (img && canvas) {
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.width || 1280;
        const ih = img.height || 720;

        // Cover fill aspect ratio calculations
        const hRatio = cw / iw;
        const vRatio = ch / ih;
        const ratio = Math.max(hRatio, vRatio);

        const sw = (iw * ratio) | 0;
        const sh = (ih * ratio) | 0;
        const sx = ((cw - sw) / 2) | 0;
        const sy = ((ch - sh) / 2) | 0;

        ctx.fillStyle = '#FEC5A8';
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, 0, 0, iw, ih, sx, sy, sw, sh);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // 3. GSAP ScrollTrigger Scrub
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const scrollObj = { frame: 0 };

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=350%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const frame = Math.min(
            totalFrames - 1,
            Math.floor(progress * (totalFrames - 1))
          );
          frameIndexRef.current = frame;

          // Stage determination
          if (progress < 0.22) {
            setActiveStage(0);
          } else if (progress < 0.50) {
            setActiveStage(1);
          } else if (progress < 0.78) {
            setActiveStage(2);
          } else {
            setActiveStage(3);
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [totalFrames]);

  const loadPercent = Math.min(100, Math.round((loadedCount / totalFrames) * 100));

  return (
    <div ref={containerRef} className="relative w-full h-screen min-h-[100dvh] bg-peach overflow-hidden select-none">
      {/* Background Pinned Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Loading Screen Indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 transition-opacity duration-700">
          {/* Dual Color Split Background */}
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full bg-[#FEC5A8]" />
            <div className="w-1/2 h-full bg-[#F4784E]" />
          </div>
          {/* Loading Content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="w-12 h-12 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            <div className="flex flex-col items-center gap-2">
              <span className="font-serif text-3xl tracking-widest text-white">CINÉ</span>
              <span className="text-xs font-sans tracking-[0.3em] uppercase text-white/80">
                Loading Experience &bull; {loadPercent}%
              </span>
            </div>
            <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-150"
                style={{ width: `${loadPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Narrative Stage Overlays (Z-Index 20) */}
      <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-5 sm:px-6 md:px-12 pointer-events-none">

          {/* Stage 0: Bottom-Left */}
          {activeStage === 0 && (
            <div className="absolute bottom-16 sm:bottom-24 md:bottom-28 left-5 sm:left-6 md:left-12 right-5 sm:right-auto max-w-lg flex flex-col gap-2.5 sm:gap-3 animate-fadeIn drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]">
              <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl tracking-tight text-white leading-[0.95] sm:leading-[0.92]">
                Real Fruit. <br />
                <span className="italic font-light text-peach">Pure Cream.</span>
              </h1>
              <p className="max-w-md text-xs sm:text-sm md:text-base text-white/95 font-sans leading-relaxed">
                Made with fresh farm cream, sweet French white peaches, and hand-squeezed citrus.
              </p>

              {/* Gentle Mobile Scroll Prompt */}
              <div className="flex items-center gap-2 pt-2 text-[11px] font-sans uppercase tracking-[0.2em] text-peach font-bold animate-pulse">
                <span>Swipe down to churn</span>
                <span>&darr;</span>
              </div>
            </div>
          )}

          {/* Stage 1: Top-Right */}
          {activeStage === 1 && (
            <div className="absolute top-20 sm:top-24 md:top-28 right-5 sm:right-6 md:right-12 left-5 sm:left-auto max-w-lg flex flex-col gap-2.5 sm:gap-3 animate-fadeIn text-right drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl text-white leading-tight">
                Sweet White Peach <br />
                <span className="italic text-peach">&amp; Fresh Cream</span>
              </h2>
              <p className="max-w-md text-xs sm:text-sm md:text-base text-white/95 font-sans leading-relaxed ml-auto">
                Picked ripe from sunny French orchards and churned fresh with real organic cream.
              </p>
            </div>
          )}

          {/* Stage 2: Bottom-Right */}
          {activeStage === 2 && (
            <div className="absolute bottom-16 sm:bottom-24 md:bottom-28 right-5 sm:right-6 md:right-12 left-5 sm:left-auto max-w-lg flex flex-col gap-2.5 sm:gap-3 animate-fadeIn text-right drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl text-white leading-tight">
                Tangy Tangerine <br />
                <span className="italic text-tangerine">Caramel Swirl</span>
              </h2>
              <p className="max-w-md text-xs sm:text-sm md:text-base text-white/95 font-sans leading-relaxed ml-auto">
                Slow-cooked citrus fruit syrup layered with crunchy almond butter toffee.
              </p>
            </div>
          )}

          {/* Stage 3: Center */}
          {activeStage === 3 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 gap-3 animate-fadeIn text-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl text-white leading-tight">
                Made For <br />
                <span className="italic text-peach">Pure Joy</span>
              </h2>
              <p className="max-w-md text-xs sm:text-sm md:text-base text-white/95 font-sans leading-relaxed">
                Fresh scoops served in warm, handmade waffle cones with golden fruit drizzle.
              </p>
            </div>
          )}

      </div>
    </div>
  );
}
