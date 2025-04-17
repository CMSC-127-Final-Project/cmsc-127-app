import type { Metadata } from 'next';
import Navbar from '@/components/ui/navbar';
import SupportForm from '@/components/support/supportForm';
import Header from '@/components/profile/ProfileHeader';
import ProfileSidebar from '@/components/profile/profilesidebar';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Help & Support',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Contact customer support for help and concerns.',
};

export default async function SupportPage() {
  const supabase = await createClient();
  const user_id = await supabase.auth.getUser().then(({ data }) => data.user?.id || '');
  return (
    <>
      <Navbar user_id={user_id} />
      <main className="container mx-auto py-6 px-4 md:px-6 flex flex-col md:flex-row gap-6">
        <div className="flex flex-col w-full md:w-3/4">
          <Header user_id={user_id}/>
          <SupportForm />
        </div>
        <ProfileSidebar />
      </main>
    </>
  );
}
