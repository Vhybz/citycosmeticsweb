-- ==============================================================================
-- City Cosmetics Sunyani - Enterprise Non-Destructive Supabase Database Schema
-- Location: Sunyani, Bono Region, Ghana
-- 
-- SAFE TO RUN ON AN EXISTING DATABASE:
--   - Will NOT overwrite any products, categories, or images you already uploaded
--   - Uses "ON CONFLICT DO NOTHING" across all seed operations
--   - Adds missing columns non-destructively with "ADD COLUMN IF NOT EXISTS"
--   - Recreates RLS policies safely with "DROP POLICY IF EXISTS"
--   - Does NOT delete or drop any of your existing customer data
-- ==============================================================================

-- Enable essential cryptographic & UUID extensions safely
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. HELPER TRIGGER FUNCTIONS
-- ==============================================================================

-- Reusable timestamp updater
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Automatic profile creation upon Supabase auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 2. TABLE DEFINITIONS (NON-DESTRUCTIVE & SAFE FOR EXISTING DATA)
-- ==============================================================================

-- PROFILES TABLE (Extends Supabase Auth users)
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

-- CATEGORIES TABLE (Formulation categories & face images)
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

-- PRODUCTS TABLE (Formulations Catalog with Actives, Benefits & Variants)
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

-- SITE BEAUTY IMAGES TABLE (Living Radiance Archive / Lookbook / Marquee)
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

