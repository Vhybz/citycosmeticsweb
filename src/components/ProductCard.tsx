'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';
import { useQuickView } from '@/lib/quickViewContext';
import { formatPrice } from '@/lib/formatPrice';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openQuickView } = useQuickView();

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
      className="group relative flex flex-col bg-white rounded-none overflow-hidden border border-[#ede4dc] hover:border-[#121113] hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Badges and Overlay Actions */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f4ede8]/60">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && product.images.length > 1 ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`text-[9px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-none shadow-sm backdrop-blur-md ${
                tag === 'Bestseller'
                  ? 'bg-[#121113] text-white'
                  : tag === 'Clean'
                  ? 'bg-[#eaf4eb] text-[#2c6e3b] border border-[#c4e4c9]'
                  : 'bg-white text-[#a85845] border border-[#ebd2c7]'
              }`}
            >
              {tag}
            </span>
          ))}
          {product.compareAtPrice && (
            <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-none bg-[#d64545] text-white shadow-sm w-fit">
              Save {formatPrice(product.compareAtPrice - product.price)}
            </span>
          )}
        </div>

        {/* Top Right Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-none bg-white/95 backdrop-blur-md flex items-center justify-center text-[#1e1b18] hover:text-[#a85845] shadow-sm hover:scale-105 transition-all z-10 border border-[#ede4dc]"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isFavorited ? 'fill-[#a85845] text-[#a85845]' : 'text-[#1e1b18]'
            }`}
          />
        </button>

        {/* Quick View Floating Button */}
        <div className="absolute bottom-3 inset-x-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 bg-white/95 hover:bg-white text-[#121113] py-2.5 px-3 rounded-none text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-md flex items-center justify-center gap-1.5 transition-all hover:shadow-lg border border-[#ede4dc]"
          >
            <Eye className="w-3.5 h-3.5 text-[#a85845]" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-[#cba258]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-[#1e1b18]">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-[#8a8075]">({product.reviewCount})</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="group-hover:text-[#a85845] transition-colors">
            <h3 className="font-serif-luxury text-base font-medium text-[#121113] line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Subtitle / Key Actives */}
          <p className="text-xs text-[#8a8075] mt-1 line-clamp-1">{product.subtitle}</p>

          {/* Color Shade Swatches (If variants exist) */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariant(variant);
                  }}
                  title={variant.name}
                  aria-label={variant.name}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedVariant?.id === variant.id
                      ? 'ring-2 ring-offset-1 ring-[#121113] scale-110'
                      : 'border-black/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: variant.hexCode || '#ccc' }}
                />
              ))}
              <span className="text-[11px] text-[#8a8075] ml-1">
                {product.variants.length} shades
              </span>
            </div>
          )}
        </div>

        {/* Pricing & 1-Click Bag Button */}
        <div className="mt-4 pt-3 border-t border-[#ede4dc]/60 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-[#121113]">
              {formatPrice(displayPrice)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[#a89f91] line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            aria-label="Add to Bag"
            disabled={product.stock === 0}
            className={`p-2.5 rounded-none transition-all duration-300 ${
              addedAnimation
                ? 'bg-[#2c6e3b] text-white scale-105'
                : 'bg-[#121113] hover:bg-[#a85845] text-white shadow-sm hover:scale-105'
            } ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {addedAnimation ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
