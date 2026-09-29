'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, User, Search, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';
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
    { name: 'Sets & Discovery', href: '/shop?category=sets' },
    { name: 'Skin Quiz', href: '/quiz' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#0B1F3A] text-[#DCEBFA] text-xs py-2 px-4 text-center tracking-widest uppercase font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#DCEBFA] animate-pulse" />
        <span>Complimentary luxury travel mini & shipping on all orders over GH₵800 | Code <strong>CITYGLOW15</strong></span>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E5E7EB] py-3.5'
            : 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
              className="p-2 text-[#0B1F3A] hover:text-[#174EA6] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex flex-col items-center lg:items-start">
            <Link href="/" className="group inline-block text-center lg:text-left">
              <span className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.22em] text-[#0B1F3A] uppercase font-normal group-hover:text-[#174EA6] transition-colors">
                CITY COSMETICS
              </span>
              <span className="block text-[9px] tracking-[0.35em] text-[#6B7280] uppercase font-sans mt-0.5">
                SUNYANI &bull; GHANA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs tracking-wider uppercase font-medium transition-all duration-200 hover:text-[#174EA6] relative py-1 ${
                    isActive ? 'text-[#0B1F3A] font-semibold' : 'text-[#1F2937]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0B1F3A]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="p-2 text-[#1F2937] hover:text-[#174EA6] transition-colors relative"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/account#wishlist"
              aria-label="Wishlist"
              className="p-2 text-[#1F2937] hover:text-[#174EA6] transition-colors relative hidden sm:flex items-center"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-1 right-0 w-4 h-4 bg-[#174EA6] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href="/account"
              aria-label="Account"
              className="p-2 text-[#1F2937] hover:text-[#174EA6] transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Admin Portal Quick Link */}
            <Link
              href="/admin"
              aria-label="Admin Portal"
              title="Admin Portal & Inventory"
              className="p-2 text-[#6B7280] hover:text-[#0B1F3A] transition-colors hidden md:flex items-center"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              className="flex items-center gap-2 bg-[#0B1F3A] hover:bg-[#174EA6] text-white px-3.5 py-2 rounded-md transition-all duration-300 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-[#DCEBFA]" />
              <span className="text-xs font-semibold tracking-wider">{totalItemCount}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-Down Interactive Search Bar */}
      {searchOpen && (
        <div className="bg-white border-b border-[#E5E7EB] px-4 py-6 shadow-lg transition-all duration-300 animate-fadeIn">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-[#6B7280] absolute left-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formulas, shade tints, serums, perfumes..."
                autoFocus
                className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md pl-12 pr-12 py-3 text-sm text-[#1F2937] focus:outline-none focus:border-[#0B1F3A] focus:ring-1 focus:ring-[#0B1F3A]/20 transition-colors"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="absolute right-4 text-[#6B7280] hover:text-[#1F2937]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search Preview */}
            {searchResults.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E5E7EB]">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-md hover:bg-[#F5F9FE] transition-colors group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded-sm object-cover border border-[#E5E7EB]"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-[#1F2937] group-hover:text-[#174EA6] transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#6B7280]">{formatPrice(product.price)}</p>
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
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto border-r border-[#E5E7EB]">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E5E7EB]">
                <span className="font-serif-luxury text-lg tracking-widest text-[#0B1F3A]">
                  CITY COSMETICS
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#1F2937] hover:text-[#174EA6]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-[#1F2937] hover:text-[#174EA6] py-2 transition-colors border-b border-[#E5E7EB]"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold text-[#174EA6] py-2 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Inventory Portal
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E5E7EB] text-xs text-[#6B7280]">
              <p>Clean Luxury Formulations</p>
              <p className="mt-1">Sunyani &bull; Ghana</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
