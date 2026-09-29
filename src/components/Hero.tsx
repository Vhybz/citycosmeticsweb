'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Droplets,
  Shield,
  Eye,
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
      'A potent golden restorative nectar designed to defend against environmental pollutants and boost cellular turnover with zero greasy residue.',
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

  // Auto-advance slideshow every 7 seconds unless paused on hover
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
      className="relative overflow-hidden min-h-[680px] lg:min-h-[780px] flex items-center bg-[#FAF9F5] dark:bg-[#071324] border-b border-[#E5E7EB] dark:border-white/10"
      aria-label="City Cosmetics Luminous Showcase"
    >
      {/* ====================================================================
          1. FULL-SCREEN BRIGHT PHOTOGRAPHIC SLIDESHOW (100% VISIBLE & VIVID)
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

        {/* Minimal atmospheric veil: maintains sun-kissed brightness while giving card pop */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* ====================================================================
          2. FLOATING FROSTED GLASS ATELIER CARD (LA MER & ESTÉE LAUDER STYLE)
          ==================================================================== */}
      <div className="relative z-10 max-w-[1560px] w-full mx-auto px-4 sm:px-8 lg:px-14 py-16 sm:py-20 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* The Floating Frosted Glass Card */}
          <div className="lg:col-span-8 xl:col-span-7 bg-white/90 dark:bg-[#0B1F3A]/90 backdrop-blur-2xl p-7 sm:p-10 lg:p-12 border border-white/80 dark:border-white/20 shadow-2xl shadow-black/15 space-y-6">
            
            {/* Header: Origin & Slide Counter */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B1F3A] text-white text-[11px] font-mono uppercase tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#93C5FD] animate-pulse" />
                <span>Formulated in Sunyani</span>
              </div>
              <span className="font-mono text-[11px] tracking-widest text-[#174EA6] dark:text-[#93C5FD] uppercase font-semibold">
                {activeSlide.batchNo} &bull; 0{currentSlide + 1} / 0{HERO_SLIDES.length}
              </span>
            </div>

            {/* Title & Category */}
            <div className="space-y-2.5">
              <p className="text-[11px] uppercase font-mono tracking-[0.25em] font-semibold text-[#174EA6] dark:text-[#93C5FD]">
                {activeSlide.category}
              </p>
              <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-normal text-[#0B1F3A] dark:text-white leading-[1.08] tracking-tight">
                {activeSlide.title}
              </h1>
              <p className="italic font-serif font-light text-base sm:text-xl text-[#4B5563] dark:text-[#DCEBFA]/90">
                {activeSlide.subtitle}
              </p>
            </div>

            {/* Editorial Description */}
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#DCEBFA]/80 leading-relaxed max-w-xl">
              {activeSlide.description}
            </p>

            {/* Key Botanical Actives Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {activeSlide.keyActives.map((active, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono bg-[#F5F9FE] dark:bg-white/10 border border-[#E5E7EB] dark:border-white/15 text-[#0B1F3A] dark:text-white shadow-2xs"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#174EA6] dark:text-[#93C5FD]" />
                  <span>{active}</span>
                </span>
              ))}
            </div>

            {/* Pricing & Direct Commerce CTAs */}
            <div className="pt-4 border-t border-[#E5E7EB] dark:border-white/15 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-[#0B1F3A] dark:text-white">
                  {formatPrice(activeProduct.price)}
                </span>
                {activeProduct.compareAtPrice && (
                  <span className="text-sm sm:text-base font-mono line-through text-[#9CA3AF]">
                    {formatPrice(activeProduct.compareAtPrice)}
                  </span>
                )}
                <span className="text-xs font-mono text-[#6B7280] dark:text-[#DCEBFA]/70">
                  &bull; Flat GH₵ 20 Delivery in Sunyani
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* 1-Click WhatsApp Quick Order */}
                <button
                  type="button"
                  onClick={() => openWhatsAppOrder(activeProduct, undefined, 1)}
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 px-6 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                  title="Order formulation instantly via WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Order via WhatsApp &bull; GH₵ 20 Delivery</span>
                </button>

                {/* Add to Bag */}
                <button
                  type="button"
                  onClick={handleAddDirectToBag}
                  className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white py-3.5 px-6 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                  title="Add formulation to bag"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                {/* Details Link */}
                <Link
                  href={`/product/${activeProduct.slug}`}
                  className="border border-[#0B1F3A] dark:border-white/30 text-[#0B1F3A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 py-3.5 px-5 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Quick Formulation Selector Tabs */}
            <div className="pt-2 flex flex-wrap gap-1.5 border-t border-[#E5E7EB] dark:border-white/10">
              {HERO_SLIDES.map((slide, idx) => {
                const isCurrent = idx === currentSlide;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`py-1.5 px-2.5 text-[11px] font-mono transition-all border ${
                      isCurrent
                        ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white dark:border-[#93C5FD] dark:bg-[#93C5FD] dark:text-[#0B1F3A] font-semibold'
                        : 'border-[#E5E7EB] dark:border-white/15 bg-white/70 dark:bg-white/5 text-[#4B5563] dark:text-[#DCEBFA]/75 hover:border-[#174EA6]'
                    }`}
                  >
                    <span>{slide.id}</span> &bull;{' '}
                    <span>{slide.title.replace('Lumière ', '').replace('Sunyani ', '')}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Floating Quick Controls & Badge */}
          <div className="lg:col-span-4 xl:col-span-5 flex flex-col items-end justify-between space-y-6">
            
            {/* Top Right Atelier Seal */}
            <div className="bg-white/90 dark:bg-[#0B1F3A]/90 backdrop-blur-xl px-4 py-2 border border-white/80 dark:border-white/20 shadow-xl hidden sm:flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#174EA6] dark:text-[#93C5FD]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-[#0B1F3A] dark:text-white">
                Sunyani Botanical Atelier
              </span>
            </div>

            {/* Bottom Right Floating Slide Navigation HUD */}
            <div className="bg-white/95 dark:bg-[#0B1F3A]/95 backdrop-blur-xl p-3 border border-white/80 dark:border-white/20 shadow-2xl flex items-center gap-3">
              <div className="font-mono text-xs font-semibold text-[#0B1F3A] dark:text-white px-2">
                0{currentSlide + 1} / 0{HERO_SLIDES.length}
              </div>

              <div className="h-4 w-px bg-[#E5E7EB] dark:border-white/20" />

              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 flex items-center justify-center text-[#0B1F3A] dark:text-white hover:bg-[#0B1F3A] hover:text-white dark:hover:bg-[#174EA6] border border-[#E5E7EB] dark:border-white/20 transition-colors"
                title="Previous Slide"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 flex items-center justify-center text-[#0B1F3A] dark:text-white hover:bg-[#0B1F3A] hover:text-white dark:hover:bg-[#174EA6] border border-[#E5E7EB] dark:border-white/20 transition-colors"
                title="Next Slide"
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
