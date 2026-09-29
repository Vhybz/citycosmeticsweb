import { createClient } from '@supabase/supabase-js';
import { Product, Category, BeautyImage } from '@/types';
import { PRODUCTS_DATA, CATEGORIES } from '@/lib/productsData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

export const isSupabaseConfigured = () => {
  return (
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http') &&
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'string' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 20 &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('xyzcompany')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Universal Image Uploader for Supabase Storage.
 * Supports 'product-images', 'category-images', or 'beauty-images'.
 */
export async function uploadImageToBucket(
  file: File,
  bucket: 'product-images' | 'category-images' | 'beauty-images' = 'product-images'
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { url: null, error: 'Supabase is not configured' };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.warn(`Supabase storage upload error (${bucket}):`, uploadError.message);
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Unknown upload error' };
  }
}

/**
 * Backward compatible alias for product image uploads.
 */
export async function uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
  return uploadImageToBucket(file, 'product-images');
}

/* ==========================================================================
   PRODUCTS CRUD
   ========================================================================== */

export async function fetchLiveProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return PRODUCTS_DATA;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return PRODUCTS_DATA;
    }

    return data.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      subtitle: row.subtitle || '',
      category: row.category,
      price: parseFloat(row.price),
      compareAtPrice: row.compare_at_price ? parseFloat(row.compare_at_price) : undefined,
      rating: parseFloat(row.rating || 5.0),
      reviewCount: row.review_count || 0,
      images: Array.isArray(row.images) && row.images.length > 0
        ? row.images
        : ['/beautyImages/ca20569827f857496b78c0666cb556c4.jpg'],
      description: row.description || '',
      benefits: row.benefits || [],
      ingredients: row.ingredients || '',
      howToUse: row.how_to_use || '',
      skinTypes: row.skin_types || ['All'],
      tags: row.tags || ['Clean'],
      variants: row.variants || [],
      stock: row.stock ?? 50,
      isFeatured: !!row.is_featured,
    }));
  } catch {
    return PRODUCTS_DATA;
  }
}

export async function saveProductToSupabase(product: Product): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    const dbPayload = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      category: product.category,
      price: product.price,
      compare_at_price: product.compareAtPrice || null,
      rating: product.rating,
      review_count: product.reviewCount,
      images: product.images,
      description: product.description,
      benefits: product.benefits,
      ingredients: product.ingredients,
      how_to_use: product.howToUse,
      skin_types: product.skinTypes,
      tags: product.tags,
      variants: product.variants || [],
      stock: product.stock,
      is_featured: product.isFeatured || false,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('products')
      .upsert(dbPayload, { onConflict: 'id' });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save product' };
  }
}

export async function deleteProductFromSupabase(productId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete product' };
  }
}

/* ==========================================================================
   CATEGORIES CRUD (Face images, custom categories)
   ========================================================================== */

export async function fetchLiveCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return CATEGORIES;
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return CATEGORIES;
    }

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || '',
      image: row.image_url || '/beautyImages/ca20569827f857496b78c0666cb556c4.jpg',
      itemCount: row.item_count || 0,
    }));
  } catch {
    return CATEGORIES;
  }
}

export async function saveCategoryToSupabase(category: Category): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    const dbPayload = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image_url: category.image,
      item_count: category.itemCount || 0,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('categories')
      .upsert(dbPayload, { onConflict: 'id' });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save category' };
  }
}

export async function deleteCategoryFromSupabase(categoryId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete category' };
  }
}

/* ==========================================================================
   SITE BEAUTY IMAGES CRUD (Glow Reel / Living Radiance Archive)
   ========================================================================== */

