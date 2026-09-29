'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { MOCK_REVIEWS } from '@/lib/productsData';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#fbf9f7] border-y border-[#ede4dc]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#a85845] font-semibold">
            Real Skin Transformations
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#121113] mt-2">
            Loved by 50,000+ City Dwellers Worldwide
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex text-[#cba258]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-semibold text-[#121113]">4.9 / 5.0</span>
            <span className="text-xs text-[#8a8075]">Overall Customer Rating</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#ede4dc]/80 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-[#cba258]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#ebd2c7]" />
                </div>

                <h3 className="font-serif-luxury text-base font-semibold text-[#121113] mb-2">
                  &ldquo;{review.title}&rdquo;
                </h3>
                <p className="text-xs sm:text-sm text-[#5a544e] leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Author & Verification */}
              <div className="pt-4 mt-6 border-t border-[#f4ede8] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#121113]">{review.author}</span>
                    {review.verified && (
                      <span title="Verified Buyer" className="inline-flex">
                        <CheckCircle className="w-3.5 h-3.5 text-[#2c6e3b]" />
                      </span>
                    )}
                  </div>
                  {review.skinType && (
                    <span className="text-[10px] text-[#8a8075]">Skin: {review.skinType}</span>
                  )}
                </div>
                <span className="text-[10px] text-[#a89f91]">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
