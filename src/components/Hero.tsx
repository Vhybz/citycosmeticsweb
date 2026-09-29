'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Droplets, Leaf, Shield, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';

export const Hero: React.FC = () => {
  const [activeVisual, setActiveVisual] = useState<'product' | 'result'>('result');

  // Auto crossfade every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveVisual((prev) => (prev === 'result' ? 'product' : 'result'));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F9FE] via-white to-white py-16 lg:py-24">
      {/* Subtle royal blue atmospheric blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#174EA6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#DCEBFA]/40 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DCEBFA] text-[#0B1F3A] text-xs font-semibold uppercase tracking-wider rounded-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#174EA6]" />
              Formulated in Sunyani &bull; Ghana
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-normal text-[#0B1F3A] leading-[1.12]">
              Sensorial Botanicals for Luminous, Resilient Skin.
            </h1>

            <p className="text-sm sm:text-base text-[#4B5563] max-w-xl font-normal leading-relaxed">
              Clinical-grade skincare formulated with potent West African botanical actives and multi-molecular hydration, designed specifically for tropical sun, warmth, and humidity.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/shop"
                className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-4 px-8 rounded-none inline-flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-300"
              >
                Explore Formulations
                <ArrowRight className="w-4 h-4 text-[#DCEBFA]" />
              </Link>

              <Link
                href="/quiz"
                className="bg-white hover:bg-[#F5F9FE] text-[#0B1F3A] border border-[#0B1F3A] text-xs uppercase tracking-widest font-semibold py-4 px-8 rounded-none inline-flex items-center justify-center gap-2 shadow-xs transition-all duration-300"
              >
                Personalized Routine Quiz
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="pt-8 border-t border-[#E5E7EB] grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-none bg-[#F5F9FE] border border-[#E5E7EB] flex items-center justify-center text-[#174EA6] shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#0B1F3A]">72H Dew Lock</h4>
                  <p className="text-[11px] text-[#6B7280]">Multi-Hyaluronic</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-none bg-[#F5F9FE] border border-[#E5E7EB] flex items-center justify-center text-[#174EA6] shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#0B1F3A]">100% Cruelty Free</h4>
                  <p className="text-[11px] text-[#6B7280]">PETA certified</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-none bg-[#F5F9FE] border border-[#E5E7EB] flex items-center justify-center text-[#174EA6] shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#0B1F3A]">Clean Actives</h4>
                  <p className="text-[11px] text-[#6B7280]">Zero toxic fillers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Animated Dual-Visual Display */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* View Switcher Pill */}
            <div className="mb-3 inline-flex p-1 bg-white border border-[#E5E7EB] shadow-xs rounded-none z-20 text-[11px]">
              <button
                onClick={() => setActiveVisual('result')}
                className={`px-3 py-1 font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeVisual === 'result'
                    ? 'bg-[#0B1F3A] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#0B1F3A]'
                }`}
              >
                The Glow (Result)
              </button>
              <button
                onClick={() => setActiveVisual('product')}
                className={`px-3 py-1 font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeVisual === 'product'
                    ? 'bg-[#0B1F3A] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#0B1F3A]'
                }`}
              >
                The Formula (Flacon)
              </button>
            </div>

            <div className="relative w-full max-w-md aspect-[4/5] rounded-none overflow-hidden shadow-2xl border border-[#E5E7EB] bg-white group">
              {/* Image 1: Radiant Result */}
              <img
                src="/beautyImages/1.jpg"
                alt="City Cosmetics Botanical Radiance Result"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${
                  activeVisual === 'result'
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-105 pointer-events-none'
                }`}
              />

              {/* Image 2: Formulation Bottle Packshot */}
              <img
                src="/beautyImages/ca20569827f857496b78c0666cb556c4.jpg"
                alt="City Cosmetics Intensive Moisture Flacon"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${
                  activeVisual === 'product'
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-105 pointer-events-none'
                }`}
              />

              {/* Floating Overlay Badge 1 */}
              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md p-3.5 rounded-none shadow-md border border-[#E5E7EB] max-w-[180px] z-10 transition-all duration-300">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#174EA6]">
                  {activeVisual === 'result' ? 'Living Radiance' : 'Sunyani Formulation'}
                </p>
                <h4 className="font-serif-luxury text-xs font-semibold text-[#0B1F3A] mt-0.5">
                  Lumière Hydra-Dew
                </h4>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-[#174EA6] text-[10px]">★★★★★</div>
                  <span className="text-[10px] text-[#6B7280]">4.9 (340+ Reviews)</span>
                </div>
              </div>

              {/* Floating Overlay Badge 2 */}
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md p-3.5 rounded-none shadow-md border border-[#E5E7EB] flex items-center gap-3 z-10 transition-all duration-300">
                <div className="w-9 h-9 rounded-none bg-[#0B1F3A] flex items-center justify-center text-[#DCEBFA] font-bold text-xs">
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
