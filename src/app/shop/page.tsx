'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, Sparkles, X, RotateCcw } from 'lucide-react';
import { PRODUCTS_DATA, CATEGORIES } from '@/lib/productsData';
import { ProductCard } from '@/components/ProductCard';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSkinType, setSelectedSkinType] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Skin type filter
      if (
        selectedSkinType !== 'all' &&
        !product.skinTypes.includes('All') &&
        !product.skinTypes.includes(selectedSkinType as any)
      ) {
        return false;
      }
      // Tag filter
      if (selectedTag !== 'all' && !product.tags.includes(selectedTag as any)) {
        return false;
      }
      // Search query
      if (
        searchQuery.trim() &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, selectedSkinType, selectedTag, sortBy, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSkinType('all');
    setSelectedTag('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSkinType !== 'all' ||
    selectedTag !== 'all' ||
    searchQuery !== '';

  return (
    <div className="min-h-screen bg-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#174EA6] font-semibold">
            Botanical Formulations
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0B1F3A] mt-2">
            The Complete Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-3">
            Pure botanical actives crafted for radiant resilience in the modern city.
          </p>
        </div>

        {/* Category Pill Tabs (horizontally scrollable on mobile, centered on desktop) */}
        <div className="flex items-center sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 border-b border-[#E5E7EB]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 sm:px-5 py-2 rounded-none text-xs uppercase tracking-wider font-semibold whitespace-nowrap shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#0B1F3A] text-white shadow-sm'
                : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:border-[#174EA6] hover:text-[#0B1F3A]'
            }`}
          >
            All Formulas ({PRODUCTS_DATA.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 sm:px-5 py-2 rounded-none text-xs uppercase tracking-wider font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-[#0B1F3A] text-white shadow-sm'
                  : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:border-[#174EA6] hover:text-[#0B1F3A]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F5F9FE] p-4 rounded-none border border-[#E5E7EB] shadow-xs mb-8">
          {/* Search inside catalog */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in formulas..."
              className="w-full bg-white border border-[#E5E7EB] rounded-none px-4 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Skin type filter */}
            <select
              value={selectedSkinType}
              onChange={(e) => setSelectedSkinType(e.target.value)}
              className="bg-white border border-[#E5E7EB] rounded-none px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
            >
              <option value="all">Skin Type: All</option>
              <option value="Dry">Dry</option>
              <option value="Sensitive">Sensitive</option>
              <option value="Oily">Oily</option>
              <option value="Combination">Combination</option>
              <option value="Normal">Normal</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#E5E7EB] rounded-none px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="reviews">Most Reviewed</option>
            </select>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="p-2 text-[#174EA6] hover:text-[#0B1F3A] transition-colors rounded-none hover:bg-[#DCEBFA]"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#6B7280]">
          <span>
            Showing <strong className="text-[#0B1F3A]">{filteredProducts.length}</strong> items
          </span>
          {hasActiveFilters && (
            <span className="text-[#174EA6] font-medium">Filters applied</span>
          )}
        </div>

        {/* Product Cards Grid (2 cols on mobile, 4 on desktop) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-none p-10 sm:p-12 text-center border border-[#E5E7EB] shadow-sm max-w-lg mx-auto">
            <h3 className="font-serif-luxury text-xl text-[#0B1F3A]">No formulas match your filters</h3>
            <p className="text-xs text-[#6B7280] mt-2 mb-6">
              Try adjusting your skin type or category filters to discover products.
            </p>
            <button
              onClick={resetFilters}
              className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-wider py-3 px-6 rounded-none transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
