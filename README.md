# City Cosmetics — Clean Luxury Skincare & Beauty (Sunyani, Ghana)

An e-commerce web application for **City Cosmetics**, located in Sunyani, Ghana. Built with **Next.js (App Router)**, **React 19**, **Tailwind CSS**, and **Supabase**.

## 🌟 Key Features
- **Cinematic Clean Beauty Storefront**: Hero spotlight, category filtration, and luxury editorial design.
- **Ghanaian Cedis (GH₵) & Regional Localization**: Tailored for Sunyani and nationwide Ghana delivery.
- **Direct WhatsApp Ordering**: One-click order dispatch straight to WhatsApp (`0559650921`).
- **Flexible Checkout**: Supports Ghana Mobile Money (MTN MoMo, Telecel Cash, AT Money), Cards, and Pay on Delivery.
- **Interactive Skin Routine Quiz**: Dynamic quiz delivering personalized skincare regimens.
- **Admin Inventory & Order Portal (`/admin`)**:
  - Protected with Master Security Password (`CITY1258`).
  - Real-time Supabase PostgreSQL CRUD for products and order fulfillment.
  - Supabase Storage image upload directly from the browser.
- **Customer Account & Wishlist Portal (`/account`)**: Order tracking, wishlist curation, and saved Sunyani address.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Deployment
Ready to deploy on **Netlify** or **Vercel** with the included `netlify.toml`.
