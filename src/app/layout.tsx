import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cartContext';
import { WishlistProvider } from '@/lib/wishlistContext';
import { QuickViewProvider } from '@/lib/quickViewContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { QuickViewModal } from '@/components/QuickViewModal';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0B1F3A',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'City Cosmetics | Clean Luxury Skincare & Beauty — Sunyani',
  description:
    'Experience high-performance botanical skincare and luminous makeup from Sunyani. 100% cruelty-free and formulated with multi-molecular hydration for radiant African beauty.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'City Cosmetics',
  },
  keywords: [
    'City Cosmetics',
    'luxury skincare',
    'clean beauty',
    'Sunyani cosmetics',
    'hydra-dew serum',
    'fine fragrance mists',
    'botanical glow oil',
    'skin routine quiz',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#1F2937] antialiased selection:bg-[#DCEBFA] selection:text-[#0B1F3A]">
        <CartProvider>
          <WishlistProvider>
            <QuickViewProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <CartDrawer />
              <QuickViewModal />
              <Footer />
            </QuickViewProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
