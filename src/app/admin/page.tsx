import Navbar from '@/components/ui/adminNavbar';
import WelcomeBanner from '@/components/admin/welcome';
import Requests from '@/components/admin/requests';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import router from 'next/router';

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
      <div className="flex justify-center mt-4">
        <Button 
          className="bg-[#5D1A0B] text-white hover:bg-[#6b1d1d] transition-colors duration-300"
          onClick={() => {
            router.push('/users');
          }}
        >
          Manage Users
        </Button>
      </div>
    </>
  );
}