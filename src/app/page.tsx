'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, ShieldCheck, Heart } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { CategorySection } from '@/components/CategorySection';
import { ProductCard } from '@/components/ProductCard';
import { SkinQuizTeaser } from '@/components/SkinQuizTeaser';
import { BrandStory } from '@/components/BrandStory';
import { ReviewsSection } from '@/components/ReviewsSection';
import { PRODUCTS_DATA } from '@/lib/productsData';
import { formatPrice } from '@/lib/formatPrice';

export default function HomePage() {
  const featuredProducts = PRODUCTS_DATA.filter((p) => p.isFeatured).slice(0, 4);
  const discoverySet = PRODUCTS_DATA.find((p) => p.id === 'cc-08');

  return (
    <div className="space-y-0">
      {/* 1. Cinematic Hero */}
      <Hero />

      {/* 2. Bestsellers Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#a85845]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#a85845] font-semibold">
                Client Favorites
              </span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#121113] mt-2">
              The Iconic Bestsellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#121113] hover:text-[#a85845] transition-colors mt-4 sm:mt-0 group"
          >
            Explore All Formulas
            <ArrowRight className="w-4 h-4 text-[#a85845] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Category Showcase */}
      <CategorySection />

      {/* 4. Editorial Ritual Spotlight Feature */}
      {discoverySet && (
        <section className="py-16 bg-[#f4ede8]/80 border-y border-[#ede4dc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-none overflow-hidden shadow-xl border border-[#ede4dc] grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Left: Big imagery */}
              <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[500px] overflow-hidden bg-[#fbf9f7]">
                <img
                  src={discoverySet.images[0]}
                  alt={discoverySet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#121113] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-none">
                  Limited Edition Vault
                </div>
              </div>

              {/* Right: Copy & Bundle Highlights */}
              <div className="lg:col-span-6 p-8 sm:p-12 space-y-6">
                <span className="text-xs uppercase tracking-[0.25em] text-[#a85845] font-semibold">
                  Curated Ritual Set
                </span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#121113]">
                  {discoverySet.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#5a544e] leading-relaxed">
                  {discoverySet.description}
                </p>

                <div className="space-y-2 text-xs text-[#6b645d] bg-[#fbf9f7] p-4 rounded-none border border-[#ede4dc]">
                  <p className="font-semibold text-[#121113] mb-1">Ritual includes:</p>
                  <p>&bull; <strong>Lumière Hydra-Dew Serum:</strong> Triple Hyaluronic hydration</p>
                  <p>&bull; <strong>Cloud-Melt Cleanser:</strong> Colloidal oat makeup dissolve</p>
                  <p>&bull; <strong>Botanical Glow Oil:</strong> 12-seed antioxidant seal</p>
                  <p>&bull; <strong>Velvet Silk Lipstick:</strong> Iconic Nude City</p>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-[#121113]">
                    {formatPrice(discoverySet.price)}
                  </span>
                  {discoverySet.compareAtPrice && (
                    <span className="text-sm text-[#8a8075] line-through">
                      {formatPrice(discoverySet.compareAtPrice)} (Save {formatPrice(discoverySet.compareAtPrice - discoverySet.price)})
                    </span>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    href={`/product/${discoverySet.slug}`}
                    className="btn-luxury-primary text-white text-xs uppercase tracking-widest font-semibold py-3.5 px-8 rounded-full shadow"
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

      {/* 7. Customer Reviews & Ratings */}
      <ReviewsSection />

      {/* 8. Social UGC Grid (#CityCosmeticsGlow) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#a85845] font-semibold">
            Join the Community
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#121113] mt-2">
            #CityCosmeticsGlow
          </h2>
          <p className="text-xs text-[#8a8075] mt-2">
            Tag @CityCosmetics on Instagram & TikTok to be featured in our seasonal lookbook.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
          ].map((src, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group border border-[#ede4dc]"
            >
              <img
                src={src}
                alt={`Community glow look ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Heart className="w-6 h-6 fill-white" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