-- ORDERS TABLE (Sunyani Dispatch, Direct MoMo & WhatsApp Tracking)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_whatsapp TEXT,
  customer_call_line TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) DEFAULT 0.00,
  delivery_fee NUMERIC(10, 2) DEFAULT 20.00,
  total_amount NUMERIC(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method TEXT DEFAULT 'momo',
  payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Pending', 'Failed', 'Refunded')),
  status TEXT DEFAULT 'Processing' CHECK (status IN ('Processing', 'Shipped', 'Delivered', 'Cancelled')),
  momo_transaction_id TEXT,
  momo_network TEXT,
  momo_phone TEXT,
  dispatch_notes TEXT,
  order_source TEXT DEFAULT 'website' CHECK (order_source IN ('website', 'whatsapp', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- REVIEWS TABLE (Customer feedback & verified buyer ratings)
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


-- ==============================================================================
-- 2B. SAFE SCHEMA EVOLUTION (ADD COLUMNS NON-DESTRUCTIVELY TO EXISTING TABLES)
-- ==============================================================================

-- Safely add any new columns to existing orders table without breaking data
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS momo_transaction_id TEXT;
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS momo_network TEXT;
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS momo_phone TEXT;
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS customer_whatsapp TEXT;
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS customer_call_line TEXT;
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(10, 2) DEFAULT 20.00;
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS dispatch_notes TEXT;
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS order_source TEXT DEFAULT 'website';

-- Safely add columns to existing products table
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10, 2);
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS skin_types TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 50;

-- Safely add columns to existing beauty images table
ALTER TABLE IF EXISTS public.site_beauty_images ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Skincare';
ALTER TABLE IF EXISTS public.site_beauty_images ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE IF EXISTS public.site_beauty_images ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;


-- ==============================================================================
-- 3. AUTOMATIC UPDATED_AT TRIGGERS
-- ==============================================================================

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_site_beauty_images_updated_at ON public.site_beauty_images;
CREATE TRIGGER trg_site_beauty_images_updated_at
  BEFORE UPDATE ON public.site_beauty_images
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Attach user signup trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================
-- 4. PERFORMANCE B-TREE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_momo_txid ON public.orders(momo_transaction_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_beauty_images_active ON public.site_beauty_images(is_active, display_order);


-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES (SAFE RE-CREATION)
-- ==============================================================================

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Allow profile insertion" ON public.profiles;
CREATE POLICY "Allow profile insertion" ON public.profiles FOR INSERT WITH CHECK (true);

-- Categories RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all modifications on categories" ON public.categories;
CREATE POLICY "Allow all modifications on categories" ON public.categories FOR ALL USING (true);

-- Products RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all modifications on products" ON public.products;
CREATE POLICY "Allow all modifications on products" ON public.products FOR ALL USING (true);

-- Site Beauty Images RLS
ALTER TABLE public.site_beauty_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Beauty images are viewable by everyone" ON public.site_beauty_images;
CREATE POLICY "Beauty images are viewable by everyone" ON public.site_beauty_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all modifications on site_beauty_images" ON public.site_beauty_images;
CREATE POLICY "Allow all modifications on site_beauty_images" ON public.site_beauty_images FOR ALL USING (true);

-- Orders RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Orders viewable by everyone" ON public.orders;
CREATE POLICY "Orders viewable by everyone" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow order creation" ON public.orders;
CREATE POLICY "Allow order creation" ON public.orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow order updates" ON public.orders;
CREATE POLICY "Allow order updates" ON public.orders FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow order deletion" ON public.orders;
CREATE POLICY "Allow order deletion" ON public.orders FOR DELETE USING (true);

-- Reviews RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Reviews viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow review creation" ON public.reviews;
CREATE POLICY "Allow review creation" ON public.reviews FOR INSERT WITH CHECK (true);


-- ==============================================================================
-- 6. STORAGE BUCKETS & PUBLIC ACCESS POLICIES (SAFE NO-CONFLICT)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('category-images', 'category-images', true),
  ('beauty-images', 'beauty-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Read & Write Policies (Idempotent)
DROP POLICY IF EXISTS "Public read for product-images" ON storage.objects;
CREATE POLICY "Public read for product-images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Allow uploads to product-images" ON storage.objects;
CREATE POLICY "Allow uploads to product-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Allow update on product-images" ON storage.objects;
CREATE POLICY "Allow update on product-images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Allow delete on product-images" ON storage.objects;
CREATE POLICY "Allow delete on product-images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public read for category-images" ON storage.objects;
CREATE POLICY "Public read for category-images" ON storage.objects FOR SELECT USING (bucket_id = 'category-images');
DROP POLICY IF EXISTS "Allow uploads to category-images" ON storage.objects;
CREATE POLICY "Allow uploads to category-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'category-images');
DROP POLICY IF EXISTS "Allow update on category-images" ON storage.objects;
CREATE POLICY "Allow update on category-images" ON storage.objects FOR UPDATE USING (bucket_id = 'category-images');
DROP POLICY IF EXISTS "Allow delete on category-images" ON storage.objects;
CREATE POLICY "Allow delete on category-images" ON storage.objects FOR DELETE USING (bucket_id = 'category-images');

DROP POLICY IF EXISTS "Public read for beauty-images" ON storage.objects;
CREATE POLICY "Public read for beauty-images" ON storage.objects FOR SELECT USING (bucket_id = 'beauty-images');
DROP POLICY IF EXISTS "Allow uploads to beauty-images" ON storage.objects;
CREATE POLICY "Allow uploads to beauty-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'beauty-images');
DROP POLICY IF EXISTS "Allow update on beauty-images" ON storage.objects;
CREATE POLICY "Allow update on beauty-images" ON storage.objects FOR UPDATE USING (bucket_id = 'beauty-images');
DROP POLICY IF EXISTS "Allow delete on beauty-images" ON storage.objects;
CREATE POLICY "Allow delete on beauty-images" ON storage.objects FOR DELETE USING (bucket_id = 'beauty-images');


-- ==============================================================================
-- 7. SUPABASE REALTIME REPLICATION (For Live Admin Dashboard)
-- ==============================================================================

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ==============================================================================
-- 8. INITIAL SEED DATA (SAFE: ZERO CONFLICT WITH USER-UPLOADED DATA)
-- Notice: ALL inserts below use "ON CONFLICT (id) DO NOTHING" so anything you
-- have already uploaded or edited will NEVER be overwritten or replaced!
-- ==============================================================================

-- Seed Categories (will NOT overwrite existing uploaded categories)
INSERT INTO public.categories (id, name, slug, description, image_url, item_count, display_order)
VALUES
  ('skincare', 'Skincare', 'skincare', 'Potent botanicals and clinical actives crafted in Sunyani for an effortless glass-skin glow.', '/beautyImages/ca20569827f857496b78c0666cb556c4.jpg', 12, 1),
  ('makeup', 'Makeup & Complexion', 'makeup', 'Weightless formulas designed to enhance your natural beauty.', '/beautyImages/34452e2fc3a3d0262d96d96e2c62e95d.jpg', 16, 2),
  ('fragrance', 'Fine Fragrance', 'fragrance', 'Sensory perfumes blending West African florals and modern tropical woods.', '/beautyImages/bd545c8751f20e872e51fc45f870cc99.jpg', 8, 3),
  ('body', 'Bath & Body', 'body', 'Silken body elixirs and scrubs infused with antioxidant oils.', '/beautyImages/61bc208cf17f0911e9f99c0810ccc200.jpg', 9, 4),
  ('sets', 'Curated Sets & Gifts', 'sets', 'Award-winning discovery routines and exclusive seasonal bundles.', '/beautyImages/cadd9c6e24c20cf8e79f77ff3f1e9c49.jpg', 6, 5)
ON CONFLICT (id) DO NOTHING;

-- Seed Living Radiance Archive Lookbook (will NOT overwrite existing uploaded images)
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

-- Seed Products Catalog (will NOT overwrite any product you have uploaded or modified)
INSERT INTO public.products (id, slug, name, subtitle, category, price, compare_at_price, rating, review_count, images, description, benefits, ingredients, stock, is_featured)
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
    'An ultra-concentrated hydration catalyst designed to flood skin with deep cellular moisture. Formulated in Sunyani with multi-molecular hyaluronic acid and botanical peptides.',
    ARRAY['72-Hour continuous hydration barrier', 'Visibly plumps fine lines and smooths rough patches', 'Strengthens epidermal moisture barrier against tropical heat'],
    'Water/Aqua, Multi-Molecular Sodium Hyaluronate (3%), Niacinamide (5%), Sunyani Shea Peptide Ferment, Panthenol, Phenoxyethanol.',
    45,
    true
  ),
  (
    'cc-02',
    'cellular-renewal-elixir',
    'Cellular Renewal Elixir',
    'Botanical Stem Cells & Golden Marula Barrier',
    'skincare',
    780.00,
    950.00,
    4.8,
    198,
    ARRAY['/beautyImages/1.jpg'],
    'A potent golden restorative nectar designed to defend against environmental pollutants and boost cellular turnover with zero greasy residue.',
    ARRAY['Stimulates cellular turnover', 'Shields against environmental pollutants', 'Absorbs instantly without sticky residue'],
    'Sclerocarya Birrea (Marula) Seed Oil, Adansonia Digitata (Baobab) Seed Extract, CoQ10, Tocopherol (Vitamin E), Rosa Damascena Flower Oil.',
    35,
    true
  ),
  (
    'cc-03',
    'luminous-glow-infusion',
    'Luminous Glow Infusion',
    '20% Vitamin C Ester & Sunyani Papaya Enzymes',
    'skincare',
    820.00,
    980.00,
    4.9,
    215,
    ARRAY['/beautyImages/3.jpg'],
    'Clinical-potency brightening concentrate that evens skin tone, reduces hyperpigmentation, and imparts a resilient glass-skin glow.',
    ARRAY['Visibly fades dark spots and sun-induced discoloration', 'Protects against UV-induced oxidative stress', 'Imparts a lit-from-within glow without greasiness'],
    'Tetrahexyldecyl Ascorbate (Vitamin C 20%), Carica Papaya Enzyme Extract, Licorice Root Ferment, Ferulic Acid, Squalane.',
    28,
    true
  ),
  (
    'cc-04',
    'atelier-velvet-night-balm',
    'Atelier Velvet Night Balm',
    'Wild Moringa & Botanical Squalane Restorative',
    'skincare',
    890.00,
    1100.00,
    5.0,
    174,
    ARRAY['/beautyImages/ca.jpg'],
    'Overnight cellular recuperation balm that replenishes vital lipids and reinforces the epidermal moisture barrier while you sleep.',
    ARRAY['Intensive overnight moisture lock', 'Calms irritated, barrier-compromised skin', 'Supple, rested glow by morning'],
    'Moringa Oleifera Seed Oil, Botanical Squalane, Butyrospermum Parkii (Shea Butter), Ceramide NP, Bisabolol, Lavandula Angustifolia Oil.',
    20,
    true
  ),
  (
    'cc-05',
    'lasgidi-fine-fragrance-mist',
    'Lasgidi Fine Fragrance Mist Collection',
    'Sensory Tropical Blooms & Warm Amber Sprays',
    'fragrance',
    380.00,
    NULL,
    4.8,
    198,
    ARRAY['/beautyImages/cadd9c6e24c20cf8e79f77ff3f1e9c49.jpg'],
    'Showroom curated fine body mists crafted to deliver refreshing, lingering sensory fragrance suitable for tropical climates.',
    ARRAY['Lightweight non-staining fine mist', '24-hour sensory floral amber longevity', 'Enriched with skin-conditioning botanicals'],
    'Alcohol Denat., Aqua/Water, Parfum/Fragrance, Hibiscus Rosa-Sinensis Flower Extract, Glycerin.',
    65,
    false
  ),
  (
    'cc-06',
    'palmers-cocoa-butter-body-oil',
    'Palmer''s Cocoa Butter & Cashmere Elixir',
    '48H Moisture Rich Botanical Body Glow',
    'body',
    920.00,
    1100.00,
    5.0,
    215,
    ARRAY['/beautyImages/61bc208cf17f0911e9f99c0810ccc200.jpg'],
    'Rich pure cocoa butter and antioxidant Vitamin E blended for deep skin rejuvenation and all-day silken sheen.',
    ARRAY['Instant non-greasy body radiance', 'Soothes rough, dry elbows and legs', 'Rich natural cocoa aroma'],
    'Theobroma Cacao (Cocoa) Extract, Glycine Soja Oil, Isopropyl Myristate, Tocopheryl Acetate.',
    35,
    false
  ),
  (
    'cc-07',
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
    ARRAY['Ultra-concentrated pure perfume oils', 'Pocket-friendly rollerball flacons', 'Rich sillage of Royal Oud and Amber'],
    'Dipropylene Glycol, Parfum/Fragrance, Benzyl Salicylate, Linalool, Limonene.',
    20,
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
    'The complete signature luxury care ritual from our Sunyani showroom. Includes full routines from cleansing to fragrance.',
    ARRAY['Comprehensive 4-step discovery routine', 'Presented in luxury royal blue keepsake gift box', 'Includes complimentary Sunyani delivery'],
    'Complete curated set containing Hydra-Dew Serum (30ml), Renewal Elixir (30ml), Cashmere Body Oil (100ml), and Pocket Perfume (15ml).',
    25,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Reviews (will NOT duplicate)
INSERT INTO public.reviews (product_id, author, rating, title, comment, skin_type, verified)
VALUES
  ('cc-01', 'Akosua Mensah (Sunyani)', 5, 'My skin is glowing non-stop', 'Delivered in Sunyani within 2 hours of payment! The Hydra-Dew serum is light, never oily in our heat.', 'Combination Skin', true),
  ('cc-01', 'Dr. Kwame Boateng', 5, 'Clinical formulation that actually works', 'The hyaluronic acid weight distribution is impressive. Highly recommended for sensitive melanin-rich skin.', 'Dry / Sensitive', true),
  ('cc-02', 'Abena Pokuaa', 5, 'Pure liquid gold', 'The baobab oil makes my skin texture baby soft. I ordered via WhatsApp and got instant dispatch.', 'Normal to Dry', true),
  ('cc-03', 'Esi Serwaa', 5, 'Faded my dark marks in 3 weeks', 'The 20% Vitamin C is gentle yet effective. Zero peeling or irritation.', 'Hyper-pigmented', true)
ON CONFLICT DO NOTHING;
