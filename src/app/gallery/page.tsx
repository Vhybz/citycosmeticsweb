'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Camera,
  Upload,
  X,
  Check,
  MapPin,
  Sparkles,
  MessageCircle,
  Eye,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/siteConfig';
import { BeautyImage } from '@/types';
import {
  fetchLiveBeautyImages,
  saveBeautyImageToSupabase,
  uploadImageToBucket,
} from '@/lib/supabaseClient';

const INITIAL_BUSINESS_GALLERY: BeautyImage[] = [
  {
    id: 'gal-real-01',
    image: '/beautyImages/5897727668306776133_121.jpg',
    title: 'Sunyani Boutique Team & Direct Store Stock',
    tag: 'Boutique Team',
    category: 'Showroom & Shelves',
    location: 'City Cosmetics Sunyani Main Boutique',
    description: 'Our in-store skincare advisor ready with authentic Queen Helene Cocoa Butter, Jergens Enriching Shea Butter, and fresh stock. Instant MoMo payments and same-day Sunyani collection.',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'gal-real-02',
    image: '/beautyImages/5897727668306776137_121.jpg',
    title: 'Radiant In-Boutique Client Glow',
    tag: 'Client Glow',
    category: 'Client Glow & Radiance',
    location: 'Sunyani Showroom Consultation Area',
    description: 'Natural melanin radiance and nourished skin vitality celebrated inside our Sunyani boutique.',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'gal-01',
    image: '/beautyImages/cadd9c6e24c20cf8e79f77ff3f1e9c49.jpg',
    title: 'Lasgidi Fine Fragrance Mists Showroom Display',
    tag: 'Showroom Shelves',
    category: 'Showroom & Shelves',
    location: 'Sunyani Showroom - Display Shelf 1',
    description: 'Authentic shelf display of our popular Lasgidi Fine Fragrance Mists lineup at our Sunyani boutique. Ready for immediate in-store collection or regional delivery.',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'gal-02',
    image: '/beautyImages/bd545c8751f20e872e51fc45f870cc99.jpg',
    title: 'Touch Concentrated Pocket Perfumes & Majestic Oud',
    tag: 'Perfumes & Mists',
    category: 'Fragrances & Mists',
    location: 'Showroom Fragrance Counter',
    description: 'Pocket-sized concentrated perfume essences with deep notes of Majestic Oud and warm woods. High customer favorite for 24-hour longevity.',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'gal-03',
    image: '/beautyImages/ff5509b7b3d0bf627a13767df76f3662.jpg',
    title: 'Anti-Perspirant Care & Fresh Deodorant Lineup',
    tag: 'Active Care',
    category: 'Skincare & Body',
    location: 'Showroom Body Care Section',
    description: 'Full in-stock stock of Fresh Active, Dry Comfort, Cool Kick, and Pearl & Beauty aerosols for 48H active defense in tropical weather.',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'gal-04',
    image: '/beautyImages/61bc208cf17f0911e9f99c0810ccc200.jpg',
    title: "Palmer's Pure Cocoa Butter & eos Vanilla Cashmere",
    tag: 'Moisture Care',
    category: 'Skincare & Body',
    location: 'Hydration & Moisture Aisle',
    description: "Authentic imported Palmer's Cocoa Butter body oil and eos lotion bottles ready for direct store pickup or regional dispatch.",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'gal-05',
    image: '/beautyImages/77261bd99d7a546b2a2d90e473132e83.jpg',
    title: 'Sure 48H MotionSense Deodorants on Display',
    tag: 'MotionSense',
    category: 'Skincare & Body',
    location: 'Display Shelf A - Sunyani',
    description: 'Antibacterial and invisible fresh aerosols engineered for humid Ghanaian climate and all-day active protection.',
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'gal-06',
    image: '/beautyImages/b4c0b01d7f8922fbb7dac620a15a3ec1.jpg',
    title: 'Vaseline Cocoa Glow & Intensive Care Lotions',
    tag: 'Clinical Glow',
    category: 'Skincare & Body',
    location: 'Client Testing Counter',
    description: 'Rich cocoa glow restorative lotion bottles for intensive deep hydration and radiant glow.',
    displayOrder: 6,
    isActive: true,
  },
  {
    id: 'gal-07',
    image: '/beautyImages/ca20569827f857496b78c0666cb556c4.jpg',
    title: 'Body Milk Intensive Moisture 72H Flacon',
    tag: 'Signature Formula',
    category: 'Skincare & Body',
    location: 'Featured Showcase Pedestal',
    description: 'Signature 72H moisture barrier milk displayed on water ripple showcase pedestal in our Sunyani boutique.',
    displayOrder: 7,
    isActive: true,
  },
  {
    id: 'gal-08',
    image: '/beautyImages/cc.jpg',
    title: 'City Cosmetics Signature Royal Blue Wardrobe',
    tag: 'Showroom Shelves',
    category: 'Showroom & Shelves',
    location: 'Sunyani Storefront Display',
    description: 'Our wide signature royal blue packaging lineup featuring lotions, serums, and body care formulations.',
    displayOrder: 8,
    isActive: true,
  },
  {
    id: 'gal-09',
    image: '/beautyImages/34452e2fc3a3d0262d96d96e2c62e95d.jpg',
    title: 'HydraMax Pro & Creme Soft Luxury Suite',
    tag: 'Showroom Shelves',
    category: 'Showroom & Shelves',
    location: 'Main Feature Table',
    description: 'Complete blue-accented personal care assortment showcased on display for client consultations.',
    displayOrder: 9,
    isActive: true,
  },
  {
    id: 'gal-10',
    image: '/beautyImages/258826bc9ee800fab3177221c23668ef.jpg',
    title: 'Daily Routine Consultation & Application',
    tag: 'Client Experience',
    category: 'Client Glow & Radiance',
    location: 'Sunyani Beauty Studio',
    description: 'Real client ritual session showcasing our gentle cleansing, botanical toning, and moisture sealing protocol.',
    displayOrder: 10,
    isActive: true,
  },
  {
    id: 'gal-11',
    image: '/beautyImages/1.jpg',
    title: 'Melanin Barrier Radiance & Glass Skin Proof',
    tag: 'Lit-From-Within',
    category: 'Client Glow & Radiance',
    location: 'Sunyani Skin Consultation',
    description: 'Healthy, luminous skin texture achieved through consistent application of active botanical hydration.',
    displayOrder: 11,
    isActive: true,
  },
  {
    id: 'gal-12',
    image: '/beautyImages/2.jpg',
    title: 'Bio-Active Vitamin C Brightening Demonstration',
    tag: 'Clarifying Ritual',
    category: 'Client Glow & Radiance',
    location: 'Skin Consultation Lounge',
    description: 'Demonstrating antioxidant defense and tone evening on Ghanaian complexion with active botanical extracts.',
    displayOrder: 12,
    isActive: true,
  },
  {
    id: 'gal-13',
    image: '/beautyImages/3.jpg',
    title: '24-Hour Clinical Barrier Softening Results',
    tag: 'Clinical Proof',
    category: 'Skincare & Body',
    location: 'Quality Assurance Archive',
    description: 'Documented visible before-and-after softening of rough skin patches with our intensive restorative body lotion.',
    displayOrder: 13,
    isActive: true,
  },
  {
    id: 'gal-14',
    image: '/beautyImages/ca.jpg',
    title: 'Hydra-Dew Morning Awakening Routine',
    tag: 'Morning Glow',
    category: 'Client Glow & Radiance',
    location: 'Sunyani Aesthetic Suite',
    description: 'Dewy, plump finish following application of our multi-molecular hyaluronic acid elixir.',
    displayOrder: 14,
    isActive: true,
  },
  {
    id: 'gal-15',
    image: '/beautyImages/e2660f8d3d6e02246ae67904661af3e7.jpg',
    title: 'Ghanaian Cocoa 5-in-1 Nourishing Care In Hand',
    tag: 'Authentic Stock',
    category: 'Skincare & Body',
    location: 'Showroom Floor',
    description: 'Showing genuine bottle packaging and formulation texture during everyday retail operations in Sunyani.',
    displayOrder: 15,
    isActive: true,
  },
];

