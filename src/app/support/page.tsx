import type { Metadata } from 'next';
import Navbar from '@/components/ui/navbar';
import SupportForm from '@/components/support/supportForm';
import { cookies } from 'next/headers';
import Header from '@/components/profile/ProfileHeader';
import ProfileSidebar from '@/components/profile/profilesidebar';

export const metadata: Metadata = {
  title: 'Help & Support',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Contact customer support for help and concerns.',
};

export default async function SupportPage() {
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
      <Navbar user_id={nickname} />
      <main className="container mx-auto py-6 px-4 md:px-6 flex flex-col md:flex-row gap-6">
        <div className="flex flex-col w-full md:w-3/4">
          <Header />
          <SupportForm />
        </div>
        <ProfileSidebar />
      </main>
    </>
  );
}
