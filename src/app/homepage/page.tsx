import Navbar from '@/components/ui/navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Homepage of the application',
};

export default function HomePage() {
  return (
    <>
      <Navbar />
    </>
  );
}
