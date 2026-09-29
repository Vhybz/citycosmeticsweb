'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SkinQuizTeaser: React.FC = () => {
  return (
    <section className="py-16 bg-[#f7f1ec] border-y border-[#ebd2c7]/60 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#ede4dc] flex flex-col md:flex-row items-center justify-between gap-8 relative">
          <div className="space-y-4 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ede8] text-[#a85845] text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" /> 60-Second Skin & Routine Diagnostic
            </div>

            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#121113]">
              Find Your Bespoke Botanical Formula
            </h2>

            <p className="text-xs sm:text-sm text-[#5a544e] leading-relaxed">
              Unsure which serum or shade matches your unique skin tone and barrier needs? Take our
              quick AI-inspired routine builder to unlock your personalized glass-skin regimen.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-[#6b645d]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#a85845]" /> Personalized shade match
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#a85845]" /> Ingredient sensitivity filter
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#a85845]" /> 15% Welcome discount code
              </span>
            </div>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto">
            <Link
              href="/quiz"
              className="btn-luxury-primary text-white text-xs uppercase tracking-widest font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl transition-all group w-full text-center"
            >
              Start Skin Diagnostic
              <ArrowRight className="w-4 h-4 text-[#ebd2c7] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
