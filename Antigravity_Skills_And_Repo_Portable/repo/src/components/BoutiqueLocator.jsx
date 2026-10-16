import React, { useState, useEffect, useRef } from 'react';
import { useCms } from '../context/CmsContext';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BoutiqueLocator() {
  const { boutiques = [] } = useCms();
  const [selectedBoutique, setSelectedBoutique] = useState(() => boutiques[0] || null);
  const [cityTimes, setCityTimes] = useState({});
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!selectedBoutique && boutiques.length > 0) {
      setSelectedBoutique(boutiques[0]);
    }
  }, [boutiques, selectedBoutique]);

  useEffect(() => {
    const updateTimes = () => {
      const times = {};
      const timezones = {
        Paris: 'Europe/Paris',
        Tokyo: 'Asia/Tokyo',
        Milan: 'Europe/Rome',
        'New York': 'America/New_York',
      };

      boutiques.forEach((b) => {
        const tz = Object.hasOwn(timezones, b.city) ? timezones[b.city] : 'UTC';
        try {
          times[b.city] = new Intl.DateTimeFormat('en-US', {
            timeZone: typeof tz === 'string' ? tz : 'UTC',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).format(new Date());
        } catch {
          times[b.city] = '--:--:--';
        }
      });

      setCityTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [boutiques]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.boutique-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.boutique-grid',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [boutiques]);

  return (
    <section
      id="boutiques"
      ref={sectionRef}
      className="py-20 sm:py-28 bg-gradient-to-b from-peach-200 via-peach to-peach-300 text-terracotta relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-tangerine-700 font-bold mb-2 sm:mb-3">
              <Navigation className="w-3.5 h-3.5 text-tangerine-700" />
              <span>Visit Our Shops</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl text-terracotta tracking-tight">
              Our Ice Cream <span className="italic text-tangerine-600">Shops</span>
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm md:text-base text-terracotta/80 font-sans leading-relaxed font-medium">
            Come visit us and taste fresh scoops churned daily in our shops around the world.
          </p>
        </div>

        {/* Boutiques Grid */}
        <div className="boutique-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {boutiques.map((boutique) => {
            const isSelected = selectedBoutique?.city === boutique.city;

            return (
              <div
                key={boutique.city}
                onClick={() => setSelectedBoutique(boutique)}
                className={`boutique-card cursor-pointer rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border-2 card-hover-luxury transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-peach-light border-tangerine shadow-glow-tangerine scale-[1.02]'
                    : 'bg-peach-50/80 border-tangerine/20 hover:border-tangerine/50 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-widest text-tangerine-700 font-bold">
                      {boutique.district}
                    </span>
                    <span className="font-mono text-xs text-white bg-tangerine px-2.5 py-1 rounded-full font-bold shadow-sm">
                      {cityTimes[boutique.city] || '00:00:00'}
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl text-terracotta mb-2 font-semibold">
                    {boutique.city}
                  </h3>

                  <div className="flex items-start gap-2 text-xs text-terracotta/80 my-3 font-medium">
                    <MapPin className="w-4 h-4 text-tangerine shrink-0 mt-0.5" />
                    <span>{boutique.address}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-tangerine/20 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-tangerine-700 font-bold">
                    <Clock className="w-3.5 h-3.5 text-tangerine" />
                    <span>{boutique.status}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-terracotta/70 font-medium">
                    <Phone className="w-3.5 h-3.5 text-tangerine-600" />
                    <span>{boutique.phone}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
