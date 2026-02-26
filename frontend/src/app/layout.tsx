import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemedToaster from '@/components/layout/ThemedToaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartSidebar from '@/components/cart/CartSidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'NexMart — Universal E-Commerce Platform',
  description: 'Shop the future with NexMart. Premium products, seamless experience, unmatched variety. Electronics, fashion, home, sports — everything you need in one place.',
  keywords: 'ecommerce, shop, online store, electronics, fashion, home, sports',
  authors: [{ name: 'NexMart' }],
  openGraph: {
    title: 'NexMart — Universal E-Commerce Platform',
    description: 'Shop the future with NexMart.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <ThemedToaster />
          <Navbar />
          <CartSidebar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
