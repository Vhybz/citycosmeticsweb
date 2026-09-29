'use client';

import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, Eye, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';

interface BeautyItem {
  id: string;
  image: string;
  tag: string;
  title: string;
  description: string;
  category: string;
}

const BEAUTY_ARCHIVE: BeautyItem[] = [
  {
    id: 'b-store-01',
    image: '/beautyImages/5897727668306776133_121.jpg',
    tag: 'Sunyani Boutique Team',
    title: 'Authentic Store Inventory & MoMo Desk',
    description: 'Direct from our Sunyani showroom shelves: Queen Helene Cocoa Butter, Jergens Enriching, and prompt dispatch.',
    category: 'Showroom',
  },
  {
    id: 'b-store-02',
    image: '/beautyImages/5897727668306776137_121.jpg',
    tag: 'Boutique Radiance',
    title: 'In-Store Melanin Vitality',
    description: 'Natural radiant glow and client skin consultation inside our Sunyani store.',
    category: 'Radiance',
  },
  {
    id: 'b1',
    image: '/beautyImages/1.jpg',
    tag: 'Botanical Radiance',
    title: 'Flawless Melanin Barrier',
    description: 'Clean active botanical infusions providing all-day lit-from-within glow and climate resilience.',
    category: 'Skincare',
  },
  {
    id: 'b2',
    image: '/beautyImages/258826bc9ee800fab3177221c23668ef.jpg',
    tag: 'Sunyani Showroom Suite',
    title: 'The Complete Daily Ritual',
    description: 'Artisanal small-batch compounded serums, body elixirs, and raw black soap formulated in Bono Region.',
    category: 'Sets',
  },
  {
    id: 'b3',
    image: '/beautyImages/ca.jpg',
    tag: 'Clinical Hydration',
    title: 'Morning Awakening Ritual',
    description: 'Triple-molecular Hyaluronic hydration delivering supple, glass-skin resilience from first application.',
    category: 'Skincare',
  },
  {
    id: 'b4',
    image: '/beautyImages/2.jpg',
    tag: 'Bio-Active Vitamin C',
    title: 'Tone Clarifying Complex',
    description: 'Dermatologist-tested antioxidant formulations that defend against hyperpigmentation and sun fatigue.',
    category: 'Skincare',
  },
  {
    id: 'b5',
    image: '/beautyImages/3.jpg',
    tag: 'Clinical Proof',
    title: '24-Hour Barrier Defense',
    description: 'Clinically proven Before & After results showing visible texture softening and dry skin alleviation.',
    category: 'Body',
  },
  {
    id: 'b6',
    image: '/beautyImages/cc.jpg',
    tag: 'Atelier Packaging',
    title: 'The Royal Blue Wardrobe',
    description: 'Signature cobalt flacons designed for sustainable refills and light-protected botanical potency.',
    category: 'Collections',
  },
  {
    id: 'b7',
    image: '/beautyImages/e2660f8d3d6e02246ae67904661af3e7.jpg',
    tag: 'Ghanaian Cocoa Butter',
    title: '5-in-1 Nourishing Care',
    description: 'Rich cold-pressed lipids that melt into skin with zero sticky residue under tropical heat.',
    category: 'Body',
  },
  {
    id: 'b8',
    image: '/beautyImages/61bc208cf17f0911e9f99c0810ccc200.jpg',
    tag: 'Botanical Elixir Duo',
    title: 'Vanilla Cashmere & Shea',
    description: 'Antioxidant plant seed oils engineered for silky, non-transfer body sheen and 48-hour moisture.',
    category: 'Body',
  },
];

export const BeautyMarquee: React.FC = () => {
  const [activeItem, setActiveItem] = useState<BeautyItem | null>(null);

  // Duplicate for seamless infinite ribbon loop
  const marqueeItems = [...BEAUTY_ARCHIVE, ...BEAUTY_ARCHIVE];

  return (
    <section className="py-20 bg-white border-b border-[#E5E7EB] overflow-hidden">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#174EA6] font-semibold block">
            Visual Radiance Archive
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#0B1F3A] mt-2">
            The Living Glow Reel
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#6B7280]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#174EA6] animate-pulse" />
          <span>Hover to pause &bull; Click to inspect formulation details</span>
        </div>
      </div>

      {/* Infinite Seamless Scrolling Ribbon */}
      <div className="relative w-full group py-4">
        {/* Subtle Edge Vignettes */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-6">
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => setActiveItem(item)}
              className="relative w-64 sm:w-72 aspect-[3/4] shrink-0 rounded-none overflow-hidden cursor-pointer border border-[#E5E7EB] bg-[#F5F9FE] shadow-sm hover:shadow-xl hover:border-[#0B1F3A] transition-all duration-500 transform hover:-translate-y-1.5"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />

              {/* Bottom Editorial Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-[#0B1F3A]/25 to-transparent opacity-90 hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
                <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#DCEBFA]">
                  {item.tag}
                </span>
                <h3 className="font-serif-luxury text-base font-normal text-white mt-1 leading-snug">
                  {item.title}
                </h3>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#DCEBFA]/80 pt-2 border-t border-white/15">
                  <span className="font-mono text-[10px] uppercase">{item.category}</span>
                  <span className="inline-flex items-center gap-1 font-medium hover:text-white">
                    View <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal on Inspection */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative bg-white max-w-2xl w-full border border-[#E5E7EB] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-none bg-white/90 border border-[#E5E7EB] flex items-center justify-center text-[#1F2937] hover:bg-[#0B1F3A] hover:text-white transition-colors"
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Image View */}
            <div className="md:col-span-6 relative aspect-square md:aspect-auto min-h-[320px] bg-[#0B1F3A]">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Details */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#174EA6] font-semibold block">
                  {activeItem.tag} &bull; {activeItem.category}
                </span>
                <h3 className="font-serif-luxury text-2xl font-normal text-[#0B1F3A]">
                  {activeItem.title}
                </h3>
                <p className="text-xs text-[#1F2937]/80 leading-relaxed">
                  {activeItem.description}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-[#6B7280]">
                  <ShieldCheck className="w-4 h-4 text-[#174EA6]" />
                  <span>Dermatologist Approved &bull; Sunyani Formulated</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex items-center gap-3">
                <Link
                  href="/shop"
                  onClick={() => setActiveItem(null)}
                  className="flex-1 bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-3 px-4 text-center rounded-none transition-colors"
                >
                  Shop Formulations
                </Link>
                <Link
                  href="/quiz"
                  onClick={() => setActiveItem(null)}
                  className="bg-[#F5F9FE] hover:bg-[#DCEBFA] text-[#0B1F3A] border border-[#E5E7EB] text-xs font-semibold py-3 px-4 rounded-none transition-colors"
                >
                  Routine Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
