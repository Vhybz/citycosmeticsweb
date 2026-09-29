'use client';

import React, { createContext, useContext, useState } from 'react';
import { Product, ProductVariant } from '@/types';

interface WhatsAppOrderContextType {
  isOpen: boolean;
  product: Product | null;
  selectedVariant: ProductVariant | null;
  quantity: number;
  openWhatsAppOrder: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  closeWhatsAppOrder: () => void;
}

const WhatsAppOrderContext = createContext<WhatsAppOrderContextType | undefined>(undefined);

export const WhatsAppOrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const openWhatsAppOrder = (
    targetProduct: Product,
    variant?: ProductVariant,
    initialQty: number = 1
  ) => {
    setProduct(targetProduct);
    setSelectedVariant(variant || (targetProduct.variants && targetProduct.variants.length > 0 ? targetProduct.variants[0] : null));
    setQuantity(initialQty > 0 ? initialQty : 1);
    setIsOpen(true);
  };

  const closeWhatsAppOrder = () => {
    setIsOpen(false);
    setProduct(null);
    setSelectedVariant(null);
  };

  return (
    <WhatsAppOrderContext.Provider
      value={{
        isOpen,
        product,
        selectedVariant,
        quantity,
        openWhatsAppOrder,
        closeWhatsAppOrder,
      }}
    >
      {children}
    </WhatsAppOrderContext.Provider>
  );
};

export const useWhatsAppOrder = () => {
  const context = useContext(WhatsAppOrderContext);
  if (!context) {
    throw new Error('useWhatsAppOrder must be used within a WhatsAppOrderProvider');
  }
  return context;
};
