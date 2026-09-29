import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
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

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'City Cosmetics | Clean Luxury Skincare & Beauty — Sunyani, Ghana',
  description:
    'Experience high-performance botanical skincare and luminous makeup from Sunyani, Ghana. 100% cruelty-free and formulated with multi-molecular hydration for radiant African beauty.',
  keywords: [
    'City Cosmetics',
    'luxury skincare',
    'clean beauty',
    'hydra-dew serum',
    'velvet cushion lipstick',
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
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#fcfaf8] text-[#1e1b18] antialiased selection:bg-[#ebd2c7] selection:text-[#121113]">
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
