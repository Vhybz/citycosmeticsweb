'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye, ShoppingBag, Star, Check, MessageCircle } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';
import { useQuickView } from '@/lib/quickViewContext';
import { useWhatsAppOrder } from '@/lib/whatsappOrderContext';
import { formatPrice } from '@/lib/formatPrice';
import { SITE_CONFIG } from '@/lib/siteConfig';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openQuickView } = useQuickView();
  const { openWhatsAppOrder } = useWhatsAppOrder();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedVariant);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const displayPrice = selectedVariant?.priceOverride ?? product.price;

  return (
    <div
      className="group relative flex flex-col bg-white rounded-none overflow-hidden border border-[#E5E7EB] hover:border-[#174EA6]/40 hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Badges and Overlay Actions */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F9FE]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && product.images.length > 1 ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10 pointer-events-none">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`text-[8px] sm:text-[9px] tracking-wider sm:tracking-widest uppercase font-semibold px-1.5 sm:px-2 py-0.5 rounded-none shadow-sm backdrop-blur-md ${
                tag === 'Bestseller'
                  ? 'bg-[#0B1F3A] text-white'
                  : tag === 'Clean'
                  ? 'bg-[#DCEBFA] text-[#0B1F3A] border border-[#DCEBFA]'
                  : 'bg-white text-[#174EA6] border border-[#E5E7EB]'
              }`}
            >
              {tag}
            </span>
          ))}
          {product.compareAtPrice && (
            <span className="text-[8px] sm:text-[9px] font-bold tracking-wider sm:tracking-widest uppercase px-1.5 sm:px-2 py-0.5 rounded-none bg-[#0B1F3A] text-[#DCEBFA] shadow-sm w-fit">
              Save {formatPrice(product.compareAtPrice - product.price)}
            </span>
          )}
        </div>

        {/* Top Right Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Wishlist"
          className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-none bg-white/95 backdrop-blur-md flex items-center justify-center text-[#1F2937] hover:text-[#174EA6] shadow-sm hover:scale-105 transition-all z-10 border border-[#E5E7EB]"
        >
          <Heart
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
              isFavorited ? 'fill-[#174EA6] text-[#174EA6]' : 'text-[#1F2937]'
            }`}
          />
        </button>

        {/* Quick View & WhatsApp Floating Action Buttons (Desktop hover + mobile touch accessible) */}
        <div className="absolute bottom-2.5 sm:bottom-3 inset-x-2.5 sm:inset-x-3 hidden sm:flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 bg-white/95 hover:bg-[#F5F9FE] text-[#0B1F3A] hover:text-[#174EA6] py-2 px-2 rounded-none text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm flex items-center justify-center gap-1.5 transition-all hover:shadow-md border border-[#E5E7EB]"
          >
            <Eye className="w-3.5 h-3.5 text-[#174EA6]" />
            Quick View
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openWhatsAppOrder(product, selectedVariant, 1);
            }}
            className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-2.5 py-2 rounded-none text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm flex items-center justify-center gap-1 transition-all"
            title="Instant Order on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Order</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
            <div className="flex text-[#174EA6]">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#1F2937]">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] sm:text-xs text-[#6B7280]">({product.reviewCount})</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="group-hover:text-[#174EA6] transition-colors">
            <h3 className="font-serif-luxury text-sm sm:text-base font-normal text-[#0B1F3A] line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Subtitle / Key Actives */}
          <p className="text-[11px] sm:text-xs text-[#6B7280] mt-0.5 sm:mt-1 line-clamp-1">{product.subtitle}</p>

          {/* Color Shade Swatches (If variants exist) */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-1.5 flex-wrap">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariant(variant);
                  }}
                  title={variant.name}
                  aria-label={variant.name}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all ${
                    selectedVariant?.id === variant.id
                      ? 'ring-2 ring-offset-1 ring-[#121113] scale-110'
                      : 'border-black/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: variant.hexCode || '#ccc' }}
                />
              ))}
              <span className="text-[10px] sm:text-[11px] text-[#8a8075] ml-1">
                {product.variants.length} shades
              </span>
            </div>
          )}
        </div>

        {/* Pricing & 1-Click Bag Button */}
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <span className="text-xs sm:text-base font-semibold text-[#0B1F3A]">
              {formatPrice(displayPrice)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[10px] sm:text-xs text-[#6B7280] line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openWhatsAppOrder(product, selectedVariant, 1);
              }}
              aria-label="Order on WhatsApp"
              className="sm:hidden p-2 rounded-none bg-[#25D366] text-white"
              title="Order on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleQuickAdd}
              aria-label="Add to Bag"
              disabled={product.stock === 0}
              className={`p-2 sm:p-2.5 rounded-none transition-all duration-200 ${
                addedAnimation
                  ? 'bg-[#174EA6] text-white scale-105'
                  : 'bg-[#0B1F3A] hover:bg-[#174EA6] text-white shadow-sm'
              } ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {addedAnimation ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
