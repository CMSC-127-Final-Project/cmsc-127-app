import Navbar from '@/components/ui/navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Homepage of the application',
};

export default function HomePage() {
  return (
    <>
      <Navbar />
    </>
  );
}
