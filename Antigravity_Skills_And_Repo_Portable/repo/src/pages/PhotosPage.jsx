import React, { useState } from 'react';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import EditorialMarquee from '../components/EditorialMarquee';

export default function PhotosPage() {
  const { galleryPhotos = [], pageContent } = useCms();
  const hero = pageContent?.photos || {};
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  const categories = ['All', 'Orchards', 'Craft', 'Moments', 'Boutiques'];

  const filteredPhotos = activeCategory === 'All'
    ? galleryPhotos
    : galleryPhotos.filter((p) => p.category === activeCategory);

  const openLightbox = (idx) => {
    setSelectedPhotoIndex(idx);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const nextPhoto = (e) => {
    e?.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev + 1) % filteredPhotos.length);
    }
  };

  const prevPhoto = (e) => {
    e?.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  const currentPhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

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
            <span>{hero.badge || 'Mediterranean Visual Journal'}</span>
          </div>

          <h1 className="font-serif font-bold text-4xl sm:text-6xl md:text-8xl tracking-tight text-terracotta leading-[0.95]">
            {hero.title || 'Our Story •'} <br />
            <span className="italic font-light text-tangerine">{hero.titleAccent || 'In Pictures.'}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-xl text-terracotta/80 font-sans leading-relaxed max-w-2xl">
            {hero.description || 'A visual chronicle from dawn in the Luberon peach groves and Valencian citrus groves to our slow copper churns and sunlit flagship boutiques.'}
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 sm:pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedPhotoIndex(null);
                }}
                className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-tangerine text-white shadow-glow-tangerine scale-105'
                    : 'bg-peach-200/60 text-terracotta/80 hover:bg-peach-200 hover:text-terracotta border border-tangerine/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photography Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(idx)}
              className="group relative flex flex-col rounded-3xl overflow-hidden border border-tangerine/20 bg-peach-100/70 shadow-sm card-hover-luxury hover:border-tangerine/50 cursor-pointer"
            >
              {/* Photo Display */}
              <div className="relative h-80 w-full overflow-hidden bg-peach-200/50">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-terracotta/80 via-terracotta/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

                {/* Top Badge: Category */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-terracotta backdrop-blur-md shadow-sm">
                    {photo.category}
                  </span>
                </div>

                {/* Top Right: Expand Icon */}
                <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-terracotta/60 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Bottom Overlay Title & Location */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-1 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-peach font-bold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-tangerine" />
                    <span>{photo.location}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold leading-tight">
                    {photo.title}
                  </h3>
                </div>
              </div>

              {/* Caption Under Photo */}
              <div className="p-5 flex flex-col justify-between flex-grow bg-peach-100/70">
                <p className="text-xs text-terracotta/80 font-sans leading-relaxed">
                  {photo.caption}
                </p>
                <div className="pt-3 mt-2 border-t border-tangerine/15 flex items-center justify-between text-[11px] font-bold text-tangerine-800 uppercase tracking-wider">
                  <span>Ciné Archive</span>
                  <span>View High-Res &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {currentPhoto && (
        <div
          data-lenis-prevent="true"
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-terracotta/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fadeIn"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={prevPhoto}
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={nextPhoto}
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Photo Content Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[85vh] sm:max-h-[90vh] flex flex-col bg-peach-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-peach/30 animate-fade-in-up"
          >
            <div className="relative flex-grow flex items-center justify-center bg-black/40 overflow-hidden min-h-[220px] max-h-[50vh] sm:max-h-[65vh]">
              <img
                src={currentPhoto.image}
                alt={currentPhoto.title}
                className="max-w-full max-h-[50vh] sm:max-h-[65vh] object-contain"
              />
            </div>

            <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-peach-100 to-peach-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 overflow-y-auto">
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-tangerine text-white text-[10px] font-bold uppercase tracking-wider">
                    {currentPhoto.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-terracotta/70 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-tangerine" />
                    {currentPhoto.location}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-terracotta">
                  {currentPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-terracotta/80 font-sans max-w-xl">
                  {currentPhoto.caption}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-terracotta/60 font-mono">
                  {selectedPhotoIndex + 1} / {filteredPhotos.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Luxury Motion Ribbon */}
      <div className="mt-20">
        <EditorialMarquee variant="peach" />
      </div>
    </div>
  );
}
