import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Full-Stack E-Commerce',
  description: 'A Next.js and Node.js e-commerce application.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className={inter.className}>
         <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
          }}
        />
        <Providers>
          <Navbar />
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}