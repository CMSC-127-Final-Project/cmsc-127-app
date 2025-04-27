import Navbar from '@/components/ui/navbar';
import Header from '@/components/profile/ProfileHeader';
import ProfileSidebar from '@/components/profile/profilesidebar';
import Settings from '@/components/profile/settings';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Homepage of the application',
};

export default async function HomePage() {
  const supabase = await createClient();
  const user_id = await supabase.auth.getUser().then(({ data }) => data.user?.id || '');

  return (
    <>
      <Navbar user_id={user_id} />
      <main className="container mx-auto py-6 px-4 md:px-6 flex flex-col md:flex-row gap-6 md:mt-10 lg:mt-0">
        <div className="flex flex-col w-full md:w-3/4">
          <Header user_id={user_id} />
          <Settings user_id={user_id} />
        </div>
        <ProfileSidebar />
      </main>
    </>
  );
}
