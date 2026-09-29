'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Droplets, HeartHandshake } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fcfaf8] via-[#f7f1ec] to-[#fcfaf8] py-12 md:py-20 lg:py-28 border-b border-[#ede4dc]/60">
      {/* Background Decorative Glow Circles */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#d69482]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#cba258]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#ebd2c7] shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#a85845]" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#a85845]">
                The New Sunyani Clean Beauty Formulation
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-normal text-[#121113] leading-[1.12]">
              Luminous Skin Designed for the{' '}
              <span className="italic font-serif font-light text-[#a85845]">Modern Woman.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#5a544e] font-light leading-relaxed max-w-xl">
              Clean botanical actives meet high-performance cellular hydration. Protect against urban
              stressors and illuminate your complexion with effortless, weightless grace.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <Link
                href="/shop"
                className="btn-luxury-primary text-white text-xs uppercase tracking-widest font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl transition-all group"
              >
                Shop Iconic Collection
                <ArrowRight className="w-4 h-4 text-[#ebd2c7] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/quiz"
                className="bg-white/90 hover:bg-white text-[#121113] border border-[#d8cec4] hover:border-[#a85845] text-xs uppercase tracking-widest font-semibold py-4 px-7 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                Take Routine Quiz (60s)
              </Link>
            </div>

            {/* Trust Pillars */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#ede4dc]/80 w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#a85845] flex-shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#121113]">72h Hydration</h4>
                  <p className="text-[11px] text-[#8a8075]">Multi-depth moisture</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#a85845] flex-shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#121113]">100% Cruelty Free</h4>
                  <p className="text-[11px] text-[#8a8075]">PETA certified vegan</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#a85845] flex-shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#121113]">Clean Actives</h4>
                  <p className="text-[11px] text-[#8a8075]">Zero toxic fillers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Product Display */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Ambient Back Glow */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white">
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85"
                alt="City Cosmetics Lumiere Hydra-Dew Serum"
                className="w-full h-full object-cover object-center transform transition-transform duration-1000 hover:scale-105"
              />

              {/* Floating Glassmorphic Overlay Badge 1 */}
              <div className="absolute top-6 right-6 glass-card p-3.5 rounded-2xl shadow-xl max-w-[170px] animate-fadeIn">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#a85845]">
                  #1 Best Seller
                </p>
                <h4 className="font-serif-luxury text-xs font-semibold text-[#121113] mt-0.5">
                  Lumière Hydra-Dew
                </h4>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-[#cba258] text-[10px]">★★★★★</div>
                  <span className="text-[10px] text-[#8a8075]">4.9 (340+)</span>
                </div>
              </div>

              {/* Floating Glassmorphic Overlay Badge 2 */}
              <div className="absolute bottom-6 left-6 glass-card p-3.5 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-[#f4ede8] flex items-center justify-center text-[#a85845] font-bold text-xs">
                  98%
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#121113]">Glass Skin Radiance</p>
                  <p className="text-[10px] text-[#8a8075]">Clinically proven results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