const CATEGORIES = [
  'All Photos',
  'Showroom & Shelves',
  'Fragrances & Mists',
  'Skincare & Body',
  'Client Glow & Radiance',
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState<BeautyImage[]>(INITIAL_BUSINESS_GALLERY);
  const [selectedCategory, setSelectedCategory] = useState('All Photos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<BeautyImage | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // New photo upload form state
  const [uploadData, setUploadData] = useState({
    title: '',
    tag: 'Showroom Shelf',
    category: 'Showroom & Shelves',
    location: 'Sunyani Showroom - Commercial Avenue',
    description: '',
    image: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  // Load photos from localStorage & Supabase on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('city_cosmetics_gallery_photos');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPhotos(parsed);
        }
      }
    } catch {
      // Ignore
    }

    const loadLive = async () => {
      const live = await fetchLiveBeautyImages();
      if (live && live.length > 0) {
        setPhotos((prev) => {
          // Merge unique by id
          const existingIds = new Set(live.map((item) => item.id));
          const uniqueExisting = prev.filter((p) => !existingIds.has(p.id));
          return [...live, ...uniqueExisting];
        });
      }
    };
    loadLive();
  }, []);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchesCat =
        selectedCategory === 'All Photos' || photo.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (photo.location && photo.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        photo.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [photos, selectedCategory, searchQuery]);

  // Handle local image file picker
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Attempt supabase upload to beauty-images bucket
      const uploadResult = await uploadImageToBucket(file, 'beauty-images');
      if (uploadResult && uploadResult.url) {
        setUploadData((prev) => ({ ...prev, image: uploadResult.url! }));
        showNotification('Image uploaded successfully to beauty storage!');
      } else {
        // Fallback to data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadData((prev) => ({ ...prev, image: reader.result as string }));
          showNotification('Image preview loaded ready to save.');
        };
        reader.readAsDataURL(file);
      }
    } catch {
      alert('Could not upload image. Please try again or paste image URL.');
    } finally {
      setIsUploading(false);
    }
  };

  // Submit new photo
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.title.trim()) {
      alert('Please enter a photo title.');
      return;
    }
    if (!uploadData.image.trim()) {
      alert('Please select an image file or enter an image URL.');
      return;
    }

    const newPhoto: BeautyImage = {
      id: `biz-${Date.now()}`,
      title: uploadData.title.trim(),
      tag: uploadData.tag.trim() || 'Showroom',
      category: uploadData.category,
      location: uploadData.location.trim() || 'Sunyani Showroom',
      description: uploadData.description.trim() || 'Authentic business photo from City Cosmetics Sunyani.',
      image: uploadData.image,
      displayOrder: 1,
      isActive: true,
    };

    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    try {
      localStorage.setItem('city_cosmetics_gallery_photos', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    // Attempt save to Supabase
    saveBeautyImageToSupabase(newPhoto).then((res) => {
      if (res.success) {
        showNotification('Business photo published and synced to database!');
      } else {
        showNotification('Business photo saved to local gallery!');
      }
    });

    setIsUploadOpen(false);
    setUploadData({
      title: '',
      tag: 'Showroom Shelf',
      category: 'Showroom & Shelves',
      location: 'Sunyani Showroom - Commercial Avenue',
      description: '',
      image: '',
    });
  };

  const handleWhatsAppInquiry = (photo: BeautyImage) => {
    const text = `Hello City Cosmetics, I saw this business photo from your gallery: "${photo.title}" (Location: ${photo.location || 'Showroom'}). I'd like to make an inquiry about these products / availability.`;
    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F5F9FE]">
      {/* Toast Notification */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1F3A] text-white px-5 py-3.5 shadow-2xl border-l-4 border-[#174EA6] flex items-center gap-3 animate-fade-in">
          <Check className="w-4 h-4 text-[#DCEBFA]" />
          <span className="text-xs tracking-wider">{notice}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-[#0B1F3A] text-white pt-14 pb-16 px-4 relative overflow-hidden border-b border-[#0B1F3A]/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#DCEBFA_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 mb-4 text-[#DCEBFA] text-[10px] tracking-[0.25em] uppercase font-mono">
                <MapPin className="w-3 h-3 text-[#DCEBFA]" />
                Commercial Avenue &bull; Sunyani, Bono Region
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl tracking-tight text-white uppercase">
                Sunyani Showroom & Business Gallery
              </h1>
              <p className="text-[#DCEBFA]/85 text-sm sm:text-base mt-3 max-w-2xl font-light leading-relaxed">
                Authentic, unfiltered business photos from our Sunyani showroom shelves, body mist displays, real customer consultations, and daily logistics.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-2 bg-[#174EA6] hover:bg-[#0B1F3A] text-white text-xs uppercase tracking-[0.16em] px-5 py-3.5 font-medium transition-all shadow-md border border-white/20"
              >
                <Camera className="w-4 h-4" />
                Upload Business Photo
              </button>

              <Link
                href="/admin"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-[#DCEBFA] text-xs uppercase tracking-[0.16em] px-4 py-3.5 font-medium transition-all border border-white/15"
              >
                <ShieldCheck className="w-4 h-4" />
                Store Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="bg-white border-b border-[#E5E7EB] sticky top-14 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] font-medium transition-all rounded-none ${
                      isActive
                        ? 'bg-[#0B1F3A] text-white'
                        : 'bg-[#F5F9FE] text-[#1F2937] hover:bg-[#DCEBFA]/50 border border-[#E5E7EB]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search showroom, shelf, mists..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5F9FE] border border-[#E5E7EB] rounded-none focus:outline-none focus:border-[#0B1F3A] text-[#0B1F3A] placeholder-[#9CA3AF]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <main className="max-w-7xl mx-auto px-4 py-10 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs uppercase tracking-[0.18em] text-[#6B7280] font-medium">
            Displaying <strong className="text-[#0B1F3A] font-semibold">{filteredPhotos.length}</strong> Business Photos
          </div>
          <div className="text-xs text-[#6B7280]">
            Click any photo for full inspection & WhatsApp inquiry
          </div>
        </div>

        {filteredPhotos.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] p-12 text-center my-8">
            <Camera className="w-10 h-10 text-[#6B7280] mx-auto mb-3 opacity-40" />
            <h3 className="font-serif-luxury text-xl text-[#0B1F3A]">No Business Photos Found</h3>
            <p className="text-xs text-[#6B7280] mt-1 max-w-sm mx-auto">
              We couldn't find any photos matching your current search or category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Photos');
                setSearchQuery('');
              }}
              className="mt-4 inline-flex items-center gap-1.5 bg-[#0B1F3A] text-white text-xs uppercase tracking-wider px-4 py-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPhotos.map((photo, idx) => (
              <div
                key={photo.id || idx}
                onClick={() => setSelectedPhoto(photo)}
                className="group bg-white border border-[#E5E7EB] hover:border-[#0B1F3A] transition-all cursor-pointer flex flex-col shadow-sm hover:shadow-md"
              >
                {/* Image Container with square edges */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0B1F3A]/5">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs inline-flex items-center gap-1.5 uppercase tracking-wider font-medium">
                      <Eye className="w-3.5 h-3.5" /> Inspect Photo
                    </span>
                  </div>

                  {/* Category / Tag Badge */}
                  <div className="absolute top-3 left-3 bg-[#0B1F3A]/90 text-white text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 font-medium backdrop-blur-xs">
                    {photo.tag || photo.category}
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-luxury text-base text-[#0B1F3A] group-hover:text-[#174EA6] transition-colors leading-snug">
                      {photo.title}
                    </h3>

                    {photo.location && (
                      <p className="text-[11px] text-[#6B7280] flex items-center gap-1 mt-1.5 font-sans">
                        <MapPin className="w-3 h-3 text-[#174EA6] shrink-0" />
                        <span>{photo.location}</span>
                      </p>
                    )}

                    <p className="text-xs text-[#1F2937]/80 mt-2 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0F0F0] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#6B7280] uppercase tracking-wider font-mono">
                      {photo.category}
                    </span>
                    <span className="text-[#174EA6] font-medium inline-flex items-center gap-1 group-hover:underline">
                      View Details &bull; Inquire
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WhatsApp Showroom Concierge Banner */}
        <section className="mt-16 bg-[#0B1F3A] text-white p-8 sm:p-10 border border-white/10 shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#174EA6]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[#DCEBFA] text-[10px] tracking-[0.25em] uppercase font-mono block mb-2">
                Real-Time Showroom Stock Verification
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white">
                Interested in any items from our Sunyani Showroom?
              </h3>
              <p className="text-xs sm:text-sm text-[#DCEBFA]/85 mt-2 leading-relaxed">
                Send us a direct message on WhatsApp with the photo or product you saw. Our team will verify shelf availability, reserve your order, or arrange same-day Bono regional dispatch.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=Hello%20City%20Cosmetics,%20I%20am%20browsing%20your%20Business%20Gallery%20and%20would%20like%20to%20inquire%20about%20current%20showroom%20stock.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-[0.16em] px-6 py-4 font-semibold transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp Now
              </a>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-[0.16em] px-5 py-4 font-medium transition-all border border-white/20"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Online Catalog
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 animate-fade-in">
          <div className="bg-white max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-white/20 shadow-2xl flex flex-col md:flex-row rounded-none relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-20 bg-[#0B1F3A] hover:bg-[#174EA6] text-white p-2 transition-colors rounded-none"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Image View */}
            <div className="md:w-3/5 bg-black flex items-center justify-center min-h-[220px] sm:min-h-[300px] md:min-h-[480px]">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full max-h-[50vh] md:max-h-[70vh] object-contain"
              />
            </div>

            {/* Right Information Panel */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#DCEBFA] text-[#0B1F3A] text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 font-semibold">
                    {selectedPhoto.tag || selectedPhoto.category}
                  </span>
                  <span className="text-[11px] text-[#6B7280] font-mono">
                    {selectedPhoto.category}
                  </span>
                </div>

                <h2 className="font-serif-luxury text-xl sm:text-2xl text-[#0B1F3A] leading-snug">
                  {selectedPhoto.title}
                </h2>

                {selectedPhoto.location && (
                  <p className="text-xs text-[#174EA6] flex items-center gap-1.5 mt-2.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{selectedPhoto.location}</span>
                  </p>
                )}

                <div className="my-4 border-t border-[#E5E7EB]" />

                <h4 className="text-[11px] uppercase tracking-[0.16em] text-[#6B7280] font-semibold mb-1">
                  Business Detail & Context
                </h4>
                <p className="text-xs text-[#1F2937] leading-relaxed">
                  {selectedPhoto.description}
                </p>

                <div className="mt-6 bg-[#F5F9FE] p-3.5 border border-[#E5E7EB] text-xs text-[#0B1F3A] space-y-1">
                  <p className="font-semibold uppercase tracking-wider text-[10px] text-[#174EA6]">
                    Showroom Verification
                  </p>
                  <p className="text-[11px] text-[#6B7280]">
                    Location: Commercial Avenue, Sunyani Central
                  </p>
                  <p className="text-[11px] text-[#6B7280]">
                    Direct Hotline: +233 (0)55 965 0921
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 pt-4 border-t border-[#E5E7EB] space-y-2.5">
                <button
                  onClick={() => handleWhatsAppInquiry(selectedPhoto)}
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 px-4 text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 transition-colors rounded-none shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Order / Inquire on WhatsApp
                </button>

                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="w-full bg-[#F5F9FE] hover:bg-[#E5E7EB] text-[#0B1F3A] py-2.5 px-4 text-xs uppercase tracking-[0.14em] font-medium transition-colors rounded-none"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Business Photo Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-white max-w-xl w-full border border-[#0B1F3A] shadow-2xl p-6 sm:p-8 rounded-none relative">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 bg-[#0B1F3A] text-white p-1.5 hover:bg-[#174EA6] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#174EA6] font-mono block">
                Direct Atelier Dispatch & Showcase
              </span>
              <h2 className="font-serif-luxury text-2xl text-[#0B1F3A] mt-1">
                Upload Business Photo
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Add an authentic photograph of our showroom, mists, shelves, or store events to the live gallery.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Photo Title */}
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#0B1F3A] mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  placeholder="e.g. New Lasgidi Mist Stock on Shelf B"
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-none px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              {/* Category & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#0B1F3A] mb-1">
                    Category *
                  </label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-none px-3 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                  >
                    <option value="Showroom & Shelves">Showroom & Shelves</option>
                    <option value="Fragrances & Mists">Fragrances & Mists</option>
                    <option value="Skincare & Body">Skincare & Body</option>
                    <option value="Client Glow & Radiance">Client Glow & Radiance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#0B1F3A] mb-1">
                    Display Tag
                  </label>
                  <input
                    type="text"
                    value={uploadData.tag}
                    onChange={(e) => setUploadData({ ...uploadData, tag: e.target.value })}
                    placeholder="e.g. Showroom Shelf"
                    className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-none px-3 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>
              </div>

              {/* Location Note */}
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#0B1F3A] mb-1">
                  Location / Section
                </label>
                <input
                  type="text"
                  value={uploadData.location}
                  onChange={(e) => setUploadData({ ...uploadData, location: e.target.value })}
                  placeholder="e.g. Sunyani Showroom - Commercial Avenue"
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-none px-3.5 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              {/* Image Input: File Picker + URL */}
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#0B1F3A] mb-1">
                  Image Source *
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-[#0B1F3A] hover:bg-[#174EA6] text-white px-3.5 py-2 text-xs uppercase tracking-wider font-medium inline-flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Uploading...' : 'Choose Device Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                      />
                    </label>
                    <span className="text-[11px] text-[#6B7280]">or enter image path / URL</span>
                  </div>

                  <input
                    type="text"
                    value={uploadData.image}
                    onChange={(e) => setUploadData({ ...uploadData, image: e.target.value })}
                    placeholder="e.g. /beautyImages/cadd9c6e24c20cf8e79f77ff3f1e9c49.jpg or https://..."
                    className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-none px-3.5 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>

                {uploadData.image && (
                  <div className="mt-2.5 p-2 bg-[#F5F9FE] border border-[#E5E7EB] flex items-center gap-3">
                    <img
                      src={uploadData.image}
                      alt="Preview"
                      className="w-12 h-12 object-cover border border-white"
                    />
                    <span className="text-[11px] text-[#174EA6] font-medium truncate flex-1">
                      Ready to attach
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#0B1F3A] mb-1">
                  Business Description & Context
                </label>
                <textarea
                  rows={3}
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  placeholder="Describe the display, stock availability, or consultation details..."
                  className="w-full bg-[#F5F9FE] border border-[#E5E7EB] rounded-none p-3 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2.5 text-xs text-[#6B7280] hover:text-[#0B1F3A] uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-[#0B1F3A] hover:bg-[#174EA6] text-white text-xs uppercase tracking-[0.16em] px-6 py-2.5 font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                  Publish to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
