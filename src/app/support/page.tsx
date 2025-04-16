import type { Metadata } from 'next';
import Navbar from '@/components/ui/navbar';
import ContactUs from '@/components/support/supportForm';
import { cookies } from 'next/headers';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Navbar username={nickname} />
      <main className="container mx-auto py-6 px-4 md:px-6 flex flex-col md:flex-row gap-6">
        <div className="flex flex-col w-full md:w-3/4">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">Help and Support</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Message us in any of the following channels and we will get back to you as soon as possible.
            </p>
          </CardHeader>
        </Card>
        <ContactUs />
        </div>
        <ProfileSidebar />
      </main>
    </>
  );
}
