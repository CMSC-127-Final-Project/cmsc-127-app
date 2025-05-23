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
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${raleway.variable} font-roboto antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster />
          <PostHogProvider>{children}</PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
