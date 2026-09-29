'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useWhatsAppOrder } from '@/lib/whatsappOrderContext';
import { PRODUCTS_DATA } from '@/lib/productsData';

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  productId: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: '01',
    image: '/beautyImages/ca20569827f857496b78c0666cb556c4.jpg',
    title: 'Lumière Hydra-Dew Serum',
    subtitle: 'Triple-molecular hydration compounded with Sunyani shea peptides.',
    productId: 'cc-01',
  },
  {
    id: '02',
    image: '/beautyImages/1.jpg',
    title: 'Cellular Renewal Elixir',
    subtitle: 'Baobab stem cells and golden marula for resilient barrier defense.',
    productId: 'cc-02',
  },
  {
    id: '03',
    image: '/beautyImages/3.jpg',
    title: 'Luminous Glow Infusion',
    subtitle: 'Vitamin C 20% ester and cold-pressed Sunyani papaya actives.',
    productId: 'cc-03',
  },
  {
    id: '04',
    image: '/beautyImages/ca.jpg',
    title: 'Atelier Velvet Night Balm',
    subtitle: 'Restorative wild moringa lipids and botanical squalane.',
    productId: 'cc-04',
  },
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { openWhatsAppOrder } = useWhatsAppOrder();

  // Clean 3-second auto-advance, paused on hover
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
      className="relative overflow-hidden min-h-[720px] lg:min-h-[820px] flex items-center bg-[#071324] text-white"
      aria-label="City Cosmetics Hero"
    >
      {/* ====================================================================
          1. FULL-BLEED PHOTOGRAPHIC SLIDESHOW (NATURAL & UNCLUTTERED)
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
                className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Quiet, natural studio vignette:
            Subtle left-to-right fade so typography is effortlessly legible while imagery remains organic */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071324]/90 via-[#071324]/60 via-45% to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071324]/80 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* ====================================================================
          2. RESTRAINED EDITORIAL CONTENT (BYREDO / DIOR STYLE)
          ==================================================================== */}
      <div className="relative z-10 max-w-[1560px] w-full mx-auto px-6 sm:px-10 lg:px-16 pt-32 sm:pt-40 lg:pt-44 pb-24 sm:pb-28">
        <div className="max-w-2xl space-y-6 sm:space-y-8">
          
          {/* Quiet Origin Label (No neon pulse, no badge borders) */}
          <div className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#93C5FD]">
            Sunyani &bull; Botanical Clinicals
          </div>

          {/* Striking Editorial Headline */}
          <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-normal text-white leading-[1.06] tracking-tight">
            Sensorial Botanicals for Luminous Skin.
          </h1>

          {/* Understated Editorial Subtext */}
          <p className="text-base sm:text-lg text-[#DCEBFA]/85 leading-relaxed max-w-xl font-normal">
            Clinical-grade skincare compounded with potent West African botanical actives and multi-molecular hydration for radiant resilience.
          </p>

          {/* Active Formulation Spotlight Line */}
          <div className="pt-1 text-xs font-mono text-[#93C5FD] tracking-wider">
            Current Showcase: <span className="text-white font-medium">{activeSlide.title}</span> &bull; {activeSlide.subtitle}
          </div>

          {/* Two Clean, Intentional Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Primary Action: Explore Formulations */}
            <Link
              href="/shop"
              className="bg-white hover:bg-[#DCEBFA] text-[#071324] py-4 px-8 text-xs uppercase tracking-widest font-semibold inline-flex items-center justify-center gap-2.5 transition-colors shadow-lg"
            >
              <span>Explore Formulations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Secondary Action: Order via WhatsApp */}
            <button
              type="button"
              onClick={() => openWhatsAppOrder(activeProduct, undefined, 1)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md py-4 px-7 text-xs uppercase tracking-widest font-semibold inline-flex items-center justify-center gap-2.5 transition-colors"
              title="Instant WhatsApp Order (GH₵ 20 Delivery in Sunyani)"
            >
              <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
              <span>Order via WhatsApp &bull; GH₵ 20 Delivery</span>
            </button>
          </div>

        </div>
      </div>

      {/* ====================================================================
          3. MINIMALIST SLIDER LINE & PROGRESS (BYREDO STYLE)
          ==================================================================== */}
      <div className="absolute bottom-8 left-0 right-0 z-20 max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between gap-6">
        
        {/* Left: Active formulation number & title */}
        <div className="font-mono text-xs tracking-wider text-[#DCEBFA]/80 flex items-center gap-3">
          <span className="text-[#93C5FD] font-semibold">{activeSlide.id}</span>
          <span className="text-white/40">/</span>
          <span className="text-white/40">0{HERO_SLIDES.length}</span>
          <span className="hidden sm:inline text-white/30">&mdash;</span>
          <span className="hidden sm:inline font-sans text-xs text-white/90 font-medium">
            {activeSlide.title}
          </span>
        </div>

        {/* Right: Slim progress track & tactile arrows */}
        <div className="flex items-center gap-4">
          {/* Progress Dots / Bars */}
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
                  title={`Go to formulation ${slide.id}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Minimalist Prev/Next Controls */}
          <div className="flex items-center gap-1 pl-2">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              title="Previous slide"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              title="Next slide"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