export const DEFAULT_BEAUTY_IMAGES: BeautyImage[] = [
  {
    id: 'b1',
    image: '/beautyImages/1.jpg',
    tag: 'Botanical Radiance',
    title: 'Flawless Melanin Barrier',
    description: 'Clean active botanical infusions providing all-day lit-from-within glow and climate resilience.',
    category: 'Skincare',
    isActive: true,
  },
  {
    id: 'b2',
    image: '/beautyImages/258826bc9ee800fab3177221c23668ef.jpg',
    tag: 'Sunyani Showroom Suite',
    title: 'The Complete Daily Ritual',
    description: 'Artisanal small-batch compounded serums, body elixirs, and raw black soap formulated in Bono Region.',
    category: 'Sets',
    isActive: true,
  },
  {
    id: 'b3',
    image: '/beautyImages/ca.jpg',
    tag: 'Clinical Hydration',
    title: 'Morning Awakening Ritual',
    description: 'Triple-molecular Hyaluronic hydration delivering supple, glass-skin resilience from first application.',
    category: 'Skincare',
    isActive: true,
  },
  {
    id: 'b4',
    image: '/beautyImages/2.jpg',
    tag: 'Bio-Active Vitamin C',
    title: 'Tone Clarifying Complex',
    description: 'Dermatologist-tested antioxidant formulations that defend against hyperpigmentation and sun fatigue.',
    category: 'Skincare',
    isActive: true,
  },
  {
    id: 'b5',
    image: '/beautyImages/3.jpg',
    tag: 'Clinical Proof',
    title: '24-Hour Barrier Defense',
    description: 'Clinically proven Before & After results showing visible texture softening and dry skin alleviation.',
    category: 'Body',
    isActive: true,
  },
  {
    id: 'b6',
    image: '/beautyImages/cc.jpg',
    tag: 'Atelier Packaging',
    title: 'The Royal Blue Wardrobe',
    description: 'Signature cobalt flacons designed for sustainable refills and light-protected botanical potency.',
    category: 'Collections',
    isActive: true,
  },
  {
    id: 'b7',
    image: '/beautyImages/e2660f8d3d6e02246ae67904661af3e7.jpg',
    tag: 'Ghanaian Cocoa Butter',
    title: '5-in-1 Nourishing Care',
    description: 'Rich cold-pressed lipids that melt into skin with zero sticky residue under tropical heat.',
    category: 'Body',
    isActive: true,
  },
  {
    id: 'b8',
    image: '/beautyImages/61bc208cf17f0911e9f99c0810ccc200.jpg',
    tag: 'Botanical Elixir Duo',
    title: 'Vanilla Cashmere & Shea',
    description: 'Antioxidant plant seed oils engineered for silky, non-transfer body sheen and 48-hour moisture.',
    category: 'Body',
    isActive: true,
  },
];

export async function fetchLiveBeautyImages(): Promise<BeautyImage[]> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_BEAUTY_IMAGES;
  }

  try {
    const { data, error } = await supabase
      .from('site_beauty_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_BEAUTY_IMAGES;
    }

    return data.map((row: any) => ({
      id: row.id,
      image: row.image_url,
      tag: row.tag || 'Radiance',
      title: row.title,
      description: row.description || '',
      category: row.category || 'Skincare',
      displayOrder: row.display_order || 0,
      isActive: row.is_active !== false,
    }));
  } catch {
    return DEFAULT_BEAUTY_IMAGES;
  }
}

export async function saveBeautyImageToSupabase(item: BeautyImage): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    const dbPayload = {
      id: item.id,
      image_url: item.image,
      tag: item.tag,
      title: item.title,
      description: item.description,
      category: item.category,
      display_order: item.displayOrder || 0,
      is_active: item.isActive !== false,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('site_beauty_images')
      .upsert(dbPayload, { onConflict: 'id' });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save beauty image' };
  }
}

export async function deleteBeautyImageFromSupabase(imageId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    const { error } = await supabase
      .from('site_beauty_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete beauty image' };
  }
}

/* ==========================================================================
   ORDERS CRUD
   ========================================================================== */

export async function fetchLiveOrders(): Promise<any[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((o: any) => ({
      id: o.order_number || o.id.slice(0, 8).toUpperCase(),
      dbId: o.id,
      customer: o.customer_name,
      email: o.customer_email,
      phone: o.customer_phone || '',
      total: parseFloat(o.total_amount),
      itemsCount: Array.isArray(o.items) ? o.items.length : 1,
      status: o.status || 'Processing',
      paymentMethod: o.payment_method || 'momo',
      date: new Date(o.created_at).toISOString().split('T')[0],
      items: o.items || [],
      shippingAddress: o.shipping_address,
      momoTxId: o.shipping_address?.momo_txid || '',
      dispatchNotes: o.dispatch_notes || '',
    }));
  } catch {
    return [];
  }
}

export async function updateLiveOrderStatus(orderId: string, status: string, notes?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;

  try {
    const payload: any = { status, updated_at: new Date().toISOString() };
    if (notes !== undefined) payload.dispatch_notes = notes;

    const { error } = await supabase
      .from('orders')
      .update(payload)
      .or(`id.eq.${orderId},order_number.eq.${orderId}`);

    return !error;
  } catch {
    return false;
  }
}

