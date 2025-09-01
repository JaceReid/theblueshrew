import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from './context/CartContext'; // Import the provider
import { Toaster } from 'react-hot-toast'; // Import the toast component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TheBlueShrew",
  description: "Premium quality shirt designs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap the entire app with the CartProvider */}
        <CartProvider>
          {children}
          {/* Add the Toaster component for notifications */}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e3a8a', // blue-900
                color: '#ffffff',
                border: '1px solid #3b82f6', // blue-500
              },
              success: {
                iconTheme: {
                  primary: '#22c55e', // green-500
                  secondary: '#ffffff',
                },
              },
              error: {
                style: {
                  background: '#dc2626', // red-600
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
