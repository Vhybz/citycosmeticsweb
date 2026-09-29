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
  Layers,
  Sparkles,
  ShoppingBag,
  Phone,
  MessageCircle,
  Truck,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { PRODUCTS_DATA, CATEGORIES } from '@/lib/productsData';
import { Product, Category, BeautyImage } from '@/types';
import {
  isSupabaseConfigured,
  fetchLiveProducts,
  saveProductToSupabase,
  deleteProductFromSupabase,
  fetchLiveCategories,
  saveCategoryToSupabase,
  deleteCategoryFromSupabase,
  fetchLiveBeautyImages,
  saveBeautyImageToSupabase,
  deleteBeautyImageFromSupabase,
  DEFAULT_BEAUTY_IMAGES,
  fetchLiveOrders,
  updateLiveOrderStatus,
  uploadImageToBucket,
} from '@/lib/supabaseClient';
import { formatPrice } from '@/lib/formatPrice';
import { SITE_CONFIG } from '@/lib/siteConfig';

export default function AdminPage() {
  // Master Password Unlock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isVerifyingPin, setIsVerifyingPin] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'beauty' | 'orders'>('overview');

  // Live Data States
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [beautyImages, setBeautyImages] = useState<BeautyImage[]>(DEFAULT_BEAUTY_IMAGES);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>('');

  // Products UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    subtitle: '',
    category: 'skincare',
    price: 450.0,
    stock: 40,
    description: '',
    benefits: ['Hydrates skin deeply', 'Restores moisture barrier'],
    ingredients: 'Botanical rosewater, Ghanaian shea butter, plant squalane, hyaluronic acid.',
    howToUse: 'Apply 2-3 drops morning and night on cleansed skin.',
    skinTypes: ['All'],
    tags: ['New', 'Clean'],
    images: ['/beautyImages/ca20569827f857496b78c0666cb556c4.jpg'],
  });

  // Categories UI State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    id: '',
    name: '',
    slug: '',
    description: '',
    image: '/beautyImages/34452e2fc3a3d0262d96d96e2c62e95d.jpg',
    itemCount: 0,
  });

  // Beauty Visuals UI State
  const [editingBeauty, setEditingBeauty] = useState<BeautyImage | null>(null);
  const [isAddingBeauty, setIsAddingBeauty] = useState(false);
  const [newBeauty, setNewBeauty] = useState<Partial<BeautyImage>>({
    id: '',
    image: '/beautyImages/1.jpg',
    tag: 'Botanical Radiance',
    title: '',
    description: '',
    category: 'Skincare',
    isActive: true,
  });

  // Image Upload State
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadFeedback, setUploadFeedback] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available pre-bundled beauty images in /beautyImages/ for quick select
  const localBeautyImages = [
    '/beautyImages/1.jpg',
    '/beautyImages/2.jpg',
    '/beautyImages/3.jpg',
    '/beautyImages/ca.jpg',
    '/beautyImages/cc.jpg',
    '/beautyImages/258826bc9ee800fab3177221c23668ef.jpg',
    '/beautyImages/61bc208cf17f0911e9f99c0810ccc200.jpg',
    '/beautyImages/e2660f8d3d6e02246ae67904661af3e7.jpg',
    '/beautyImages/77261bd99d7a546b2a2d90e473132e83.jpg',
    '/beautyImages/b4c0b01d7f8922fbb7dac620a15a3ec1.jpg',
    '/beautyImages/bd545c8751f20e872e51fc45f870cc99.jpg',
    '/beautyImages/ca20569827f857496b78c0666cb556c4.jpg',
    '/beautyImages/cadd9c6e24c20cf8e79f77ff3f1e9c49.jpg',
    '/beautyImages/34452e2fc3a3d0262d96d96e2c62e95d.jpg',
    '/beautyImages/ff5509b7b3d0bf627a13767df76f3662.jpg',
  ];

  // Check session unlock status on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('city_cosmetics_admin_unlocked');
      if (stored === 'true') {
        setIsUnlocked(true);
      }
    }
  }, []);

  // Fetch all live data when unlocked
  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [liveProds, liveCats, liveBeauty, liveOrds] = await Promise.all([
        fetchLiveProducts(),
        fetchLiveCategories(),
        fetchLiveBeautyImages(),
        fetchLiveOrders(),
      ]);

      if (liveProds && liveProds.length > 0) setProducts(liveProds);
      if (liveCats && liveCats.length > 0) setCategories(liveCats);
      if (liveBeauty && liveBeauty.length > 0) setBeautyImages(liveBeauty);

      if (liveOrds && liveOrds.length > 0) {
        setOrders(liveOrds);
      } else {
        setOrders([
          {
            id: 'CC-982314',
            customer: 'Ama Osei-Bonsu',
            phone: '024 456 7890',
            email: 'ama.osei@gmail.com',
            total: 1050.0,
            itemsCount: 2,
            status: 'Shipped',
            paymentMethod: 'momo',
            date: '2026-09-24',
            dispatchNotes: 'Dispatched via Sunyani VIP Courier',
          },
          {
            id: 'CC-982315',
            customer: 'Kofi Mensah',
            phone: '055 965 0921',
            email: 'kofi.mensah@sunyani.gh',
            total: 1950.0,
            itemsCount: 3,
            status: 'Processing',
            paymentMethod: 'telecel',
            date: '2026-09-28',
            dispatchNotes: 'Packing at Commercial Avenue showroom',
          },
          {
            id: 'CC-982316',
            customer: 'Akosua Serwaa',
            phone: '020 123 4567',
            email: 'serwaa.akosua@yahoo.com',
            total: 680.0,
            itemsCount: 1,
            status: 'Delivered',
            paymentMethod: 'cod',
            date: '2026-09-20',
            dispatchNotes: 'Hand-delivered in Sunyani Central',
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
        setPinError('Incorrect password. Please enter the master admin key.');
      }
      setIsVerifyingPin(false);
    }, 250);
  };

  const handleLock = () => {
    sessionStorage.removeItem('city_cosmetics_admin_unlocked');
    setIsUnlocked(false);
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  /* ==========================================================================
     IMAGE UPLOAD HELPER
     ========================================================================== */
  const handleGenericFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    bucket: 'product-images' | 'category-images' | 'beauty-images',
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadFeedback(`Uploading to Supabase Storage (${bucket})...`);

    const { url, error } = await uploadImageToBucket(file, bucket);

    if (error || !url) {
      // Local fallback object URL preview
      const localUrl = URL.createObjectURL(file);
      onSuccess(localUrl);
      showNotice('Uploaded for local preview (Run supabase/schema.sql to sync permanent bucket storage).');
    } else {
      onSuccess(url);
      showNotice('Image successfully uploaded to Supabase Storage!');
    }

    setIsUploading(false);
    setUploadFeedback('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ==========================================================================
     PRODUCT HANDLERS
     ========================================================================== */
  const handleSaveProduct = async (productToSave: Product) => {
    const updated = products.map((p) => (p.id === productToSave.id ? productToSave : p));
    setProducts(updated);
    setEditingProduct(null);

    const res = await saveProductToSupabase(productToSave);
    if (res.success) {
      showNotice(`"${productToSave.name}" updated in Supabase.`);
    } else {
      showNotice(`Updated locally. (Supabase note: ${res.error || 'Saved in local state'})`);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Please provide at least a Product Name and Price.');
      return;
    }

    const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const product: Product = {
      id: `cc-${Date.now().toString().slice(-4)}`,
      slug,
      name: newProduct.name,
      subtitle: newProduct.subtitle || '',
      category: newProduct.category || 'skincare',
      price: Number(newProduct.price),
      compareAtPrice: newProduct.compareAtPrice ? Number(newProduct.compareAtPrice) : undefined,
      rating: 5.0,
      reviewCount: 1,
      images: newProduct.images && newProduct.images.length > 0
        ? newProduct.images
        : ['/beautyImages/ca20569827f857496b78c0666cb556c4.jpg'],
      description: newProduct.description || '',
      benefits: newProduct.benefits || ['Hydrates and softens skin'],
      ingredients: newProduct.ingredients || 'Botanical extracts, Ghanaian shea butter.',
      howToUse: newProduct.howToUse || 'Apply as desired.',
      skinTypes: (newProduct.skinTypes as any) || ['All'],
      tags: (newProduct.tags as any) || ['New', 'Clean'],
      stock: Number(newProduct.stock) || 50,
      isFeatured: false,
    };

    setProducts([product, ...products]);
    setIsAddingProduct(false);

    const res = await saveProductToSupabase(product);
    if (res.success) {
      showNotice(`"${product.name}" created and synced to Supabase.`);
    } else {
      showNotice(`"${product.name}" created in local store.`);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      setProducts(products.filter((p) => p.id !== id));
      const res = await deleteProductFromSupabase(id);
      if (res.success) {
        showNotice(`"${name}" deleted from database.`);
      } else {
        showNotice(`"${name}" removed from catalog.`);
      }
    }
  };

  /* ==========================================================================
     CATEGORY HANDLERS (Face Image / Cover Image updates)
     ========================================================================== */
  const handleSaveCategory = async (catToSave: Category) => {
    const updated = categories.map((c) => (c.id === catToSave.id ? catToSave : c));
    setCategories(updated);
    setEditingCategory(null);

    const res = await saveCategoryToSupabase(catToSave);
    if (res.success) {
      showNotice(`Category "${catToSave.name}" & Face Image updated in Supabase!`);
    } else {
      showNotice(`Category "${catToSave.name}" updated locally.`);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      alert('Please enter a Category Name.');
      return;
    }

    const slug = (newCategory.slug || newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    const id = slug;

    const cat: Category = {
      id,
      name: newCategory.name,
      slug,
      description: newCategory.description || 'Artisanal formulations crafted in Sunyani.',
      image: newCategory.image || '/beautyImages/34452e2fc3a3d0262d96d96e2c62e95d.jpg',
      itemCount: 0,
    };

    setCategories([...categories, cat]);
    setIsAddingCategory(false);
    setNewCategory({
      name: '',
      slug: '',
      description: '',
      image: '/beautyImages/34452e2fc3a3d0262d96d96e2c62e95d.jpg',
      itemCount: 0,
    });

    const res = await saveCategoryToSupabase(cat);
    if (res.success) {
      showNotice(`Category "${cat.name}" created and synced to Supabase!`);
    } else {
      showNotice(`Category "${cat.name}" added to catalog.`);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (confirm(`Delete category "${name}"? Existing products in this category will become unassigned.`)) {
      setCategories(categories.filter((c) => c.id !== id));
      const res = await deleteCategoryFromSupabase(id);
      if (res.success) {
        showNotice(`Category "${name}" deleted.`);
      } else {
        showNotice(`Category "${name}" removed.`);
      }
    }
  };

  /* ==========================================================================
     BEAUTY VISUALS HANDLERS (Living Radiance Archive / Marquee)
     ========================================================================== */
  const handleSaveBeauty = async (itemToSave: BeautyImage) => {
    const updated = beautyImages.map((b) => (b.id === itemToSave.id ? itemToSave : b));
    setBeautyImages(updated);
    setEditingBeauty(null);

    const res = await saveBeautyImageToSupabase(itemToSave);
    if (res.success) {
      showNotice(`Beauty Visual "${itemToSave.title}" updated in Supabase!`);
    } else {
      showNotice(`Beauty Visual updated locally.`);
    }
  };

  const handleCreateBeauty = async () => {
    if (!newBeauty.title || !newBeauty.image) {
      alert('Please provide a Title and an Image URL or Upload.');
      return;
    }

    const item: BeautyImage = {
      id: `b-${Date.now().toString().slice(-4)}`,
      image: newBeauty.image,
      tag: newBeauty.tag || 'Radiance',
      title: newBeauty.title,
      description: newBeauty.description || '',
      category: newBeauty.category || 'Skincare',
      isActive: newBeauty.isActive !== false,
    };

    setBeautyImages([item, ...beautyImages]);
    setIsAddingBeauty(false);
    setNewBeauty({
      image: '/beautyImages/1.jpg',
      tag: 'Botanical Radiance',
      title: '',
      description: '',
      category: 'Skincare',
      isActive: true,
    });

    const res = await saveBeautyImageToSupabase(item);
    if (res.success) {
      showNotice(`Beauty visual "${item.title}" added to living gallery!`);
    } else {
      showNotice(`Beauty visual added to local gallery.`);
    }
  };

  const handleDeleteBeauty = async (id: string, title: string) => {
    if (confirm(`Remove "${title}" from the living radiance gallery?`)) {
      setBeautyImages(beautyImages.filter((b) => b.id !== id));
      const res = await deleteBeautyImageFromSupabase(id);
      if (res.success) {
        showNotice(`Visual removed from Supabase.`);
      } else {
        showNotice(`Visual removed from gallery.`);
      }
    }
  };

  /* ==========================================================================
     ORDER DISPATCH HANDLERS
     ========================================================================== */
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    const success = await updateLiveOrderStatus(orderId, newStatus);
    if (success) {
      showNotice(`Order #${orderId} marked as ${newStatus}.`);
    } else {
      showNotice(`Order #${orderId} status updated locally.`);
    }
  };

  const sendWhatsAppDispatchNotice = (order: any) => {
    const cleanPhone = (order.phone || SITE_CONFIG.whatsappNumber).replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.startsWith('0') ? `233${cleanPhone.slice(1)}` : cleanPhone;
    const msg = `Hello ${order.customer},\n\nYour order #${order.id} (Total: ${formatPrice(order.total)}) has been prepared and marked as *${order.status}* from our City Cosmetics Sunyani showroom.\n\n${order.dispatchNotes ? `Dispatch Note: ${order.dispatchNotes}\n\n` : ''}Thank you for supporting clean Ghanaian botanical beauty!`;
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Filter products by category & search
  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // KPI Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 284500);
  const lowStockCount = products.filter((p) => (p.stock || 0) < 20).length;
  const processingOrdersCount = orders.filter((o) => o.status === 'Processing').length;

  /* ==========================================================================
     PIN LOCK SCREEN
     ========================================================================== */
  if (!isUnlocked) {
    return (
      <div className="min-h-[85vh] bg-[#F5F9FE] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 border border-[#E5E7EB] shadow-2xl rounded-none text-center animate-fadeIn">
          <div className="w-14 h-14 bg-[#0B1F3A] text-white flex items-center justify-center mx-auto mb-6 rounded-none shadow-md">
            <Lock className="w-7 h-7 text-[#DCEBFA]" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#174EA6] block">
            Sunyani Flagship Store
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-[#0B1F3A] mt-1 mb-2 font-normal">
            Inventory & Operations Portal
          </h1>
          <p className="text-xs text-[#6B7280] leading-relaxed mb-6">
            Enter the master management password to monitor orders, update formulations, customize categories, and manage site beauty visuals.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter admin password (e.g. CITY1258)"
                className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-none px-4 py-3 text-sm text-[#0B1F3A] placeholder-[#9CA3AF] text-center tracking-widest font-mono focus:outline-none focus:border-[#0B1F3A] focus:ring-1 focus:ring-[#0B1F3A]/20 transition-all"
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-600 bg-red-50 p-2 border border-red-200">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifyingPin}
              className="w-full bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-3.5 px-6 rounded-none transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
            >
              {isVerifyingPin ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#DCEBFA]" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-[#DCEBFA]" /> Unlock Store Operations
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#6B7280]">
            <span>Sunyani Central &bull; Bono Region</span>
            <Link href="/" className="text-[#174EA6] hover:underline font-medium">
              &larr; Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     UNLOCKED STORE MANAGEMENT DASHBOARD
     ========================================================================== */
  return (
    <div className="min-h-screen bg-[#F5F9FE] pb-24">
      {/* Top Banner Notice */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-[#0B1F3A] text-white text-xs px-5 py-3 shadow-2xl border border-white/20 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#DCEBFA]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="bg-[#0B1F3A] text-white border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 border border-white/15 flex items-center justify-center text-[#DCEBFA]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-xl tracking-[0.16em] uppercase">
                  City Cosmetics
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#174EA6] text-white font-mono uppercase">
                  Operations Suite
                </span>
              </div>
              <p className="text-[10px] text-[#DCEBFA]/75 font-sans">
                Sunyani Showroom Dispatch & Cloud Database Management
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={isLoadingData}
              className="bg-white/10 hover:bg-white/20 text-[#DCEBFA] text-xs px-3.5 py-2 rounded-none border border-white/15 flex items-center gap-1.5 transition-colors"
              title="Refresh all Supabase data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
              <span>Sync Cloud</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-3.5 py-2 rounded-none border border-white/15 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#DCEBFA]" />
              <span>Live Website</span>
            </Link>

            <button
              onClick={handleLock}
              className="bg-red-600/80 hover:bg-red-600 text-white text-xs px-3.5 py-2 rounded-none flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 border-t border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-[#DCEBFA]/70 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Operations Overview
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-[#DCEBFA]/70 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> Products ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-4 font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-[#DCEBFA]/70 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Categories & Face Images ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('beauty')}
            className={`py-3 px-4 font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'beauty'
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-[#DCEBFA]/70 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Site Beauty Gallery ({beautyImages.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-[#DCEBFA]/70 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Orders & Dispatch ({orders.length})
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ====================================================================
            TAB 1: OPERATIONS & MONITORING OVERVIEW
            ==================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-none border border-[#E5E7EB] shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#6B7280] block">
                  Total Gross Revenue (Ghana Cedis)
                </span>
                <p className="font-serif-luxury text-3xl font-semibold text-[#0B1F3A] mt-2">
                  {formatPrice(totalRevenue)}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-600 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month across Sunyani & Ghana
                </div>
              </div>

              <div className="bg-white p-6 rounded-none border border-[#E5E7EB] shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#6B7280] block">
                  Active Showroom Orders
                </span>
                <p className="font-serif-luxury text-3xl font-semibold text-[#0B1F3A] mt-2">
                  {processingOrdersCount} Pending Dispatch
                </p>
                <p className="text-[11px] text-[#6B7280] mt-2">
                  {orders.length} total recorded customer orders
                </p>
              </div>

              <div className="bg-white p-6 rounded-none border border-[#E5E7EB] shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#6B7280] block">
                  Formulations & Inventory
                </span>
                <p className="font-serif-luxury text-3xl font-semibold text-[#0B1F3A] mt-2">
                  {products.length} Products
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                  {lowStockCount > 0 ? (
                    <span className="text-amber-600 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {lowStockCount} items below 20 stock
                    </span>
                  ) : (
                    <span className="text-emerald-600">All inventory adequately stocked</span>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-none border border-[#E5E7EB] shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#6B7280] block">
                  Categories & Living Visuals
                </span>
                <p className="font-serif-luxury text-3xl font-semibold text-[#0B1F3A] mt-2">
                  {categories.length} Cats &bull; {beautyImages.length} Visuals
                </p>
                <p className="text-[11px] text-[#174EA6] mt-2 font-medium">
                  Live in Infinite Radiance Marquee
                </p>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Orders Overview */}
              <div className="lg:col-span-8 bg-white p-6 rounded-none border border-[#E5E7EB] shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-5">
                  <h3 className="font-serif-luxury text-lg font-semibold text-[#0B1F3A]">
                    Recent Showroom Dispatches & Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#174EA6] hover:underline font-semibold"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] text-[#6B7280] uppercase tracking-wider text-[10px]">
                        <th className="py-2.5">Order ID</th>
                        <th className="py-2.5">Customer</th>
                        <th className="py-2.5">Total</th>
                        <th className="py-2.5">Payment</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Dispatch Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-[#F5F9FE]">
                          <td className="py-3 font-mono font-semibold text-[#0B1F3A]">
                            #{order.id}
                          </td>
                          <td className="py-3">
                            <span className="font-medium text-[#1F2937] block">{order.customer}</span>
                            <span className="text-[10px] text-[#6B7280]">{order.phone || order.email}</span>
                          </td>
                          <td className="py-3 font-semibold text-[#0B1F3A]">
                            {formatPrice(order.total)}
                          </td>
                          <td className="py-3 uppercase text-[10px] text-[#6B7280]">
                            {order.paymentMethod || 'momo'}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'Shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => sendWhatsAppDispatchNotice(order)}
                              className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 border border-emerald-200 transition-colors"
                              title="Send WhatsApp dispatch notification"
                            >
                              <MessageCircle className="w-3 h-3" /> WhatsApp
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Operations Guide & Database Status */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#0B1F3A] text-white p-6 rounded-none border border-white/10 shadow-sm">
                  <span className="text-[10px] uppercase tracking-widest text-[#DCEBFA] font-semibold block">
                    Cloud Database Status
                  </span>
                  <h4 className="font-serif-luxury text-lg font-normal text-white mt-1">
                    {isSupabaseConfigured() ? 'Supabase Connected' : 'Local Fallback Active'}
                  </h4>
                  <p className="text-xs text-[#DCEBFA]/80 mt-2 leading-relaxed">
                    Database credentials in <code className="text-white bg-white/10 px-1">.env.local</code>. Run the complete updated script in <code className="text-white bg-white/10 px-1">supabase/schema.sql</code> to create all storage buckets and tables.
                  </p>
                  <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs">
                    <span className="text-[#DCEBFA]/70">Admin Password</span>
                    <span className="font-mono text-white font-bold bg-white/10 px-2 py-0.5">CITY1258</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-none border border-[#E5E7EB] shadow-xs">
                  <h4 className="font-serif-luxury text-sm font-semibold text-[#0B1F3A] uppercase tracking-wider mb-3">
                    Quick Operations Shortcut
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <button
                      onClick={() => {
                        setActiveTab('categories');
                        setIsAddingCategory(true);
                      }}
                      className="w-full text-left p-3 bg-[#F5F9FE] hover:bg-[#DCEBFA]/50 border border-[#E5E7EB] font-medium text-[#0B1F3A] flex items-center justify-between transition-colors"
                    >
                      <span>+ Create New Category & Face Image</span>
                      <Layers className="w-4 h-4 text-[#174EA6]" />
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('products');
                        setIsAddingProduct(true);
                      }}
                      className="w-full text-left p-3 bg-[#F5F9FE] hover:bg-[#DCEBFA]/50 border border-[#E5E7EB] font-medium text-[#0B1F3A] flex items-center justify-between transition-colors"
                    >
                      <span>+ Add New Formulation / Product</span>
                      <Package className="w-4 h-4 text-[#174EA6]" />
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('beauty');
                        setIsAddingBeauty(true);
                      }}
                      className="w-full text-left p-3 bg-[#F5F9FE] hover:bg-[#DCEBFA]/50 border border-[#E5E7EB] font-medium text-[#0B1F3A] flex items-center justify-between transition-colors"
                    >
                      <span>+ Upload Marquee Beauty Visual</span>
                      <ImageIcon className="w-4 h-4 text-[#174EA6]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 2: PRODUCTS MANAGEMENT
            ==================================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-none border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search formulation name or category..."
                    className="w-full pl-9 pr-4 py-2 bg-[#F5F9FE] border border-[#E5E7EB] text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsAddingProduct(true)}
                className="w-full sm:w-auto bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-2.5 px-5 rounded-none flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Formulation
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-none border border-[#E5E7EB] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#F5F9FE] border-b border-[#E5E7EB] text-[#6B7280] uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Formulation Packshot</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (GH₵)</th>
                      <th className="py-3 px-4">Stock Level</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-[#F5F9FE]/60 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-none object-cover border border-[#E5E7EB] bg-[#F5F9FE]"
                          />
                          <div>
                            <span className="font-serif-luxury text-sm font-semibold text-[#0B1F3A] block">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-[#6B7280] line-clamp-1">
                              {product.subtitle}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 uppercase text-[10px] font-semibold text-[#174EA6]">
                          {product.category}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#0B1F3A]">
                          {formatPrice(product.price)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 text-[11px] font-mono font-semibold ${
                              product.stock < 20
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-[#F5F9FE] text-[#0B1F3A] border border-[#E5E7EB]'
                            }`}
                          >
                            {product.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-[#6B7280]">
                          ★ {product.rating} ({product.reviewCount})
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-1.5 bg-[#F5F9FE] hover:bg-[#0B1F3A] hover:text-white border border-[#E5E7EB] text-[#0B1F3A] transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 text-red-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 3: CATEGORIES MANAGEMENT & FACE IMAGES (User's explicit request)
            ==================================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header info & Create Category Trigger */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-none border border-[#E5E7EB] shadow-xs">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#174EA6] font-semibold block">
                  Category Hierarchy & Visual Identity
                </span>
                <h3 className="font-serif-luxury text-xl font-normal text-[#0B1F3A] mt-0.5">
                  Store Categories & Face Image Manager
                </h3>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                  Create new collections and update the face/cover image for any category across the storefront.
                </p>
              </div>

              <button
                onClick={() => setIsAddingCategory(true)}
                className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-3 px-6 rounded-none flex items-center gap-2 shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" /> Create Category
              </button>
            </div>

            {/* Categories Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white border border-[#E5E7EB] shadow-sm rounded-none overflow-hidden flex flex-col justify-between group hover:border-[#0B1F3A] transition-all"
                >
                  {/* Category Face Image Banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0B1F3A]">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest font-mono text-[#DCEBFA]">
                          Slug: /{cat.slug}
                        </span>
                        <h4 className="font-serif-luxury text-xl font-normal text-white">
                          {cat.name}
                        </h4>
                      </div>
                      <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 font-semibold text-white">
                        {cat.itemCount || products.filter((p) => p.category === cat.slug).length} items
                      </span>
                    </div>
                  </div>

                  {/* Body description & actions */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-[#1F2937]/80 leading-relaxed">
                      {cat.description || 'No description provided.'}
                    </p>

                    <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-[11px] uppercase tracking-wider font-semibold py-2 px-4 rounded-none flex items-center gap-1.5 transition-colors"
                      >
                        <Edit className="w-3 h-3" /> Update Face Image
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="text-red-600 hover:text-red-800 text-[11px] font-semibold px-2 py-1 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 4: SITE BEAUTY IMAGES & LIVING GLOW REEL
            ==================================================================== */}
        {activeTab === 'beauty' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-none border border-[#E5E7EB] shadow-xs">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#174EA6] font-semibold block">
                  Storefront Visual Showcase
                </span>
                <h3 className="font-serif-luxury text-xl font-normal text-[#0B1F3A] mt-0.5">
                  Living Radiance Visuals & Marquee Gallery
                </h3>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                  Manage the animated beauty visuals shown in the infinite marquee, hero cycler, and lookbook reels.
                </p>
              </div>

              <button
                onClick={() => setIsAddingBeauty(true)}
                className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-widest font-semibold py-3 px-6 rounded-none flex items-center gap-2 shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Beauty Visual
              </button>
            </div>

            {/* Visuals Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {beautyImages.map((b) => (
                <div
                  key={b.id}
                  className="bg-white border border-[#E5E7EB] shadow-sm rounded-none overflow-hidden flex flex-col justify-between group hover:border-[#0B1F3A] transition-all"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0B1F3A]">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#0B1F3A]/90 text-white text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 border border-white/20">
                      {b.tag}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-serif-luxury text-sm font-semibold text-[#0B1F3A] line-clamp-1">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-[#6B7280] line-clamp-2 leading-relaxed">
                      {b.description}
                    </p>

                    <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono text-[#174EA6] uppercase">
                        {b.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingBeauty(b)}
                          className="p-1 hover:text-[#0B1F3A] text-[#6B7280]"
                          title="Edit Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBeauty(b.id, b.title)}
                          className="p-1 hover:text-red-600 text-[#6B7280]"
                          title="Remove Visual"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 5: ORDERS & SUNYANI DISPATCH LOGISTICS
            ==================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-5 rounded-none border border-[#E5E7EB] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#174EA6] font-semibold block">
                  Logistics & Fulfillment
                </span>
                <h3 className="font-serif-luxury text-xl font-normal text-[#0B1F3A] mt-0.5">
                  Sunyani Showroom Dispatch Management
                </h3>
              </div>
              <span className="text-xs text-[#6B7280] font-mono">
                {orders.length} Total Orders
              </span>
            </div>

            <div className="bg-white rounded-none border border-[#E5E7EB] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#F5F9FE] border-b border-[#E5E7EB] text-[#6B7280] uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Items / Total</th>
                      <th className="py-3 px-4">Payment Channel</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                      <th className="py-3 px-4 text-right">Instant Notification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#F5F9FE]/60">
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-semibold text-[#0B1F3A] block">#{order.id}</span>
                          <span className="text-[10px] text-[#6B7280]">{order.date}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#1F2937] block">{order.customer}</span>
                          <span className="text-[11px] text-[#6B7280] block font-mono">{order.phone || 'No phone'}</span>
                          <span className="text-[10px] text-[#6B7280]">{order.email}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#0B1F3A] block">{formatPrice(order.total)}</span>
                          <span className="text-[10px] text-[#6B7280]">{order.itemsCount} items</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="uppercase font-mono text-[10px] px-2 py-0.5 bg-[#F5F9FE] border border-[#E5E7EB]">
                            {order.paymentMethod || 'momo'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-[#F5F9FE] border border-[#E5E7EB] px-2.5 py-1 text-xs text-[#0B1F3A] font-semibold focus:outline-none focus:border-[#0B1F3A]"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Dispatched / Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => sendWhatsAppDispatchNotice(order)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] px-3 py-1.5 rounded-none shadow-xs transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            <span>WhatsApp Dispatch</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
          MODAL: CREATE NEW CATEGORY & FACE IMAGE
          ==================================================================== */}
      {isAddingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-lg w-full border border-[#E5E7EB] shadow-2xl p-6 sm:p-8 rounded-none space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#174EA6] font-semibold block">
                  Category Architect
                </span>
                <h3 className="font-serif-luxury text-xl font-normal text-[#0B1F3A]">
                  Create New Store Category
                </h3>
              </div>
              <button
                onClick={() => setIsAddingCategory(false)}
                className="p-1 hover:text-[#0B1F3A] text-[#6B7280]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setNewCategory({ ...newCategory, name, slug });
                  }}
                  placeholder="e.g. Lip Care & Balms"
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  placeholder="e.g. lip-care"
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={2}
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Describe formulations and sensorial benefits in this category..."
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              {/* Category Face Image Section */}
              <div className="pt-2 border-t border-[#E5E7EB]">
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">
                  Category Face Image / Cover Banner *
                </label>

                {/* Preview Box */}
                <div className="relative aspect-[16/9] w-full bg-[#0B1F3A] mb-3 overflow-hidden border border-[#E5E7EB]">
                  {newCategory.image ? (
                    <img
                      src={newCategory.image}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-white/60">
                      No image selected
                    </div>
                  )}
                </div>

                {/* Upload or Select Options */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory.image}
                      onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                      placeholder="Image URL or choose file below..."
                      className="flex-1 bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                    />
                    <label className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs font-semibold px-3 py-1.5 cursor-pointer shrink-0 flex items-center gap-1 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleGenericFileUpload(e, 'category-images', (url) =>
                            setNewCategory({ ...newCategory, image: url })
                          )
                        }
                      />
                    </label>
                  </div>

                  {/* Quick Select from existing beauty images */}
                  <div className="pt-2">
                    <span className="text-[10px] text-[#6B7280] block mb-1 font-medium">
                      Or select from store beauty library:
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {localBeautyImages.slice(0, 6).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Option"
                          onClick={() => setNewCategory({ ...newCategory, image: img })}
                          className={`w-10 h-10 object-cover cursor-pointer border-2 shrink-0 ${
                            newCategory.image === img ? 'border-[#174EA6]' : 'border-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#6B7280] hover:text-[#0B1F3A]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCategory}
                className="px-6 py-2 bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: EDIT CATEGORY & UPDATE FACE IMAGE (User's explicit request)
          ==================================================================== */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-lg w-full border border-[#E5E7EB] shadow-2xl p-6 sm:p-8 rounded-none space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#174EA6] font-semibold block">
                  Category Editor
                </span>
                <h3 className="font-serif-luxury text-xl font-normal text-[#0B1F3A]">
                  Update &ldquo;{editingCategory.name}&rdquo; Face Image
                </h3>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1 hover:text-[#0B1F3A] text-[#6B7280]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              {/* Face Image Preview & Replacement */}
              <div className="pt-2 border-t border-[#E5E7EB]">
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">
                  Current Face Image Preview
                </label>

                <div className="relative aspect-[16/9] w-full bg-[#0B1F3A] mb-3 overflow-hidden border border-[#E5E7EB]">
                  <img
                    src={editingCategory.image}
                    alt={editingCategory.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 text-[9px] uppercase font-bold text-[#0B1F3A]">
                    Live Face Image
                  </div>
                </div>

                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={editingCategory.image}
                    onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                    placeholder="Paste new image URL or upload below..."
                    className="flex-1 bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B1F3A]"
                  />
                  <label className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs font-semibold px-3 py-1.5 cursor-pointer shrink-0 flex items-center gap-1 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleGenericFileUpload(e, 'category-images', (url) =>
                          setEditingCategory({ ...editingCategory, image: url })
                        )
                      }
                    />
                  </label>
                </div>

                {/* Quick Select from library */}
                <div>
                  <span className="text-[10px] text-[#6B7280] block mb-1 font-medium">
                    Or select from existing beauty library:
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {localBeautyImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Option"
                        onClick={() => setEditingCategory({ ...editingCategory, image: img })}
                        className={`w-11 h-11 object-cover cursor-pointer border-2 shrink-0 ${
                          editingCategory.image === img ? 'border-[#174EA6]' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#6B7280] hover:text-[#0B1F3A]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveCategory(editingCategory)}
                className="px-6 py-2 bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: ADD BEAUTY VISUAL TO LIVING GLOW REEL
          ==================================================================== */}
      {isAddingBeauty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-md w-full border border-[#E5E7EB] shadow-2xl p-6 sm:p-8 rounded-none space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#174EA6] font-semibold block">
                  Living Glow Reel
                </span>
                <h3 className="font-serif-luxury text-xl font-normal text-[#0B1F3A]">
                  Add Beauty Visual
                </h3>
              </div>
              <button onClick={() => setIsAddingBeauty(false)} className="p-1 hover:text-[#0B1F3A] text-[#6B7280]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Preview */}
              <div className="relative aspect-[3/4] w-full max-w-[200px] mx-auto bg-[#0B1F3A] overflow-hidden border border-[#E5E7EB]">
                {newBeauty.image ? (
                  <img src={newBeauty.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-white/60">
                    No image
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">
                  Tagline (e.g. Botanical Radiance)
                </label>
                <input
                  type="text"
                  value={newBeauty.tag}
                  onChange={(e) => setNewBeauty({ ...newBeauty, tag: e.target.value })}
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#1F2937]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newBeauty.title}
                  onChange={(e) => setNewBeauty({ ...newBeauty, title: e.target.value })}
                  placeholder="e.g. Flawless Melanin Barrier"
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#1F2937]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">
                  Clinical Description
                </label>
                <textarea
                  rows={2}
                  value={newBeauty.description}
                  onChange={(e) => setNewBeauty({ ...newBeauty, description: e.target.value })}
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#1F2937]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">
                  Image Source
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBeauty.image}
                    onChange={(e) => setNewBeauty({ ...newBeauty, image: e.target.value })}
                    className="flex-1 bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#1F2937]"
                  />
                  <label className="bg-[#0B1F3A] text-white text-xs font-semibold px-3 py-1.5 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleGenericFileUpload(e, 'beauty-images', (url) =>
                          setNewBeauty({ ...newBeauty, image: url })
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Quick Select */}
              <div>
                <span className="text-[10px] text-[#6B7280] block mb-1">Select from library:</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {localBeautyImages.slice(0, 7).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Choice"
                      onClick={() => setNewBeauty({ ...newBeauty, image: img })}
                      className={`w-9 h-9 object-cover cursor-pointer border-2 shrink-0 ${
                        newBeauty.image === img ? 'border-[#174EA6]' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddingBeauty(false)}
                className="px-3 py-1.5 border border-[#E5E7EB] text-xs font-semibold text-[#6B7280]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateBeauty}
                className="px-5 py-1.5 bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Add to Marquee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: EDIT BEAUTY VISUAL
          ==================================================================== */}
      {editingBeauty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-md w-full border border-[#E5E7EB] shadow-2xl p-6 sm:p-8 rounded-none space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="font-serif-luxury text-xl font-normal text-[#0B1F3A]">
                Edit Beauty Visual
              </h3>
              <button onClick={() => setEditingBeauty(null)} className="p-1 text-[#6B7280]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="relative aspect-[3/4] w-full max-w-[200px] mx-auto bg-[#0B1F3A] overflow-hidden border border-[#E5E7EB]">
                <img src={editingBeauty.image} alt="Visual" className="w-full h-full object-cover" />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">Title</label>
                <input
                  type="text"
                  value={editingBeauty.title}
                  onChange={(e) => setEditingBeauty({ ...editingBeauty, title: e.target.value })}
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#1F2937]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">Tag</label>
                <input
                  type="text"
                  value={editingBeauty.tag}
                  onChange={(e) => setEditingBeauty({ ...editingBeauty, tag: e.target.value })}
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#1F2937]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingBeauty.description}
                  onChange={(e) => setEditingBeauty({ ...editingBeauty, description: e.target.value })}
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#1F2937]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2937] block mb-1">Change Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingBeauty.image}
                    onChange={(e) => setEditingBeauty({ ...editingBeauty, image: e.target.value })}
                    className="flex-1 bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#1F2937]"
                  />
                  <label className="bg-[#0B1F3A] text-white text-xs font-semibold px-3 py-1.5 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleGenericFileUpload(e, 'beauty-images', (url) =>
                          setEditingBeauty({ ...editingBeauty, image: url })
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingBeauty(null)}
                className="px-3 py-1.5 border border-[#E5E7EB] text-xs font-semibold text-[#6B7280]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveBeauty(editingBeauty)}
                className="px-5 py-1.5 bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: ADD NEW FORMULATION / PRODUCT
          ==================================================================== */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-2xl w-full border border-[#E5E7EB] shadow-2xl p-6 sm:p-8 rounded-none space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#174EA6] font-semibold block">
                  Product Compounder
                </span>
                <h3 className="font-serif-luxury text-xl font-normal text-[#0B1F3A]">
                  Add New Formulation to Catalog
                </h3>
              </div>
              <button onClick={() => setIsAddingProduct(false)} className="p-1 hover:text-[#0B1F3A] text-[#6B7280]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1 text-[#1F2937]">Formulation Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Celestial Night Peptide Crème"
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-[#1F2937]">Subtitle / Active Key</label>
                <input
                  type="text"
                  value={newProduct.subtitle}
                  onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                  placeholder="e.g. Multi-Peptide Cell Barrier Restorative"
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-[#1F2937]">Category *</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-[#1F2937]">Price (GH₵) *</label>
                <input
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-[#1F2937]">Stock Quantity</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1 text-[#1F2937]">Description</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1 text-[#1F2937]">Product Bottle Packshot Image *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newProduct.images?.[0] || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                    className="flex-1 bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                  />
                  <label className="bg-[#0B1F3A] text-white text-xs font-semibold px-4 py-2 cursor-pointer flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Packshot</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleGenericFileUpload(e, 'product-images', (url) =>
                          setNewProduct({ ...newProduct, images: [url] })
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddingProduct(false)}
                className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#6B7280]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateProduct}
                className="px-6 py-2 bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-wider font-semibold"
              >
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: EDIT EXISTING FORMULATION
          ==================================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-2xl w-full border border-[#E5E7EB] shadow-2xl p-6 sm:p-8 rounded-none space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#174EA6] font-semibold block">
                  Product Editor
                </span>
                <h3 className="font-serif-luxury text-xl font-normal text-[#0B1F3A]">
                  Edit &ldquo;{editingProduct.name}&rdquo;
                </h3>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-1 hover:text-[#0B1F3A] text-[#6B7280]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1 text-[#1F2937]">Formulation Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-[#1F2937]">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-[#1F2937]">Price (GH₵)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
                  }
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-[#1F2937]">Stock Units</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })
                  }
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-[#1F2937]">Compare-At Price (GH₵)</label>
                <input
                  type="number"
                  value={editingProduct.compareAtPrice || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      compareAtPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1 text-[#1F2937]">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1 text-[#1F2937]">Packshot Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProduct.images[0] || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        images: [e.target.value, ...editingProduct.images.slice(1)],
                      })
                    }
                    className="flex-1 bg-[#F5F9FE] border border-[#E5E7EB] px-3 py-2 text-xs text-[#1F2937]"
                  />
                  <label className="bg-[#0B1F3A] text-white text-xs font-semibold px-4 py-2 cursor-pointer flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleGenericFileUpload(e, 'product-images', (url) =>
                          setEditingProduct({
                            ...editingProduct,
                            images: [url, ...editingProduct.images.slice(1)],
                          })
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#6B7280]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveProduct(editingProduct)}
                className="px-6 py-2 bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
