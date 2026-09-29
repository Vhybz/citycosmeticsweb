import type { Metadata, Viewport } from 'next';
import { Montserrat, Figtree } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cartContext';
import { WishlistProvider } from '@/lib/wishlistContext';
import { QuickViewProvider } from '@/lib/quickViewContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { QuickViewModal } from '@/components/QuickViewModal';
import { WhatsAppOrderProvider } from '@/lib/whatsappOrderContext';
import { WhatsAppOrderModal } from '@/components/WhatsAppOrderModal';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const figtree = Figtree({
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
    <html lang="en" className={`${montserrat.variable} ${figtree.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#1F2937] antialiased selection:bg-[#DCEBFA] selection:text-[#0B1F3A]">
        <CartProvider>
          <WishlistProvider>
            <QuickViewProvider>
              <WhatsAppOrderProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <CartDrawer />
                <QuickViewModal />
                <WhatsAppOrderModal />
                <Footer />
              </WhatsAppOrderProvider>
            </QuickViewProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
