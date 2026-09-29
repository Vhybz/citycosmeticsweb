'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SkinQuizTeaser: React.FC = () => {
  return (
    <section className="py-16 bg-[#F5F9FE] border-y border-[#E5E7EB] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-md p-8 sm:p-12 shadow-sm border border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-8 relative">
          <div className="space-y-4 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCEBFA] text-[#0B1F3A] text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#174EA6]" /> 60-Second Skin & Routine Diagnostic
            </div>

            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#0B1F3A]">
              Find Your Bespoke Botanical Formula
            </h2>

            <p className="text-xs sm:text-sm text-[#1F2937]/80 leading-relaxed">
              Unsure which serum or shade matches your unique skin tone and barrier needs? Take our
              quick AI-inspired routine builder to unlock your personalized glass-skin regimen.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#174EA6]" /> Personalized shade match
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#174EA6]" /> Ingredient sensitivity filter
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#174EA6]" /> 15% Welcome discount code
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/quiz"
              className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-4 px-8 rounded-md flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all group w-full text-center"
            >
              Start Skin Diagnostic
              <ArrowRight className="w-4 h-4 text-[#DCEBFA] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
