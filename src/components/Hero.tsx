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
  Play,
  Pause,
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
  skinType: string;
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
    skinType: 'All Skin Types • Tropical Tested',
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
    skinType: 'Resilient Barrier • Sensitive Safe',
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
    skinType: 'Dullness & Tone Correction',
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
    skinType: 'Overnight Barrier Renewal',
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
    skinType: 'Complete 4-Step Regimen',
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
      className="relative overflow-hidden min-h-[680px] lg:min-h-[780px] flex items-center bg-[#071324] text-white select-none"
      aria-label="City Cosmetics Full-Bleed Cinematic Showcase"
    >
      {/* ====================================================================
          1. FULL-BLEED CINEMATIC PHOTOGRAPHIC BACKGROUND (100% VISIBLE)
          ==================================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
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

        {/* Chanel / Tom Ford Signature Scrim:
            Protects the left-hand editorial typography while keeping the center and right photography vivid */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071324]/95 via-[#071324]/80 via-45% to-[#071324]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071324] via-transparent to-[#071324]/60" />
      </div>

      {/* ====================================================================
          2. EDITORIAL HERO STAGE CONTENT (CHANEL & TOM FORD LUXURY)
          ==================================================================== */}
      <div className="relative z-10 max-w-[1560px] w-full mx-auto px-4 sm:px-8 lg:px-14 py-20 sm:py-24 lg:py-28 flex flex-col justify-between min-h-[640px] lg:min-h-[720px]">
        
        {/* Main Grid: Left Storytelling & Right Floating Atelier Pill */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 pb-16">
          
          {/* Left Column: Editorial Typography & Actions */}
          <div className="lg:col-span-8 space-y-6 max-w-3xl">
            
            {/* Atelier Sunyani Origin Pill & Live Slide Counter */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 text-white backdrop-blur-md border border-white/20 text-[11px] font-mono uppercase tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#93C5FD] animate-pulse" />
                <span>Formulated in Sunyani</span>
              </div>
              <span className="font-mono text-[11px] tracking-widest text-[#93C5FD] uppercase">
                {activeSlide.batchNo} &bull; 0{currentSlide + 1} / 0{HERO_SLIDES.length}
              </span>
            </div>

            {/* Category Kicker */}
            <div className="text-xs uppercase font-mono tracking-[0.28em] font-semibold text-[#93C5FD]">
              {activeSlide.category}
            </div>

            {/* Headline */}
            <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-normal text-white leading-[1.06] tracking-tight">
              {activeSlide.title}
            </h1>

            {/* Subtitle with High-Fashion Italic Accent */}
            <p className="italic font-serif font-light text-lg sm:text-2xl text-[#DCEBFA]/90">
              {activeSlide.subtitle}
            </p>

            {/* Formulation Description */}
            <p className="text-sm sm:text-base text-[#DCEBFA]/80 leading-relaxed max-w-2xl font-normal">
              {activeSlide.description}
            </p>

            {/* Key Botanical Actives Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {activeSlide.keyActives.map((active, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-2xs"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#93C5FD]" />
                  <span>{active}</span>
                </span>
              ))}
            </div>

            {/* Pricing & Direct Commerce CTAs */}
            <div className="pt-4 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-mono font-bold text-white tracking-tight">
                  {formatPrice(activeProduct.price)}
                </span>
                {activeProduct.compareAtPrice && (
                  <span className="text-base font-mono line-through text-[#9CA3AF]">
                    {formatPrice(activeProduct.compareAtPrice)}
                  </span>
                )}
                <span className="text-xs font-mono text-[#93C5FD]">
                  &bull; Flat GH₵ 20 Delivery in Sunyani
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                {/* 1-Click WhatsApp Quick Order */}
                <button
                  type="button"
                  onClick={() => openWhatsAppOrder(activeProduct, undefined, 1)}
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white py-4 px-8 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-xl shadow-black/20 hover:scale-[1.02] transition-all duration-200"
                  title="Order formulation instantly via WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Order via WhatsApp &bull; GH₵ 20 Delivery</span>
                </button>

                {/* Add to Bag */}
                <button
                  type="button"
                  onClick={handleAddDirectToBag}
                  className="bg-white hover:bg-[#DCEBFA] text-[#071324] py-4 px-8 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-xl shadow-black/20 hover:scale-[1.02] transition-all duration-200"
                  title="Add formulation to bag"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                {/* Explore Details Link */}
                <Link
                  href={`/product/${activeProduct.slug}`}
                  className="border border-white/30 hover:border-white text-white hover:bg-white/10 py-4 px-6 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Atelier Specs Badge */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-end space-y-4">
            <div className="bg-[#071324]/85 backdrop-blur-xl border border-white/15 p-6 max-w-xs text-right space-y-4 shadow-2xl">
              <div className="flex items-center justify-end gap-2 text-[#93C5FD]">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-semibold">
                  Atelier Standards
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="text-[11px] uppercase tracking-wider text-[#9CA3AF]">
                  Skin Profile:
                </div>
                <div className="font-serif text-sm text-white font-medium">
                  {activeSlide.skinType}
                </div>
              </div>
              <div className="space-y-1 text-xs pt-2 border-t border-white/10">
                <div className="text-[11px] uppercase tracking-wider text-[#9CA3AF]">
                  Compounding Atelier:
                </div>
                <div className="font-mono text-xs text-[#93C5FD]">
                  Sunyani, Bono Region &bull; Ghana
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ====================================================================
            3. FLOATING BOTTOM HUD: FORMULATION TABS & SLIDE CONTROLS (CHANEL STYLE)
            ==================================================================== */}
        <div className="pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Formulation Selector Tabs */}
          <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {HERO_SLIDES.map((slide, idx) => {
              const isCurrent = idx === currentSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`group relative text-left py-2 px-3 transition-all duration-300 border ${
                    isCurrent
                      ? 'border-[#93C5FD] bg-white/15 text-white'
                      : 'border-white/10 bg-black/20 text-[#DCEBFA]/60 hover:text-white hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#93C5FD]">
                      {slide.id}
                    </span>
                    <span className="font-sans text-xs font-semibold tracking-wide whitespace-nowrap">
                      {slide.title.replace('Lumière ', '').replace('Sunyani ', '')}
                    </span>
                  </div>
                  {/* Active Indicator Line */}
                  {isCurrent && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#93C5FD] animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Controls: Prev/Next & Autoplay State */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="font-mono text-xs text-[#DCEBFA]/80">
              0{currentSlide + 1} <span className="text-white/30">/</span> 0{HERO_SLIDES.length}
            </div>

            <div className="h-4 w-px bg-white/20" />

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="w-9 h-9 flex items-center justify-center border border-white/20 bg-white/5 hover:bg-white hover:text-[#071324] text-white transition-all"
                title="Previous formulation"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-9 h-9 flex items-center justify-center border border-white/20 bg-white/5 hover:bg-white hover:text-[#071324] text-white transition-all"
                title="Next formulation"
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
