'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Check, ShieldCheck, Truck, RefreshCw, MapPin, Lock, Phone } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/siteConfig';

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
    <footer className="bg-[#0B1F3A] text-[#DCEBFA] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Guarantees Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-14 border-b border-white/10">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 shrink-0 rounded-none bg-white/[0.04] border border-white/15 flex items-center justify-center text-[#DCEBFA]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.14em] font-semibold text-white">Complimentary Delivery</h4>
              <p className="text-[11px] text-[#DCEBFA]/75 mt-0.5 leading-relaxed">On all orders over GH₵800 nationwide across Ghana</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 shrink-0 rounded-none bg-white/[0.04] border border-white/15 flex items-center justify-center text-[#DCEBFA]">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.14em] font-semibold text-white">30-Day Ritual Promise</h4>
              <p className="text-[11px] text-[#DCEBFA]/75 mt-0.5 leading-relaxed">Hassle-free satisfaction and exchange guarantee</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 shrink-0 rounded-none bg-white/[0.04] border border-white/15 flex items-center justify-center text-[#DCEBFA]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.14em] font-semibold text-white">Clean Clinical Actives</h4>
              <p className="text-[11px] text-[#DCEBFA]/75 mt-0.5 leading-relaxed">Dermatologist-tested for tropical climates</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 shrink-0 rounded-none bg-white/[0.04] border border-white/15 flex items-center justify-center text-[#DCEBFA]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.14em] font-semibold text-white">Sunyani</h4>
              <p className="text-[11px] text-[#DCEBFA]/75 mt-0.5 leading-relaxed">Showroom pickup & immediate regional dispatch</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 py-14 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif-luxury text-2xl tracking-[0.26em] text-white uppercase font-normal block leading-none">
                CITY COSMETICS
              </span>
              <span className="block text-[9px] tracking-[0.42em] text-[#DCEBFA]/70 uppercase font-sans mt-1.5">
                SUNYANI
              </span>
            </Link>
            <p className="text-xs text-[#DCEBFA]/80 leading-relaxed max-w-sm">
              Formulating clinical-grade botanical cosmetics tailored to skin resilience, balance, and radiance in the West African climate.
            </p>
            <div className="pt-1 text-xs text-[#DCEBFA]/80 space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#DCEBFA]/60 shrink-0" />
                <span>Sunyani</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#DCEBFA]/60 shrink-0" />
                <span>Concierge & WhatsApp: +233 (0)55 965 0921</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">Formulations</h5>
            <ul className="space-y-2.5 text-xs text-[#DCEBFA]/75">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Formulations
                </Link>
              </li>
              <li>
                <Link href="/shop?category=skincare" className="hover:text-white transition-colors">
                  Hydra-Dew Serums
                </Link>
              </li>
              <li>
                <Link href="/shop?category=makeup" className="hover:text-white transition-colors">
                  Complexion & Lip Tints
                </Link>
              </li>
              <li>
                <Link href="/shop?category=fragrance" className="hover:text-white transition-colors">
                  Fine Botanical Fragrance
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sets" className="hover:text-white transition-colors">
                  The Discovery Wardrobe
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care & Portal */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">Client Care</h5>
            <ul className="space-y-2.5 text-xs text-[#DCEBFA]/75">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Client Account
                </Link>
              </li>
              <li>
                <Link href="/account#orders" className="hover:text-white transition-colors">
                  Dispatch & Tracking
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-white transition-colors">
                  Skin Diagnostic Consultation
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=Hello%20City%20Cosmetics,%20I%20would%20like%20a%20skin%20consultation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Beauty Concierge
                </a>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white text-[#DCEBFA] transition-colors">
                  Showroom & Business Gallery
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white text-[#DCEBFA] transition-colors inline-flex items-center gap-1.5 font-medium pt-1">
                  <Lock className="w-3 h-3 text-[#DCEBFA]" /> Store Inventory Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* VIP Newsletter */}
          <div className="lg:col-span-4 space-y-3.5">
            <h5 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">
              City Cosmetics Circle
            </h5>
            <p className="text-xs text-[#DCEBFA]/80 leading-relaxed">
              Receive private preview invitations to limited botanical extractions and 15% off your initial order.
            </p>

            {subscribed ? (
              <div className="bg-[#174EA6]/30 border border-white/20 p-3.5 text-xs text-[#DCEBFA] flex items-center gap-2.5">
                <Check className="w-4 h-4 text-white shrink-0" />
                <span>Welcome to the Circle. Use code <strong className="text-white">CITYGLOW15</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-[#08172c] border border-white/20 rounded-none px-3.5 py-2.5 text-xs text-white placeholder-[#DCEBFA]/50 focus:outline-none focus:border-[#DCEBFA] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-white text-[#0B1F3A] hover:bg-[#DCEBFA] text-xs font-semibold px-5 py-2.5 rounded-none uppercase tracking-wider transition-all duration-200 shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}

            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-widest text-[#DCEBFA]/60 block mb-2">Accepted Payment Channels</span>
              <div className="flex flex-wrap gap-2 text-[10px] text-[#DCEBFA]/80">
                <span className="px-2.5 py-1 bg-white/[0.05] border border-white/10">MTN MoMo</span>
                <span className="px-2.5 py-1 bg-white/[0.05] border border-white/10">Telecel Cash</span>
                <span className="px-2.5 py-1 bg-white/[0.05] border border-white/10">Visa / Mastercard</span>
                <span className="px-2.5 py-1 bg-white/[0.05] border border-white/10">Sunyani COD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#DCEBFA]/60 gap-4">
          <p>&copy; {new Date().getFullYear()} City Cosmetics. Sunyani. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Dispatch Logistics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
