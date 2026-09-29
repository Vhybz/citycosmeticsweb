'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/siteConfig';
import { formatPrice } from '@/lib/formatPrice';

interface WhatsAppButtonProps {
  productName?: string;
  variantName?: string;
  price?: number;
  quantity?: number;
  cartItems?: Array<{ name: string; quantity: number; price: number; variant?: string }>;
  cartTotal?: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'pill';
  text?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  productName,
  variantName,
  price,
  quantity = 1,
  cartItems,
  cartTotal,
  className = '',
  variant = 'secondary',
  text,
}) => {
  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let message = `Hello City Cosmetics Sunyani,\n\n`;

    if (cartItems && cartItems.length > 0) {
      message += `I would like to place an order for the following items:\n\n`;
      cartItems.forEach((item, index) => {
        const itemLine = `${index + 1}. *${item.name}* ${item.variant ? `(${item.variant})` : ''} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`;
        message += `${itemLine}\n`;
      });
      if (cartTotal) {
        message += `\n*Cart Total:* ${formatPrice(cartTotal)}`;
      }
      message += `\n\nPlease let me know how to proceed with payment and delivery in Sunyani. Thank you!`;
    } else if (productName && price !== undefined) {
      message += `I would like to order:\n*${productName}*\n`;
      if (variantName) {
        message += `• Variant / Shade: ${variantName}\n`;
      }
      message += `• Quantity: ${quantity}\n`;
      message += `• Total: ${formatPrice(price * quantity)}\n\n`;
      message += `Please confirm availability and arrange delivery in Sunyani / Ghana. Thank you!`;
    } else {
      message += `I would like to make an inquiry about your skincare and cosmetics products in Sunyani. Thank you!`;
    }

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getStyle = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md hover:shadow-lg';
      case 'outline':
        return 'border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10';
      case 'pill':
        return 'bg-[#25D366]/15 text-[#128C7E] hover:bg-[#25D366]/25 border border-[#25D366]/30';
      case 'secondary':
      default:
        return 'bg-[#25D366] text-white hover:bg-[#1fa851]';
    }
  };

  return (
    <button
      onClick={handleWhatsAppOrder}
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ${getStyle()} ${className}`}
      title="Order directly via WhatsApp in Sunyani"
    >
      <MessageCircle className="w-4 h-4 fill-current shrink-0" />
      <span>{text || 'Order via WhatsApp'}</span>
    </button>
  );
};
