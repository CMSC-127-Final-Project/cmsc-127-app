import type { Metadata } from 'next';
import Navbar from '@/components/ui/navbar';
import SupportForm from '@/components/support/supportForm';
import { cookies } from 'next/headers';

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
      <Navbar username={nickname} />
      <div className=" flex min-h-screen flex-col items-center justify-center px-4">
        <div className="flex-1 container mx-auto px-4 py-8 sm:mt-20">
          <div className="max-w-full bg-white p-8 shadow-sm">
            <h1 className="text-4xl font-bold mb-2">Contact Support</h1>
            <p className="text-lg mb-8">Enter your concerns below:</p>
          </div>
          <div className="flex w-full flex-col justify-center sm:bg-background sm:rounded-lg sm:shadow-lg sm:p-10">
            <SupportForm />
          </div>
        </div>
      </div>
    </>
  );
}