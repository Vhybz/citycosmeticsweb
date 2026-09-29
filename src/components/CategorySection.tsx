'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/productsData';
import { ArrowUpRight } from 'lucide-react';

export const CategorySection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#F5F9FE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#174EA6] font-semibold">
              Curated Collections
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#0B1F3A] mt-2">
              Formulated for Every Daily Ritual
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] max-w-md mt-3 md:mt-0 leading-relaxed">
            From skin-plumping multi-molecular serums to fine botanical eau de parfum, discover products crafted for radiant tropical beauty.
          </p>
        </div>

        {/* Grid of Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`group relative rounded-none overflow-hidden shadow-sm border border-[#E5E7EB] hover:border-[#174EA6]/40 hover:shadow-lg transition-all duration-300 bg-white ${
                index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Image with zoom effect */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#F5F9FE]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-[#0B1F3A]/30 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#DCEBFA] font-semibold">
                      {cat.itemCount} Formulations
                    </span>
                    <h3 className="font-serif-luxury text-xl sm:text-2xl font-normal text-white mt-0.5">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#FFFFFF] group-hover:text-[#0B1F3A] text-white transition-colors duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs text-[#DCEBFA]/90 mt-2 line-clamp-1 group-hover:line-clamp-2 transition-all duration-300">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
