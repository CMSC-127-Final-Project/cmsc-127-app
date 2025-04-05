import Navbar from '@/components/ui/adminNavbar';
import WelcomeBanner from '@/components/admin/welcome';
import Requests from '@/components/admin/requests';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Admin page of the application',
};

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-24">
        <WelcomeBanner />
        <Requests />
      </div>
    </>
  );
}
