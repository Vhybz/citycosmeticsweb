'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useWishlist } from '@/lib/wishlistContext';
import { useCart } from '@/lib/cartContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { formatPrice } from '@/lib/formatPrice';

export default function AccountPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('eleanor.vance@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Eleanor Vance');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  // Check live Supabase user on mount
  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsLoggedIn(true);
          setEmail(session.user.email || '');
          setFullName(session.user.user_metadata?.full_name || 'Valued Member');
        }
      });
    }
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthMessage('');

    if (isSupabaseConfigured()) {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setAuthMessage(error.message);
        } else {
          setIsLoggedIn(true);
          setAuthMessage('Logged in successfully!');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) {
          setAuthMessage(error.message);
        } else {
          setIsLoggedIn(true);
          setAuthMessage('Account created successfully!');
        }
      }
    } else {
      // Demo simulated auth
      setTimeout(() => {
        setIsLoggedIn(true);
        setAuthLoading(false);
      }, 500);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setIsLoggedIn(false);
  };

  const sampleOrders = [
    {
      id: 'CC-982314',
      date: 'September 24, 2026',
      total: 1060.0,
      status: 'Shipped',
      tracking: 'DHL Express: 9248201948',
      items: [
        {
          name: 'Lumière Hydra-Dew Serum',
          price: 720.0,
          quantity: 1,
          image:
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80',
        },
        {
          name: 'Velvet Silk Cushion Lipstick (Nude City)',
          price: 340.0,
          quantity: 1,
          image:
            'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
    {
      id: 'CC-872911',
      date: 'August 12, 2026',
      total: 1100.0,
      status: 'Delivered',
      tracking: 'DHL Express: 8192038102',
      items: [
        {
          name: 'Urban Flora Eau de Parfum',
          price: 1100.0,
          quantity: 1,
          image:
            'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf8] py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isLoggedIn ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-[#ede4dc] shadow-xl animate-fadeIn">
            <div className="text-center mb-8">
              <span className="font-serif-luxury text-2xl tracking-widest text-[#121113] block">
                CITY COSMETICS
              </span>
              <p className="text-xs uppercase tracking-widest text-[#a85845] mt-1 font-semibold">
                Client VIP Sanctuary
              </p>
            </div>

            {/* Login / Register toggle */}
            <div className="flex rounded-full bg-[#f4ede8] p-1 mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
                  authMode === 'login' ? 'bg-white shadow text-[#121113]' : 'text-[#6b645d]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
                  authMode === 'register' ? 'bg-white shadow text-[#121113]' : 'text-[#6b645d]'
                }`}
              >
                Join VIP Circle
              </button>
            </div>

            {authMessage && (
              <p className="text-xs text-[#d64545] mb-4 text-center">{authMessage}</p>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-medium text-[#1e1b18] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Eleanor Vance"
                    className="w-full bg-[#fbf9f7] border border-[#d8cec4] rounded-xl px-4 py-2.5 text-xs text-[#1e1b18] focus:outline-none focus:border-[#a85845]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-[#1e1b18] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#fbf9f7] border border-[#d8cec4] rounded-xl px-4 py-2.5 text-xs text-[#1e1b18] focus:outline-none focus:border-[#a85845]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#1e1b18] block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#fbf9f7] border border-[#d8cec4] rounded-xl px-4 py-2.5 text-xs text-[#1e1b18] focus:outline-none focus:border-[#a85845]"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full btn-luxury-primary text-white text-xs uppercase tracking-widest font-semibold py-3.5 rounded-full shadow hover:shadow-lg transition-all mt-2"
              >
                {authLoading
                  ? 'Connecting...'
                  : authMode === 'login'
                  ? 'Sign In to Account'
                  : 'Create VIP Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-[#8a8075]">
              <p>Protected by Supabase Auth with Row-Level Security.</p>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="space-y-8 animate-fadeIn">
            {/* Top User Welcome Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4dc] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#f4ede8] border-2 border-[#d69482] flex items-center justify-center text-[#a85845] font-serif-luxury text-xl font-bold">
                  {fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif-luxury text-2xl font-normal text-[#121113]">
                      Bonjour, {fullName}
                    </h1>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-[#fdf8f5] text-[#a85845] border border-[#ebd2c7]">
                      Lumière Gold VIP
                    </span>
                  </div>
                  <p className="text-xs text-[#8a8075] mt-0.5">{email} &bull; Member since 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className="text-xs font-semibold text-[#a85845] border border-[#ebd2c7] hover:bg-[#f4ede8] px-4 py-2 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Inventory
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-[#8a8075] hover:text-[#d64545] p-2 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            </div>

            {/* Dashboard Navigation Tabs */}
            <div className="flex border-b border-[#ede4dc] space-x-6 text-xs font-semibold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'profile'
                    ? 'border-[#121113] text-[#121113]'
                    : 'border-transparent text-[#8a8075] hover:text-[#121113]'
                }`}
              >
                <User className="w-4 h-4" /> Beauty Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'orders'
                    ? 'border-[#121113] text-[#121113]'
                    : 'border-transparent text-[#8a8075] hover:text-[#121113]'
                }`}
              >
                <Package className="w-4 h-4" /> Orders ({sampleOrders.length})
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'wishlist'
                    ? 'border-[#121113] text-[#121113]'
                    : 'border-transparent text-[#8a8075] hover:text-[#121113]'
                }`}
              >
                <Heart className="w-4 h-4" /> Wishlist ({wishlist.length})
              </button>
            </div>

            {/* Tab 1: Profile & VIP Perks */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#ede4dc] shadow-sm space-y-6">
                  <h3 className="font-serif-luxury text-lg font-semibold text-[#121113]">
                    Personalized Skin Profile
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#fbf9f7] rounded-2xl border border-[#ede4dc]">
                      <span className="text-[11px] text-[#8a8075] uppercase tracking-wider font-semibold block">
                        Primary Skin Concern
                      </span>
                      <p className="text-sm font-medium text-[#121113] mt-1">
                        Urban Dehydration & Barrier Resilience
                      </p>
                    </div>

                    <div className="p-4 bg-[#fbf9f7] rounded-2xl border border-[#ede4dc]">
                      <span className="text-[11px] text-[#8a8075] uppercase tracking-wider font-semibold block">
                        Preferred Complexion Finish
                      </span>
                      <p className="text-sm font-medium text-[#121113] mt-1">
                        Luminous Glass-Skin Satin
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#ede4dc]">
                    <h4 className="text-xs font-semibold text-[#121113] mb-2">Saved Delivery Address</h4>
                    <p className="text-xs text-[#5a544e]">
                      Plot 14, Commercial Avenue, Sunyani Central, Bono Region, Ghana
                    </p>
                  </div>
                </div>

                {/* VIP Perks */}
                <div className="bg-gradient-to-br from-[#121113] to-[#2a282c] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-[#d69482]">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs uppercase font-bold tracking-widest">
                      VIP Privileges
                    </span>
                  </div>
                  <h3 className="font-serif-luxury text-xl">Lumière Gold Status</h3>
                  <ul className="text-xs text-[#d8cec4] space-y-2.5 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#d69482]" /> Complimentary Express
                      Worldwide Shipping
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#d69482]" /> Deluxe Sample with
                      Every Order
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#d69482]" /> 48-Hour Early Access to
                      New Formulations
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Orders History */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {sampleOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-6 rounded-3xl border border-[#ede4dc] shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f4ede8] gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#121113]">{order.id}</span>
                          <span className="text-xs text-[#8a8075]">&bull; {order.date}</span>
                        </div>
                        <p className="text-xs text-[#a85845] font-medium mt-0.5">{order.tracking}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold bg-[#eaf4eb] text-[#2c6e3b] px-3 py-1 rounded-full flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" /> {order.status}
                        </span>
                        <span className="font-serif-luxury text-base font-semibold text-[#121113]">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 rounded-xl bg-[#fbf9f7] border border-[#ede4dc]"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-xs font-semibold text-[#121113] line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-[#8a8075]">
                              {formatPrice(item.price)} &bull; Qty {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Wishlist */}
            {activeTab === 'wishlist' && (
              <div>
                {wishlist.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-[#ede4dc] shadow-sm max-w-md mx-auto">
                    <Heart className="w-12 h-12 text-[#d69482] mx-auto mb-3" />
                    <h3 className="font-serif-luxury text-lg text-[#121113]">Your wishlist is empty</h3>
                    <p className="text-xs text-[#8a8075] mt-1 mb-6">
                      Explore our clean beauty formulas and save your favorite items here.
                    </p>
                    <Link
                      href="/shop"
                      className="btn-luxury-primary text-white text-xs uppercase tracking-wider py-3 px-6 rounded-full"
                    >
                      Browse Catalogue
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-none border border-[#ede4dc] shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[4/3] rounded-none overflow-hidden mb-3 bg-[#f4ede8]">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="font-serif-luxury text-sm font-semibold text-[#121113] line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-[#8a8075] mt-0.5">{formatPrice(item.price)}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#ede4dc] flex items-center justify-between">
                          <button
                            onClick={() => addToCart(item, 1)}
                            className="btn-luxury-primary text-white text-[11px] uppercase tracking-wider font-semibold py-2 px-4 rounded-full flex items-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                          </button>
                          <button
                            onClick={() => toggleWishlist(item)}
                            className="text-xs text-[#8a8075] hover:text-[#d64545]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
