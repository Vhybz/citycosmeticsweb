'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  promoCode: string;
  discountPercent: number;
  promoError: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  freeShippingThreshold: number;
  totalItemCount: number;
}

const FREE_SHIPPING_THRESHOLD = 800;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('city_cosmetics_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedPromo = localStorage.getItem('city_cosmetics_promo');
      if (savedPromo) {
        const parsed = JSON.parse(savedPromo);
        setPromoCode(parsed.code);
        setDiscountPercent(parsed.discount);
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('city_cosmetics_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items, isInitialized]);

  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedVariant: variant }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedVariant?.id === variantId)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedVariant?.id === variantId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setDiscountPercent(0);
    localStorage.removeItem('city_cosmetics_cart');
    localStorage.removeItem('city_cosmetics_promo');
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    setPromoError('');

    if (cleanCode === 'CITYGLOW15') {
      setPromoCode(cleanCode);
      setDiscountPercent(15);
      localStorage.setItem('city_cosmetics_promo', JSON.stringify({ code: cleanCode, discount: 15 }));
      return true;
    } else if (cleanCode === 'WELCOME10') {
      setPromoCode(cleanCode);
      setDiscountPercent(10);
      localStorage.setItem('city_cosmetics_promo', JSON.stringify({ code: cleanCode, discount: 10 }));
      return true;
    } else if (cleanCode === 'VIP20') {
      setPromoCode(cleanCode);
      setDiscountPercent(20);
      localStorage.setItem('city_cosmetics_promo', JSON.stringify({ code: cleanCode, discount: 20 }));
      return true;
    } else {
      setPromoError('Invalid promo code. Try CITYGLOW15 or WELCOME10');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
    setPromoError('');
    localStorage.removeItem('city_cosmetics_promo');
  };

  const subtotal = items.reduce((acc, item) => {
    const price = item.selectedVariant?.priceOverride ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 65;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        promoCode,
        discountPercent,
        promoError,
        applyPromoCode,
        removePromoCode,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
