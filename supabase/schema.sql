-- ==============================================================================
-- City Cosmetics Sunyani - Complete Supabase Database Schema
-- Run this script in your Supabase Project SQL Editor to set up all tables,
-- storage buckets, RLS policies, and initial Ghanaian beauty catalog seed data.
-- ==============================================================================

-- 1. PROFILES TABLE (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url TEXT,
  address JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role / admin manage profiles" ON public.profiles FOR ALL USING (true);

-- 2. CATEGORIES TABLE (Supports custom categories & face/cover image updates)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  item_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow all modifications on categories" ON public.categories FOR ALL USING (true);

-- 3. PRODUCTS TABLE (Formulations Catalog)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  category TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  benefits TEXT[] DEFAULT '{}',
  ingredients TEXT,
  how_to_use TEXT,
  skin_types TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  variants JSONB DEFAULT '[]'::jsonb,
  stock INTEGER DEFAULT 50,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow all modifications on products" ON public.products FOR ALL USING (true);

-- 4. SITE BEAUTY IMAGES TABLE (Living Radiance Archive / Marquee / Lookbook)
CREATE TABLE IF NOT EXISTS public.site_beauty_images (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  tag TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Skincare',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_beauty_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Beauty images are viewable by everyone" ON public.site_beauty_images FOR SELECT USING (true);
CREATE POLICY "Allow all modifications on site_beauty_images" ON public.site_beauty_images FOR ALL USING (true);

-- 5. ORDERS TABLE (Sunyani Dispatch & Nationwide Logistics)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method TEXT DEFAULT 'momo',
  payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Pending', 'Failed', 'Refunded')),
  status TEXT DEFAULT 'Processing' CHECK (status IN ('Processing', 'Shipped', 'Delivered', 'Cancelled')),
  dispatch_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders viewable by creator or admin" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow order creation" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow order updates" ON public.orders FOR UPDATE USING (true);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  skin_type TEXT,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow review creation" ON public.reviews FOR INSERT WITH CHECK (true);

-- 7. STORAGE BUCKETS SETUP FOR IMAGES
-- (Product packshots, Category face images, and Beauty lifestyle photos)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('category-images', 'category-images', true),
  ('beauty-images', 'beauty-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Read & Write Policies
CREATE POLICY "Public read for product-images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Allow uploads to product-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Allow update on product-images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Allow delete on product-images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

CREATE POLICY "Public read for category-images" ON storage.objects FOR SELECT USING (bucket_id = 'category-images');
CREATE POLICY "Allow uploads to category-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'category-images');
CREATE POLICY "Allow update on category-images" ON storage.objects FOR UPDATE USING (bucket_id = 'category-images');
CREATE POLICY "Allow delete on category-images" ON storage.objects FOR DELETE USING (bucket_id = 'category-images');

CREATE POLICY "Public read for beauty-images" ON storage.objects FOR SELECT USING (bucket_id = 'beauty-images');
CREATE POLICY "Allow uploads to beauty-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'beauty-images');
CREATE POLICY "Allow update on beauty-images" ON storage.objects FOR UPDATE USING (bucket_id = 'beauty-images');
CREATE POLICY "Allow delete on beauty-images" ON storage.objects FOR DELETE USING (bucket_id = 'beauty-images');


-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Categories (with luxury cover images)
INSERT INTO public.categories (id, name, slug, description, image_url, item_count, display_order)
VALUES
  ('skincare', 'Skincare', 'skincare', 'Potent botanicals and clinical actives crafted in Sunyani for an effortless glass-skin glow.', '/beautyImages/ca20569827f857496b78c0666cb556c4.jpg', 12, 1),
  ('makeup', 'Makeup & Complexion', 'makeup', 'Weightless formulas designed to enhance your natural beauty.', '/beautyImages/34452e2fc3a3d0262d96d96e2c62e95d.jpg', 16, 2),
  ('fragrance', 'Fine Fragrance', 'fragrance', 'Sensory perfumes blending West African florals and modern tropical woods.', '/beautyImages/bd545c8751f20e872e51fc45f870cc99.jpg', 8, 3),
  ('body', 'Bath & Body', 'body', 'Silken body elixirs and scrubs infused with antioxidant oils.', '/beautyImages/61bc208cf17f0911e9f99c0810ccc200.jpg', 9, 4),
  ('sets', 'Curated Sets & Gifts', 'sets', 'Award-winning discovery routines and exclusive seasonal bundles.', '/beautyImages/cadd9c6e24c20cf8e79f77ff3f1e9c49.jpg', 6, 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- Seed Site Beauty Images (Living Radiance Archive)
INSERT INTO public.site_beauty_images (id, image_url, tag, title, description, category, display_order, is_active)
VALUES
  ('b1', '/beautyImages/1.jpg', 'Botanical Radiance', 'Flawless Melanin Barrier', 'Clean active botanical infusions providing all-day lit-from-within glow and climate resilience.', 'Skincare', 1, true),
  ('b2', '/beautyImages/258826bc9ee800fab3177221c23668ef.jpg', 'Sunyani Showroom Suite', 'The Complete Daily Ritual', 'Artisanal small-batch compounded serums, body elixirs, and raw black soap formulated in Bono Region.', 'Sets', 2, true),
  ('b3', '/beautyImages/ca.jpg', 'Clinical Hydration', 'Morning Awakening Ritual', 'Triple-molecular Hyaluronic hydration delivering supple, glass-skin resilience from first application.', 'Skincare', 3, true),
  ('b4', '/beautyImages/2.jpg', 'Bio-Active Vitamin C', 'Tone Clarifying Complex', 'Dermatologist-tested antioxidant formulations that defend against hyperpigmentation and sun fatigue.', 'Skincare', 4, true),
  ('b5', '/beautyImages/3.jpg', 'Clinical Proof', '24-Hour Barrier Defense', 'Clinically proven Before & After results showing visible texture softening and dry skin alleviation.', 'Body', 5, true),
  ('b6', '/beautyImages/cc.jpg', 'Atelier Packaging', 'The Royal Blue Wardrobe', 'Signature cobalt flacons designed for sustainable refills and light-protected botanical potency.', 'Collections', 6, true),
  ('b7', '/beautyImages/e2660f8d3d6e02246ae67904661af3e7.jpg', 'Ghanaian Cocoa Butter', '5-in-1 Nourishing Care', 'Rich cold-pressed lipids that melt into skin with zero sticky residue under tropical heat.', 'Body', 7, true),
  ('b8', '/beautyImages/61bc208cf17f0911e9f99c0810ccc200.jpg', 'Botanical Elixir Duo', 'Vanilla Cashmere & Shea', 'Antioxidant plant seed oils engineered for silky, non-transfer body sheen and 48-hour moisture.', 'Body', 8, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Core Products
INSERT INTO public.products (id, slug, name, subtitle, category, price, compare_at_price, rating, review_count, images, description, stock, is_featured)
VALUES
  (
    'cc-01',
    'lumiere-hydra-dew-serum',
    'Lumière Hydra-Dew Serum',
    'Triple-Hyaluronic & Niacinamide Plumping Elixir',
    'skincare',
    850.00,
    1050.00,
    4.9,
    342,
    ARRAY['/beautyImages/ca20569827f857496b78c0666cb556c4.jpg'],
    'An ultra-concentrated hydration catalyst designed to flood skin with deep cellular moisture.',
    45,
    true
  ),
  (
    'cc-02',
    'lasgidi-fine-fragrance-mist',
    'Lasgidi Fine Fragrance Mist Collection',
    'Sensory Tropical Blooms & Warm Amber Sprays',
    'fragrance',
    380.00,
    NULL,
    4.8,
    198,
    ARRAY['/beautyImages/cadd9c6e24c20cf8e79f77ff3f1e9c49.jpg'],
    'Showroom curated fine body mists crafted to deliver refreshing, lingering sensory fragrance.',
    65,
    true
  ),
  (
    'cc-03',
    'palmers-cocoa-butter-body-oil',
    'Palmer''s Cocoa Butter & Cashmere Elixir',
    '48H Moisture Rich Botanical Body Glow',
    'body',
    920.00,
    1100.00,
    5.0,
    215,
    ARRAY['/beautyImages/61bc208cf17f0911e9f99c0810ccc200.jpg'],
    'Rich pure cocoa butter and antioxidant Vitamin E blended for deep skin rejuvenation.',
    35,
    true
  ),
  (
    'cc-04',
    'touch-concentrated-pocket-perfume',
    'Touch Concentrated Pocket Perfume Set',
    'Majestic Oud, Velvet Woods & Royal Musk Oils',
    'fragrance',
    1450.00,
    NULL,
    4.9,
    88,
    ARRAY['/beautyImages/bd545c8751f20e872e51fc45f870cc99.jpg'],
    'Pocket-sized concentrated perfume essences with magnetic projection and 24-hour longevity.',
    20,
    true
  ),
  (
    'cc-05',
    'active-defense-motion-body-spray',
    'Active Defense Motion Body Spray',
    'Pearl & Beauty 48H Anti-Perspirant Care',
    'body',
    550.00,
    NULL,
    4.8,
    164,
    ARRAY['/beautyImages/ff5509b7b3d0bf627a13767df76f3662.jpg'],
    'All-day humidity and active sweat defense leaving skin dry, clean, and velvety soft.',
    50,
    false
  ),
  (
    'cc-06',
    'intensive-care-cocoa-radiance-lotion',
    'Intensive Care Cocoa Radiance Lotion',
    '100% Pure Cocoa & Shea Butter Restorative Milk',
    'skincare',
    620.00,
    NULL,
    4.7,
    230,
    ARRAY['/beautyImages/b4c0b01d7f8922fbb7dac620a15a3ec1.jpg'],
    'Deeply restores dull skin to reveal its natural glow with micro-droplets of healing jelly.',
    110,
    true
  ),
  (
    'cc-07',
    'sure-48h-motionsense-collection',
    'Sure 48H MotionSense Aerosol Line',
    'Invisible Antibacterial Fresh Protection',
    'body',
    680.00,
    NULL,
    4.9,
    142,
    ARRAY['/beautyImages/77261bd99d7a546b2a2d90e473132e83.jpg'],
    'Motion-activated micro-capsules burst with freshness as you move through your day.',
    40,
    false
  ),
  (
    'cc-08',
    'sunyani-showroom-discovery-vault',
    'Sunyani Showroom Discovery Vault',
    'Complete Curated Personal Care & Fragrance Suite',
    'sets',
    1200.00,
    1750.00,
    5.0,
    310,
    ARRAY['/beautyImages/cc.jpg'],
    'The complete signature luxury care ritual from our Sunyani showroom.',
    25,
    true
  )
ON CONFLICT (id) DO NOTHING;
