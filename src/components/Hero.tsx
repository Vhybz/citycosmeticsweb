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
  ShoppingBag,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { useWhatsAppOrder } from '@/lib/whatsappOrderContext';
import { useCart } from '@/lib/cartContext';
import { PRODUCTS_DATA } from '@/lib/productsData';

interface Slide {
  id: string;
  image: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  keyActives: string[];
  batchNo: string;
  productId: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: '01',
    image: '/beautyImages/ca20569827f857496b78c0666cb556c4.jpg',
    category: 'DEEP MOISTURE • BIO-CELLULAR',
    title: 'Lumière Hydra-Dew Serum',
    subtitle: 'Triple-Hyaluronic & Niacinamide Plumping Elixir',
    description:
      'Formulated in Sunyani with multi-molecular weight hyaluronic acid and botanical shea peptides for 72-hour weightless dew lock in tropical warmth.',
    keyActives: ['Triple-Hyaluronic 3%', 'Shea Peptide Matrix', 'Niacinamide 5%'],
    batchNo: 'BATCH SY-01',
    productId: 'cc-01',
  },
  {
    id: '02',
    image: '/beautyImages/1.jpg',
    category: 'BARRIER DEFENSE • CELLULAR REPAIR',
    title: 'Cellular Renewal Elixir',
    subtitle: 'Botanical Stem Cells & Golden Marula Barrier',
    description:
      'A potent restorative nectar designed to defend against environmental pollutants and boost cellular turnover with zero greasy residue.',
    keyActives: ['Baobab Stem Cells', 'Golden Marula Oil', 'CoQ10 Infusion'],
    batchNo: 'BATCH SY-02',
    productId: 'cc-02',
  },
  {
    id: '03',
    image: '/beautyImages/3.jpg',
    category: 'ILLUMINATING COMPLEXION • VITAMIN C',
    title: 'Luminous Glow Infusion',
    subtitle: '20% Vitamin C Ester & Sunyani Papaya Enzymes',
    description:
      'Clinical-potency brightening concentrate that evens skin tone, reduces hyperpigmentation, and imparts a resilient glass-skin glow.',
    keyActives: ['Vitamin C Ester 20%', 'Papaya Enzyme Ferment', 'Licorice Root'],
    batchNo: 'BATCH SY-03',
    productId: 'cc-03',
  },
  {
    id: '04',
    image: '/beautyImages/ca.jpg',
    category: 'INTENSIVE RESTORATIVE LIPIDS',
    title: 'Atelier Velvet Night Balm',
    subtitle: 'Wild Moringa & Botanical Squalane Restorative',
    description:
      'Overnight cellular recuperation balm that replenishes vital lipids and reinforces the epidermal moisture barrier while you sleep.',
    keyActives: ['Wild Moringa Lipids', 'Botanical Squalane', 'Ceramide NP'],
    batchNo: 'BATCH SY-04',
    productId: 'cc-04',
  },
  {
    id: '05',
    image: '/beautyImages/258826bc9ee800fab3177221c23668ef.jpg',
    category: 'ESSENTIAL DAILY RITUAL',
    title: 'Sunyani Daily Ritual Set',
    subtitle: 'Comprehensive 4-Step Clinical Discovery Wardrobe',
    description:
      'The definitive botanical regimen compounding gentle cleansing, deep hydration, antioxidant barrier defense, and restorative sun care.',
    keyActives: ['Full Discovery Ritual', 'Bono Botanical Extracts', 'Travel Atelier Box'],
    batchNo: 'BATCH SY-08',
    productId: 'cc-08',
  },
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { openWhatsAppOrder } = useWhatsAppOrder();
  const { addToCart, setIsCartOpen } = useCart();

  // Auto-advance slideshow every 7 seconds unless paused on user hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
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

  const handleAddDirectToBag = () => {
    addToCart(activeProduct, 1);
    setIsCartOpen(true);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative bg-[#FAF9F5] dark:bg-[#071324] border-b border-[#E5E7EB] dark:border-white/10 transition-colors"
      aria-label="City Cosmetics Atelier Showcase"
    >
      <div className="max-w-[1560px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[660px] lg:min-h-[740px]">
          
          {/* ====================================================================
              LEFT COLUMN: EDITORIAL ATELIER STORY & DIRECT ACTION
              (Augustinus Bader & Aesop Architectural Layout)
              ==================================================================== */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 border-b lg:border-b-0 lg:border-r border-[#E5E7EB] dark:border-white/10 z-10 bg-[#FAF9F5] dark:bg-[#071324]">
            
            {/* 1. Header Metadata & Location */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B1F3A] text-white text-[11px] font-mono uppercase tracking-[0.2em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#93C5FD] animate-pulse" />
                  <span>Formulated in Sunyani</span>
                </div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#6B7280] dark:text-[#DCEBFA]/70">
                  {activeSlide.batchNo} &bull; 0{currentSlide + 1} / 0{HERO_SLIDES.length}
                </div>
              </div>

              {/* 2. Slide Category & Title */}
              <div className="space-y-3 pt-2">
                <p className="text-[11px] uppercase font-mono tracking-[0.25em] font-semibold text-[#174EA6] dark:text-[#93C5FD]">
                  {activeSlide.category}
                </p>
                <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0B1F3A] dark:text-white leading-[1.12] tracking-tight transition-all duration-300">
                  {activeSlide.title}
                </h1>
                <p className="italic font-serif font-light text-base sm:text-lg text-[#4B5563] dark:text-[#DCEBFA]/85">
                  {activeSlide.subtitle}
                </p>
              </div>

              {/* 3. Editorial Description */}
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#DCEBFA]/80 leading-relaxed max-w-xl">
                {activeSlide.description}
              </p>

              {/* 4. Key Botanical Actives Tags */}
              <div className="pt-1 flex flex-wrap gap-2">
                {activeSlide.keyActives.map((active, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono bg-white dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[#0B1F3A] dark:text-[#DCEBFA] shadow-2xs"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#174EA6] dark:text-[#93C5FD]" />
                    <span>{active}</span>
                  </span>
                ))}
              </div>

              {/* 5. Pricing & Primary CTAs */}
              <div className="pt-4 space-y-3.5 border-t border-[#E5E7EB] dark:border-white/10">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-mono font-bold text-[#0B1F3A] dark:text-white">
                    {formatPrice(activeProduct.price)}
                  </span>
                  {activeProduct.compareAtPrice && (
                    <span className="text-sm font-mono line-through text-[#9CA3AF]">
                      {formatPrice(activeProduct.compareAtPrice)}
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-[#6B7280] dark:text-[#DCEBFA]/70">
                    &bull; Flat GH₵ 20 Delivery in Sunyani
                  </span>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* WhatsApp Direct Quick Order */}
                  <button
                    type="button"
                    onClick={() => openWhatsAppOrder(activeProduct, undefined, 1)}
                    className="bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 px-6 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
                    title="Order via WhatsApp with GH₵ 20 Delivery"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Order via WhatsApp</span>
                  </button>

                  {/* Add to Bag */}
                  <button
                    type="button"
                    onClick={handleAddDirectToBag}
                    className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white py-3.5 px-6 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
                    title="Add formulation to bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  {/* View Details Link */}
                  <Link
                    href={`/product/${activeProduct.slug}`}
                    className="border border-[#0B1F3A] dark:border-white/20 text-[#0B1F3A] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 py-3.5 px-5 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 6. Interactive Formulation Tabs (Bottom of Left Column) */}
            <div className="pt-8 mt-6 border-t border-[#E5E7EB] dark:border-white/10">
              <div className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#6B7280] dark:text-[#DCEBFA]/60 mb-3">
                Select Botanical Formulation:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {HERO_SLIDES.map((slide, idx) => {
                  const isCurrent = idx === currentSlide;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`text-left p-2.5 transition-all duration-200 border ${
                        isCurrent
                          ? 'border-[#0B1F3A] dark:border-[#93C5FD] bg-[#0B1F3A] text-white dark:bg-[#93C5FD] dark:text-[#0B1F3A] shadow-xs'
                          : 'border-[#E5E7EB] dark:border-white/10 bg-white/60 dark:bg-white/5 text-[#4B5563] dark:text-[#DCEBFA]/75 hover:border-[#174EA6]'
                      }`}
                    >
                      <div className="font-mono text-[10px] opacity-75">{slide.id}</div>
                      <div className="font-sans text-[11px] font-semibold truncate leading-tight mt-0.5">
                        {slide.title.replace('Lumière ', '').replace('Sunyani ', '')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ====================================================================
              RIGHT COLUMN: PRISTINE HIGH-RESOLUTION PHOTOGRAPHIC SHOWCASE
              (100% visible, uncompromised product visual stage)
              ==================================================================== */}
          <div className="lg:col-span-6 xl:col-span-7 relative overflow-hidden bg-[#F3F4F6] dark:bg-black/60 min-h-[480px] sm:min-h-[580px] lg:min-h-full flex items-center justify-center p-6 sm:p-10 lg:p-12">
            
            {/* Slideshow Image Canvas (100% visible, no heavy fog) */}
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

              {/* Ultra-subtle luxury corner vignette to elevate floating HUD badges */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
            </div>

            {/* Top-Right Floating Atelier Seal */}
            <div className="absolute top-6 right-6 z-10 bg-white/90 dark:bg-[#0B1F3A]/90 backdrop-blur-md px-3.5 py-1.5 border border-white/80 dark:border-white/10 shadow-lg hidden sm:flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#174EA6] dark:text-[#93C5FD]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#0B1F3A] dark:text-white font-semibold">
                Pure Botanicals &bull; Sunyani Atelier
              </span>
            </div>

            {/* Bottom-Left Floating Formulation Summary Card */}
            <div className="absolute bottom-6 left-6 z-10 bg-white/95 dark:bg-[#0B1F3A]/95 backdrop-blur-md p-3.5 border border-white/80 dark:border-white/10 shadow-xl max-w-xs hidden sm:block animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-100 dark:bg-black/50 overflow-hidden shrink-0 border border-[#E5E7EB] dark:border-white/10">
                  <img
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-serif-luxury text-xs font-semibold text-[#0B1F3A] dark:text-white truncate">
                    {activeSlide.title}
                  </div>
                  <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>In Stock &bull; Sunyani Dispatch</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-Right Slideshow Navigation Controls */}
            <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2 bg-white/95 dark:bg-[#0B1F3A]/95 backdrop-blur-md p-2 border border-white/80 dark:border-white/10 shadow-xl">
              <div className="px-2 font-mono text-xs font-semibold text-[#0B1F3A] dark:text-white">
                0{currentSlide + 1} / 0{HERO_SLIDES.length}
              </div>

              <div className="h-4 w-px bg-[#E5E7EB] dark:border-white/20" />

              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 flex items-center justify-center text-[#0B1F3A] dark:text-white hover:bg-[#0B1F3A] hover:text-white dark:hover:bg-[#174EA6] transition-colors"
                title="Previous Formulation"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 flex items-center justify-center text-[#0B1F3A] dark:text-white hover:bg-[#0B1F3A] hover:text-white dark:hover:bg-[#174EA6] transition-colors"
                title="Next Formulation"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
