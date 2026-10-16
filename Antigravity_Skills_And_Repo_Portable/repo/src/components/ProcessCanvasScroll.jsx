import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Thermometer, Wind, Droplets, CheckCircle2 } from 'lucide-react';
import peachFramesList from '../data/peach_frames.json';
import { processSteps } from '../data/iceCreamData';

gsap.registerPlugin(ScrollTrigger);

export default function ProcessCanvasScroll() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const frameIndexRef = useRef(0);
  const imagesRef = useRef([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const totalFrames = peachFramesList.length > 0 ? peachFramesList.length : 248;

  // 1. Off-Thread GPU Pre-decode
  useEffect(() => {
    let isCancelled = false;
    imagesRef.current = new Array(totalFrames);

    const loadBatch = async () => {
      const batchSize = 12;
      for (let i = 0; i < totalFrames; i += batchSize) {
        if (isCancelled) break;
        const currentBatch = [];
        for (let j = i; j < Math.min(i + batchSize, totalFrames); j++) {
          const frameFile = peachFramesList[j] || `peach_${String(j + 1).padStart(4, '0')}.jpg`;
          const url = `/peach_frames/${frameFile}`;
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
      canvas.width = (canvas.clientWidth * dpr) | 0;
      canvas.height = (canvas.clientHeight * dpr) | 0;
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

        const hRatio = cw / iw;
        const vRatio = ch / ih;
        const ratio = Math.max(hRatio, vRatio);

        const sw = (iw * ratio) | 0;
        const sh = (ih * ratio) | 0;
        const sx = ((cw - sw) / 2) | 0;
        const sy = ((ch - sh) / 2) | 0;

        ctx.fillStyle = '#38140B';
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
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const frame = Math.min(
            totalFrames - 1,
            Math.floor(progress * (totalFrames - 1))
          );
          frameIndexRef.current = frame;

          const step = Math.min(3, Math.floor(progress * 4));
          setActiveStep(step);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [totalFrames]);

  const currentStepData = processSteps[activeStep] || processSteps[0];

  return (
    <section
      id="alchemy"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[100dvh] bg-terracotta-dark text-white overflow-hidden select-none"
    >
      {/* Background Pinned Canvas Container */}
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />
        {/* Soft Warm Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-terracotta-dark/95 via-terracotta/40 to-terracotta-dark/80 z-10 pointer-events-none" />
      </div>

      {/* Main Interactive Stage & Telemetry Overlays */}
      <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-14 sm:py-20 md:py-24 flex flex-col justify-between">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-4 border-b border-peach/25 pb-3 sm:pb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-6xl text-white tracking-tight">
              How We Make <span className="italic text-peach">Our Ice Cream</span>
            </h2>
          </div>
        </div>

        {/* Dynamic Center Step Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8 items-center py-2 sm:py-4 md:py-6">
          {/* Step Narrative Column */}
          <div className="md:col-span-7 flex flex-col gap-3 sm:gap-5">
            <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl text-white drop-shadow leading-tight">
              {currentStepData.title}
            </h3>

            <p className="text-peach-light text-xs sm:text-sm md:text-base max-w-xl font-sans leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">
              {currentStepData.desc}
            </p>

            {/* Stepper Dots */}
            <div className="flex items-center gap-2 sm:gap-3 pt-1">
              {processSteps.map((step, idx) => (
                <div
                  key={step.step}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeStep
                      ? 'w-10 sm:w-14 bg-gradient-to-r from-peach to-tangerine shadow-glow-peach'
                      : idx < activeStep
                      ? 'w-3 sm:w-4 bg-peach/70'
                      : 'w-2 sm:w-2.5 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Real-time Quality Facts Card */}
          <div className="md:col-span-5">
            <div className="glass-panel-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-peach/40 shadow-2xl flex flex-col gap-3 sm:gap-6">
              <div className="flex items-center justify-between border-b border-peach/20 pb-2 sm:pb-4">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-peach font-bold">
                  Ingredient Facts
                </span>
                <span className="text-[10px] sm:text-[11px] text-peach-light/70 uppercase tracking-widest font-mono">
                  Natural Standard
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-terracotta/80 border border-peach/20 flex flex-col gap-0.5 sm:gap-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-peach-light/70">
                    <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tangerine" />
                    <span>Temperature</span>
                  </div>
                  <span className="font-mono text-base sm:text-lg md:text-xl font-bold text-peach">
                    {currentStepData.temp}
                  </span>
                </div>

                <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-terracotta/80 border border-peach/20 flex flex-col gap-0.5 sm:gap-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-peach-light/70">
                    <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-peach" />
                    <span>Real Fruit</span>
                  </div>
                  <span className="font-mono text-base sm:text-lg md:text-xl font-bold text-white">
                    68% Pure Fruit
                  </span>
                </div>

                <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-terracotta/80 border border-peach/20 flex flex-col gap-0.5 sm:gap-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-peach-light/70">
                    <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tangerine" />
                    <span>Texture</span>
                  </div>
                  <span className="font-mono text-base sm:text-lg md:text-xl font-bold text-peach">
                    Extra Creamy
                  </span>
                </div>

                <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-terracotta/80 border border-peach/20 flex flex-col gap-0.5 sm:gap-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-peach-light/70">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-peach" />
                    <span>Resting Time</span>
                  </div>
                  <span className="font-mono text-base sm:text-lg md:text-xl font-bold text-white">
                    48h Slow Blend
                  </span>
                </div>
              </div>

              <div className="hidden sm:block text-[11px] text-peach-light/75 font-sans tracking-wide">
                * Made with 100% natural ingredients. No artificial sweeteners, colors, or gums.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
