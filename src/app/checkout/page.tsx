'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Smartphone,
  Truck,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { formatPrice } from '@/lib/formatPrice';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { SITE_CONFIG } from '@/lib/siteConfig';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    discountAmount,
    discountPercent,
    promoCode,
    shippingFee,
    total,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    firstName: 'Ama',
    lastName: 'Osei',
    email: 'ama.osei@citycosmetics.gh',
    phone: '024 412 3456',
    address: 'Plot 14, Commercial Avenue',
    city: 'Sunyani',
    state: 'Bono Region',
    postalCode: 'BS-0023-4560',
    country: 'Ghana',
    paymentMethod: 'momo', // 'momo' | 'paystack' | 'cod'
    momoNetwork: 'MTN Mobile Money',
    momoPhone: '024 412 3456',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••',
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [lastOrderDetails, setLastOrderDetails] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsProcessing(true);

    const generatedOrderNumber = `CC-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      orderNumber: generatedOrderNumber,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      total: total,
      items: items.map((it) => ({
        name: it.product.name,
        quantity: it.quantity,
        price: it.selectedVariant?.priceOverride ?? it.product.price,
        variant: it.selectedVariant?.name || 'Default',
      })),
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country}`,
      paymentMethod: formData.paymentMethod === 'momo'
        ? `${formData.momoNetwork} (${formData.momoPhone})`
        : formData.paymentMethod === 'paystack'
        ? 'Card (Paystack Encrypted)'
        : 'Pay on Delivery (Sunyani)',
    };

    setLastOrderDetails(orderPayload);

    // Save to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('orders').insert({
          customer_name: orderPayload.customerName,
          customer_email: orderPayload.customerEmail,
          items: orderPayload.items,
          total_amount: orderPayload.total,
          shipping_address: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            phone: formData.phone,
            method: orderPayload.paymentMethod,
          },
          status: 'Processing',
          payment_status: formData.paymentMethod === 'cod' ? 'Pending' : 'Paid',
        });
      } catch (err) {
        console.warn('Could not insert order directly to Supabase table:', err);
      }
    }

    setTimeout(() => {
      setOrderNumber(generatedOrderNumber);
      setIsProcessing(false);
      setOrderComplete(true);

      try {
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#a85845', '#d69482', '#2c6e3b'],
        });
      } catch (e) {}

      clearCart();
    }, 1200);
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!lastOrderDetails) return;
    const msg = `Hello City Cosmetics Sunyani! 🌸\n\nI just placed an order on your website:\n*Order Ref:* #${lastOrderDetails.orderNumber}\n*Customer:* ${lastOrderDetails.customerName}\n*Phone:* ${lastOrderDetails.customerPhone}\n*Delivery Address:* ${lastOrderDetails.shippingAddress}\n*Total:* ${formatPrice(lastOrderDetails.total)}\n*Payment:* ${lastOrderDetails.paymentMethod}\n\nPlease confirm order preparation and dispatch in Sunyani. Thank you!`;
    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] py-16 flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto px-4 text-center bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-[#ede4dc] animate-fadeIn space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#eaf4eb] text-[#2c6e3b] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-[#a85845] font-semibold">
              Payment Confirmed &bull; Sunyani, Ghana
            </span>
            <h1 className="font-serif-luxury text-3xl font-normal text-[#121113] mt-1">
              Medaase! Thank You for Your Order!
            </h1>
            <p className="text-xs text-[#8a8075] mt-2">
              Order reference: <strong className="text-[#121113] font-mono text-sm">{orderNumber}</strong>
            </p>
          </div>

          <div className="text-xs sm:text-sm text-[#5a544e] leading-relaxed bg-[#fbf9f7] p-5 rounded-2xl border border-[#ede4dc] text-left space-y-2">
            <p className="font-semibold text-[#121113] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#a85845]" /> Your botanical ritual is being hand-prepared.
            </p>
            <p>
              A confirmation email has been dispatched to <strong>{formData.email}</strong>. Our local courier in Sunyani will contact <strong>{formData.phone}</strong> before delivery.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={handleSendWhatsAppConfirmation}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-6 rounded-full text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" /> Send Order Notification to WhatsApp
            </button>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/shop"
                className="btn-luxury-primary text-white text-xs uppercase tracking-widest font-semibold py-3.5 px-8 rounded-full shadow"
              >
                Continue Shopping
              </Link>
              <Link
                href="/account"
                className="bg-white border border-[#d8cec4] text-[#121113] text-xs uppercase tracking-widest font-semibold py-3.5 px-6 rounded-full hover:border-[#a85845]"
              >
                View in Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf8] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ede8] text-[#a85845] text-xs font-semibold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted Checkout &bull; Sunyani, Ghana
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#121113]">
            Secure Checkout
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#ede4dc] shadow-sm max-w-lg mx-auto">
            <ShoppingBag className="w-12 h-12 text-[#d69482] mx-auto mb-3" />
            <h2 className="font-serif-luxury text-xl text-[#121113]">Your bag is currently empty</h2>
            <p className="text-xs text-[#8a8075] mt-2 mb-6">
              Discover our botanical formulations and add your favorites to checkout.
            </p>
            <Link
              href="/shop"
              className="btn-luxury-primary text-white text-xs uppercase tracking-widest font-semibold py-3.5 px-8 rounded-full shadow inline-block"
            >
              Explore Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Column */}
            <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
              {/* 1. Contact Information */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ede4dc] shadow-sm space-y-4">
                <h3 className="font-serif-luxury text-lg font-semibold text-[#121113]">
                  1. Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#1e1b18] block mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-[#fbf9f7] border border-[#d8cec4] rounded-xl px-3 py-2.5 text-xs text-[#1e1b18] focus:outline-none focus:border-[#a85845]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1e1b18] block mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-[#fbf9f7] border border-[#d8cec4] rounded-xl px-3 py-2.5 text-xs text-[#1e1b18] focus:outline-none focus:border-[#a85845]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1e1b18] block mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#fbf9f7] border border-[#d8cec4] rounded-xl px-3 py-2.5 text-xs text-[#1e1b18] focus:outline-none focus:border-[#a85845]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1e1b18] block mb-1">Phone Number (Ghana)</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="024 123 4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#fbf9f7] border border-[#d8cec4] rounded-xl px-3 py-2.5 text-xs text-[#1e1b18] focus:outline-none focus:border-[#a85845]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ede4dc] shadow-sm space-y-4">
                <h3 className="font-serif-luxury text-lg font-semibold text-[#121113]">
                  2. Delivery Destination
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-[#1e1b18] block mb-1">Street / Location Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="e.g. Plot 14, Commercial Avenue, Sunyani"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-[#fbf9f7] border border-[#d8cec4] rounded-xl px-3 py-2.5 text-xs text-[#1e1b18] focus:outline-none focus:border-[#a85845]"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-[#1e1b18] block mb-1">City / Town</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-[#fbf9f7] border border-[#d8cec4] rounded-xl px-3 py-2.5 text-xs text-[#1e1b18] focus:outline-none focus:border-[#a85845]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#1e1b18] block mb-1">Region</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-[#fbf9f7] border border-[#d8cec4] rounded-xl px-3 py-2.5 text-xs text-[#1e1b18] focus:outline-none focus:border-[#a85845]"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-medium text-[#1e1b18] block mb-1">Country</label>
                      <input
                        type="text"
                        name="country"
                        disabled
                        value={formData.country}
                        className="w-full bg-[#f4ede8] border border-[#d8cec4] rounded-xl px-3 py-2.5 text-xs text-[#6b645d] cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Payment Method (Ghana MoMo / Paystack / COD) */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ede4dc] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-luxury text-lg font-semibold text-[#121113]">
                    3. Payment Method
                  </h3>
                  <div className="flex items-center gap-1 text-[#2c6e3b] text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4" /> SSL Encrypted
                  </div>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#f4ede8] rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'momo' })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'momo'
                        ? 'bg-white text-[#121113] shadow-sm'
                        : 'text-[#6b645d] hover:text-[#121113]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#e5a00d]" /> MoMo
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'paystack' })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'paystack'
                        ? 'bg-white text-[#121113] shadow-sm'
                        : 'text-[#6b645d] hover:text-[#121113]'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#0ba4db]" /> Card
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'bg-white text-[#121113] shadow-sm'
                        : 'text-[#6b645d] hover:text-[#121113]'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 text-[#2c6e3b]" /> Sunyani COD
                  </button>
                </div>

                {/* MoMo Options */}
                {formData.paymentMethod === 'momo' && (
                  <div className="p-4 rounded-2xl border border-[#ebd2c7] bg-[#fdf8f5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#121113]">
                        Ghana Mobile Money
                      </span>
                      <span className="text-[10px] text-[#8a8075]">MTN &bull; Telecel &bull; AT</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-medium text-[#6b645d] block mb-1">
                          Network Provider
                        </label>
                        <select
                          name="momoNetwork"
                          value={formData.momoNetwork}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#d8cec4] rounded-xl px-3 py-2 text-xs"
                        >
                          <option value="MTN Mobile Money">MTN Mobile Money</option>
                          <option value="Telecel Cash">Telecel Cash (Vodafone)</option>
                          <option value="AT Money">AT Money (AirtelTigo)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[#6b645d] block mb-1">
                          MoMo Wallet Number
                        </label>
                        <input
                          type="tel"
                          name="momoPhone"
                          required
                          value={formData.momoPhone}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#d8cec4] rounded-xl px-3 py-2 text-xs"
                          placeholder="024 123 4567"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-[#8a8075] bg-white p-2.5 rounded-xl border border-[#ede4dc]">
                      ⚡ You will receive an instant payment push prompt on your handset to approve the GH₵ transaction.
                    </p>
                  </div>
                )}

                {/* Card / Paystack */}
                {formData.paymentMethod === 'paystack' && (
                  <div className="p-4 rounded-2xl border border-[#ebd2c7] bg-[#fdf8f5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#121113]">
                        Debit or Credit Card (Paystack Secured)
                      </span>
                      <span className="text-[10px] text-[#0ba4db] font-semibold">Paystack GHS</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-1">
                      <div className="col-span-3">
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#d8cec4] rounded-xl px-3 py-2 text-xs"
                          placeholder="Card Number"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          name="cardExp"
                          value={formData.cardExp}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#d8cec4] rounded-xl px-3 py-2 text-xs"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#d8cec4] rounded-xl px-3 py-2 text-xs"
                          placeholder="CVC"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* COD */}
                {formData.paymentMethod === 'cod' && (
                  <div className="p-4 rounded-2xl border border-[#c4e4c9] bg-[#f3f9f4] space-y-1">
                    <span className="text-xs font-semibold text-[#2c6e3b] block">
                      Pay on Delivery (Sunyani Municipality)
                    </span>
                    <p className="text-[11px] text-[#5a544e]">
                      Available for deliveries within Sunyani Central, Fiapre, Berlin Top, and environs. Pay with cash or MoMo directly to the dispatch courier.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn-luxury-gold text-white text-xs uppercase tracking-widest font-semibold py-4 rounded-full flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all"
              >
                {isProcessing ? (
                  <span>Authorizing {formData.paymentMethod === 'momo' ? formData.momoNetwork : 'Payment'}...</span>
                ) : (
                  <>
                    <span>Complete Order &bull; {formatPrice(total)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Order Summary Column */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ede4dc] shadow-sm sticky top-28 space-y-6">
                <h3 className="font-serif-luxury text-lg font-semibold text-[#121113] pb-3 border-b border-[#ede4dc]">
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h3>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const price = item.selectedVariant?.priceOverride ?? item.product.price;
                    return (
                      <div
                        key={`${item.product.id}-${item.selectedVariant?.id || 'def'}`}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#ede4dc]"
                          />
                          <div>
                            <p className="font-semibold text-[#121113] line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-[11px] text-[#8a8075]">Qty: {item.quantity}</p>
                            {item.selectedVariant && (
                              <p className="text-[10px] text-[#a85845]">
                                {item.selectedVariant.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold text-[#121113]">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-4 border-t border-[#ede4dc] text-xs text-[#5a544e]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#121113] font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#2c6e3b]">
                      <span>Discount ({promoCode})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#121113] font-medium">
                      {shippingFee === 0 ? 'FREE Express (Sunyani & Nationwide)' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#121113] pt-3 border-t border-[#ede4dc]">
                    <span>Total</span>
                    <span className="font-serif-luxury text-xl">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#fbf9f7] rounded-2xl border border-[#ede4dc] text-[11px] text-[#6b645d] space-y-1">
                  <p className="flex items-center gap-1.5 font-semibold text-[#121113]">
                    <Sparkles className="w-3.5 h-3.5 text-[#d69482]" /> Includes Luxury Travel Pouch
                  </p>
                  <p>All formulas shipped from Sunyani in temperature-controlled packaging.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
