import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import { DrawerProvider } from '@/contexts/drawer-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shopify CSV',
  description: 'Transform your product data for Shopify in seconds',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DrawerProvider>{children}</DrawerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}