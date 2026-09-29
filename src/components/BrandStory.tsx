'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, Award, Recycle, CheckCircle2 } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section className="py-20 bg-[#121113] text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#d69482]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual collage */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4] bg-[#2a282c]">
                <img
                  src="https://images.unsplash.com/photo-1608248597359-216694663806?auto=format&fit=crop&w=600&q=80"
                  alt="City Cosmetics Botanical Sourcing"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 rounded-2xl bg-[#1e1b18] border border-white/10 text-center">
                <span className="font-serif-luxury text-2xl text-[#d69482] block">100%</span>
                <span className="text-[11px] uppercase tracking-wider text-[#a89f91]">
                  Cruelty Free & Vegan
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-4 rounded-2xl bg-[#1e1b18] border border-white/10 text-center">
                <span className="font-serif-luxury text-2xl text-[#cba258] block">98%</span>
                <span className="text-[11px] uppercase tracking-wider text-[#a89f91]">
                  Naturally Derived Actives
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4] bg-[#2a282c]">
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"
                  alt="City Cosmetics Velvet Matte Texture"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#d69482] font-semibold">
              The City Cosmetics Standard
            </span>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-[#fcfaf8]">
              Where Clean Botanical Science Meets Urban Sophistication.
            </h2>

            <p className="text-sm sm:text-base text-[#d8cec4] font-light leading-relaxed">
              Founded in the heart of Sunyani, Ghana, City Cosmetics was born from a singular
              vision: creating skincare and cosmetics powerful enough for the tropical African climate
              while remaining completely gentle, clean, and luxurious.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a282c] flex items-center justify-center text-[#d69482] flex-shrink-0 mt-0.5">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Clean & Non-Toxic</h4>
                  <p className="text-xs text-[#a89f91] mt-0.5">
                    Free from parabens, phthalates, synthetic fragrance, and over 1,800 harmful ingredients.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a282c] flex items-center justify-center text-[#cba258] flex-shrink-0 mt-0.5">
                  <Recycle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Sustainable Glass Packaging</h4>
                  <p className="text-xs text-[#a89f91] mt-0.5">
                    Recyclable weighted frosted glass flacons with refillable lipstick mechanisms.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/shop"
                className="btn-luxury-gold text-white text-xs uppercase tracking-widest font-semibold py-3.5 px-8 rounded-full inline-flex items-center gap-2 shadow-lg"
              >
                Experience The Formula
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
