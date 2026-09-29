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
      <div className="bg-[#121113] text-[#ebd2c7] text-xs py-2 px-4 text-center tracking-widest uppercase font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#d69482] animate-pulse" />
        <span>Complimentary luxury travel mini & shipping on all orders over GH₵800 | Code <strong>CITYGLOW15</strong></span>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-sm py-3.5'
            : 'bg-[#fcfaf8]/95 backdrop-blur-md border-b border-[#ede4dc]/70 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
              className="p-2 text-[#1e1b18] hover:text-[#d69482] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex flex-col items-center lg:items-start">
            <Link href="/" className="group inline-block text-center lg:text-left">
              <span className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.22em] text-[#121113] uppercase font-light group-hover:text-[#a85845] transition-colors">
                CITY COSMETICS
              </span>
              <span className="block text-[9px] tracking-[0.35em] text-[#8a8075] uppercase font-sans mt-0.5">
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
                  className={`text-sm tracking-wider uppercase font-medium transition-all duration-200 hover:text-[#a85845] relative py-1 ${
                    isActive ? 'text-[#a85845] font-semibold' : 'text-[#3d3834]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#a85845]" />
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
              className="p-2 text-[#1e1b18] hover:text-[#a85845] transition-colors relative"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/account#wishlist"
              aria-label="Wishlist"
              className="p-2 text-[#1e1b18] hover:text-[#a85845] transition-colors relative hidden sm:flex items-center"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-1 right-0 w-4 h-4 bg-[#a85845] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href="/account"
              aria-label="Account"
              className="p-2 text-[#1e1b18] hover:text-[#a85845] transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Admin Portal Quick Link */}
            <Link
              href="/admin"
              aria-label="Admin Portal"
              title="Admin Portal & Inventory"
              className="p-2 text-[#8a8075] hover:text-[#a85845] transition-colors hidden md:flex items-center"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              className="flex items-center gap-2 bg-[#121113] hover:bg-[#2a282c] text-white px-3.5 py-2 rounded-full transition-all duration-300 shadow-sm hover:scale-[1.03]"
            >
              <ShoppingBag className="w-4 h-4 text-[#ebd2c7]" />
              <span className="text-xs font-semibold tracking-wider">{totalItemCount}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-Down Interactive Search Bar */}
      {searchOpen && (
        <div className="bg-white border-b border-[#ede4dc] px-4 py-6 shadow-xl transition-all duration-300 animate-fadeIn">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-[#8a8075] absolute left-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formulas, shade tints, serums, perfumes..."
                autoFocus
                className="w-full bg-[#fbf9f7] border border-[#d8cec4] rounded-full pl-12 pr-12 py-3 text-sm text-[#1e1b18] focus:outline-none focus:border-[#a85845] transition-colors"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="absolute right-4 text-[#8a8075] hover:text-[#1e1b18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search Preview */}
            {searchResults.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#ede4dc]">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#fbf9f7] transition-colors group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover border border-[#ede4dc]"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-[#1e1b18] group-hover:text-[#a85845] transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#8a8075]">{formatPrice(product.price)}</p>
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
          <div className="relative w-full max-w-xs bg-[#fcfaf8] h-full shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#ede4dc]">
                <span className="font-serif-luxury text-lg tracking-widest text-[#121113]">
                  CITY COSMETICS
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#1e1b18] hover:text-[#a85845]"
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
                    className="text-base font-medium text-[#1e1b18] hover:text-[#a85845] py-2 transition-colors border-b border-[#f4ede8]"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-[#a85845] py-2 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Inventory Portal
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-[#ede4dc] text-xs text-[#8a8075]">
              <p>Clean Luxury Formulations</p>
              <p className="mt-1">Cruelty Free &bull; Dermatologist Tested</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
