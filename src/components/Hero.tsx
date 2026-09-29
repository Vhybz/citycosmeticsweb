'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Droplets,
  Leaf,
  Shield,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { useWhatsAppOrder } from '@/lib/whatsappOrderContext';
import { PRODUCTS_DATA } from '@/lib/productsData';

interface Slide {
  image: string;
  title: string;
  tagline: string;
  productId: string;
}

const HERO_SLIDES: Slide[] = [
  {
    image: '/beautyImages/1.jpg',
    title: 'Lumière Hydra-Dew Serum',
    tagline: 'Living Radiance &bull; Triple-Molecular Hyaluronic Dew',
    productId: 'cc-01',
  },
  {
    image: '/beautyImages/ca.jpg',
    title: 'Clinical Dew Glow Oil',
    tagline: 'Instant Glass Skin &bull; Cold-Pressed Botanical Lipids',
    productId: 'cc-02',
  },
  {
    image: '/beautyImages/258826bc9ee800fab3177221c23668ef.jpg',
    title: 'Sunyani Atelier Daily Ritual',
    tagline: 'Small-Batch Formulations &bull; Compounded in Bono Region',
    productId: 'cc-08',
  },
  {
    image: '/beautyImages/3.jpg',
    title: '24H Barrier Defense Emulsion',
    tagline: 'Tropical Climate Resilience &bull; Zero Sticky Residue',
    productId: 'cc-03',
  },
  {
    image: '/beautyImages/ca20569827f857496b78c0666cb556c4.jpg',
    title: 'Intensive Moisture Flacon',
    tagline: 'Atelier Cobalt Flacon &bull; Multi-Molecular Hydration',
    productId: 'cc-01',
  },
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { openWhatsAppOrder } = useWhatsAppOrder();

  // Auto-advance slideshow every 6 seconds unless paused on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const activeSlideData = HERO_SLIDES[currentSlide];
  const spotlightProduct =
    PRODUCTS_DATA.find((p) => p.id === activeSlideData.productId) || PRODUCTS_DATA[0];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden min-h-[640px] lg:min-h-[720px] flex items-center bg-white dark:bg-[#0B1F3A]"
    >
      {/* ====================================================================
          1. BACKGROUND SLIDESHOW - 0.95 VISIBILITY
          ==================================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-[0.95] dark:opacity-[0.95]' : 'opacity-0'
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

        {/* Minimal atmospheric veil: lets 0.95 photography display with clarity */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 to-transparent dark:from-[#0B1F3A]/70 dark:via-[#0B1F3A]/25 dark:to-transparent pointer-events-none" />
      </div>

      {/* ====================================================================
          2. FOREGROUND CONTENT: TEXT, BUTTONS & FLOATING GLASS CONTROLS
          ==================================================================== */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions in Atelier Glass Panel */}
          <div className="lg:col-span-8 space-y-7 text-left bg-white/85 dark:bg-[#0B1F3A]/85 backdrop-blur-xl p-6 sm:p-10 border border-white/80 dark:border-white/10 shadow-2xl">
            {/* Location Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#0B1F3A] text-white text-[11px] font-mono uppercase tracking-[0.2em] rounded-none shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#93C5FD] animate-pulse" />
              <span>Formulated in Sunyani</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-normal text-[#0B1F3A] dark:text-white leading-[1.08] tracking-tight">
              Sensorial Botanicals for{' '}
              <span className="italic font-serif font-light text-[#174EA6] dark:text-[#93C5FD]">
                Luminous,
              </span>{' '}
              Resilient Skin.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-[#374151] dark:text-[#DCEBFA]/90 max-w-2xl font-normal leading-relaxed">
              Clinical-grade skincare formulated with potent West African botanical actives and
              multi-molecular hydration, designed specifically for tropical sun, warmth, and humidity.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/shop"
                className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-4 px-8 rounded-none inline-flex items-center justify-center gap-2 shadow-lg shadow-[#0B1F3A]/15 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <span>Explore Formulations</span>
                <ArrowRight className="w-4 h-4 text-[#DCEBFA] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/quiz"
                className="bg-white/80 hover:bg-white text-[#0B1F3A] border-2 border-[#0B1F3A] text-xs uppercase tracking-widest font-semibold py-4 px-8 rounded-none inline-flex items-center justify-center gap-2 backdrop-blur-md hover:border-[#174EA6] hover:text-[#174EA6] shadow-xs hover:shadow-md transition-all duration-300"
              >
                <span>Personalized Routine Quiz</span>
              </Link>
            </div>

            {/* Micro Highlights Cards */}
            <div className="pt-6 border-t border-[#E5E7EB]/80 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-white/80 dark:bg-[#0B1F3A]/70 backdrop-blur-md border border-[#E5E7EB] dark:border-white/10 p-3.5 rounded-none flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-none bg-[#F5F9FE] dark:bg-white/10 border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center text-[#174EA6] dark:text-[#93C5FD] shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#0B1F3A] dark:text-white">
                    72H Dew Lock
                  </h4>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#DCEBFA]/70">
                    Multi-Hyaluronic
                  </p>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-[#0B1F3A]/70 backdrop-blur-md border border-[#E5E7EB] dark:border-white/10 p-3.5 rounded-none flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-none bg-[#F5F9FE] dark:bg-white/10 border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center text-[#174EA6] dark:text-[#93C5FD] shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#0B1F3A] dark:text-white">
                    100% Cruelty Free
                  </h4>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#DCEBFA]/70">
                    PETA certified
                  </p>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-[#0B1F3A]/70 backdrop-blur-md border border-[#E5E7EB] dark:border-white/10 p-3.5 rounded-none flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-none bg-[#F5F9FE] dark:bg-white/10 border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center text-[#174EA6] dark:text-[#93C5FD] shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#0B1F3A] dark:text-white">
                    Clean Actives
                  </h4>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#DCEBFA]/70">
                    Zero toxic fillers
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Glass Spotlight Card & Slideshow Controls */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end space-y-4">
            {/* Glass Formulation Spotlight Badge */}
            <div className="w-full max-w-sm bg-white/90 dark:bg-[#0B1F3A]/90 backdrop-blur-xl border border-white/80 dark:border-white/20 p-5 rounded-none shadow-2xl shadow-[#0B1F3A]/10 space-y-4 animate-fadeIn">
              {/* Card Header with Live Slide Index */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#174EA6] dark:text-[#93C5FD]">
                    Visual Showcase
                  </span>
                </div>
                <span className="font-mono text-xs font-semibold text-[#0B1F3A] dark:text-white">
                  0{currentSlide + 1} / 0{HERO_SLIDES.length}
                </span>
              </div>

              {/* Active Slide Snapshot & Details */}
              <div className="flex gap-3.5 items-center">
                <div className="relative w-16 h-16 bg-[#0B1F3A] rounded-none overflow-hidden shrink-0 border border-[#E5E7EB] dark:border-white/10 shadow-inner">
                  <img
                    src={activeSlideData.image}
                    alt={activeSlideData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif-luxury text-sm font-semibold text-[#0B1F3A] dark:text-white truncate">
                    {activeSlideData.title}
                  </h4>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#DCEBFA]/75 truncate mt-0.5">
                    {activeSlideData.tagline.replace('&bull;', '•')}
                  </p>
                  <p className="text-xs font-mono font-bold text-[#174EA6] dark:text-[#93C5FD] mt-1">
                    {formatPrice(spotlightProduct.price)}
                  </p>
                </div>
              </div>

              {/* 1-Click WhatsApp Quick Order from Hero */}
              <button
                type="button"
                onClick={() => openWhatsAppOrder(spotlightProduct, undefined, 1)}
                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 px-4 rounded-none text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                title="Instant WhatsApp Order (GH₵ 20 Sunyani delivery fee)"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Order via WhatsApp &bull; GH₵ 20 Delivery</span>
              </button>

              {/* Slideshow Progress Bar & Navigation Controls */}
              <div className="pt-2 flex items-center justify-between border-t border-[#E5E7EB] dark:border-white/10 text-xs">
                {/* Visual Slide Thumbnails */}
                <div className="flex gap-1.5">
                  {HERO_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-1.5 transition-all duration-300 rounded-none ${
                        i === currentSlide
                          ? 'w-6 bg-[#0B1F3A] dark:bg-[#93C5FD]'
                          : 'w-2 bg-[#E5E7EB] dark:bg-white/20 hover:bg-[#174EA6]'
                      }`}
                      title={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-1.5 text-[#0B1F3A] dark:text-white hover:bg-[#F5F9FE] dark:hover:bg-white/10 border border-[#E5E7EB] dark:border-white/15 transition-colors"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-1.5 text-[#0B1F3A] dark:text-white hover:bg-[#F5F9FE] dark:hover:bg-white/10 border border-[#E5E7EB] dark:border-white/15 transition-colors"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Edge Navigation Arrows for Slideshow */}
      <button
        type="button"
        onClick={handlePrev}
        className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-white/90 dark:bg-[#0B1F3A]/90 hover:bg-[#0B1F3A] hover:text-white dark:hover:bg-[#174EA6] text-[#0B1F3A] dark:text-white border border-[#E5E7EB] dark:border-white/20 shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105"
        title="Previous formulation"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-white/90 dark:bg-[#0B1F3A]/90 hover:bg-[#0B1F3A] hover:text-white dark:hover:bg-[#174EA6] text-[#0B1F3A] dark:text-white border border-[#E5E7EB] dark:border-white/20 shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105"
        title="Next formulation"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
};
