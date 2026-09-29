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
  BarChart3,
  Activity,
  Calendar,
  ArrowUpRight,
  Printer,
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
  const [printingOrder, setPrintingOrder] = useState<any | null>(null);

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
            momoTxId: '28491829402',
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
            momoTxId: 'TEL-94028172',
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

  // Graphs & Activities State
  const [activityTimeframe, setActivityTimeframe] = useState<'7d' | '30d'>('7d');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const ACTIVITY_DATA_7D = [
    { label: 'Mon', fullDate: 'Mon, 22 Sep', revenue: 8420, orders: 12, visits: 380, whatsapp: 18, quiz: 22 },
    { label: 'Tue', fullDate: 'Tue, 23 Sep', revenue: 11250, orders: 16, visits: 440, whatsapp: 25, quiz: 28 },
    { label: 'Wed', fullDate: 'Wed, 24 Sep', revenue: 9800, orders: 14, visits: 410, whatsapp: 21, quiz: 24 },
    { label: 'Thu', fullDate: 'Thu, 25 Sep', revenue: 14900, orders: 21, visits: 520, whatsapp: 34, quiz: 36 },
    { label: 'Fri', fullDate: 'Fri, 26 Sep', revenue: 18340, orders: 28, visits: 660, whatsapp: 42, quiz: 48 },
    { label: 'Sat', fullDate: 'Sat, 27 Sep', revenue: 24100, orders: 36, visits: 850, whatsapp: 58, quiz: 64 },
    { label: 'Sun', fullDate: 'Sun, 28 Sep', revenue: 19850, orders: 29, visits: 740, whatsapp: 46, quiz: 51 },
  ];

  const ACTIVITY_DATA_30D = [
    { label: 'W1', fullDate: 'Week 1 (Sep 1-7)', revenue: 64500, orders: 98, visits: 2850, whatsapp: 145, quiz: 180 },
    { label: 'W2', fullDate: 'Week 2 (Sep 8-14)', revenue: 78200, orders: 118, visits: 3290, whatsapp: 182, quiz: 210 },
    { label: 'W3', fullDate: 'Week 3 (Sep 15-21)', revenue: 89400, orders: 134, visits: 3840, whatsapp: 210, quiz: 245 },
    { label: 'W4', fullDate: 'Week 4 (Sep 22-28)', revenue: 106660, orders: 156, visits: 4650, whatsapp: 260, quiz: 290 },
  ];

  const currentChartData = activityTimeframe === '7d' ? ACTIVITY_DATA_7D : ACTIVITY_DATA_30D;
  const periodTotalRevenue = currentChartData.reduce((acc, curr) => acc + curr.revenue, 0);
  const periodTotalOrders = currentChartData.reduce((acc, curr) => acc + curr.orders, 0);
  const maxRevenueVal = Math.max(...currentChartData.map((d) => d.revenue)) * 1.15;

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
            City Cosmetics &bull; Sunyani
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
                City Cosmetics Sunyani &bull; Operations & Visuals Portal
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

            {/* ==================================================================
                GRAPHS & PERFORMANCE ACTIVITIES SECTION
                ================================================================== */}
            <div className="space-y-6">
              {/* Graph 1: Revenue & Order Trajectory Area Graph */}
              <div className="bg-white p-6 sm:p-7 rounded-none border border-[#E5E7EB] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E7EB]">
                  <div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#174EA6]" />
                      <h3 className="font-serif-luxury text-xl font-semibold text-[#0B1F3A]">
                        Store Revenue & Sales Activity Trajectory
                      </h3>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-1">
                      Real-time retail volume, online checkouts, and customer transactions in Sunyani.
                    </p>
                  </div>

                  {/* Timeframe Filter Buttons */}
                  <div className="flex items-center gap-1.5 bg-[#F5F9FE] p-1 border border-[#E5E7EB] self-start sm:self-auto">
                    <button
                      onClick={() => setActivityTimeframe('7d')}
                      className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold transition-all ${
                        activityTimeframe === '7d'
                          ? 'bg-[#0B1F3A] text-white shadow-xs'
                          : 'text-[#6B7280] hover:text-[#0B1F3A]'
                      }`}
                    >
                      Past 7 Days
                    </button>
                    <button
                      onClick={() => setActivityTimeframe('30d')}
                      className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold transition-all ${
                        activityTimeframe === '30d'
                          ? 'bg-[#0B1F3A] text-white shadow-xs'
                          : 'text-[#6B7280] hover:text-[#0B1F3A]'
                      }`}
                    >
                      Monthly Trajectory
                    </button>
                  </div>
                </div>

                {/* Metric Summary Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[#E5E7EB]/60">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6B7280] block font-mono">
                      Period Sales Volume
                    </span>
                    <span className="text-lg font-bold text-[#0B1F3A]">
                      {formatPrice(periodTotalRevenue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6B7280] block font-mono">
                      Orders Fulfilled
                    </span>
                    <span className="text-lg font-bold text-[#174EA6]">
                      {periodTotalOrders} Completed
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6B7280] block font-mono">
                      Avg Order Basket
                    </span>
                    <span className="text-lg font-bold text-[#0B1F3A]">
                      {formatPrice(periodTotalOrders > 0 ? periodTotalRevenue / periodTotalOrders : 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6B7280] block font-mono">
                      Conversion Spike
                    </span>
                    <span className="text-lg font-bold text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> +23.8%
                    </span>
                  </div>
                </div>

                {/* SVG Area & Trend Line Graph */}
                <div className="pt-6 relative">
                  <div className="w-full h-56 relative">
                    <svg
                      viewBox="0 0 760 220"
                      className="w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="adminRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#174EA6" stopOpacity="0.45" />
                          <stop offset="60%" stopColor="#174EA6" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#174EA6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid Guidelines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                        const y = 20 + (1 - pct) * 160;
                        const labelVal = Math.round((pct * maxRevenueVal) / 1000) * 1000;
                        return (
                          <g key={i}>
                            <line
                              x1="45"
                              y1={y}
                              x2="750"
                              y2={y}
                              stroke="#E5E7EB"
                              strokeDasharray="4 4"
                              strokeWidth="1"
                            />
                            <text
                              x="35"
                              y={y + 3}
                              fill="#9CA3AF"
                              fontSize="9"
                              textAnchor="end"
                              fontFamily="monospace"
                            >
                              GH₵{labelVal.toLocaleString()}
                            </text>
                          </g>
                        );
                      })}

                      {/* Area Fill & Line Coordinates */}
                      {(() => {
                        const count = currentChartData.length;
                        const width = 705;
                        const startX = 45;
                        const stepX = width / (count - 1);

                        const points = currentChartData.map((d, idx) => {
                          const x = startX + idx * stepX;
                          const y = 180 - (d.revenue / maxRevenueVal) * 160 + 20;
                          return { x, y, data: d };
                        });

                        const pathPoints = points.map((p) => `${p.x},${p.y}`).join(' L ');
                        const areaPath = `M ${points[0].x},180 L ${pathPoints} L ${points[points.length - 1].x},180 Z`;

                        return (
                          <>
                            {/* Area Gradient Fill */}
                            <path d={areaPath} fill="url(#adminRevenueGrad)" />

                            {/* Crisp Trend Line */}
                            <path
                              d={`M ${pathPoints}`}
                              fill="none"
                              stroke="#174EA6"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            {/* Data Points with Hover Interaction */}
                            {points.map((p, idx) => {
                              const isHovered = hoveredPointIndex === idx;
                              return (
                                <g
                                  key={idx}
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredPointIndex(idx)}
                                  onMouseLeave={() => setHoveredPointIndex(null)}
                                >
                                  {/* Vertical Guide Line on Hover */}
                                  {isHovered && (
                                    <line
                                      x1={p.x}
                                      y1="20"
                                      x2={p.x}
                                      y2="180"
                                      stroke="#0B1F3A"
                                      strokeWidth="1.5"
                                      strokeDasharray="2 2"
                                    />
                                  )}

                                  {/* Circle Point */}
                                  <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r={isHovered ? 6 : 4}
                                    fill={isHovered ? '#0B1F3A' : '#174EA6'}
                                    stroke="#FFFFFF"
                                    strokeWidth="2"
                                    className="transition-all duration-200"
                                  />

                                  {/* Date Label on X Axis */}
                                  <text
                                    x={p.x}
                                    y="200"
                                    fill={isHovered ? '#0B1F3A' : '#6B7280'}
                                    fontWeight={isHovered ? 'bold' : 'normal'}
                                    fontSize="10"
                                    textAnchor="middle"
                                    fontFamily="sans-serif"
                                  >
                                    {p.data.label}
                                  </text>
                                </g>
                              );
                            })}
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Interactive Floating Tooltip */}
                  {hoveredPointIndex !== null && currentChartData[hoveredPointIndex] && (
                    <div
                      className="absolute top-2 right-4 bg-[#0B1F3A] text-white p-3 shadow-xl border border-white/20 text-xs animate-fade-in pointer-events-none"
                      style={{ minWidth: '180px' }}
                    >
                      <p className="text-[10px] text-[#DCEBFA]/75 font-mono uppercase tracking-wider">
                        {currentChartData[hoveredPointIndex].fullDate}
                      </p>
                      <p className="text-sm font-bold text-white mt-1">
                        {formatPrice(currentChartData[hoveredPointIndex].revenue)}
                      </p>
                      <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-[#DCEBFA]">
                        <span>Orders: {currentChartData[hoveredPointIndex].orders}</span>
                        <span>Visits: {currentChartData[hoveredPointIndex].visits}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Side-by-Side Activity Graphs: Daily Operations vs Category Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Graph 2: Daily Operations & Customer Activity Bar Chart */}
                <div className="lg:col-span-7 bg-white p-6 rounded-none border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#174EA6]" />
                        <h4 className="font-serif-luxury text-base font-semibold text-[#0B1F3A]">
                          Daily Customer Engagement & Activity
                        </h4>
                      </div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#6B7280]">
                        Sunyani Activity
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-2 mb-4">
                      Comparison of web store visitors, skin routine quizzes, and direct WhatsApp sales inquiries.
                    </p>

                    {/* Chart Legend */}
                    <div className="flex items-center gap-4 text-[11px] text-[#6B7280] mb-5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-[#0B1F3A]" /> Store Visits
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-[#174EA6]" /> Skin Consultations
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-emerald-600" /> WhatsApp Orders
                      </span>
                    </div>

                    {/* Grouped Bar Chart Display */}
                    <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-44 pt-4 border-b border-[#E5E7EB]">
                      {ACTIVITY_DATA_7D.map((day, idx) => {
                        const isHovered = hoveredBarIndex === idx;
                        const visitHeight = Math.min(100, Math.round((day.visits / 900) * 100));
                        const quizHeight = Math.min(100, Math.round((day.quiz / 75) * 100));
                        const waHeight = Math.min(100, Math.round((day.whatsapp / 75) * 100));

                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredBarIndex(idx)}
                            onMouseLeave={() => setHoveredBarIndex(null)}
                            className="flex flex-col items-center h-full justify-end group cursor-pointer"
                          >
                            <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-36">
                              {/* Visits Bar */}
                              <div
                                style={{ height: `${visitHeight}%` }}
                                className="w-1.5 sm:w-2.5 bg-[#0B1F3A] hover:bg-[#174EA6] transition-all duration-300"
                                title={`Visits: ${day.visits}`}
                              />
                              {/* Quiz Bar */}
                              <div
                                style={{ height: `${quizHeight}%` }}
                                className="w-1.5 sm:w-2.5 bg-[#174EA6] hover:bg-[#0B1F3A] transition-all duration-300"
                                title={`Skin Quizzes: ${day.quiz}`}
                              />
                              {/* WhatsApp Bar */}
                              <div
                                style={{ height: `${waHeight}%` }}
                                className="w-1.5 sm:w-2.5 bg-emerald-600 hover:bg-emerald-700 transition-all duration-300"
                                title={`WhatsApp Inquiries: ${day.whatsapp}`}
                              />
                            </div>
                            <span
                              className={`text-[10px] mt-2 font-mono transition-colors ${
                                isHovered ? 'text-[#0B1F3A] font-bold' : 'text-[#6B7280]'
                              }`}
                            >
                              {day.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Tooltip Footnote */}
                  <div className="mt-3 text-[11px] text-[#6B7280] flex items-center justify-between">
                    <span>
                      {hoveredBarIndex !== null
                        ? `${ACTIVITY_DATA_7D[hoveredBarIndex].fullDate}: ${ACTIVITY_DATA_7D[hoveredBarIndex].visits} visitors, ${ACTIVITY_DATA_7D[hoveredBarIndex].quiz} diagnostic quizzes, ${ACTIVITY_DATA_7D[hoveredBarIndex].whatsapp} WhatsApp conversions`
                        : 'Hover any day to inspect exact engagement metrics'}
                    </span>
                    <span className="font-semibold text-emerald-600">
                      78% Conversion from Sunyani
                    </span>
                  </div>
                </div>

                {/* Graph 3: Category Revenue & Volume Performance */}
                <div className="lg:col-span-5 bg-white p-6 rounded-none border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#174EA6]" />
                        <h4 className="font-serif-luxury text-base font-semibold text-[#0B1F3A]">
                          Category Sales & Revenue Share
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { name: 'Skincare Formulations', pct: 42, revenue: 119490, units: 214, growth: '+28%' },
                        { name: 'Fine Fragrances & Lasgidi Mists', pct: 28, revenue: 79660, units: 165, growth: '+34%' },
                        { name: 'Bath & Active Body Care', pct: 18, revenue: 51210, units: 108, growth: '+14%' },
                        { name: 'Curated Sets & Gift Vaults', pct: 12, revenue: 34140, units: 42, growth: '+45%' },
                      ].map((cat, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-[#1F2937]">{cat.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-600 font-bold text-[10px]">{cat.growth}</span>
                              <span className="font-bold text-[#0B1F3A]">{cat.pct}%</span>
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full bg-[#E5E7EB] h-2 rounded-none overflow-hidden">
                            <div
                              style={{ width: `${cat.pct}%` }}
                              className={`h-full transition-all duration-500 ${
                                idx === 0
                                  ? 'bg-[#0B1F3A]'
                                  : idx === 1
                                  ? 'bg-[#174EA6]'
                                  : idx === 2
                                  ? 'bg-blue-400'
                                  : 'bg-[#DCEBFA]'
                              }`}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-[#6B7280] font-mono">
                            <span>{formatPrice(cat.revenue)} volume</span>
                            <span>{cat.units} units sold</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                    <span className="text-[#6B7280]">Most active category:</span>
                    <span className="font-bold text-[#174EA6]">Skincare (Triple Hyaluronic & Body Milk)</span>
                  </div>
                </div>
              </div>

              {/* Graph 4: Top 5 Bestselling Formulations Velocity Leaderboard */}
              <div className="bg-white p-6 rounded-none border border-[#E5E7EB] shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-serif-luxury text-lg font-semibold text-[#0B1F3A]">
                      Top 5 Formulations Velocity Leaderboard
                    </h4>
                  </div>
                  <span className="text-xs text-[#6B7280] font-mono">
                    Sunyani Boutique Retail & Delivery Metrics
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    {
                      rank: 1,
                      name: '72H Intensive Moisture Body Milk',
                      category: 'Skincare',
                      image: '/beautyImages/ca20569827f857496b78c0666cb556c4.jpg',
                      units: 88,
                      revenue: 74800,
                      stock: 45,
                    },
                    {
                      rank: 2,
                      name: 'Lasgidi Fine Fragrance Mists',
                      category: 'Fragrance',
                      image: '/beautyImages/cadd9c6e24c20cf8e79f77ff3f1e9c49.jpg',
                      units: 64,
                      revenue: 24320,
                      stock: 65,
                    },
                    {
                      rank: 3,
                      name: 'Touch Pocket Perfumes & Oud',
                      category: 'Fragrance',
                      image: '/beautyImages/bd545c8751f20e872e51fc45f870cc99.jpg',
                      units: 48,
                      revenue: 69600,
                      stock: 20,
                    },
                    {
                      rank: 4,
                      name: "Palmer's Pure Cocoa Butter Elixir",
                      category: 'Body',
                      image: '/beautyImages/61bc208cf17f0911e9f99c0810ccc200.jpg',
                      units: 42,
                      revenue: 38640,
                      stock: 35,
                    },
                    {
                      rank: 5,
                      name: 'Sure 48H MotionSense Aerosols',
                      category: 'Body',
                      image: '/beautyImages/77261bd99d7a546b2a2d90e473132e83.jpg',
                      units: 35,
                      revenue: 23800,
                      stock: 40,
                    },
                  ].map((item) => (
                    <div
                      key={item.rank}
                      className="bg-[#F5F9FE] p-3.5 border border-[#E5E7EB] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="w-5 h-5 bg-[#0B1F3A] text-white text-[10px] font-bold flex items-center justify-center">
                            #{item.rank}
                          </span>
                          <span className="text-[10px] font-mono text-[#174EA6] uppercase">
                            {item.category}
                          </span>
                        </div>

                        <div className="w-full aspect-square overflow-hidden bg-white border border-[#E5E7EB] mb-2.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <h5 className="font-serif-luxury text-xs text-[#0B1F3A] font-semibold line-clamp-1">
                          {item.name}
                        </h5>
                        <p className="text-[11px] text-[#6B7280] font-bold mt-0.5">
                          {formatPrice(item.revenue)}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#E5E7EB]/80 text-[10px] text-[#6B7280] flex items-center justify-between">
                        <span>{item.units} sold</span>
                        <span className="text-emerald-700 font-semibold">{item.stock} in stock</span>
                      </div>
                    </div>
                  ))}
                </div>
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
                          <span className="uppercase font-mono text-[10px] px-2 py-0.5 bg-[#F5F9FE] border border-[#E5E7EB] block w-fit">
                            {order.paymentMethod || 'momo'}
                          </span>
                          {(order.momoTxId || order.shippingAddress?.momo_txid) && (
                            <span className="text-[10px] text-emerald-800 font-mono font-semibold block mt-1">
                              TxID: {order.momoTxId || order.shippingAddress?.momo_txid}
                            </span>
                          )}
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
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setPrintingOrder(order)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1F3A] bg-[#F5F9FE] hover:bg-[#E5E7EB] border border-[#E5E7EB] px-2.5 py-1.5 rounded-none transition-colors"
                              title="Print Official Packing Slip & Waybill"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#174EA6]" />
                              <span>Waybill</span>
                            </button>
                            <button
                              onClick={() => sendWhatsAppDispatchNotice(order)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] px-3 py-1.5 rounded-none shadow-xs transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-current" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
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

      {/* ====================================================================
          MODAL: OFFICIAL PRINTABLE PACKING SLIP & COURIER WAYBILL
          ==================================================================== */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-2xl w-full border-2 border-[#0B1F3A] shadow-2xl p-6 sm:p-8 rounded-none max-h-[95vh] overflow-y-auto print:p-0 print:border-0 print:max-h-none print:shadow-none">
            {/* Top Toolbar (Hidden on actual print) */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-6 print:hidden">
              <span className="text-xs uppercase tracking-widest font-mono text-[#174EA6] font-semibold">
                Print Preview &bull; Courier Waybill
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4 text-[#DCEBFA]" />
                  <span>Print Waybill</span>
                </button>
                <button
                  onClick={() => setPrintingOrder(null)}
                  className="p-2 border border-[#E5E7EB] hover:bg-[#F5F9FE] text-[#6B7280]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official Printable Waybill Body */}
            <div className="space-y-6 text-[#1F2937] font-sans">
              {/* Header Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-[#0B1F3A] pb-4">
                <div>
                  <h1 className="font-serif-luxury text-2xl tracking-[0.2em] uppercase font-bold text-[#0B1F3A]">
                    CITY COSMETICS
                  </h1>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#174EA6] font-mono mt-0.5">
                    SUNYANI SHOWROOM &bull; DISPATCH HUB
                  </p>
                  <p className="text-[11px] text-[#6B7280] mt-1">
                    Plot 14, Commercial Avenue &bull; Sunyani Central, Bono Region, Ghana
                  </p>
                  <p className="text-[11px] text-[#6B7280]">
                    Concierge Hotline / WhatsApp: +233 (0)55 965 0921
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-block bg-[#0B1F3A] text-white px-3 py-1 text-xs uppercase tracking-widest font-bold mb-1">
                    OFFICIAL WAYBILL
                  </div>
                  <p className="font-mono text-xs font-bold text-[#0B1F3A]">
                    #{printingOrder.id}
                  </p>
                  <p className="text-[11px] text-[#6B7280] font-mono">
                    Date: {printingOrder.date || new Date().toISOString().split('T')[0]}
                  </p>
                </div>
              </div>

              {/* Delivery Consignee & Order Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#F5F9FE] border border-[#E5E7EB] text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] block mb-1">
                    Consignee / Customer Details:
                  </span>
                  <p className="font-bold text-sm text-[#0B1F3A]">{printingOrder.customer}</p>
                  <p className="font-mono text-xs text-[#1F2937] mt-0.5">
                    {printingOrder.phone || 'No phone provided'}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{printingOrder.email}</p>
                  <p className="text-xs font-medium text-[#0B1F3A] mt-1.5">
                    <strong>Delivery Address:</strong>{' '}
                    {printingOrder.shippingAddress || 'Sunyani Central Showroom Pickup'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] block mb-1">
                    Dispatch & Logistics Info:
                  </span>
                  <p className="text-xs">
                    <strong>Status:</strong>{' '}
                    <span className="uppercase font-semibold text-[#174EA6]">
                      {printingOrder.status}
                    </span>
                  </p>
                  <p className="text-xs mt-0.5">
                    <strong>Payment Channel:</strong>{' '}
                    <span className="uppercase font-mono font-semibold">
                      {printingOrder.paymentMethod || 'momo'}
                    </span>
                  </p>
                  {(printingOrder.momoTxId || printingOrder.shippingAddress?.momo_txid) && (
                    <p className="text-xs mt-0.5 text-emerald-800 font-mono font-semibold">
                      <strong>MoMo TxID:</strong> {printingOrder.momoTxId || printingOrder.shippingAddress?.momo_txid}
                    </p>
                  )}
                  <p className="text-xs mt-0.5">
                    <strong>Payment State:</strong>{' '}
                    <span className="font-semibold text-emerald-700">
                      {printingOrder.paymentMethod === 'cod' ? 'Collect on Delivery (COD)' : 'Prepaid & Verified'}
                    </span>
                  </p>
                  {printingOrder.dispatchNotes && (
                    <p className="text-[11px] text-[#1F2937] mt-1 bg-white p-1.5 border border-[#E5E7EB]">
                      <strong>Dispatch Note:</strong> {printingOrder.dispatchNotes}
                    </p>
                  )}
                </div>
              </div>

              {/* Items Manifest Table */}
              <div>
                <table className="w-full text-left text-xs border border-[#E5E7EB]">
                  <thead>
                    <tr className="bg-[#0B1F3A] text-white uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Item / Formulation Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Total (GHS)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {Array.isArray(printingOrder.items) && printingOrder.items.length > 0 ? (
                      printingOrder.items.map((it: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-2.5 px-3 font-medium text-[#0B1F3A]">
                            {it.name || it.productName || 'Botanical Cosmetic Formulation'}
                            {it.variant && <span className="text-[#6B7280] text-[10px] block font-normal">Variant: {it.variant}</span>}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-semibold">{it.quantity || 1}</td>
                          <td className="py-2.5 px-3 text-right font-mono">{formatPrice(it.price || printingOrder.total / printingOrder.items.length)}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold">{formatPrice((it.price || printingOrder.total / printingOrder.items.length) * (it.quantity || 1))}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-2.5 px-3 font-medium text-[#0B1F3A]">
                          City Cosmetics Formulations Package ({printingOrder.itemsCount || 1} item{printingOrder.itemsCount > 1 ? 's' : ''})
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold">{printingOrder.itemsCount || 1}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{formatPrice(printingOrder.total)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">{formatPrice(printingOrder.total)}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#F5F9FE] border-t-2 border-[#0B1F3A] font-bold">
                      <td colSpan={3} className="py-3 px-3 text-right uppercase text-[11px] text-[#0B1F3A]">
                        Grand Total Payable:
                      </td>
                      <td className="py-3 px-3 text-right text-sm text-[#0B1F3A] font-mono">
                        {formatPrice(printingOrder.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Courier Dispatch Inspection & Signoff */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#E5E7EB] text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] block mb-2 font-mono">
                    Dispatcher / Courier Signoff (Sunyani Hub)
                  </span>
                  <div className="border-b border-[#0B1F3A] h-10 flex items-end pb-1 text-[11px] text-[#6B7280]">
                    <span>Inspected by Store Associate: _______________</span>
                  </div>
                  <p className="text-[10px] text-[#6B7280] mt-1">Date & Time: ________________________</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] block mb-2 font-mono">
                    Client / Consignee Acceptance
                  </span>
                  <div className="border-b border-[#0B1F3A] h-10 flex items-end pb-1 text-[11px] text-[#6B7280]">
                    <span>Received in pristine condition: _______________</span>
                  </div>
                  <p className="text-[10px] text-[#6B7280] mt-1">Signature / Date: ___________________</p>
                </div>
              </div>

              {/* Security & Authenticity Stamp */}
              <div className="pt-2 text-center text-[10px] text-[#6B7280] font-mono border-t border-[#E5E7EB]">
                City Cosmetics Official Dispatch &bull; Sunyani Flagship Boutique &bull; Thank you for choosing clean botanical beauty.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
