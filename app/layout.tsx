import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import ChatWidget from '@/components/ChatWidget';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'BethMedic — Premium Medical & Health Products',
  description: 'Nigeria\'s most trusted source for pharmaceutical-grade supplements, certified medical devices, and expert health guidance. Founded by Dr. Precious Nneoma Ojiugo.',
  keywords: 'medical, health, supplements, medical devices, pharmacy, BethMedic, Nigeria, Naira, pharmaceutical',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'BethMedic — Premium Medical & Health Products',
    description: 'Nigeria\'s most trusted source for premium health & medical products. Founded by Dr. Precious Nneoma Ojiugo.',
    type: 'website',
    locale: 'en_NG',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <CartSidebar />
          <main className="min-h-screen">{children}</main>
          <ChatWidget />
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#1f2937',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#7C3AED', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
