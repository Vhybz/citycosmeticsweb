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
      className="relative overflow-hidden min-h-[720px] lg:min-h-[840px] flex items-center justify-center bg-[#071324] text-white select-none"
      aria-label="City Cosmetics Centered Magazine Cover Showcase"
    >
      {/* ====================================================================
          1. FULL-BLEED HIGH-FASHION BACKGROUND PHOTOGRAPHY
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

        {/* Vogue / Dior Magazine Cover Scrim:
            Radial dark vignette focusing the eye on the center typography while keeping photo details rich */}
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-black/45 via-black/60 to-black/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071324] via-transparent to-black/50 pointer-events-none" />
      </div>

      {/* ====================================================================
          2. CENTERED MAGAZINE COVER EDITORIAL STAGE (VOGUE & DIOR STYLE)
          ==================================================================== */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 py-20 sm:py-24 text-center flex flex-col items-center justify-center space-y-6 sm:space-y-7">
        
        {/* Magazine Masthead Kicker */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-[0.25em] text-[#93C5FD]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#93C5FD] animate-pulse" />
          <span>Atelier Sunyani &bull; {activeSlide.batchNo} &bull; Compounded in Ghana</span>
        </div>

        {/* Category Kicker */}
        <p className="text-xs uppercase font-mono tracking-[0.3em] font-semibold text-[#DCEBFA]/90 pt-1">
          {activeSlide.category}
        </p>

        {/* Grand Headline (Vogue Serif Style) */}
        <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-normal text-white leading-[1.05] tracking-tight max-w-4xl drop-shadow-lg">
          {activeSlide.title}
        </h1>

        {/* Italic Accent Subtitle */}
        <p className="italic font-serif font-light text-xl sm:text-2xl text-[#93C5FD] max-w-2xl drop-shadow-sm">
          {activeSlide.subtitle}
        </p>

        {/* Formulation Benefit Description */}
        <p className="text-sm sm:text-base text-[#DCEBFA]/85 leading-relaxed max-w-2xl font-normal drop-shadow-xs">
          {activeSlide.description}
        </p>

        {/* Botanical Actives Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {activeSlide.keyActives.map((active, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-2xs"
            >
              <CheckCircle2 className="w-3 h-3 text-[#93C5FD]" />
              <span>{active}</span>
            </span>
          ))}
        </div>

        {/* Price & Sunyani Delivery Info */}
        <div className="pt-2 flex items-baseline justify-center gap-3">
          <span className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
            {formatPrice(activeProduct.price)}
          </span>
          {activeProduct.compareAtPrice && (
            <span className="text-lg font-mono line-through text-[#9CA3AF]">
              {formatPrice(activeProduct.compareAtPrice)}
            </span>
          )}
          <span className="text-xs font-mono text-[#93C5FD]">
            &bull; Flat GH₵ 20 Delivery in Sunyani
          </span>
        </div>

        {/* Centered Direct Commerce Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          {/* Order via WhatsApp */}
          <button
            type="button"
            onClick={() => openWhatsAppOrder(activeProduct, undefined, 1)}
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white py-4 px-8 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.03] transition-all duration-200"
            title="Order formulation instantly via WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Order via WhatsApp &bull; GH₵ 20 Delivery</span>
          </button>

          {/* Add to Bag */}
          <button
            type="button"
            onClick={handleAddDirectToBag}
            className="w-full sm:w-auto bg-white hover:bg-[#DCEBFA] text-[#071324] py-4 px-8 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.03] transition-all duration-200"
            title="Add formulation to bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag</span>
          </button>

          {/* Details Link */}
          <Link
            href={`/product/${activeProduct.slug}`}
            className="w-full sm:w-auto border border-white/30 hover:border-white text-white hover:bg-white/10 py-4 px-6 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all duration-200"
          >
            <span>Explore Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* ====================================================================
          3. FLOATING MAGAZINE BOTTOM HUD (SLIDE TABS & CONTROLS)
          ==================================================================== */}
      <div className="absolute bottom-6 left-0 right-0 z-20 max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Numbered Formulation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
          {HERO_SLIDES.map((slide, idx) => {
            const isCurrent = idx === currentSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`py-1.5 px-3 text-xs font-mono uppercase tracking-wider transition-all duration-300 border ${
                  isCurrent
                    ? 'border-[#93C5FD] bg-white/20 text-white font-bold'
                    : 'border-white/15 bg-black/40 text-[#DCEBFA]/60 hover:text-white hover:border-white/40'
                }`}
              >
                <span>{slide.id}</span> &bull;{' '}
                <span>{slide.title.replace('Lumière ', '').replace('Sunyani ', '')}</span>
              </button>
            );
          })}
        </div>

        {/* Tactile Prev/Next Arrows & Counter */}
        <div className="flex items-center gap-2 shrink-0 bg-black/40 backdrop-blur-md border border-white/15 p-1.5">
          <div className="px-2 font-mono text-xs text-[#93C5FD]">
            0{currentSlide + 1} / 0{HERO_SLIDES.length}
          </div>

          <div className="h-4 w-px bg-white/20" />

          <button
            type="button"
            onClick={handlePrev}
            className="w-7 h-7 flex items-center justify-center text-white hover:bg-white hover:text-[#071324] transition-colors"
            title="Previous Formulation"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-7 h-7 flex items-center justify-center text-white hover:bg-white hover:text-[#071324] transition-colors"
            title="Next Formulation"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Floating Edge Arrows for Quick Navigation */}
      <button
        type="button"
        onClick={handlePrev}
        className="hidden xl:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center bg-black/40 hover:bg-white hover:text-[#071324] text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all hover:scale-105"
        title="Previous Slide"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="hidden xl:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center bg-black/40 hover:bg-white hover:text-[#071324] text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all hover:scale-105"
        title="Next Slide"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

    </section>
  );
};
