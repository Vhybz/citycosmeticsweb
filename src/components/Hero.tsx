'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Droplets, HeartHandshake } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F9FE] via-[#FFFFFF] to-[#FFFFFF] py-14 md:py-22 lg:py-28 border-b border-[#E5E7EB]">
      {/* Background Decorative Soft Powder Blue Glow */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-[#DCEBFA]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#DCEBFA]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBFA]/80 border border-[#DCEBFA] shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#0B1F3A]" />
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[#0B1F3A]">
                Sunyani Clean Beauty Formulation
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-normal text-[#0B1F3A] leading-[1.12]">
              Elevate Your{' '}
              <span className="italic font-serif font-light text-[#174EA6]">Everyday Beauty.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#1F2937]/80 font-normal leading-relaxed max-w-xl">
              Clean botanical actives meet high-performance cellular hydration. Formulated in Sunyani,
              Ghana for radiant skin that glows with effortless, modern elegance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <Link
                href="/shop"
                className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-4 px-8 rounded-md flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                Shop Iconic Collection
                <ArrowRight className="w-4 h-4 text-[#DCEBFA] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/quiz"
                className="bg-white hover:bg-[#F5F9FE] text-[#0B1F3A] border border-[#0B1F3A] text-xs uppercase tracking-widest font-semibold py-4 px-7 rounded-md flex items-center justify-center gap-2 transition-all duration-200"
              >
                Take Routine Quiz (60s)
              </Link>
            </div>

            {/* Trust Pillars */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E5E7EB] w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#F5F9FE] border border-[#E5E7EB] flex items-center justify-center text-[#174EA6] shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#0B1F3A]">72h Hydration</h4>
                  <p className="text-[11px] text-[#6B7280]">Multi-depth moisture</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#F5F9FE] border border-[#E5E7EB] flex items-center justify-center text-[#174EA6] shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#0B1F3A]">100% Cruelty Free</h4>
                  <p className="text-[11px] text-[#6B7280]">PETA certified vegan</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#F5F9FE] border border-[#E5E7EB] flex items-center justify-center text-[#174EA6] shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#0B1F3A]">Clean Actives</h4>
                  <p className="text-[11px] text-[#6B7280]">Zero toxic fillers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Product Display */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-lg overflow-hidden shadow-xl border border-[#E5E7EB] bg-white">
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85"
                alt="City Cosmetics Lumiere Hydra-Dew Serum"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
              />

              {/* Floating Overlay Badge 1 */}
              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md p-3 rounded-md shadow-md border border-[#E5E7EB] max-w-[170px] animate-fadeIn">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#174EA6]">
                  #1 Best Seller
                </p>
                <h4 className="font-serif-luxury text-xs font-semibold text-[#0B1F3A] mt-0.5">
                  Lumière Hydra-Dew
                </h4>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-[#174EA6] text-[10px]">★★★★★</div>
                  <span className="text-[10px] text-[#6B7280]">4.9 (340+)</span>
                </div>
              </div>

              {/* Floating Overlay Badge 2 */}
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md p-3 rounded-md shadow-md border border-[#E5E7EB] flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-[#DCEBFA] flex items-center justify-center text-[#0B1F3A] font-bold text-xs">
                  98%
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0B1F3A]">Glass Skin Radiance</p>
                  <p className="text-[10px] text-[#6B7280]">Clinically proven results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
