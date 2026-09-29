'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, User, Search, Menu, X, ShieldCheck } from 'lucide-react';
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
    { name: 'Discovery Sets', href: '/shop?category=sets' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Skin Diagnostic', href: '/quiz' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#0B1F3A] text-[#DCEBFA] border-b border-white/10 text-[11px] py-2 px-4 tracking-[0.16em] uppercase font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline-block text-[#DCEBFA]/70 text-[10px]">
            Sunyani Showroom & Nationwide Express Dispatch
          </span>
          <span className="mx-auto sm:mx-0 text-center">
            Complimentary Shipping on Orders Over GH₵800 &bull; Code <strong className="text-white font-semibold">CITYGLOW15</strong>
          </span>
          <span className="hidden md:inline-block text-[#DCEBFA]/70 text-[10px]">
            GHS (GH₵)
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-md shadow-sm border-b border-[#E5E7EB] py-3.5'
            : 'bg-white border-b border-[#E5E7EB] py-4'
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
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex flex-col items-center lg:items-start">
            <Link href="/" className="group inline-block text-center lg:text-left">
              <span className="font-serif-luxury text-2xl sm:text-[26px] tracking-[0.26em] text-[#0B1F3A] uppercase font-normal group-hover:text-[#174EA6] transition-colors leading-none">
                CITY COSMETICS
              </span>
              <span className="block text-[9px] tracking-[0.42em] text-[#6B7280] uppercase font-sans mt-1">
                SUNYANI &bull; GHANA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] tracking-[0.18em] uppercase font-medium transition-all duration-200 hover:text-[#174EA6] relative py-1.5 ${
                    isActive ? 'text-[#0B1F3A] font-semibold' : 'text-[#4B5563]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#0B1F3A]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="p-2 text-[#1F2937] hover:text-[#174EA6] transition-colors"
              title="Search Formulations"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/account#wishlist"
              aria-label="Wishlist"
              title="Saved Items"
              className="p-2 text-[#1F2937] hover:text-[#174EA6] transition-colors relative hidden sm:flex items-center"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-0.5 w-3.5 h-3.5 bg-[#174EA6] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href="/account"
              aria-label="Account"
              title="Client Account"
              className="p-2 text-[#1F2937] hover:text-[#174EA6] transition-colors"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Admin Portal Quick Link */}
            <Link
              href="/admin"
              aria-label="Admin Portal"
              title="Admin Inventory Portal"
              className="p-2 text-[#6B7280] hover:text-[#0B1F3A] transition-colors hidden md:flex items-center"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              className="flex items-center gap-2.5 bg-[#0B1F3A] hover:bg-[#174EA6] text-white px-4 py-2 rounded-none transition-all duration-200 shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#DCEBFA]" />
              <span className="text-[11px] font-semibold tracking-widest font-mono">{totalItemCount}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-Down Interactive Search Bar */}
      {searchOpen && (
        <div className="bg-white border-b border-[#E5E7EB] px-4 py-5 shadow-lg transition-all duration-300 animate-fadeIn">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#6B7280] absolute left-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search botanical serums, silk tints, fragrances..."
                autoFocus
                className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-none pl-11 pr-11 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A] focus:ring-1 focus:ring-[#0B1F3A]/20 transition-colors"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="absolute right-4 text-[#6B7280] hover:text-[#0B1F3A]"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search Preview */}
            {searchResults.length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-[#E5E7EB]">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2 rounded-none hover:bg-[#F5F9FE] transition-colors group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-11 h-11 rounded-none object-cover border border-[#E5E7EB]"
                    />
                    <div>
                      <h4 className="text-xs font-medium text-[#1F2937] group-hover:text-[#174EA6] transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-[#6B7280]">{formatPrice(product.price)}</p>
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
              <div className="flex items-center justify-between pb-5 border-b border-[#E5E7EB]">
                <div>
                  <span className="font-serif-luxury text-lg tracking-[0.2em] text-[#0B1F3A] block">
                    CITY COSMETICS
                  </span>
                  <span className="text-[9px] tracking-[0.3em] text-[#6B7280] uppercase">
                    SUNYANI &bull; GHANA
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#1F2937] hover:text-[#174EA6]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs tracking-[0.14em] uppercase font-medium text-[#1F2937] hover:text-[#174EA6] py-3 transition-colors border-b border-[#E5E7EB]/60"
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

            <div className="pt-6 border-t border-[#E5E7EB] text-xs text-[#6B7280]">
              <p className="font-medium text-[#0B1F3A]">Sunyani Flagship Store</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">Plot 14, Commercial Avenue &bull; Bono Region</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
