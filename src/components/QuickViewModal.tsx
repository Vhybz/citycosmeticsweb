'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Star, ShoppingBag, Check, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { useQuickView } from '@/lib/quickViewContext';
import { useCart } from '@/lib/cartContext';
import { ProductVariant } from '@/types';
import { formatPrice } from '@/lib/formatPrice';

export const QuickViewModal: React.FC = () => {
  const { activeProduct, closeQuickView } = useQuickView();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  useEffect(() => {
    if (activeProduct) {
      setSelectedImage(activeProduct.images[0]);
      setSelectedVariant(
        activeProduct.variants && activeProduct.variants.length > 0
          ? activeProduct.variants[0]
          : undefined
      );
      setQuantity(1);
      setIsAdded(false);
    }
  }, [activeProduct]);

  if (!activeProduct) return null;

  const currentPrice = selectedVariant?.priceOverride ?? activeProduct.price;

  const handleAddToCart = () => {
    addToCart(activeProduct, quantity, selectedVariant);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      closeQuickView();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeQuickView}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#ede4dc] animate-fadeIn max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-[#1e1b18] hover:bg-[#121113] hover:text-white flex items-center justify-center transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images Gallery */}
        <div className="w-full md:w-1/2 bg-[#f4ede8]/40 p-6 flex flex-col justify-between">
          <div className="relative aspect-square rounded-none overflow-hidden bg-white border border-[#ede4dc]/80">
            <img
              src={selectedImage || activeProduct.images[0]}
              alt={activeProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail row */}
          {activeProduct.images.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
              {activeProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-none overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#121113] scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`view-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Category & Tags */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider text-[#a85845] font-semibold">
                {activeProduct.category}
              </span>
              <span className="text-xs text-[#a89f91]">&bull;</span>
              <div className="flex items-center text-[#cba258] text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-current mr-1" />
                <span>{activeProduct.rating.toFixed(1)}</span>
                <span className="text-[#8a8075] ml-1">({activeProduct.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-serif-luxury text-2xl font-normal text-[#121113]">
              {activeProduct.name}
            </h2>
            <p className="text-xs text-[#8a8075] mt-1">{activeProduct.subtitle}</p>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-semibold text-[#121113]">
                {formatPrice(currentPrice)}
              </span>
              {activeProduct.compareAtPrice && (
                <span className="text-sm text-[#a89f91] line-through">
                  {formatPrice(activeProduct.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#5a544e] mt-4 leading-relaxed line-clamp-3">
              {activeProduct.description}
            </p>

            {/* Shade / Variant Selector */}
            {activeProduct.variants && activeProduct.variants.length > 0 && (
              <div className="mt-5 pt-4 border-t border-[#ede4dc]/80">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-medium text-[#1e1b18]">Select Shade:</span>
                  <span className="text-[#a85845] font-semibold">{selectedVariant?.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {activeProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center ${
                        selectedVariant?.id === v.id
                          ? 'ring-2 ring-offset-2 ring-[#121113] scale-110'
                          : 'border-black/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: v.hexCode || '#ccc' }}
                      title={v.name}
                    >
                      {selectedVariant?.id === v.id && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            v.hexCode && ['#ffffff', '#f6e4d9', '#eed3c2'].includes(v.hexCode.toLowerCase())
                              ? 'text-black'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key Benefits summary */}
            <div className="mt-5 bg-[#fbf9f7] rounded-xl p-3 border border-[#ede4dc]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1e1b18] mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d69482]" />
                Key Botanical Formula Benefits:
              </div>
              <ul className="text-xs text-[#6b645d] space-y-1 pl-5 list-disc">
                {activeProduct.benefits.slice(0, 2).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Row: Quantity + Add to Bag */}
          <div className="mt-6 pt-4 border-t border-[#ede4dc] flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-[#d8cec4] rounded-full px-3 py-2 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-xs font-bold text-[#6b645d] hover:text-black px-2"
                >
                  -
                </button>
                <span className="text-xs font-semibold px-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-xs font-bold text-[#6b645d] hover:text-black px-2"
                >
                  +
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 py-3 px-6 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all ${
                  isAdded
                    ? 'bg-[#2c6e3b] text-white'
                    : 'btn-luxury-primary text-white shadow-md hover:shadow-xl'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#ebd2c7]" /> Add to Bag &bull; {formatPrice(currentPrice * quantity)}
                  </>
                )}
              </button>
            </div>

            {/* View Full Product Page link */}
            <Link
              href={`/product/${activeProduct.slug}`}
              onClick={closeQuickView}
              className="text-center text-xs text-[#8a8075] hover:text-[#a85845] transition-colors flex items-center justify-center gap-1 mt-1"
            >
              View Full Product Ritual & Clinical Results <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
