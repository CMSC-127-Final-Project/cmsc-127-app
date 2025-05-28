import './globals.css';
import type { Metadata } from 'next';
import { Raleway, Roboto } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { PostHogProvider } from './providers';
import { ThemeProvider } from 'next-themes';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  display: 'swap',
});

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CSM Room Management System',
  description: 'A room management system for CSM',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json"></link>
      </head>
      <body className={`${roboto.variable} ${raleway.variable} font-roboto antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster />
          <PostHogProvider>{children}</PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
