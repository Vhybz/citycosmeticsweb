'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useWhatsAppOrder } from '@/lib/whatsappOrderContext';
import { PRODUCTS_DATA } from '@/lib/productsData';

interface Slide {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  productId: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: '01',
    category: 'DEEP HYDRATION',
    title: 'Lumière Hydra-Dew Serum',
    description:
      'Triple-molecular weight hydration compounded with botanical shea peptides for 72-hour moisture in tropical warmth.',
    image: '/beautyImages/ca20569827f857496b78c0666cb556c4.jpg',
    productId: 'cc-01',
  },
  {
    id: '02',
    category: 'BARRIER DEFENSE',
    title: 'Cellular Renewal Elixir',
    description:
      'Baobab stem cells and golden marula lipids to strengthen the skin barrier against environmental stressors.',
    image: '/beautyImages/1.jpg',
    productId: 'cc-02',
  },
  {
    id: '03',
    category: 'VITAMIN C ILLUMINATOR',
    title: 'Luminous Glow Infusion',
    description:
      'Twenty percent Vitamin C ester and cold-pressed papaya bio-enzymes to visibly clarify and even tone.',
    image: '/beautyImages/3.jpg',
    productId: 'cc-03',
  },
  {
    id: '04',
    category: 'NOCTURNAL RECOVERY',
    title: 'Atelier Velvet Night Balm',
    description:
      'Rich wild moringa lipids and plant squalane to replenish essential moisture while you sleep.',
    image: '/beautyImages/ca.jpg',
    productId: 'cc-04',
  },
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { openWhatsAppOrder } = useWhatsAppOrder();

  // Auto-advance every 3 seconds, pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const activeSlide = HERO_SLIDES[currentSlide];
  const activeProduct =
    PRODUCTS_DATA.find((p) => p.id === activeSlide.productId) || PRODUCTS_DATA[0];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden min-h-[700px] lg:min-h-[800px] flex items-center bg-[#071324] text-white"
      aria-label="City Cosmetics Formulation Showcase"
    >
      {/* ====================================================================
          1. FULL-BLEED PHOTOGRAPHIC SLIDESHOW
          ==================================================================== */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover object-center transition-transform duration-5000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Soft lateral vignette for natural text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071324]/90 via-[#071324]/60 via-45% to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071324]/80 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* ====================================================================
          2. EDITORIAL HERO STAGE (ZERO REDUNDANCY)
          ==================================================================== */}
      <div className="relative z-10 max-w-[1560px] w-full mx-auto px-6 sm:px-10 lg:px-16 pt-32 sm:pt-40 lg:pt-44 pb-24 sm:pb-28">
        <div className="max-w-2xl space-y-5 sm:space-y-6">
          
          {/* Formulation Category */}
          <div className="text-[11px] font-mono uppercase tracking-[0.3em] font-semibold text-[#93C5FD]">
            {activeSlide.category}
          </div>

          {/* Active Formulation Title */}
          <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-normal text-white leading-[1.06] tracking-tight">
            {activeSlide.title}
          </h1>

          {/* Distinct Formulation Story */}
          <p className="text-base sm:text-lg text-[#DCEBFA]/85 leading-relaxed max-w-xl font-normal">
            {activeSlide.description}
          </p>

          {/* Clean Dual CTAs */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Link
              href="/shop"
              className="bg-white hover:bg-[#DCEBFA] text-[#071324] py-4 px-8 text-xs uppercase tracking-widest font-semibold inline-flex items-center justify-center gap-2.5 transition-colors shadow-lg"
            >
              <span>Explore Formulations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => openWhatsAppOrder(activeProduct, undefined, 1)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md py-4 px-7 text-xs uppercase tracking-widest font-semibold inline-flex items-center justify-center gap-2.5 transition-colors"
              title="Order this formulation directly via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
              <span>Order via WhatsApp</span>
            </button>
          </div>

        </div>
      </div>

      {/* ====================================================================
          3. MINIMAL SLIDER PROGRESS TRACK
          ==================================================================== */}
      <div className="absolute bottom-8 left-0 right-0 z-20 max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between gap-6">
        
        {/* Simple Slide Counter */}
        <div className="font-mono text-xs tracking-widest text-[#DCEBFA]/75">
          <span className="text-white font-semibold">{activeSlide.id}</span>
          <span className="mx-2 text-white/30">/</span>
          <span className="text-white/40">0{HERO_SLIDES.length}</span>
        </div>

        {/* Progress Track & Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((slide, idx) => {
              const isCurrent = idx === currentSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-0.5 transition-all duration-300 ${
                    isCurrent ? 'w-8 bg-white' : 'w-3 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Jump to formulation ${slide.id}`}
                  title={slide.title}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-1 pl-2">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              aria-label="Previous Slide"
              title="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              aria-label="Next Slide"
              title="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
