'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  CheckCircle,
  Share2,
} from 'lucide-react';
import { PRODUCTS_DATA, MOCK_REVIEWS } from '@/lib/productsData';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';
import { ProductVariant, Review } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const product = PRODUCTS_DATA.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState<string>(product.images[0]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string>('benefits');

  // Customer reviews for this product (or fallback)
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const currentPrice = selectedVariant?.priceOverride ?? product.price;

  // Related products
  const relatedProducts = PRODUCTS_DATA.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      author: newReviewAuthor,
      rating: newReviewRating,
      date: 'Just now',
      title: 'Verified Customer Experience',
      comment: newReviewComment,
      verified: true,
      skinType: 'All',
    };

    setReviews([newRev, ...reviews]);
    setReviewSubmitted(true);
    setNewReviewAuthor('');
    setNewReviewComment('');
  };

  return (
    <div className="bg-[#fcfaf8] py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs text-[#8a8075] mb-8 space-x-2">
          <Link href="/" className="hover:text-[#121113] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#121113] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="capitalize hover:text-[#121113] transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#121113] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Interactive Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[600px] flex-shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                      activeImage === img
                        ? 'border-[#121113] shadow-md scale-105'
                        : 'border-[#ede4dc] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 relative aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-xl border border-[#ede4dc]">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-white/95 text-[#a85845] border border-[#ebd2c7] shadow-sm backdrop-blur-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Details & Buying Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-[#a85845] font-semibold">
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-[#8a8075] hover:text-[#121113] rounded-full hover:bg-white border border-[#ede4dc] transition-all"
                    title="Share Link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2 text-[#8a8075] hover:text-[#a85845] rounded-full hover:bg-white border border-[#ede4dc] transition-all"
                    title="Add to Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFavorited ? 'fill-[#a85845] text-[#a85845]' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {copiedLink && (
                <p className="text-[11px] text-[#2c6e3b] font-medium">Link copied to clipboard!</p>
              )}

              {/* Title & Subtitle */}
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#121113] mt-2">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#8a8075] mt-1">{product.subtitle}</p>

              {/* Stars & Reviews */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-[#cba258]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#121113]">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-[#8a8075]">
                  ({product.reviewCount} verified reviews)
                </span>
              </div>

              {/* Price & Value */}
              <div className="flex items-baseline gap-3 mt-5 pt-4 border-t border-[#ede4dc]">
                <span className="text-3xl font-semibold text-[#121113]">
                  {formatPrice(currentPrice)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-base text-[#8a8075] line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-xs text-[#2c6e3b] font-semibold bg-[#eaf4eb] px-2.5 py-1 rounded-full">
                  In Stock &bull; Ready to Ship
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#5a544e] mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Shade Selector if variants exist */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-6 pt-5 border-t border-[#ede4dc]">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold text-[#121113]">Select Shade Tone:</span>
                    <span className="text-[#a85845] font-semibold">{selectedVariant?.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`w-9 h-9 rounded-full border transition-all flex items-center justify-center ${
                          selectedVariant?.id === v.id
                            ? 'ring-2 ring-offset-2 ring-[#121113] scale-110 shadow-md'
                            : 'border-black/20 hover:scale-105'
                        }`}
                        style={{ backgroundColor: v.hexCode || '#ccc' }}
                        title={v.name}
                      >
                        {selectedVariant?.id === v.id && (
                          <Check
                            className={`w-4 h-4 ${
                              v.hexCode &&
                              ['#ffffff', '#f6e4d9', '#eed3c2'].includes(v.hexCode.toLowerCase())
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

              {/* Quantity & Add to Cart Button */}
              <div className="mt-8 pt-6 border-t border-[#ede4dc] space-y-4">
                <div className="flex items-center gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[#d8cec4] rounded-full px-4 py-2.5 bg-white shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-sm font-bold text-[#6b645d] hover:text-black px-2"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold px-3">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-sm font-bold text-[#6b645d] hover:text-black px-2"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`flex-1 py-4 px-8 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-3 transition-all ${
                      isAdded
                        ? 'bg-[#2c6e3b] text-white shadow-lg'
                        : 'btn-luxury-primary text-white shadow-xl hover:shadow-2xl'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#ebd2c7]" /> Add to Bag &bull;{' '}
                        {formatPrice(currentPrice * quantity)}
                      </>
                    )}
                  </button>

                  <WhatsAppButton
                    productName={product.name}
                    variantName={selectedVariant?.name}
                    price={currentPrice}
                    quantity={quantity}
                    variant="primary"
                    text="Order via WhatsApp"
                    className="w-full py-3.5 px-6 text-xs uppercase tracking-wider font-semibold"
                  />
                </div>

                {/* Guarantees row */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-[#6b645d]">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#a85845]" /> Free Express Shipping over GH₵800
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#a85845]" /> 30-Day Glowing Guarantee
                  </div>
                </div>
              </div>

              {/* Accordions */}
              <div className="mt-8 pt-6 border-t border-[#ede4dc] space-y-3">
                {/* 1. Benefits */}
                <div className="border border-[#ede4dc] rounded-2xl overflow-hidden bg-white">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === 'benefits' ? '' : 'benefits')
                    }
                    className="w-full px-5 py-4 flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#121113]"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#a85845]" /> Botanical Key Benefits
                    </span>
                    {openAccordion === 'benefits' ? (
                      <ChevronUp className="w-4 h-4 text-[#8a8075]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8a8075]" />
                    )}
                  </button>
                  {openAccordion === 'benefits' && (
                    <div className="px-5 pb-4 pt-1 text-xs text-[#5a544e] border-t border-[#f4ede8]">
                      <ul className="space-y-1.5 list-disc pl-4">
                        {product.benefits.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 2. Full Ingredients */}
                <div className="border border-[#ede4dc] rounded-2xl overflow-hidden bg-white">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === 'ingredients' ? '' : 'ingredients')
                    }
                    className="w-full px-5 py-4 flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#121113]"
                  >
                    <span>Full Ingredients List (Clean Actives)</span>
                    {openAccordion === 'ingredients' ? (
                      <ChevronUp className="w-4 h-4 text-[#8a8075]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8a8075]" />
                    )}
                  </button>
                  {openAccordion === 'ingredients' && (
                    <div className="px-5 pb-4 pt-1 text-xs text-[#6b645d] leading-relaxed border-t border-[#f4ede8]">
                      {product.ingredients}
                    </div>
                  )}
                </div>

                {/* 3. How to Apply */}
                <div className="border border-[#ede4dc] rounded-2xl overflow-hidden bg-white">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === 'howto' ? '' : 'howto')
                    }
                    className="w-full px-5 py-4 flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#121113]"
                  >
                    <span>Ritual & How to Apply</span>
                    {openAccordion === 'howto' ? (
                      <ChevronUp className="w-4 h-4 text-[#8a8075]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8a8075]" />
                    )}
                  </button>
                  {openAccordion === 'howto' && (
                    <div className="px-5 pb-4 pt-1 text-xs text-[#5a544e] leading-relaxed border-t border-[#f4ede8]">
                      {product.howToUse}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Feedback Submission */}
        <section className="mt-20 pt-12 border-t border-[#ede4dc]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#a85845] font-semibold">
                Customer Community
              </span>
              <h2 className="font-serif-luxury text-3xl font-normal text-[#121113] mt-1">
                Verified Reviews ({reviews.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-2xl border border-[#ede4dc] shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#cba258]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#8a8075]">{rev.date}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#121113]">{rev.title}</h4>
                  <p className="text-xs sm:text-sm text-[#5a544e] leading-relaxed">{rev.comment}</p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-[#8a8075]">
                    <span className="font-semibold text-[#121113]">{rev.author}</span>
                    {rev.verified && (
                      <span className="text-[#2c6e3b] flex items-center gap-0.5 text-[11px]">
                        <CheckCircle className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Write a Review Box */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#ede4dc] shadow-sm h-fit space-y-4">
              <h3 className="font-serif-luxury text-lg font-semibold text-[#121113]">
                Share Your Experience
              </h3>
              <p className="text-xs text-[#8a8075]">
                Tell our community how {product.name} feels on your skin.
              </p>

              {reviewSubmitted ? (
                <div className="bg-[#eaf4eb] text-[#2c6e3b] p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Thank you! Your review has been posted.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[#1e1b18] block mb-1">
                      Your Rating:
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 text-[#cba258]"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newReviewRating ? 'fill-current' : 'text-[#ede4dc]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#1e1b18] block mb-1">Name:</label>
                    <input
                      type="text"
                      required
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Eleanor W."
                      className="w-full bg-[#fbf9f7] border border-[#d8cec4] rounded-xl px-3 py-2 text-xs text-[#1e1b18] focus:outline-none focus:border-[#a85845]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#1e1b18] block mb-1">
                      Review Comments:
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Describe hydration, scent, texture, or results..."
                      className="w-full bg-[#fbf9f7] border border-[#d8cec4] rounded-xl px-3 py-2 text-xs text-[#1e1b18] focus:outline-none focus:border-[#a85845]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-luxury-primary text-white text-xs uppercase tracking-wider font-semibold py-3 rounded-xl shadow"
                  >
                    Post Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Pairs Well With / Related Products */}
        <section className="mt-20 pt-12 border-t border-[#ede4dc]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#a85845] font-semibold">
              Complete The Ritual
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#121113] mt-1">
              Pairs Well With
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
