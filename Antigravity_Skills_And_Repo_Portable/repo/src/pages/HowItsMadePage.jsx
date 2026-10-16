import React, { useState } from 'react';
import { Sparkles, Sun, Flame, Snowflake, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import EditorialMarquee from '../components/EditorialMarquee';

export default function HowItsMadePage({ onOpenFlavors }) {
  const { processSteps = [], pageContent } = useCms();
  const hero = pageContent?.howItsMade || {};
  const [selectedStep, setSelectedStep] = useState(0);
  const [comparisonDensity, setComparisonDensity] = useState(85); // 0 to 100

  const iconMap = {
    0: Sun,
    1: Flame,
    2: Snowflake,
    3: Sparkles,
  };

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
            <span>{hero.badge || 'Artisanal Atelier Process'}</span>
          </div>

          <h1 className="font-serif font-bold text-4xl sm:text-6xl md:text-8xl tracking-tight text-terracotta leading-[0.95]">
            {hero.title || 'Pure Craft •'} <br />
            <span className="italic font-light text-tangerine">{hero.titleAccent || "How It's Made."}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-xl text-terracotta/80 font-sans leading-relaxed max-w-2xl">
            {hero.description || 'From the dawn orchards of Provence to the chilled copper churners of our workshop atelier, explore the four slow stages that give Ciné its rich velvet density and bright fruit flavor.'}
          </p>
        </div>

        {/* Big Atelier Hero Feature Card with Generated Craft Image */}
        <div className="relative rounded-3xl overflow-hidden border border-tangerine/30 shadow-luxury mb-14 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 h-64 sm:h-96 lg:h-[500px] relative overflow-hidden">
              <img
                src="/assets/generated/artisanal_churn_craft.jpg"
                alt="Artisanal Ice Cream Churning"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-terracotta/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-10">
                <span className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/90 text-terracotta text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  Workshop Atelier &bull; Churned at -11°C
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-b from-peach-100 to-peach-200 p-6 sm:p-8 md:p-12 flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <span className="text-xs uppercase tracking-[0.2em] text-tangerine-700 font-bold">
                  The French-Mediterranean Standard
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-terracotta">
                  Slow-Churned In Solid Copper Vats
                </h2>
                <p className="text-sm text-terracotta/80 font-sans leading-relaxed">
                  Unlike modern automated industrial freezers that whip air into cheap dairy powders, our workshop churns in micro-batches of only 12 liters. Cold copper conducts temperature evenly, preserving the delicate aromatics of fresh fruit without crystallization.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-tangerine/20 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-terracotta/60 block">Overrun (Air Added)</span>
                    <span className="font-bold text-lg text-tangerine">&lt; 18%</span>
                    <span className="text-[10px] text-terracotta/70 block">Commercial is ~100%</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-terracotta/60 block">Resting Maturation</span>
                    <span className="font-bold text-lg text-terracotta">48 Hours</span>
                    <span className="text-[10px] text-terracotta/70 block">Cold cream infusion</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex items-center gap-2 text-xs text-tangerine-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-tangerine" />
                  <span>Zero preservatives, artificial gums, or flavor syrups.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Craft Process Stages Grid */}
        <div className="mb-24">
          <div className="flex flex-col gap-2 mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-tangerine-700 font-bold">
              Step-By-Step Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-terracotta">
              The Four Principles of Pure Flavor
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {processSteps.map((step, idx) => {
              const IconComponent = iconMap[idx] || Sparkles;
              const isCurrent = selectedStep === idx;

              return (
                <div
                  key={step.step}
                  onClick={() => setSelectedStep(idx)}
                  className={`p-8 rounded-3xl border card-hover-luxury cursor-pointer flex flex-col justify-between gap-6 ${
                    isCurrent
                      ? 'bg-gradient-to-br from-peach-100 to-peach-200/90 border-tangerine shadow-glow-peach scale-[1.02]'
                      : 'bg-peach-100/50 hover:bg-peach-100/80 border-tangerine/20 hover:border-tangerine/40'
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-3xl font-bold text-tangerine">
                        {step.step}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-peach-300/60 flex items-center justify-center text-tangerine">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-2xl font-bold text-terracotta">
                        {step.title}
                      </h3>
                      <span className="text-xs font-semibold text-tangerine-700 tracking-wider uppercase">
                        {step.tagline}
                      </span>
                    </div>

                    <p className="text-sm text-terracotta/85 font-sans leading-relaxed">
                      {step.desc}
                    </p>

                    <p className="text-xs text-terracotta/70 font-sans italic bg-peach-50/70 p-3 rounded-xl border border-peach/40">
                      "{step.detail}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-tangerine/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-terracotta">
                      <span className="w-2 h-2 rounded-full bg-tangerine" />
                      <span>{step.temp}</span>
                    </div>
                    <span className="font-bold text-tangerine-800 uppercase tracking-wider text-[11px]">
                      {step.metric}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Velvet Density Interactive Comparison */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-peach-200/70 via-peach-100 to-peach-200/50 border border-tangerine/30 shadow-sm mb-20">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
            <span className="text-xs uppercase tracking-[0.25em] text-tangerine-700 font-bold">
              Ingredient Density Comparison
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-terracotta">
              Why Real Fruit Makes Real Difference
            </h2>
            <p className="text-sm text-terracotta/80 font-sans leading-relaxed">
              Slide the density gauge to see the fundamental difference between Ciné's slow-churned pure fruit formulation and conventional mass-produced grocery store ice cream.
            </p>

            {/* Slider */}
            <div className="w-full max-w-md flex flex-col gap-2 pt-4">
              <input
                type="range"
                min="0"
                max="100"
                value={comparisonDensity}
                onChange={(e) => setComparisonDensity(Number(e.target.value))}
                className="w-full h-2 bg-peach-300 rounded-lg appearance-none cursor-pointer accent-tangerine"
              />
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-terracotta/70">
                <span>Mass Industrial (0%)</span>
                <span>Ciné Haute Glace (100%)</span>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left pt-6">
              {/* Ciné Standard */}
              <div className="p-6 rounded-2xl bg-white/80 border-2 border-tangerine shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-xl text-terracotta">Ciné Pure Glace</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-tangerine text-white text-[10px] font-bold uppercase">
                    Our Standard
                  </span>
                </div>
                <ul className="text-xs space-y-2 text-terracotta/90 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tangerine" />
                    <span><strong>68% Real Fruit</strong> (Fresh peaches & tangerines)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tangerine" />
                    <span><strong>18% Low Overrun</strong> (Dense, slow melting)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tangerine" />
                    <span><strong>Organic Farm Milk</strong> from grass-fed cows</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tangerine" />
                    <span><strong>0% Artificial</strong> syrups, gums, or colors</span>
                  </li>
                </ul>
              </div>

              {/* Mass Market Ice Cream */}
              <div className="p-6 rounded-2xl bg-peach-200/40 border border-terracotta/15 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-xl text-terracotta/70">Commercial Grocery</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-terracotta/20 text-terracotta/70 text-[10px] font-bold uppercase">
                    Industry Average
                  </span>
                </div>
                <ul className="text-xs space-y-2 text-terracotta/70">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta/40" />
                    <span>4% – 8% fruit syrup concentrate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta/40" />
                    <span>Up to 110% air injected into pints</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta/40" />
                    <span>Reconstituted dried milk solids</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta/40" />
                    <span>Polysorbate, guar gum, chemical dyes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA to Flavors */}
        <div className="text-center">
          <button
            onClick={onOpenFlavors}
            className="px-8 py-4 rounded-full bg-tangerine hover:bg-tangerine-deep text-white font-bold text-xs uppercase tracking-widest shadow-glow-tangerine hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3"
          >
            <span>Explore All Our Flavors</span>
            <ArrowRight className="w-4 h-4" />
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
