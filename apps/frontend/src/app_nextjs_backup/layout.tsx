import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Or your preferred font
import './globals.css';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import React from 'react';

const inter = Inter({ subsets: ['latin'] }); // Configure your font

export const metadata: Metadata = {
  title: 'Mediahand',
  description: 'Your AI-powered business assistant for creators',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning> {/* Changed from RTL to LTR for English */}
      <body className={inter.className}> {/* Apply font class */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 