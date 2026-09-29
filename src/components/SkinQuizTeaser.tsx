'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Stethoscope } from 'lucide-react';

export const SkinQuizTeaser: React.FC = () => {
  return (
    <section className="py-16 bg-[#F5F9FE] border-y border-[#E5E7EB] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-none shadow-sm border border-[#E5E7EB] grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left: Consultation Prompt */}
          <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DCEBFA] text-[#0B1F3A] text-xs font-semibold tracking-wider uppercase">
                <Stethoscope className="w-3.5 h-3.5 text-[#174EA6]" /> 60-Second Skin & Routine Diagnostic
              </div>

              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#0B1F3A]">
                Find Your Bespoke Botanical Formula
              </h2>

              <p className="text-xs sm:text-sm text-[#1F2937]/80 leading-relaxed">
                Unsure which serum or shade matches your unique skin tone and barrier needs? Take our
                clinical routine builder to unlock your personalized glass-skin regimen tailored for the West African climate.
              </p>

              <div className="flex flex-wrap gap-4 pt-1 text-xs text-[#6B7280]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#174EA6]" /> Personalized shade match
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#174EA6]" /> Climate sensitivity filter
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#174EA6]" /> 15% Welcome ritual discount
                </span>
              </div>
            </div>

            <div>
              <Link
                href="/quiz"
                className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-4 px-8 rounded-none inline-flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all group"
              >
                Start Skin Diagnostic
                <ArrowRight className="w-4 h-4 text-[#DCEBFA] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right: Authentic Beauty Model Image */}
          <div className="md:col-span-5 relative min-h-[320px] md:min-h-[400px] bg-[#F5F9FE]">
            <img
              src="/beautyImages/ca.jpg"
              alt="Skin Diagnostic Consultation - City Cosmetics Sunyani"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-[10px] uppercase tracking-widest font-semibold text-[#0B1F3A] border border-[#E5E7EB]">
              Sunyani Consultation
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
