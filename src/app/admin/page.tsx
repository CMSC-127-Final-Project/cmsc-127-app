import Navbar from '@/components/ui/adminNavbar';
import WelcomeBanner from '@/components/admin/welcome';
import Requests from '@/components/admin/requests';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Admin',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Admin page of the application',
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const user_id = cookieStore.get('user')?.value || '';

  let nickname = '';
  try {
    const response = await fetch(`http://localhost:3000/api/user/${user_id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error);
    }

    const data = await response.json();
    nickname = data.nickname;
  } catch (error) {
    console.error('Error fetching nickname:', error);
  }

  return (
    <>
      <Navbar username={nickname} />
      <div className="pt-16 md:pt-24">
        <WelcomeBanner username={nickname} />
        <Requests />
      </div>
    </>
  );
}
