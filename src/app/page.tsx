'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, ShieldCheck, Heart } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { BeautyMarquee } from '@/components/BeautyMarquee';
import { CategorySection } from '@/components/CategorySection';
import { ProductCard } from '@/components/ProductCard';
import { SkinQuizTeaser } from '@/components/SkinQuizTeaser';
import { BrandStory } from '@/components/BrandStory';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { ReviewsSection } from '@/components/ReviewsSection';
import { PRODUCTS_DATA } from '@/lib/productsData';
import { formatPrice } from '@/lib/formatPrice';

export default function HomePage() {
  const featuredProducts = PRODUCTS_DATA.filter((p) => p.isFeatured).slice(0, 4);
  const discoverySet = PRODUCTS_DATA.find((p) => p.id === 'cc-08');

  return (
    <div className="space-y-0">
      {/* 1. Cinematic Hero with Dynamic Visual Toggle */}
      <Hero />

      {/* 2. Infinite Living Glow Marquee Ribbon */}
      <BeautyMarquee />

      {/* 3. Bestsellers Section (Clean Product Packshots) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#174EA6]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#174EA6] font-semibold">
                Client Favorites
              </span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#0B1F3A] mt-2">
              The Iconic Bestsellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#0B1F3A] hover:text-[#174EA6] transition-colors mt-4 sm:mt-0 group"
          >
            Explore All Formulas
            <ArrowRight className="w-4 h-4 text-[#174EA6] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid (2 cols on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Category Showcase */}
      <CategorySection />

      {/* 4. Editorial Ritual Spotlight Feature */}
      {discoverySet && (
        <section className="py-16 bg-[#F5F9FE] border-y border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-none overflow-hidden shadow-sm border border-[#E5E7EB] grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Left: Big imagery */}
              <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[500px] overflow-hidden bg-[#F5F9FE]">
                <img
                  src={discoverySet.images[0]}
                  alt={discoverySet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0B1F3A] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-none">
                  Limited Edition Vault
                </div>
              </div>

              {/* Right: Copy & Bundle Highlights */}
              <div className="lg:col-span-6 p-8 sm:p-12 space-y-6">
                <span className="text-xs uppercase tracking-[0.25em] text-[#174EA6] font-semibold">
                  Curated Ritual Set
                </span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#0B1F3A]">
                  {discoverySet.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#1F2937]/80 leading-relaxed">
                  {discoverySet.description}
                </p>

                <div className="space-y-2 text-xs text-[#1F2937] bg-[#F5F9FE] p-4 rounded-none border border-[#E5E7EB]">
                  <p className="font-semibold text-[#0B1F3A] mb-1">Ritual includes:</p>
                  <p>&bull; <strong>Lumière Hydra-Dew Serum:</strong> Triple Hyaluronic hydration</p>
                  <p>&bull; <strong>Cloud-Melt Cleanser:</strong> Colloidal oat makeup dissolve</p>
                  <p>&bull; <strong>Botanical Glow Oil:</strong> 12-seed antioxidant seal</p>
                  <p>&bull; <strong>Velvet Silk Lipstick:</strong> Iconic Nude City</p>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-[#0B1F3A]">
                    {formatPrice(discoverySet.price)}
                  </span>
                  {discoverySet.compareAtPrice && (
                    <span className="text-sm text-[#6B7280] line-through">
                      {formatPrice(discoverySet.compareAtPrice)} (Save {formatPrice(discoverySet.compareAtPrice - discoverySet.price)})
                    </span>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    href={`/product/${discoverySet.slug}`}
                    className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-3.5 px-8 rounded-none shadow-sm transition-all"
                  >
                    Claim Discovery Set
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Interactive Skin Quiz Teaser */}
      <SkinQuizTeaser />

      {/* 6. Brand Story & Ethical Philosophy */}
      <BrandStory />

      {/* 7. Clinical Proof & Hydration Before/After Slider */}
      <BeforeAfterSlider />

      {/* 8. Customer Reviews & Ratings */}
      <ReviewsSection />

      {/* 8. Social UGC Grid (#CityCosmeticsGlow) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#174EA6] font-semibold">
            Join the Community
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#0B1F3A] mt-2">
            #CityCosmeticsGlow
          </h2>
          <p className="text-xs text-[#6B7280] mt-2">
            Tag @CityCosmetics on Instagram & TikTok to be featured in our seasonal Sunyani lookbook.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { src: '/beautyImages/ca.jpg', label: '@amina.glow' },
            { src: '/beautyImages/2.jpg', label: '@akosua.skin' },
            { src: '/beautyImages/3.jpg', label: '@yaaglow_daily' },
            { src: '/beautyImages/e2660f8d3d6e02246ae67904661af3e7.jpg', label: '@kofi_beautylabs' },
          ].map((item, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-none overflow-hidden shadow-sm group border border-[#E5E7EB]"
            >
              <img
                src={item.src}
                alt={`Community glow look ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#0B1F3A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-3">
                <Heart className="w-5 h-5 fill-white mb-1.5" />
                <span className="text-[11px] font-medium tracking-wide">{item.label}</span>
                <span className="text-[9px] uppercase tracking-widest text-[#DCEBFA]/75 mt-0.5">Verified Ritual</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 bg-transparent hover:bg-[#0B1F3A] text-[#0B1F3A] hover:text-white border border-[#0B1F3A] px-7 py-3.5 text-xs uppercase tracking-[0.16em] font-semibold transition-all rounded-none"
          >
            Explore Sunyani Showroom & Business Gallery &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
