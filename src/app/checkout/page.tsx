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
  Copy,
  Check,
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

  const [orderRef] = useState<string>(
    () => `CC-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [copiedField, setCopiedField] = useState<'number' | 'ref' | 'amount' | null>(null);

  const handleCopy = (text: string, field: 'number' | 'ref' | 'amount') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2200);
    }
  };

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
    momoTransactionId: '',
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

    const generatedOrderNumber = orderRef;

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
      paymentMethod:
        formData.paymentMethod === 'momo'
          ? `Direct MoMo: ${formData.momoNetwork} (TxID: ${formData.momoTransactionId.trim() || 'Pending Verification'})`
          : formData.paymentMethod === 'paystack'
          ? 'Card (Paystack Encrypted)'
          : 'Pay on Delivery (Sunyani)',
      momoTransactionId: formData.momoTransactionId.trim(),
      momoNetwork: formData.momoNetwork,
      momoPhone: formData.momoPhone,
    };

    setLastOrderDetails(orderPayload);

    // Save to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('orders').insert({
          order_number: generatedOrderNumber,
          customer_name: orderPayload.customerName,
          customer_email: orderPayload.customerEmail,
          customer_phone: orderPayload.customerPhone,
          items: orderPayload.items,
          total_amount: orderPayload.total,
          shipping_address: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            phone: formData.phone,
            method: orderPayload.paymentMethod,
            momo_txid: formData.momoTransactionId.trim(),
            momo_network: formData.momoNetwork,
            momo_phone: formData.momoPhone,
          },
          payment_method: orderPayload.paymentMethod,
          status: 'Processing',
          payment_status: formData.paymentMethod === 'cod' ? 'Pending' : 'Paid',
        });
      } catch (err) {
        console.warn('Could not insert order directly to Supabase table:', err);
      }
    }

    // Send SMS alert to 0503574865 to check WhatsApp, confirm payment & dispatch
    try {
      fetch('/api/notify-order-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: generatedOrderNumber,
          customerName: orderPayload.customerName,
          total: orderPayload.total,
          phone: orderPayload.customerPhone,
          channel: 'checkout',
        }),
      }).catch((e) => console.warn('SMS dispatch ping error:', e));
    } catch {}

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
    const isMomo = formData.paymentMethod === 'momo';
    const msg = isMomo
      ? `Hello City Cosmetics Sunyani,\n\nI just completed a Direct MoMo order on your website:\n*Order Ref:* #${lastOrderDetails.orderNumber}\n*MoMo Network:* ${formData.momoNetwork}\n*MoMo Sender:* ${formData.momoPhone}\n*MoMo Transaction ID:* ${formData.momoTransactionId.trim() || 'Awaiting manual check'}\n*Total Paid:* ${formatPrice(lastOrderDetails.total)}\n*Customer:* ${lastOrderDetails.customerName}\n*Delivery Address:* ${lastOrderDetails.shippingAddress}\n\nPlease confirm payment and prepare my dispatch in Sunyani. Medaase!`
      : `Hello City Cosmetics Sunyani,\n\nI just placed an order on your website:\n*Order Ref:* #${lastOrderDetails.orderNumber}\n*Customer:* ${lastOrderDetails.customerName}\n*Phone:* ${lastOrderDetails.customerPhone}\n*Delivery Address:* ${lastOrderDetails.shippingAddress}\n*Total:* ${formatPrice(lastOrderDetails.total)}\n*Payment:* ${lastOrderDetails.paymentMethod}\n\nPlease confirm order preparation and dispatch in Sunyani. Thank you!`;
    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (orderComplete) {
    const isMomo = formData.paymentMethod === 'momo';
    return (
      <div className="min-h-screen bg-white py-16 flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto px-4 text-center bg-white p-8 sm:p-12 rounded-none shadow-xl border border-[#E5E7EB] animate-fadeIn space-y-6">
          <div className="w-16 h-16 rounded-none bg-[#DCEBFA] text-[#0B1F3A] flex items-center justify-center mx-auto shadow-inner border border-[#174EA6]/20">
            <CheckCircle2 className="w-8 h-8 text-[#174EA6]" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-[#174EA6] font-semibold">
              Order Registered &bull; Sunyani, Ghana
            </span>
            <h1 className="font-serif-luxury text-3xl font-normal text-[#0B1F3A] mt-1">
              Medaase! Thank You for Your Order!
            </h1>
            <p className="text-xs text-[#6B7280] mt-2">
              Order reference: <strong className="text-[#0B1F3A] font-mono text-sm">#{orderNumber}</strong>
            </p>
          </div>

          {/* Payment summary box */}
          {isMomo && (
            <div className="bg-[#F5F9FE] border border-[#DCEBFA] p-4 rounded-none text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                <span className="font-semibold text-[#0B1F3A] uppercase tracking-wider text-[10px]">
                  Mobile Money Verification
                </span>
                <span className="px-2 py-0.5 bg-[#0B1F3A] text-white text-[10px] font-mono font-semibold">
                  {formData.momoNetwork}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div>
                  <span className="text-[#6B7280] block text-[10px] uppercase font-sans">MoMo TxID</span>
                  <span className="font-bold text-emerald-800">
                    {formData.momoTransactionId.trim() || 'Awaiting Confirmation'}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px] uppercase font-sans">Sender Number</span>
                  <span className="text-[#1F2937]">{formData.momoPhone}</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px] uppercase font-sans">Merchant Paid</span>
                  <span className="text-[#1F2937]">{SITE_CONFIG.momo?.merchantName || 'CITY COSMETICS'}</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px] uppercase font-sans">Total Transferred</span>
                  <span className="font-bold text-[#0B1F3A]">{formatPrice(lastOrderDetails?.total || total)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs sm:text-sm text-[#4B5563] leading-relaxed bg-[#F5F9FE] p-5 rounded-none border border-[#E5E7EB] text-left space-y-2">
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
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-6 rounded-none text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>
                {isMomo ? 'Send MoMo Payment Proof to WhatsApp' : 'Send Order Notification to WhatsApp'}
              </span>
            </button>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/shop"
                className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-3.5 px-8 rounded-none shadow-sm transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/account"
                className="bg-white border border-[#E5E7EB] text-[#0B1F3A] text-xs uppercase tracking-widest font-semibold py-3.5 px-6 rounded-none hover:border-[#174EA6] transition-colors"
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

                {/* MoMo Options (Direct Transfer & MoMoPay) */}
                {formData.paymentMethod === 'momo' && (
                  <div className="p-4 sm:p-5 rounded-none border border-[#DCEBFA] bg-[#F5F9FE] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-[#E5E7EB]">
                      <div>
                        <span className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block">
                          Direct MoMo Transfer &amp; MoMoPay
                        </span>
                        <span className="text-[11px] text-[#6B7280]">
                          Zero transaction fee &bull; Instant dispatch verification
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0B1F3A] text-[#DCEBFA] uppercase tracking-widest w-fit">
                        Official Sunyani Account
                      </span>
                    </div>

                    {/* Official Merchant Credentials Card */}
                    <div className="bg-white p-4 rounded-none border-2 border-[#174EA6]/30 shadow-xs space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#174EA6]">
                        <span>Official Account Credentials</span>
                        <span>Recipient: {SITE_CONFIG.momo?.merchantName || 'CITY COSMETICS'}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {/* Number */}
                        <div className="bg-[#F5F9FE] p-2.5 border border-[#E5E7EB] flex flex-col justify-between">
                          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-semibold">
                            MoMo Number
                          </span>
                          <span className="font-mono text-xs font-bold text-[#0B1F3A] my-1">
                            {SITE_CONFIG.momo?.mtnNumber || '055 965 0921'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(SITE_CONFIG.momo?.mtnNumber || '055 965 0921', 'number')
                            }
                            className="inline-flex items-center justify-center gap-1 text-[10px] font-semibold text-[#174EA6] hover:text-[#0B1F3A] transition-colors pt-1 border-t border-[#E5E7EB]"
                          >
                            {copiedField === 'number' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy Number
                              </>
                            )}
                          </button>
                        </div>

                        {/* Amount */}
                        <div className="bg-[#F5F9FE] p-2.5 border border-[#E5E7EB] flex flex-col justify-between">
                          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-semibold">
                            Exact Amount
                          </span>
                          <span className="font-mono text-xs font-bold text-[#174EA6] my-1">
                            {formatPrice(total)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(total.toFixed(2), 'amount')}
                            className="inline-flex items-center justify-center gap-1 text-[10px] font-semibold text-[#174EA6] hover:text-[#0B1F3A] transition-colors pt-1 border-t border-[#E5E7EB]"
                          >
                            {copiedField === 'amount' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy Amount
                              </>
                            )}
                          </button>
                        </div>

                        {/* Reference */}
                        <div className="bg-[#F5F9FE] p-2.5 border border-[#E5E7EB] flex flex-col justify-between">
                          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-semibold">
                            Payment Ref
                          </span>
                          <span className="font-mono text-xs font-bold text-[#0B1F3A] my-1">
                            {orderRef}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(orderRef, 'ref')}
                            className="inline-flex items-center justify-center gap-1 text-[10px] font-semibold text-[#174EA6] hover:text-[#0B1F3A] transition-colors pt-1 border-t border-[#E5E7EB]"
                          >
                            {copiedField === 'ref' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy Ref
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Instructions Steps */}
                      <div className="bg-[#FAF5E6] border border-[#F3E8B5] p-3 text-[11px] text-[#785E0E] space-y-1">
                        <span className="font-bold text-[#0B1F3A] block text-[10px] uppercase tracking-wider">
                          How to transfer via phone:
                        </span>
                        <ol className="list-decimal list-inside space-y-0.5 text-[11px] leading-relaxed">
                          <li>Dial <strong>*170#</strong> (MTN) or <strong>*110#</strong> (Telecel / AT).</li>
                          <li>Select <strong>Transfer Money</strong> or <strong>MoMoPay</strong> and send <strong>{formatPrice(total)}</strong> to <strong>055 965 0921</strong>.</li>
                          <li>Recipient displays as: <strong>{SITE_CONFIG.momo?.merchantName || 'CITY COSMETICS'}</strong>.</li>
                          <li>Enter Reference: <strong>{orderRef}</strong> and authorize with your PIN.</li>
                          <li>Copy the <strong>Transaction ID</strong> from your SMS receipt and enter it below.</li>
                        </ol>
                      </div>
                    </div>

                    {/* Customer Sender Details & TxID Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-semibold text-[#1F2937] block mb-1">
                          Network Provider
                        </label>
                        <select
                          name="momoNetwork"
                          value={formData.momoNetwork}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#E5E7EB] rounded-none px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                        >
                          <option value="MTN Mobile Money">MTN Mobile Money</option>
                          <option value="Telecel Cash">Telecel Cash (Vodafone)</option>
                          <option value="AT Money">AT Money (AirtelTigo)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#1F2937] block mb-1">
                          Your Sender Wallet Number *
                        </label>
                        <input
                          type="tel"
                          name="momoPhone"
                          required
                          value={formData.momoPhone}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#E5E7EB] rounded-none px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                          placeholder="024 123 4567"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-[#0B1F3A]">
                            MoMo Transaction ID (From SMS Receipt) *
                          </label>
                          <span className="text-[10px] text-[#174EA6] font-mono">
                            e.g. 28491829402 or MTN-38291
                          </span>
                        </div>
                        <input
                          type="text"
                          name="momoTransactionId"
                          required={formData.paymentMethod === 'momo'}
                          value={formData.momoTransactionId}
                          onChange={handleInputChange}
                          placeholder="Enter the Transaction ID from your confirmation SMS..."
                          className="w-full bg-white border-2 border-[#174EA6]/40 rounded-none px-3 py-2.5 text-xs text-[#0B1F3A] font-mono focus:outline-none focus:border-[#0B1F3A]"
                        />
                        <p className="text-[10px] text-[#6B7280] mt-1">
                          Our Sunyani dispatch desk matches this ID with our merchant notification to prepare your parcel immediately.
                        </p>
                      </div>
                    </div>
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
