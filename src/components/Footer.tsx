'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Check, ShieldCheck, Truck, RefreshCw, Heart, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#121113] text-[#d8cec4] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Guarantees Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e1b18] border border-white/10 flex items-center justify-center text-[#d69482]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Complimentary Shipping</h4>
              <p className="text-xs text-[#a89f91]">On all orders over GH₵800</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e1b18] border border-white/10 flex items-center justify-center text-[#d69482]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day Glow Guarantee</h4>
              <p className="text-xs text-[#a89f91]">Hassle-free complimentary returns</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e1b18] border border-white/10 flex items-center justify-center text-[#d69482]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Clean Actives</h4>
              <p className="text-xs text-[#a89f91]">Dermatologist allergy-tested</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e1b18] border border-white/10 flex items-center justify-center text-[#d69482]">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Cruelty-Free & Vegan</h4>
              <p className="text-xs text-[#a89f91]">Leaping Bunny certified</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 py-14 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif-luxury text-2xl tracking-[0.25em] text-white font-light">
                CITY COSMETICS
              </span>
              <span className="block text-[9px] tracking-[0.35em] text-[#a89f91] uppercase mt-0.5">
                SUNYANI &bull; GHANA
              </span>
            </Link>
            <p className="text-xs text-[#a89f91] leading-relaxed max-w-sm">
              Formulating botanical cosmetics that empower skin resilience and
              natural luminosity in the warm, vibrant climate of West Africa.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-[#d69482]">
              <span>SUNYANI</span> &bull; <span>KUMASI</span> &bull; <span>ACCRA</span> &bull; <span>TAMALE</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs uppercase tracking-widest text-white font-semibold">Shop</h5>
            <ul className="space-y-2 text-xs text-[#a89f91]">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=skincare" className="hover:text-white transition-colors">
                  Skincare Serums
                </Link>
              </li>
              <li>
                <Link href="/shop?category=makeup" className="hover:text-white transition-colors">
                  Lipstick & Complexion
                </Link>
              </li>
              <li>
                <Link href="/shop?category=fragrance" className="hover:text-white transition-colors">
                  Fine Fragrance
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sets" className="hover:text-white transition-colors">
                  Discovery Gift Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care & Portal */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs uppercase tracking-widest text-white font-semibold">Client Care</h5>
            <ul className="space-y-2 text-xs text-[#a89f91]">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account#orders" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-white transition-colors">
                  Skin Routine Quiz
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white text-[#d69482] transition-colors inline-flex items-center gap-1.5 font-medium">
                  <Lock className="w-3 h-3 text-[#d69482]" /> Store Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* VIP Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="text-xs uppercase tracking-widest text-white font-semibold">
              The City VIP Circle
            </h5>
            <p className="text-xs text-[#a89f91]">
              Subscribe to receive private preview access to limited formulations and 15% off your
              first order.
            </p>

            {subscribed ? (
              <div className="bg-[#1e1b18] border border-[#d69482]/40 rounded-xl p-3 text-xs text-[#d69482] flex items-center gap-2">
                <Check className="w-4 h-4" /> Welcome to the Circle! Use code{' '}
                <strong>CITYGLOW15</strong> at checkout.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-[#1e1b18] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#8a8075] focus:outline-none focus:border-[#d69482]"
                />
                <button
                  type="submit"
                  className="btn-luxury-gold text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8a8075] gap-4">
          <p>&copy; {new Date().getFullYear()} City Cosmetics International Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
