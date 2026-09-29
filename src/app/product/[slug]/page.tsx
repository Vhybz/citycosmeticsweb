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
  MessageCircle,
} from 'lucide-react';
import { PRODUCTS_DATA, MOCK_REVIEWS } from '@/lib/productsData';
import { ProductCard } from '@/components/ProductCard';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';
import { ProductVariant, Review } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { SITE_CONFIG } from '@/lib/siteConfig';

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

  // Customer reviews for this product
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewSkinType, setNewReviewSkinType] = useState('Dry');
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
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: 'Just now',
      title: newReviewTitle.trim() || 'Verified Customer Experience',
      comment: newReviewComment.trim(),
      verified: true,
      skinType: newReviewSkinType as any,
    };

    setReviews([newRev, ...reviews]);
    setReviewSubmitted(true);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  return (
    <div className="bg-white py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs text-[#6B7280] mb-8 space-x-2">
          <Link href="/" className="hover:text-[#174EA6] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#174EA6] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="capitalize hover:text-[#174EA6] transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#0B1F3A] font-medium truncate max-w-xs">{product.name}</span>
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
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                      activeImage === img
                        ? 'border-[#0B1F3A] shadow-sm scale-105'
                        : 'border-[#E5E7EB] opacity-70 hover:opacity-100'
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
            <div className="flex-1 relative aspect-[4/5] rounded-xl overflow-hidden bg-[#F5F9FE] shadow-sm border border-[#E5E7EB]">
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
                    className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-sm bg-white/95 text-[#0B1F3A] border border-[#DCEBFA] shadow-xs backdrop-blur-md"
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
                <span className="text-xs uppercase tracking-[0.25em] text-[#174EA6] font-semibold">
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-[#6B7280] hover:text-[#0B1F3A] rounded-md hover:bg-[#F5F9FE] border border-[#E5E7EB] transition-all"
                    title="Share Link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2 text-[#6B7280] hover:text-[#174EA6] rounded-md hover:bg-[#F5F9FE] border border-[#E5E7EB] transition-all"
                    title="Add to Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFavorited ? 'fill-[#174EA6] text-[#174EA6]' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {copiedLink && (
                <p className="text-[11px] text-[#174EA6] font-medium">Link copied to clipboard!</p>
              )}

              {/* Title & Subtitle */}
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#0B1F3A] mt-2">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1">{product.subtitle}</p>

              {/* Stars & Reviews */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#0B1F3A]">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-[#6B7280]">
                  ({product.reviewCount} verified reviews)
                </span>
              </div>

              {/* Price & Value */}
              <div className="flex items-baseline gap-3 mt-5 pt-4 border-t border-[#E5E7EB]">
                <span className="text-3xl font-semibold text-[#0B1F3A]">
                  {formatPrice(currentPrice)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-base text-[#9CA3AF] line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-xs text-[#0B1F3A] font-semibold bg-[#DCEBFA] px-2.5 py-1 rounded-sm">
                  In Stock &bull; Ready to Ship
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4B5563] mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Shade Selector if variants exist */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold text-[#0B1F3A]">Select Shade Tone:</span>
                    <span className="text-[#174EA6] font-semibold">{selectedVariant?.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`w-9 h-9 rounded-full border transition-all flex items-center justify-center ${
                          selectedVariant?.id === v.id
                            ? 'ring-2 ring-offset-2 ring-[#0B1F3A] scale-110 shadow-sm'
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

              {/* Quantity & Add to Cart & WhatsApp Order Buttons */}
              <div className="mt-8 pt-6 border-t border-[#E5E7EB] space-y-3">
                {/* Row 1: Quantity selector & Add to Bag */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#E5E7EB] rounded-none px-3.5 py-3 bg-[#F5F9FE]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-sm font-bold text-[#6B7280] hover:text-[#0B1F3A] px-2"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold px-3 text-[#0B1F3A] font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-sm font-bold text-[#6B7280] hover:text-[#0B1F3A] px-2"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`flex-1 py-3.5 px-6 rounded-none text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2.5 transition-all ${
                      isAdded
                        ? 'bg-[#174EA6] text-white shadow-md'
                        : 'bg-[#0B1F3A] hover:bg-[#174EA6] text-white shadow-sm hover:shadow-md'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#DCEBFA]" /> Add to Bag &bull;{' '}
                        {formatPrice(currentPrice * quantity)}
                      </>
                    )}
                  </button>
                </div>

                {/* Row 2: Instant WhatsApp Order Button */}
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                    `Hello City Cosmetics Sunyani,\n\nI want to order:\n*Product:* ${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''}\n*Quantity:* ${quantity}\n*Total Price:* ${formatPrice(currentPrice * quantity)}\n\nPlease confirm showroom pickup or immediate delivery in Sunyani/Ghana. Thank you!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 px-6 rounded-none text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct Order on WhatsApp &bull; Fast Sunyani Dispatch</span>
                </a>

                {/* Guarantees row */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-[#6B7280]">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#174EA6]" /> Free Express Shipping over GH₵800
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#174EA6]" /> 30-Day Glowing Guarantee
                  </div>
                </div>
              </div>

              {/* Accordions */}
              <div className="mt-8 pt-6 border-t border-[#E5E7EB] space-y-3">
                {/* 1. Benefits */}
                <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === 'benefits' ? '' : 'benefits')
                    }
                    className="w-full px-5 py-4 flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#0B1F3A]"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#174EA6]" /> Botanical Key Benefits
                    </span>
                    {openAccordion === 'benefits' ? (
                      <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                    )}
                  </button>
                  {openAccordion === 'benefits' && (
                    <div className="px-5 pb-4 pt-1 text-xs text-[#4B5563] border-t border-[#E5E7EB]">
                      <ul className="space-y-1.5 list-disc pl-4">
                        {product.benefits.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 2. Full Ingredients */}
                <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === 'ingredients' ? '' : 'ingredients')
                    }
                    className="w-full px-5 py-4 flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#0B1F3A]"
                  >
                    <span>Full Ingredients List (Clean Actives)</span>
                    {openAccordion === 'ingredients' ? (
                      <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                    )}
                  </button>
                  {openAccordion === 'ingredients' && (
                    <div className="px-5 pb-4 pt-1 text-xs text-[#6B7280] leading-relaxed border-t border-[#E5E7EB]">
                      {product.ingredients}
                    </div>
                  )}
                </div>

                {/* 3. How to Apply */}
                <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === 'howto' ? '' : 'howto')
                    }
                    className="w-full px-5 py-4 flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#0B1F3A]"
                  >
                    <span>Ritual & How to Apply</span>
                    {openAccordion === 'howto' ? (
                      <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                    )}
                  </button>
                  {openAccordion === 'howto' && (
                    <div className="px-5 pb-4 pt-1 text-xs text-[#4B5563] leading-relaxed border-t border-[#E5E7EB]">
                      {product.howToUse}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Proof Before/After Comparison */}
        <div className="mt-16">
          <BeforeAfterSlider
            title={`Clinical Results & Transformation with ${product.name}`}
            subtitle="Documented visible texture softening and barrier hydration under tropical climate conditions."
          />
        </div>

        {/* Customer Reviews Section with Form */}
        <section className="mt-20 pt-12 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#174EA6] font-semibold">
                Customer Testimonials
              </span>
              <h2 className="font-serif-luxury text-3xl font-normal text-[#0B1F3A] mt-1">
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
                  className="bg-white p-5 rounded-none border border-[#E5E7EB] shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#6B7280]">{rev.date}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#0B1F3A]">{rev.title}</h4>
                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">{rev.comment}</p>
                  <div className="pt-2 flex items-center justify-between text-xs text-[#6B7280]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#0B1F3A]">{rev.author}</span>
                      {rev.verified && (
                        <span className="text-[#174EA6] flex items-center gap-0.5 text-[11px] font-medium">
                          <CheckCircle className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    {rev.skinType && (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#F5F9FE] border border-[#E5E7EB]">
                        Skin: {rev.skinType}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Write a Review Box */}
            <div className="lg:col-span-5 bg-[#F5F9FE] p-6 rounded-none border border-[#E5E7EB] shadow-xs h-fit space-y-4">
              <h3 className="font-serif-luxury text-lg font-semibold text-[#0B1F3A]">
                Share Your Experience
              </h3>
              <p className="text-xs text-[#6B7280]">
                Tell our Sunyani community how {product.name} feels on your skin.
              </p>

              {reviewSubmitted ? (
                <div className="bg-[#DCEBFA] text-[#0B1F3A] p-4 rounded-none text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#174EA6]" /> Thank you! Your review has been posted.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-[#0B1F3A] block mb-1">
                      Your Rating *
                    </label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 text-amber-500 hover:scale-110 transition-transform"
                          title={`${star} Star${star > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newReviewRating ? 'fill-current' : 'text-[#E5E7EB]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0B1F3A] block mb-1">
                      Your Skin Type
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Dry', 'Oily', 'Combination', 'Sensitive'].map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setNewReviewSkinType(type)}
                          className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-medium border transition-colors ${
                            newReviewSkinType === type
                              ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                              : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#0B1F3A]'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0B1F3A] block mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Eleanor W."
                      className="w-full bg-white border border-[#E5E7EB] rounded-none px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0B1F3A] block mb-1">Review Headline</label>
                    <input
                      type="text"
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      placeholder="e.g. Incredible hydration under Ghana heat"
                      className="w-full bg-white border border-[#E5E7EB] rounded-none px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0B1F3A] block mb-1">
                      Review Comments *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Describe hydration, scent, texture, or results..."
                      className="w-full bg-white border border-[#E5E7EB] rounded-none px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-wider font-semibold py-3 rounded-none shadow-sm transition-colors"
                  >
                    Submit Verified Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Pairs Well With / Related Products */}
        <section className="mt-20 pt-12 border-t border-[#E5E7EB]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#174EA6] font-semibold">
              Complete The Ritual
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#0B1F3A] mt-1">
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
