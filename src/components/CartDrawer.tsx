'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles, Check, Gift } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { PRODUCTS_DATA } from '@/lib/productsData';
import { formatPrice } from '@/lib/formatPrice';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    promoCode,
    discountPercent,
    promoError,
    applyPromoCode,
    removePromoCode,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    freeShippingThreshold,
    totalItemCount,
    addToCart,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Recommendations: pick 2 items not already in cart
  const upsellRecommendations = PRODUCTS_DATA.filter(
    (p) => !items.some((item) => item.product.id === p.id)
  ).slice(0, 2);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const success = applyPromoCode(inputCode);
    if (success) {
      setPromoSuccess(true);
      setInputCode('');
      setTimeout(() => setPromoSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between z-10 border-l border-[#E5E7EB]">
          {/* Header */}
          <div className="p-5 border-b border-[#E5E7EB] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#0B1F3A]" />
              <h2 className="font-serif-luxury text-lg font-medium text-[#0B1F3A]">
                Your Shopping Bag
              </h2>
              <span className="text-xs bg-[#DCEBFA] text-[#0B1F3A] font-semibold px-2 py-0.5 rounded-full">
                {totalItemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#1F2937] hover:text-[#174EA6] rounded-full hover:bg-[#F5F9FE] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#F5F9FE] px-6 py-3.5 border-b border-[#E5E7EB]">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              {remainingForFreeShipping === 0 ? (
                <span className="text-[#174EA6] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#174EA6]" /> You qualify for FREE Luxury Shipping!
                </span>
              ) : (
                <span className="text-[#6B7280]">
                  Add <strong className="text-[#0B1F3A] font-semibold">{formatPrice(remainingForFreeShipping)}</strong> more for <strong>Free Express Shipping</strong>
                </span>
              )}
              <span className="text-[11px] text-[#6B7280] font-semibold">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-[#DCEBFA] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#174EA6] to-[#0B1F3A] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List / Empty State */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F5F9FE] border border-[#DCEBFA] flex items-center justify-center text-[#174EA6]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif-luxury text-xl text-[#0B1F3A]">Your bag is empty</h3>
                <p className="text-xs text-[#6B7280] max-w-xs">
                  Discover our best-selling serums, silk tints, and sensory botanical perfumes.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-luxury-primary text-white text-xs uppercase tracking-wider py-3 px-6 rounded-md shadow"
                >
                  Explore Bestsellers
                </button>
              </div>
            ) : (
              items.map((item) => {
                const price = item.selectedVariant?.priceOverride ?? item.product.price;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`}
                    className="flex gap-4 p-3 bg-white rounded-lg border border-[#E5E7EB] shadow-sm hover:border-[#DCEBFA] transition-colors"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-md object-cover border border-[#E5E7EB]"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-semibold text-[#0B1F3A] line-clamp-1">
                            {item.product.name}
                          </h4>
                          {item.selectedVariant && (
                            <p className="text-[11px] text-[#174EA6] font-medium mt-0.5">
                              Shade: {item.selectedVariant.name}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                          className="text-[#9CA3AF] hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Pill */}
                        <div className="flex items-center border border-[#E5E7EB] rounded-md px-2 py-1 bg-[#F5F9FE]">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.selectedVariant?.id
                              )
                            }
                            className="text-xs text-[#6B7280] px-1 hover:text-[#0B1F3A]"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold px-2 text-[#0B1F3A]">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.selectedVariant?.id
                              )
                            }
                            className="text-xs text-[#6B7280] px-1 hover:text-[#0B1F3A]"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-xs font-semibold text-[#0B1F3A]">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* In-Cart Mini Upsells */}
            {items.length > 0 && upsellRecommendations.length > 0 && (
              <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
                <h4 className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold mb-3 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#174EA6]" /> Recommended Additions
                </h4>
                <div className="space-y-2">
                  {upsellRecommendations.map((upsell) => (
                    <div
                      key={upsell.id}
                      className="flex items-center justify-between bg-[#F5F9FE] p-2.5 rounded-lg border border-[#E5E7EB]"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={upsell.images[0]}
                          alt={upsell.name}
                          className="w-10 h-10 rounded-md object-cover border border-[#E5E7EB]"
                        />
                        <div>
                          <h5 className="text-xs font-medium text-[#0B1F3A] line-clamp-1">
                            {upsell.name}
                          </h5>
                          <p className="text-[11px] text-[#6B7280]">{formatPrice(upsell.price)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(upsell, 1)}
                        className="text-[11px] font-semibold bg-white border border-[#E5E7EB] hover:border-[#0B1F3A] hover:text-[#0B1F3A] px-3 py-1.5 rounded-md transition-all shadow-xs"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer / Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E5E7EB] shadow-lg space-y-3">
              {/* Promo Code Input */}
              {discountPercent > 0 ? (
                <div className="flex items-center justify-between bg-[#DCEBFA] text-[#0B1F3A] px-3 py-2 rounded-md text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#174EA6]" /> Code: {promoCode} ({discountPercent}% OFF applied)
                  </span>
                  <button
                    onClick={removePromoCode}
                    className="text-[#174EA6] hover:text-red-500 underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Promo Code (e.g. CITYGLOW15)"
                    className="flex-1 bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs uppercase text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                  />
                  <button
                    type="submit"
                    className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoError && <p className="text-[11px] text-red-500">{promoError}</p>}
              {promoSuccess && (
                <p className="text-[11px] text-[#174EA6] flex items-center gap-1">
                  <Check className="w-3 h-3" /> Discount applied successfully!
                </p>
              )}

              {/* Cost Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-[#6B7280] pt-2 border-t border-[#E5E7EB]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#0B1F3A] font-medium">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#174EA6]">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-[#0B1F3A] font-medium">
                    {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#0B1F3A] pt-2 border-t border-[#E5E7EB]">
                  <span>Total</span>
                  <span className="text-base font-serif-luxury">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-3.5 rounded-md flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Order via WhatsApp direct button */}
              <WhatsAppButton
                cartItems={items.map((it) => ({
                  name: it.product.name,
                  quantity: it.quantity,
                  price: it.selectedVariant?.priceOverride ?? it.product.price,
                  variant: it.selectedVariant?.name,
                }))}
                cartTotal={total}
                variant="primary"
                text="Order via WhatsApp (Sunyani)"
                className="w-full py-3 text-xs uppercase tracking-wider font-semibold rounded-md shadow-sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
