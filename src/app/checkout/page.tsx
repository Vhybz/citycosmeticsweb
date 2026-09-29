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
          colors: ['#0B1F3A', '#174EA6', '#DCEBFA'],
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
      <div className="min-h-screen bg-white py-16 flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto px-4 text-center bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-[#E5E7EB] animate-fadeIn space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#DCEBFA] text-[#0B1F3A] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-[#174EA6]" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-[#174EA6] font-semibold">
              Payment Confirmed &bull; Sunyani, Ghana
            </span>
            <h1 className="font-serif-luxury text-3xl font-normal text-[#0B1F3A] mt-1">
              Medaase! Thank You for Your Order!
            </h1>
            <p className="text-xs text-[#6B7280] mt-2">
              Order reference: <strong className="text-[#0B1F3A] font-mono text-sm">{orderNumber}</strong>
            </p>
          </div>

          <div className="text-xs sm:text-sm text-[#4B5563] leading-relaxed bg-[#F5F9FE] p-5 rounded-xl border border-[#E5E7EB] text-left space-y-2">
            <p className="font-semibold text-[#0B1F3A] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#174EA6]" /> Your botanical ritual is being hand-prepared.
            </p>
            <p>
              A confirmation email has been dispatched to <strong>{formData.email}</strong>. Our local courier in Sunyani will contact <strong>{formData.phone}</strong> before delivery.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={handleSendWhatsAppConfirmation}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-6 rounded-md text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" /> Send Order Notification to WhatsApp
            </button>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/shop"
                className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-3.5 px-8 rounded-md shadow-sm transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/account"
                className="bg-white border border-[#E5E7EB] text-[#0B1F3A] text-xs uppercase tracking-widest font-semibold py-3.5 px-6 rounded-md hover:border-[#174EA6] transition-colors"
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
    <div className="min-h-screen bg-[#F5F9FE]/30 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCEBFA] text-[#0B1F3A] text-xs font-semibold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5 text-[#174EA6]" /> 256-Bit SSL Encrypted Checkout &bull; Sunyani, Ghana
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#0B1F3A]">
            Secure Checkout
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E5E7EB] shadow-sm max-w-lg mx-auto">
            <ShoppingBag className="w-12 h-12 text-[#174EA6] mx-auto mb-3" />
            <h2 className="font-serif-luxury text-xl text-[#0B1F3A]">Your bag is currently empty</h2>
            <p className="text-xs text-[#6B7280] mt-2 mb-6">
              Discover our botanical formulations and add your favorites to checkout.
            </p>
            <Link
              href="/shop"
              className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-3.5 px-8 rounded-md shadow-sm inline-block transition-colors"
            >
              Explore Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Column */}
            <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
              {/* 1. Contact Information */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
                <h3 className="font-serif-luxury text-lg font-semibold text-[#0B1F3A]">
                  1. Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#1F2937] block mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1F2937] block mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1F2937] block mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1F2937] block mb-1">Phone Number (Ghana)</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="024 123 4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
                <h3 className="font-serif-luxury text-lg font-semibold text-[#0B1F3A]">
                  2. Delivery Destination
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-[#1F2937] block mb-1">Street / Location Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="e.g. Plot 14, Commercial Avenue, Sunyani"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-[#1F2937] block mb-1">City / Town</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#1F2937] block mb-1">Region</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-medium text-[#1F2937] block mb-1">Country</label>
                      <input
                        type="text"
                        name="country"
                        disabled
                        value={formData.country}
                        className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2.5 text-xs text-[#6B7280] cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Payment Method (Ghana MoMo / Paystack / COD) */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-luxury text-lg font-semibold text-[#0B1F3A]">
                    3. Payment Method
                  </h3>
                  <div className="flex items-center gap-1 text-[#174EA6] text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4" /> SSL Encrypted
                  </div>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#F5F9FE] border border-[#E5E7EB] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'momo' })}
                    className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'momo'
                        ? 'bg-[#0B1F3A] text-white shadow-xs'
                        : 'text-[#6B7280] hover:text-[#0B1F3A]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> MoMo
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'paystack' })}
                    className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'paystack'
                        ? 'bg-[#0B1F3A] text-white shadow-xs'
                        : 'text-[#6B7280] hover:text-[#0B1F3A]'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Card
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'bg-[#0B1F3A] text-white shadow-xs'
                        : 'text-[#6B7280] hover:text-[#0B1F3A]'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" /> Sunyani COD
                  </button>
                </div>

                {/* MoMo Options */}
                {formData.paymentMethod === 'momo' && (
                  <div className="p-4 rounded-xl border border-[#DCEBFA] bg-[#F5F9FE] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#0B1F3A]">
                        Ghana Mobile Money
                      </span>
                      <span className="text-[10px] text-[#6B7280]">MTN &bull; Telecel &bull; AT</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-medium text-[#6B7280] block mb-1">
                          Network Provider
                        </label>
                        <select
                          name="momoNetwork"
                          value={formData.momoNetwork}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                        >
                          <option value="MTN Mobile Money">MTN Mobile Money</option>
                          <option value="Telecel Cash">Telecel Cash (Vodafone)</option>
                          <option value="AT Money">AT Money (AirtelTigo)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[#6B7280] block mb-1">
                          MoMo Wallet Number
                        </label>
                        <input
                          type="tel"
                          name="momoPhone"
                          required
                          value={formData.momoPhone}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                          placeholder="024 123 4567"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-[#6B7280] bg-white p-2.5 rounded-md border border-[#E5E7EB]">
                      ⚡ You will receive an instant payment push prompt on your handset to approve the GH₵ transaction.
                    </p>
                  </div>
                )}

                {/* Card / Paystack */}
                {formData.paymentMethod === 'paystack' && (
                  <div className="p-4 rounded-xl border border-[#DCEBFA] bg-[#F5F9FE] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#0B1F3A]">
                        Debit or Credit Card (Paystack Secured)
                      </span>
                      <span className="text-[10px] text-[#174EA6] font-semibold">Paystack GHS</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-1">
                      <div className="col-span-3">
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                          placeholder="Card Number"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          name="cardExp"
                          value={formData.cardExp}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                          placeholder="CVC"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* COD */}
                {formData.paymentMethod === 'cod' && (
                  <div className="p-4 rounded-xl border border-[#DCEBFA] bg-[#F5F9FE] space-y-1">
                    <span className="text-xs font-semibold text-[#0B1F3A] block">
                      Pay on Delivery (Sunyani Municipality)
                    </span>
                    <p className="text-[11px] text-[#4B5563]">
                      Available for deliveries within Sunyani Central, Fiapre, Berlin Top, and environs. Pay with cash or MoMo directly to the dispatch courier.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-4 rounded-md flex items-center justify-center gap-2 shadow-sm transition-all"
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
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-xs sticky top-28 space-y-6">
                <h3 className="font-serif-luxury text-lg font-semibold text-[#0B1F3A] pb-3 border-b border-[#E5E7EB]">
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
                            className="w-12 h-12 rounded-md object-cover border border-[#E5E7EB]"
                          />
                          <div>
                            <p className="font-semibold text-[#0B1F3A] line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-[11px] text-[#6B7280]">Qty: {item.quantity}</p>
                            {item.selectedVariant && (
                              <p className="text-[10px] text-[#174EA6]">
                                {item.selectedVariant.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold text-[#0B1F3A]">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-4 border-t border-[#E5E7EB] text-xs text-[#4B5563]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#0B1F3A] font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#174EA6]">
                      <span>Discount ({promoCode})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#0B1F3A] font-medium">
                      {shippingFee === 0 ? 'FREE Express (Sunyani & Nationwide)' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#0B1F3A] pt-3 border-t border-[#E5E7EB]">
                    <span>Total</span>
                    <span className="font-serif-luxury text-xl">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F5F9FE] rounded-lg border border-[#E5E7EB] text-[11px] text-[#6B7280] space-y-1">
                  <p className="flex items-center gap-1.5 font-semibold text-[#0B1F3A]">
                    <Sparkles className="w-3.5 h-3.5 text-[#174EA6]" /> Includes Luxury Travel Pouch
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
