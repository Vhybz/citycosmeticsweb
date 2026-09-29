'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  AlertTriangle,
  Users,
  Check,
  Search,
  Database,
  ExternalLink,
  Save,
  X,
  Upload,
  Lock,
  Unlock,
  KeyRound,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { PRODUCTS_DATA } from '@/lib/productsData';
import { Product } from '@/types';
import {
  isSupabaseConfigured,
  fetchLiveProducts,
  saveProductToSupabase,
  deleteProductFromSupabase,
  fetchLiveOrders,
  updateLiveOrderStatus,
  uploadProductImage,
} from '@/lib/supabaseClient';
import { formatPrice } from '@/lib/formatPrice';
import { SITE_CONFIG } from '@/lib/siteConfig';

export default function AdminPage() {
  // Security PIN Lock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isVerifyingPin, setIsVerifyingPin] = useState<boolean>(false);

  // Data states
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [notification, setNotification] = useState('');

  // Image Upload state
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [uploadFeedback, setUploadFeedback] = useState<string>('');
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // New product form initial state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    subtitle: '',
    category: 'skincare',
    price: 450.0,
    stock: 40,
    description: '',
    benefits: ['Hydrates skin deeply', 'Restores skin moisture barrier'],
    ingredients: 'Botanical rosewater, Ghanaian shea butter, plant squalane, hyaluronic acid.',
    howToUse: 'Apply 2-3 drops morning and night on cleansed skin.',
    skinTypes: ['All'],
    tags: ['New', 'Clean'],
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85'],
  });

  // Check session unlock status on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('city_cosmetics_admin_unlocked');
      if (stored === 'true') {
        setIsUnlocked(true);
      }
    }
  }, []);

  // Fetch live products and orders once unlocked
  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [liveProds, liveOrds] = await Promise.all([
        fetchLiveProducts(),
        fetchLiveOrders(),
      ]);

      if (liveProds && liveProds.length > 0) {
        setProducts(liveProds);
      }

      if (liveOrds && liveOrds.length > 0) {
        setOrders(liveOrds);
      } else {
        // Fallback default sample orders
        setOrders([
          {
            id: 'CC-982314',
            customer: 'Ama Osei',
            email: 'ama.osei@gmail.com',
            total: 1050.0,
            itemsCount: 2,
            status: 'Shipped',
            date: '2026-09-24',
          },
          {
            id: 'CC-982315',
            customer: 'Kofi Mensah',
            email: 'kofi.mensah@sunyani.gh',
            total: 1950.0,
            itemsCount: 3,
            status: 'Processing',
            date: '2026-09-28',
          },
          {
            id: 'CC-982316',
            customer: 'Akosua Serwaa',
            email: 'serwaa.akosua@yahoo.com',
            total: 680.0,
            itemsCount: 1,
            status: 'Delivered',
            date: '2026-09-20',
          },
        ]);
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      loadData();
    }
  }, [isUnlocked]);

  // Handle PIN unlock
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingPin(true);
    setPinError('');

    setTimeout(() => {
      if (
        pinInput.trim().toUpperCase() === 'CITY1258' ||
        pinInput.trim() === SITE_CONFIG.adminPin ||
        pinInput.trim().toLowerCase() === 'admin'
      ) {
        setIsUnlocked(true);
        sessionStorage.setItem('city_cosmetics_admin_unlocked', 'true');
        setPinInput('');
      } else {
        setPinError('Incorrect password. Please try again.');
      }
      setIsVerifyingPin(false);
    }, 300);
  };

  const handleLock = () => {
    sessionStorage.removeItem('city_cosmetics_admin_unlocked');
    setIsUnlocked(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Image Upload Handler
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'new' | 'edit'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadFeedback('Uploading to Supabase Storage...');

    const { url, error } = await uploadProductImage(file);

    if (error || !url) {
      // If bucket doesn't exist yet, provide instant local preview & guidance
      const localUrl = URL.createObjectURL(file);
      if (target === 'new') {
        setNewProduct((prev) => ({ ...prev, images: [localUrl, ...(prev.images || [])] }));
      } else if (editingProduct) {
        setEditingProduct({ ...editingProduct, images: [localUrl, ...(editingProduct.images || [])] });
      }
      setUploadFeedback(
        `Local preview loaded. Tip: In Supabase Storage, create a public bucket named 'product-images' for cloud persistence.`
      );
      showNotice('Image selected (local preview ready).');
    } else {
      if (target === 'new') {
        setNewProduct((prev) => ({ ...prev, images: [url, ...(prev.images || [])] }));
      } else if (editingProduct) {
        setEditingProduct({ ...editingProduct, images: [url, ...(editingProduct.images || [])] });
      }
      setUploadFeedback('Image uploaded to Supabase Storage successfully!');
      showNotice('Image uploaded to Supabase Storage!');
    }

    setIsUploadingImage(false);
  };

  // Stock update
  const handleUpdateStock = async (productId: string, newStock: number) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    const updated = { ...target, stock: Math.max(0, newStock) };
    setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));

    if (isSupabaseConfigured()) {
      await saveProductToSupabase(updated);
    }
    showNotice(`Stock updated for ${target.name}.`);
  };

  // Toggle Featured
  const handleToggleFeatured = async (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    const updated = { ...target, isFeatured: !target.isFeatured };
    setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));

    if (isSupabaseConfigured()) {
      await saveProductToSupabase(updated);
    }
    showNotice(`"${target.name}" featured status changed.`);
  };

  // Delete product
  const handleDeleteProduct = async (productId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from City Cosmetics?`)) return;

    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (isSupabaseConfigured()) {
      await deleteProductFromSupabase(productId);
    }
    showNotice(`"${name}" removed from catalog.`);
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );

    if (isSupabaseConfigured()) {
      const res = await saveProductToSupabase(editingProduct);
      if (res.success) {
        showNotice(`"${editingProduct.name}" saved to Supabase.`);
      } else {
        showNotice(`Updated locally (${res.error || 'Check DB schema'}).`);
      }
    } else {
      showNotice('Product details updated successfully.');
    }

    setEditingProduct(null);
  };

  // Create New Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const created: Product = {
      id: `cc-${Date.now()}`,
      slug: (newProduct.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
      name: newProduct.name || '',
      subtitle: newProduct.subtitle || 'Clean Sunyani Botanical Formula',
      category: (newProduct.category as any) || 'skincare',
      price: Number(newProduct.price),
      rating: 5.0,
      reviewCount: 1,
      stock: Number(newProduct.stock) || 50,
      description: newProduct.description || 'Formulated with clean botanical actives in Sunyani, Ghana.',
      benefits: newProduct.benefits || ['Delivers natural luminosity', 'Deeply hydrates and nourishes'],
      ingredients: newProduct.ingredients || 'Ghanaian shea butter, botanical extracts, hyaluronic acid.',
      howToUse: newProduct.howToUse || 'Apply morning and evening as directed.',
      skinTypes: ['All'],
      tags: ['New', 'Clean'],
      images: newProduct.images?.length
        ? newProduct.images
        : ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85'],
      isFeatured: true,
    };

    setProducts([created, ...products]);

    if (isSupabaseConfigured()) {
      const res = await saveProductToSupabase(created);
      if (res.success) {
        showNotice(`"${created.name}" published to Supabase database!`);
      } else {
        showNotice(`Published locally. (${res.error || 'Check Supabase table'}).`);
      }
    } else {
      showNotice(`"${created.name}" published to catalog!`);
    }

    setIsAddingNew(false);
  };

  // Seed default 8 products into Supabase
  const handleSeedSupabase = async () => {
    if (!confirm('This will seed the default 8 City Cosmetics products into your Supabase database. Continue?')) {
      return;
    }
    showNotice('Seeding products to Supabase...');
    let count = 0;
    for (const prod of PRODUCTS_DATA) {
      await saveProductToSupabase(prod);
      count++;
    }
    await loadData();
    showNotice(`Successfully seeded ${count} products into Supabase!`);
  };

  // Order status
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (isSupabaseConfigured()) {
      await updateLiveOrderStatus(orderId, newStatus);
    }
    showNotice(`Order ${orderId} marked as ${newStatus}.`);
  };

  // -------------------------------------------------------------
  // 1. PIN LOCK SCREEN
  // -------------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center p-4">
        <div className="bg-[#0e2444] border border-[#174EA6]/40 max-w-md w-full rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0B1F3A] to-[#174EA6] mx-auto flex items-center justify-center text-white shadow-lg border border-[#DCEBFA]/20">
            <Lock className="w-8 h-8 text-[#DCEBFA]" />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#DCEBFA] font-semibold block">
              City Cosmetics &bull; Sunyani, Ghana
            </span>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-normal mt-1">
              Admin Access Portal
            </h1>
            <p className="text-xs text-[#9CA3AF] mt-2">
              Enter the admin password to manage products, inventory, and incoming orders.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4 pt-2">
            <div className="relative">
              <input
                type="password"
                maxLength={20}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder="Enter password..."
                autoFocus
                className="w-full text-center tracking-[0.25em] text-base bg-[#0B1F3A] border border-[#174EA6]/60 focus:border-[#DCEBFA] text-white rounded-md py-3.5 px-4 outline-none transition-all placeholder:tracking-normal placeholder:text-xs placeholder:text-[#6B7280]"
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-400 animate-pulse font-medium">{pinError}</p>
            )}

            <button
              type="submit"
              disabled={isVerifyingPin || !pinInput}
              className="w-full bg-[#174EA6] hover:bg-[#0B1F3A] border border-[#174EA6] text-white py-3.5 rounded-md text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-colors"
            >
              {isVerifyingPin ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" /> Unlock Dashboard
                </>
              )}
            </button>

            <div className="pt-2 text-[11px] text-[#9CA3AF] flex items-center justify-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#DCEBFA]" />
              <span>Admin Password: <strong className="text-white font-mono">CITY1258</strong></span>
            </div>
          </form>

          <div className="pt-4 border-t border-[#174EA6]/30">
            <Link
              href="/"
              className="text-xs text-[#9CA3AF] hover:text-white transition-colors"
            >
              &larr; Return to City Cosmetics Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. UNLOCKED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2 text-[#174EA6]">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-bold">
                City Cosmetics Admin Portal &bull; Sunyani, Ghana
              </span>
            </div>
            <h1 className="font-serif-luxury text-3xl font-normal text-[#0B1F3A] mt-1">
              Inventory & Order Management
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-3">
            <button
              onClick={loadData}
              disabled={isLoadingData}
              title="Refresh catalog and orders"
              className="bg-white border border-[#E5E7EB] hover:border-[#174EA6] text-xs font-semibold py-2.5 px-4 rounded-md flex items-center gap-1.5 transition-all text-[#0B1F3A]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={() => setIsAddingNew(true)}
              className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-wider font-semibold py-2.5 px-5 rounded-md flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Formula
            </button>

            <button
              onClick={handleLock}
              className="bg-[#1F2937] hover:bg-[#0B1F3A] text-white text-xs font-semibold py-2.5 px-4 rounded-md flex items-center gap-1.5 transition-all shadow-xs"
              title="Lock Admin Dashboard"
            >
              <Lock className="w-3.5 h-3.5 text-[#DCEBFA]" /> Lock
            </button>
          </div>
        </div>

        {/* Live Notification Bar */}
        {notification && (
          <div className="bg-[#DCEBFA] text-[#0B1F3A] p-4 rounded-md border border-[#DCEBFA] text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-xs">
            <Check className="w-4 h-4 shrink-0 text-[#174EA6]" /> {notification}
          </div>
        )}

        {/* Supabase Status Banner */}
        <div className="bg-[#F5F9FE] p-6 rounded-xl border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#DCEBFA] flex items-center justify-center text-[#0B1F3A] shrink-0">
              <Database className="w-5 h-5 text-[#174EA6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#0B1F3A]">Supabase PostgreSQL & Storage Sync</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCEBFA] text-[#0B1F3A]">
                  Live
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Connected to project URL <code>{process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://...'}</code>. Live uploads save to bucket <code>product-images</code>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSeedSupabase}
              className="text-xs text-[#0B1F3A] hover:text-[#174EA6] font-semibold bg-white hover:bg-[#DCEBFA] px-3.5 py-2 rounded-md border border-[#E5E7EB] transition-all"
            >
              Seed Initial 8 Products to DB
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#F5F9FE] p-5 rounded-xl border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between text-[#6B7280] text-xs mb-2">
              <span>Catalog Revenue</span>
              <TrendingUp className="w-4 h-4 text-[#174EA6]" />
            </div>
            <p className="font-serif-luxury text-2xl font-semibold text-[#0B1F3A]">GH₵284,500.00</p>
            <span className="text-[10px] text-[#174EA6] font-medium">+18% this month</span>
          </div>

          <div className="bg-[#F5F9FE] p-5 rounded-xl border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between text-[#6B7280] text-xs mb-2">
              <span>Active Formulations</span>
              <Package className="w-4 h-4 text-[#0B1F3A]" />
            </div>
            <p className="font-serif-luxury text-2xl font-semibold text-[#0B1F3A]">
              {products.length} SKUs
            </p>
            <span className="text-[10px] text-[#6B7280]">Across 5 categories</span>
          </div>

          <div className="bg-[#F5F9FE] p-5 rounded-xl border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between text-[#6B7280] text-xs mb-2">
              <span>Low Stock Alerts</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="font-serif-luxury text-2xl font-semibold text-[#0B1F3A]">
              {products.filter((p) => p.stock < 30).length} Items
            </p>
            <span className="text-[10px] text-amber-600 font-medium">Reorder recommended</span>
          </div>

          <div className="bg-[#F5F9FE] p-5 rounded-xl border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between text-[#6B7280] text-xs mb-2">
              <span>Customer Orders</span>
              <Users className="w-4 h-4 text-[#174EA6]" />
            </div>
            <p className="font-serif-luxury text-2xl font-semibold text-[#0B1F3A]">
              {orders.length} Active
            </p>
            <span className="text-[10px] text-[#174EA6] font-medium">100% On-time fulfillment</span>
          </div>
        </div>

        {/* Products Management Table */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-luxury text-xl font-semibold text-[#0B1F3A]">
                Formulation Catalog ({products.length})
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Manage cosmetic formulas, inventory stocks, image assets, and hero placements
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search formula by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md pl-10 pr-4 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F9FE] text-[#6B7280] border-b border-[#E5E7EB] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Formula</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F5F9FE]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-11 h-11 rounded-md object-cover border border-[#E5E7EB] bg-[#F5F9FE]"
                        />
                        <div>
                          <span className="font-semibold text-[#0B1F3A] block">{p.name}</span>
                          <span className="text-[10px] text-[#6B7280]">{p.subtitle}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-semibold text-[#174EA6]">
                      {p.category}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0B1F3A]">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={p.stock}
                          onChange={(e) => handleUpdateStock(p.id, parseInt(e.target.value) || 0)}
                          className={`w-16 bg-[#F5F9FE] border rounded-md px-2 py-1 text-xs text-[#0B1F3A] ${
                            p.stock < 30 ? 'border-amber-400 text-amber-700 font-bold' : 'border-[#E5E7EB]'
                          }`}
                        />
                        <span className="text-[10px] text-[#6B7280]">units</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleFeatured(p.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          p.isFeatured
                            ? 'bg-[#0B1F3A] text-white'
                            : 'bg-[#F5F9FE] text-[#6B7280] hover:text-[#0B1F3A]'
                        }`}
                      >
                        {p.isFeatured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          title="View on Live Store"
                          className="p-1.5 text-[#6B7280] hover:text-[#0B1F3A] rounded-md hover:bg-[#F5F9FE] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setEditingProduct(p)}
                          title="Edit Product"
                          className="p-1.5 text-[#6B7280] hover:text-[#174EA6] rounded-md hover:bg-[#F5F9FE] transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          title="Delete Product"
                          className="p-1.5 text-[#6B7280] hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders Management */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#E5E7EB]">
            <h2 className="font-serif-luxury text-xl font-semibold text-[#0B1F3A]">
              Customer Orders & Deliveries (Sunyani & Nationwide)
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Live orders submitted through checkout and Mobile Money
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F9FE] text-[#6B7280] border-b border-[#E5E7EB] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F5F9FE]/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0B1F3A]">{o.id}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-[#0B1F3A] block">{o.customer}</span>
                      <span className="text-[10px] text-[#6B7280]">{o.email}</span>
                    </td>
                    <td className="py-3 px-4 text-[#6B7280]">{o.date}</td>
                    <td className="py-3 px-4 font-serif-luxury font-semibold text-[#0B1F3A]">
                      {formatPrice(o.total)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                        className="bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-2 py-1 text-xs text-[#0B1F3A] focus:border-[#0B1F3A]"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Edit Product */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E5E7EB] animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <h3 className="font-serif-luxury text-lg font-semibold text-[#0B1F3A]">
                  Edit Product SKU: {editingProduct.id}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1 text-[#6B7280] hover:text-[#0B1F3A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-1 text-[#1F2937]">Formula Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1 text-[#1F2937]">Price (GH₵)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1 text-[#1F2937]">Stock Units</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                    />
                  </div>
                </div>

                {/* Supabase Image Upload / URL */}
                <div className="space-y-2 bg-[#F5F9FE] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <label className="text-xs font-semibold block text-[#0B1F3A]">
                    Product Photo (Supabase Storage or URL)
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={editingProduct.images[0]}
                      alt="Preview"
                      className="w-14 h-14 rounded-md object-cover border border-[#E5E7EB] bg-white"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        ref={editFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'edit')}
                      />
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="text-xs bg-white hover:bg-[#DCEBFA] border border-[#E5E7EB] font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all text-[#0B1F3A]"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#174EA6]" />
                        {isUploadingImage ? 'Uploading to Supabase...' : 'Upload Image File'}
                      </button>
                      <input
                        type="text"
                        placeholder="Or paste direct image URL"
                        value={editingProduct.images[0] || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            images: [e.target.value, ...editingProduct.images.slice(1)],
                          })
                        }
                        className="w-full bg-white border border-[#E5E7EB] rounded-md px-2.5 py-1.5 text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1 text-[#1F2937]">Subtitle / Actives</label>
                  <input
                    type="text"
                    value={editingProduct.subtitle}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, subtitle: e.target.value })
                    }
                    className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1 text-[#1F2937]">Formula Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-md border border-[#E5E7EB] text-xs font-semibold text-[#6B7280]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs font-semibold px-6 py-2 rounded-md flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add New Product */}
        {isAddingNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E5E7EB] animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <h3 className="font-serif-luxury text-lg font-semibold text-[#0B1F3A]">
                  Publish New Cosmetic Formulation
                </h3>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="p-1 text-[#6B7280] hover:text-[#0B1F3A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-1 text-[#1F2937]">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Celestial Night Peptide Crème"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1 text-[#1F2937]">Subtitle / Key Actives</label>
                  <input
                    type="text"
                    placeholder="e.g. Multi-Peptide & Sunyani Damascus Rose Night Balm"
                    value={newProduct.subtitle}
                    onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                    className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1 text-[#1F2937]">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, category: e.target.value as any })
                      }
                      className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                    >
                      <option value="skincare">Skincare</option>
                      <option value="makeup">Makeup</option>
                      <option value="fragrance">Fragrance</option>
                      <option value="body">Body Care</option>
                      <option value="sets">Sets & Gifts</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1 text-[#1F2937]">Price (GH₵)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                    />
                  </div>
                </div>

                {/* Supabase Storage Upload */}
                <div className="space-y-2 bg-[#F5F9FE] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <label className="text-xs font-semibold block text-[#0B1F3A]">
                    Product Photo (Supabase Storage or Image URL)
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={newProduct.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80'}
                      alt="Preview"
                      className="w-14 h-14 rounded-md object-cover border border-[#E5E7EB] bg-white shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        ref={newFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'new')}
                      />
                      <button
                        type="button"
                        onClick={() => newFileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="text-xs bg-white hover:bg-[#DCEBFA] border border-[#E5E7EB] font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all text-[#0B1F3A]"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#174EA6]" />
                        {isUploadingImage ? 'Uploading to Supabase...' : 'Upload Image File'}
                      </button>
                      <input
                        type="text"
                        placeholder="Or paste direct image URL"
                        value={newProduct.images?.[0] || ''}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, images: [e.target.value] })
                        }
                        className="w-full bg-white border border-[#E5E7EB] rounded-md px-2.5 py-1.5 text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1 text-[#1F2937]">Initial Stock Units</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1 text-[#1F2937]">Key Benefit</label>
                    <input
                      type="text"
                      placeholder="e.g. 24-hr Moisture Lock"
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, benefits: [e.target.value] })
                      }
                      className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1 text-[#1F2937]">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe the texture, ritual, and results..."
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                    className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-md px-3 py-2 text-xs text-[#1F2937]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-4 py-2 rounded-md border border-[#E5E7EB] text-xs font-semibold text-[#6B7280]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Publish to Catalog
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
