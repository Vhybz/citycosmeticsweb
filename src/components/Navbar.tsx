'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';
import { PRODUCTS_DATA } from '@/lib/productsData';
import { formatPrice } from '@/lib/formatPrice';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [headerTheme, setHeaderTheme] = useState<'light' | 'dark'>('light');

  // Load saved header theme from localStorage on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('city_cosmetics_header_theme');
      if (saved === 'dark' || saved === 'light') {
        setHeaderTheme(saved);
      }
    }
  }, []);

  const toggleHeaderTheme = () => {
    const nextTheme = headerTheme === 'light' ? 'dark' : 'light';
    setHeaderTheme(nextTheme);
    try {
      localStorage.setItem('city_cosmetics_header_theme', nextTheme);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter search results
  const searchResults = searchQuery.trim()
    ? PRODUCTS_DATA.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const navLinks = [
    { name: 'Shop All', href: '/shop' },
    { name: 'Skincare', href: '/shop?category=skincare' },
    { name: 'Makeup', href: '/shop?category=makeup' },
    { name: 'Fragrance', href: '/shop?category=fragrance' },
    { name: 'Discovery Sets', href: '/shop?category=sets' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Skin Diagnostic', href: '/quiz' },
  ];

  const isDark = headerTheme === 'dark';

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300">

      {/* Main Navigation Bar */}
      <nav
        className={`transition-all duration-300 ${
          isDark
            ? isScrolled
              ? 'bg-[#08172c]/95 backdrop-blur-xl shadow-[0_4px_30px_-5px_rgba(0,0,0,0.5)] border-b border-white/10 text-white py-3 sm:py-3.5'
              : 'bg-[#0B1F3A] border-b border-white/15 text-white py-4 sm:py-5'
            : isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_25px_-5px_rgba(11,31,58,0.08)] border-b border-[#E5E7EB] text-[#1F2937] py-3 sm:py-3.5'
            : 'bg-white border-b border-[#E5E7EB]/90 text-[#1F2937] py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
              className={`w-9 h-9 flex items-center justify-center border transition-colors ${
                isDark
                  ? 'border-white/15 text-white hover:bg-white/10'
                  : 'border-[#E5E7EB] text-[#0B1F3A] hover:bg-[#F5F9FE]'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex flex-col items-center lg:items-start">
            <Link href="/" className="group inline-block text-center lg:text-left transition-transform duration-300 hover:scale-[1.01]">
              <span
                className={`font-serif-luxury text-2xl sm:text-[27px] tracking-[0.28em] uppercase font-normal transition-colors leading-none block ${
                  isDark ? 'text-white group-hover:text-[#DCEBFA]' : 'text-[#0B1F3A] group-hover:text-[#174EA6]'
                }`}
              >
                CITY COSMETICS
              </span>
              <span
                className={`block text-[9px] tracking-[0.45em] uppercase font-mono mt-1.5 transition-colors ${
                  isDark ? 'text-[#93C5FD]' : 'text-[#174EA6]'
                }`}
              >
                SUNYANI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7 xl:space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] tracking-[0.2em] uppercase font-medium transition-all duration-200 relative py-2 group ${
                    isDark
                      ? isActive
                        ? 'text-white font-semibold'
                        : 'text-[#DCEBFA]/75 hover:text-white'
                      : isActive
                      ? 'text-[#0B1F3A] font-semibold'
                      : 'text-[#4B5563] hover:text-[#0B1F3A]'
                  }`}
                >
                  <span>{link.name}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ${
                      isActive
                        ? isDark
                          ? 'w-full bg-[#93C5FD]'
                          : 'w-full bg-[#0B1F3A]'
                        : isDark
                        ? 'w-0 group-hover:w-full bg-[#DCEBFA]/60'
                        : 'w-0 group-hover:w-full bg-[#174EA6]'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className={`w-9 h-9 flex items-center justify-center transition-colors border ${
                isDark
                  ? 'border-transparent hover:border-white/20 text-[#DCEBFA] hover:text-white hover:bg-white/10'
                  : 'border-transparent hover:border-[#E5E7EB] text-[#4B5563] hover:text-[#0B1F3A] hover:bg-[#F5F9FE]'
              }`}
              title="Search Formulations"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleHeaderTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} header mode`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Header Mode`}
              className={`w-9 h-9 flex items-center justify-center transition-all duration-200 border ${
                isDark
                  ? 'border-white/15 text-[#DCEBFA] hover:text-white hover:bg-white/10'
                  : 'border-[#E5E7EB] text-[#1F2937] hover:text-[#174EA6] hover:bg-[#F5F9FE]'
              }`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-300 animate-fade-in" />
              ) : (
                <Moon className="w-4 h-4 text-[#0B1F3A] animate-fade-in" />
              )}
            </button>

            {/* Wishlist Link */}
            <Link
              href="/account#wishlist"
              aria-label="Wishlist"
              title="Saved Items"
              className={`w-9 h-9 relative hidden sm:flex items-center justify-center transition-colors border ${
                isDark
                  ? 'border-transparent hover:border-white/20 text-[#DCEBFA] hover:text-white hover:bg-white/10'
                  : 'border-transparent hover:border-[#E5E7EB] text-[#4B5563] hover:text-[#0B1F3A] hover:bg-[#F5F9FE]'
              }`}
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#174EA6] text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href="/account"
              aria-label="Account"
              title="Client Account"
              className={`w-9 h-9 hidden sm:flex items-center justify-center transition-colors border ${
                isDark
                  ? 'border-transparent hover:border-white/20 text-[#DCEBFA] hover:text-white hover:bg-white/10'
                  : 'border-transparent hover:border-[#E5E7EB] text-[#4B5563] hover:text-[#0B1F3A] hover:bg-[#F5F9FE]'
              }`}
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Admin Portal Quick Link */}
            <Link
              href="/admin"
              aria-label="Admin Portal"
              title="Admin Inventory Portal"
              className={`w-9 h-9 hidden md:flex items-center justify-center transition-colors border ${
                isDark
                  ? 'border-transparent hover:border-white/20 text-[#DCEBFA]/75 hover:text-white hover:bg-white/10'
                  : 'border-transparent hover:border-[#E5E7EB] text-[#6B7280] hover:text-[#0B1F3A] hover:bg-[#F5F9FE]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>

            {/* Premium Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-none transition-all duration-300 shadow-xs hover:shadow-md ${
                isDark
                  ? 'bg-white text-[#0B1F3A] hover:bg-[#DCEBFA]'
                  : 'bg-[#0B1F3A] hover:bg-[#174EA6] text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-widest font-semibold hidden sm:inline">
                Bag
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-none ${
                  isDark ? 'bg-[#0B1F3A] text-white' : 'bg-[#DCEBFA] text-[#0B1F3A]'
                }`}
              >
                {totalItemCount}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-Down Interactive Search Bar */}
      {searchOpen && (
        <div
          className={`border-b px-4 py-5 shadow-lg transition-all duration-300 animate-fadeIn ${
            isDark
              ? 'bg-[#08172c] border-white/15 text-white'
              : 'bg-white border-[#E5E7EB] text-[#1F2937]'
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <Search
                className={`w-4 h-4 absolute left-4 ${
                  isDark ? 'text-[#DCEBFA]/75' : 'text-[#6B7280]'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search botanical serums, silk tints, fragrances..."
                autoFocus
                className={`w-full border rounded-none pl-11 pr-11 py-2.5 text-xs transition-colors focus:outline-none ${
                  isDark
                    ? 'bg-[#0B1F3A] border-white/20 text-white placeholder-[#DCEBFA]/60 focus:border-[#DCEBFA]'
                    : 'bg-[#F5F9FE] border-[#E5E7EB] text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#0B1F3A]'
                }`}
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className={`absolute right-4 ${
                  isDark ? 'text-[#DCEBFA] hover:text-white' : 'text-[#6B7280] hover:text-[#0B1F3A]'
                }`}
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search Preview */}
            {searchResults.length > 0 && (
              <div
                className={`mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t ${
                  isDark ? 'border-white/10' : 'border-[#E5E7EB]'
                }`}
              >
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className={`flex items-center gap-3 p-2 rounded-none transition-colors group ${
                      isDark ? 'hover:bg-white/10' : 'hover:bg-[#F5F9FE]'
                    }`}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className={`w-11 h-11 rounded-none object-cover border ${
                        isDark ? 'border-white/15' : 'border-[#E5E7EB]'
                      }`}
                    />
                    <div>
                      <h4
                        className={`text-xs font-medium transition-colors line-clamp-1 ${
                          isDark
                            ? 'text-white group-hover:text-[#DCEBFA]'
                            : 'text-[#1F2937] group-hover:text-[#174EA6]'
                        }`}
                      >
                        {product.name}
                      </h4>
                      <p
                        className={`text-[11px] ${
                          isDark ? 'text-[#DCEBFA]/75' : 'text-[#6B7280]'
                        }`}
                      >
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className={`relative w-full max-w-xs h-full shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto border-r transition-colors ${
              isDark
                ? 'bg-[#0B1F3A] text-white border-white/15'
                : 'bg-white text-[#1F2937] border-[#E5E7EB]'
            }`}
          >
            <div>
              <div
                className={`flex items-center justify-between pb-5 border-b ${
                  isDark ? 'border-white/15' : 'border-[#E5E7EB]'
                }`}
              >
                <div>
                  <span className="font-serif-luxury text-lg tracking-[0.2em] block">
                    CITY COSMETICS
                  </span>
                  <span
                    className={`text-[9px] tracking-[0.3em] uppercase ${
                      isDark ? 'text-[#DCEBFA]/75' : 'text-[#6B7280]'
                    }`}
                  >
                    SUNYANI
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-1.5 ${
                    isDark ? 'text-white hover:text-[#DCEBFA]' : 'text-[#1F2937] hover:text-[#174EA6]'
                  }`}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Theme Switcher inside mobile drawer */}
              <div
                className={`mt-4 p-3 border flex items-center justify-between text-xs ${
                  isDark ? 'border-white/15 bg-white/5' : 'border-[#E5E7EB] bg-[#F5F9FE]'
                }`}
              >
                <span className="uppercase tracking-wider text-[10px] font-semibold">
                  Header Appearance
                </span>
                <button
                  onClick={toggleHeaderTheme}
                  className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                    isDark
                      ? 'bg-[#174EA6] text-white border-white/20'
                      : 'bg-white text-[#0B1F3A] border-[#E5E7EB]'
                  }`}
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-300" /> Light
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#0B1F3A]" /> Dark
                    </>
                  )}
                </button>
              </div>

              <div className="mt-5 flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-xs tracking-[0.14em] uppercase font-medium py-3 transition-colors border-b ${
                      isDark
                        ? 'text-[#DCEBFA] hover:text-white border-white/10'
                        : 'text-[#1F2937] hover:text-[#174EA6] border-[#E5E7EB]/60'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs tracking-[0.14em] uppercase font-semibold text-[#174EA6] py-3 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Inventory Portal
                </Link>
              </div>
            </div>

            <div
              className={`pt-6 border-t text-xs ${
                isDark ? 'border-white/15 text-[#DCEBFA]/75' : 'border-[#E5E7EB] text-[#6B7280]'
              }`}
            >
              <p
                className={`font-medium ${
                  isDark ? 'text-white' : 'text-[#0B1F3A]'
                }`}
              >
                City Cosmetics
              </p>
              <p className="text-[11px] mt-0.5">Sunyani</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
