import { createClient } from '@supabase/supabase-js';
import { Product } from '@/types';
import { PRODUCTS_DATA } from '@/lib/productsData';

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
 * Upload an image file to Supabase Storage in the 'product-images' bucket.
 * Returns the public URL of the uploaded image.
 */
export async function uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { url: null, error: 'Supabase is not configured' };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Unknown upload error' };
  }
}

/**
 * Fetch all products from Supabase DB, falling back to local PRODUCTS_DATA.
 */
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

    // Map DB column snake_case to Product interface camelCase
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
        : ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'],
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

/**
 * Upsert (insert or update) a product into the Supabase 'products' table.
 */
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

/**
 * Delete a product from Supabase DB.
 */
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

/**
 * Fetch orders from Supabase DB.
 */
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
      id: o.id.slice(0, 8).toUpperCase(),
      dbId: o.id,
      customer: o.customer_name,
      email: o.customer_email,
      total: parseFloat(o.total_amount),
      itemsCount: Array.isArray(o.items) ? o.items.length : 1,
      status: o.status,
      date: new Date(o.created_at).toISOString().split('T')[0],
      items: o.items || [],
      shippingAddress: o.shipping_address,
    }));
  } catch {
    return [];
  }
}

/**
 * Update order status in Supabase.
 */
export async function updateLiveOrderStatus(orderId: string, status: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .or(`id.eq.${orderId},id.ilike.${orderId}%`);

    return !error;
  } catch {
    return false;
  }
}
