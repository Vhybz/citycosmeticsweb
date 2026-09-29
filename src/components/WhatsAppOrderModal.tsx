'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  Phone,
  Truck,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Plus,
  Minus,
  MapPin,
  User,
} from 'lucide-react';
import { useWhatsAppOrder } from '@/lib/whatsappOrderContext';
import { formatPrice } from '@/lib/formatPrice';
import { SITE_CONFIG } from '@/lib/siteConfig';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import confetti from 'canvas-confetti';

export const WhatsAppOrderModal: React.FC = () => {
  const { isOpen, product, selectedVariant, quantity: initialQuantity, closeWhatsAppOrder } =
    useWhatsAppOrder();

  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(selectedVariant);
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [callLine, setCallLine] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(initialQuantity > 0 ? initialQuantity : 1);
      setVariant(
        selectedVariant ||
          (product.variants && product.variants.length > 0 ? product.variants[0] : null)
      );
      setIsSubmitted(false);
    }
  }, [product, selectedVariant, initialQuantity]);

  if (!isOpen || !product) return null;

  const unitPrice = variant?.priceOverride ?? product.price;
  const itemsSubtotal = unitPrice * quantity;
  // Delivery fee is 20gh and always added to total price
  const deliveryFee = 20;
  const grandTotal = itemsSubtotal + deliveryFee;

  const packshotImage = product.images?.[0] || '/beautyImages/1.jpg';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !callLine.trim() || !deliveryLocation.trim()) {
      return;
    }

    setIsSubmitting(true);

    const generatedOrderRef = `CC-WA-${Math.floor(100000 + Math.random() * 900000)}`;

    // Build absolute URL for the image so it can be previewed or opened directly on WhatsApp
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://citycosmetics.vercel.app';
    const absoluteImageUrl = packshotImage.startsWith('http')
      ? packshotImage
      : `${origin}${packshotImage.startsWith('/') ? '' : '/'}${packshotImage}`;

    const effectiveWhatsApp = whatsappNumber.trim() || callLine.trim();

    // Construct structured WhatsApp message
    const msg = `✨ *NEW ORDER — CITY COSMETICS SUNYANI* ✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 *PRODUCT ORDERED:*
• *Item:* ${product.name}
• *Variant:* ${variant ? variant.name : 'Standard'}
• *Quantity:* ${quantity}
• *Unit Price:* ${formatPrice(unitPrice)}
• *Packshot Image:* ${absoluteImageUrl}

🚚 *DELIVERY & PRICING:*
• *Items Subtotal:* ${formatPrice(itemsSubtotal)}
• *Sunyani Delivery Fee:* GH₵ 20.00 (Standard Dispatch)
• *GRAND TOTAL:* ${formatPrice(grandTotal)}

👤 *CUSTOMER CONTACT DETAILS:*
• *Name:* ${customerName.trim()}
• *WhatsApp Number:* ${effectiveWhatsApp}
• *Direct Call Line:* ${callLine.trim()} 📞
• *Delivery Location in Sunyani:* ${deliveryLocation.trim()}
${notes.trim() ? `• *Order Note:* ${notes.trim()}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please call my phone line (${callLine.trim()}) to confirm payment and deliver from Sunyani. Medaase!`;

    // Save order into Supabase orders table in background
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('orders').insert({
          order_number: generatedOrderRef,
          customer_name: customerName.trim(),
          customer_email: `${customerName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}@whatsapp.order`,
          customer_phone: callLine.trim(),
          items: [
            {
              name: product.name,
              variant: variant ? variant.name : 'Default',
              quantity,
              price: unitPrice,
              image: absoluteImageUrl,
            },
          ],
          total_amount: grandTotal,
          shipping_address: {
            address: deliveryLocation.trim(),
            city: 'Sunyani',
            country: 'Ghana',
            whatsapp: effectiveWhatsApp,
            call_line: callLine.trim(),
            delivery_fee: 20,
            channel: 'WhatsApp Direct',
          },
          payment_method: 'WhatsApp Order (Call & Deliver)',
          status: 'Processing',
          payment_status: 'Pending',
          dispatch_notes: `Call Line: ${callLine.trim()} | WhatsApp: ${effectiveWhatsApp}`,
        });
      } catch (err) {
        console.warn('Could not register WhatsApp order into Supabase:', err);
      }
    }

    // Send SMS alert to 0503574865 to check WhatsApp, confirm payment & dispatch
    try {
      fetch('/api/notify-order-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: generatedOrderRef,
          customerName: customerName.trim(),
          total: grandTotal,
          phone: callLine.trim(),
          channel: 'whatsapp',
        }),
      }).catch((e) => console.warn('SMS dispatch ping error:', e));
    } catch {}

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#25D366', '#0B1F3A', '#174EA6'],
      });
    } catch {}

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Open WhatsApp
    const waUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white max-w-xl w-full border border-[#E5E7EB] shadow-2xl rounded-none overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0B1F3A] text-white px-5 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#25D366] text-white flex items-center justify-center rounded-none shadow-sm">
              <MessageCircle className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base sm:text-lg font-normal text-white">
                Direct WhatsApp Order
              </h3>
              <p className="text-[10px] text-[#DCEBFA]/75 font-mono uppercase tracking-wider">
                Sunyani Showroom Dispatch &bull; GH₵ 20 Delivery
              </p>
            </div>
          </div>
          <button
            onClick={closeWhatsAppOrder}
            className="p-1.5 text-[#DCEBFA]/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-[#DCEBFA] text-[#0B1F3A] flex items-center justify-center mx-auto rounded-none border border-[#174EA6]/20">
                <CheckCircle2 className="w-8 h-8 text-[#174EA6]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#174EA6] block">
                  Order Dispatched to WhatsApp
                </span>
                <h4 className="font-serif-luxury text-2xl text-[#0B1F3A] mt-1">
                  Medaase, {customerName}!
                </h4>
                <p className="text-xs text-[#6B7280] mt-2 max-w-md mx-auto leading-relaxed">
                  Your order details and product packshot have been pre-filled in WhatsApp. Our Sunyani dispatch team will call you on{' '}
                  <strong className="text-[#0B1F3A] font-mono">{callLine}</strong> to confirm payment and rider delivery.
                </p>
              </div>

              <div className="p-4 bg-[#F5F9FE] border border-[#E5E7EB] text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#6B7280] font-sans">Product:</span>
                  <span className="font-semibold text-[#0B1F3A]">{product.name} (x{quantity})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280] font-sans">Sunyani Delivery Fee:</span>
                  <span>GH₵ 20.00</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#E5E7EB] font-bold text-sm text-[#0B1F3A]">
                  <span className="font-sans">Total Payable:</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeWhatsAppOrder}
                className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-3 px-8 rounded-none transition-colors"
              >
                Done / Continue Shopping
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Product Packshot Snapshot */}
              <div className="flex gap-4 p-3.5 bg-[#F5F9FE] border border-[#DCEBFA] rounded-none">
                <div className="relative w-20 h-20 bg-white border border-[#E5E7EB] shrink-0 overflow-hidden">
                  <img
                    src={packshotImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#174EA6] block">
                      {product.category}
                    </span>
                    <h4 className="font-serif-luxury text-sm font-semibold text-[#0B1F3A] line-clamp-1">
                      {product.name}
                    </h4>
                    {product.variants && product.variants.length > 1 && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] text-[#6B7280]">Size:</span>
                        <select
                          value={variant?.id || ''}
                          onChange={(e) => {
                            const found = product.variants?.find((v) => v.id === e.target.value);
                            if (found) setVariant(found);
                          }}
                          className="text-[11px] bg-white border border-[#E5E7EB] px-2 py-0.5 rounded-none font-semibold text-[#0B1F3A]"
                        >
                          {product.variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name} ({formatPrice(v.priceOverride ?? product.price)})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-[#E5E7EB] bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 py-1 text-[#6B7280] hover:text-[#0B1F3A]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-mono font-bold text-[#0B1F3A]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 py-1 text-[#6B7280] hover:text-[#0B1F3A]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono text-xs font-bold text-[#0B1F3A]">
                      {formatPrice(itemsSubtotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Fee Notice (Always Added 20gh) */}
              <div className="bg-[#FAF5E6] border border-[#F3E8B5] p-3 rounded-none flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#785E0E]">
                  <Truck className="w-4 h-4 shrink-0 text-[#B45309]" />
                  <span>
                    <strong>Sunyani Dispatch Rider:</strong> Flat GH₵ 20.00 delivery fee always added to your order total.
                  </span>
                </div>
                <span className="font-mono font-bold text-[#B45309] shrink-0 ml-2">+GH₵ 20.00</span>
              </div>

              {/* Customer Inputs Form */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-[#1F2937] block mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ama Osei"
                      className="w-full bg-[#F5F9FE] border border-[#E5E7EB] pl-9 pr-3 py-2 text-xs text-[#1F2937] rounded-none focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#1F2937] block mb-1">
                      Call Line (Phone to Call You) *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-[#174EA6] absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={callLine}
                        onChange={(e) => setCallLine(e.target.value)}
                        placeholder="024 123 4567"
                        className="w-full bg-[#F5F9FE] border-2 border-[#174EA6]/30 pl-9 pr-3 py-2 text-xs text-[#1F2937] font-mono rounded-none focus:outline-none focus:border-[#0B1F3A]"
                      />
                    </div>
                    <span className="text-[10px] text-[#174EA6] block mt-0.5">
                      We will call this line to confirm payment &amp; dispatch
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#1F2937] block mb-1">
                      WhatsApp Number (Optional)
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366] absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="Leave blank if same as Call Line"
                        className="w-full bg-[#F5F9FE] border border-[#E5E7EB] pl-9 pr-3 py-2 text-xs text-[#1F2937] font-mono rounded-none focus:outline-none focus:border-[#0B1F3A]"
                      />
                    </div>
                    <span className="text-[10px] text-[#6B7280] block mt-0.5">
                      If different from your call line
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#1F2937] block mb-1">
                    Delivery Address / Area in Sunyani *
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      placeholder="e.g. Fiapre near Catholic University, Sunyani"
                      className="w-full bg-[#F5F9FE] border border-[#E5E7EB] pl-9 pr-3 py-2 text-xs text-[#1F2937] rounded-none focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#6B7280] block mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call when rider reaches landmark..."
                    className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937] rounded-none focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>
              </div>

              {/* Total Summary */}
              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] block">
                    Total Amount (Incl. GH₵20 Delivery)
                  </span>
                  <span className="font-serif-luxury text-xl font-bold text-[#0B1F3A]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 px-6 rounded-none text-xs uppercase tracking-wider font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{isSubmitting ? 'Preparing...' : 'Send Order to WhatsApp'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
