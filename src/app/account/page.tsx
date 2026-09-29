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
          image: '/beautyImages/ca20569827f857496b78c0666cb556c4.jpg',
        },
        {
          name: 'Lasgidi Fine Mist & Tint (Pinky Crush)',
          price: 340.0,
          quantity: 1,
          image: '/beautyImages/cadd9c6e24c20cf8e79f77ff3f1e9c49.jpg',
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
          name: 'Touch Majestic Oud Concentrated Flacon',
          price: 1100.0,
          quantity: 1,
          image: '/beautyImages/bd545c8751f20e872e51fc45f870cc99.jpg',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isLoggedIn ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto bg-white p-8 sm:p-10 rounded-2xl border border-[#E5E7EB] shadow-xl animate-fadeIn">
            <div className="text-center mb-8">
              <span className="font-serif-luxury text-2xl tracking-widest text-[#0B1F3A] block">
                CITY COSMETICS
              </span>
              <p className="text-xs uppercase tracking-widest text-[#174EA6] mt-1 font-semibold">
                Client VIP Sanctuary
              </p>
            </div>

            {/* Login / Register toggle */}
            <div className="flex rounded-lg bg-[#F5F9FE] border border-[#E5E7EB] p-1 mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                  authMode === 'login' ? 'bg-[#0B1F3A] shadow-xs text-white' : 'text-[#6B7280]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                  authMode === 'register' ? 'bg-[#0B1F3A] shadow-xs text-white' : 'text-[#6B7280]'
                }`}
              >
                Join VIP Circle
              </button>
            </div>

            {authMessage && (
              <p className="text-xs text-red-500 mb-4 text-center">{authMessage}</p>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-medium text-[#1F2937] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Eleanor Vance"
                    className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-4 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-[#1F2937] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-4 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#1F2937] block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-4 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-3.5 rounded-md shadow-xs hover:shadow transition-all mt-2"
              >
                {authLoading
                  ? 'Connecting...'
                  : authMode === 'login'
                  ? 'Sign In to Account'
                  : 'Create VIP Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-[#6B7280]">
              <p>Protected by Supabase Auth with Row-Level Security.</p>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="space-y-8 animate-fadeIn">
            {/* Top User Welcome Banner */}
            <div className="bg-[#F5F9FE] rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#DCEBFA] border-2 border-[#174EA6] flex items-center justify-center text-[#0B1F3A] font-serif-luxury text-xl font-bold">
                  {fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif-luxury text-2xl font-normal text-[#0B1F3A]">
                      Bonjour, {fullName}
                    </h1>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-[#DCEBFA] text-[#0B1F3A] border border-[#DCEBFA]">
                      Lumière Gold VIP
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-0.5">{email} &bull; Member since 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className="text-xs font-semibold text-[#0B1F3A] border border-[#E5E7EB] hover:bg-[#DCEBFA] px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 bg-white"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#174EA6]" /> Admin Inventory
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-[#6B7280] hover:text-red-500 p-2 flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            </div>

            {/* Dashboard Navigation Tabs */}
            <div className="flex border-b border-[#E5E7EB] space-x-6 text-xs font-semibold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'profile'
                    ? 'border-[#0B1F3A] text-[#0B1F3A]'
                    : 'border-transparent text-[#6B7280] hover:text-[#0B1F3A]'
                }`}
              >
                <User className="w-4 h-4" /> Beauty Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'orders'
                    ? 'border-[#0B1F3A] text-[#0B1F3A]'
                    : 'border-transparent text-[#6B7280] hover:text-[#0B1F3A]'
                }`}
              >
                <Package className="w-4 h-4" /> Orders ({sampleOrders.length})
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'wishlist'
                    ? 'border-[#0B1F3A] text-[#0B1F3A]'
                    : 'border-transparent text-[#6B7280] hover:text-[#0B1F3A]'
                }`}
              >
                <Heart className="w-4 h-4" /> Wishlist ({wishlist.length})
              </button>
            </div>

            {/* Tab 1: Profile & VIP Perks */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6">
                  <h3 className="font-serif-luxury text-lg font-semibold text-[#0B1F3A]">
                    Personalized Skin Profile
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#F5F9FE] rounded-xl border border-[#E5E7EB]">
                      <span className="text-[11px] text-[#174EA6] uppercase tracking-wider font-semibold block">
                        Primary Skin Concern
                      </span>
                      <p className="text-sm font-medium text-[#0B1F3A] mt-1">
                        Urban Dehydration & Barrier Resilience
                      </p>
                    </div>

                    <div className="p-4 bg-[#F5F9FE] rounded-xl border border-[#E5E7EB]">
                      <span className="text-[11px] text-[#174EA6] uppercase tracking-wider font-semibold block">
                        Preferred Complexion Finish
                      </span>
                      <p className="text-sm font-medium text-[#0B1F3A] mt-1">
                        Luminous Glass-Skin Satin
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <h4 className="text-xs font-semibold text-[#0B1F3A] mb-2">Saved Delivery Address</h4>
                    <p className="text-xs text-[#4B5563]">
                      Plot 14, Commercial Avenue, Sunyani Central, Bono Region, Ghana
                    </p>
                  </div>
                </div>

                {/* VIP Perks */}
                <div className="bg-gradient-to-br from-[#0B1F3A] to-[#174EA6] text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-[#DCEBFA]">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs uppercase font-bold tracking-widest">
                      VIP Privileges
                    </span>
                  </div>
                  <h3 className="font-serif-luxury text-xl">Lumière Gold Status</h3>
                  <ul className="text-xs text-[#DCEBFA] space-y-2.5 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-white" /> Complimentary Express
                      Worldwide Shipping
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-white" /> Deluxe Sample with
                      Every Order
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-white" /> 48-Hour Early Access to
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
                    className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#0B1F3A]">{order.id}</span>
                          <span className="text-xs text-[#6B7280]">&bull; {order.date}</span>
                        </div>
                        <p className="text-xs text-[#174EA6] font-medium mt-0.5">{order.tracking}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold bg-[#DCEBFA] text-[#0B1F3A] px-3 py-1 rounded-full flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-[#174EA6]" /> {order.status}
                        </span>
                        <span className="font-serif-luxury text-base font-semibold text-[#0B1F3A]">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F5F9FE] border border-[#E5E7EB]"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-md object-cover border border-[#E5E7EB]"
                          />
                          <div>
                            <p className="text-xs font-semibold text-[#0B1F3A] line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-[#6B7280]">
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
                  <div className="bg-white rounded-2xl p-12 text-center border border-[#E5E7EB] shadow-xs max-w-md mx-auto">
                    <Heart className="w-12 h-12 text-[#174EA6] mx-auto mb-3" />
                    <h3 className="font-serif-luxury text-lg text-[#0B1F3A]">Your wishlist is empty</h3>
                    <p className="text-xs text-[#6B7280] mt-1 mb-6">
                      Explore our clean beauty formulas and save your favorite items here.
                    </p>
                    <Link
                      href="/shop"
                      className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-wider py-3 px-6 rounded-md transition-colors"
                    >
                      Browse Catalogue
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-none border border-[#E5E7EB] shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[4/3] rounded-none overflow-hidden mb-3 bg-[#F5F9FE] border border-[#E5E7EB]">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="font-serif-luxury text-sm font-semibold text-[#0B1F3A] line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-[#6B7280] mt-0.5">{formatPrice(item.price)}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                          <button
                            onClick={() => addToCart(item, 1)}
                            className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-[11px] uppercase tracking-wider font-semibold py-2 px-4 rounded-md flex items-center gap-1.5 transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#DCEBFA]" /> Move to Bag
                          </button>
                          <button
                            onClick={() => toggleWishlist(item)}
                            className="text-xs text-[#6B7280] hover:text-red-500 transition-colors"
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
