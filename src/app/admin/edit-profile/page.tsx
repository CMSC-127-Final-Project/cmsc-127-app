import Navbar from '@/components/ui/navbar';
import EditClientProfile from '@/components/admin/editClient'; // Import the client component
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Edit Profile',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Edit user profile',
};

export default async function EditProfilePage() {
  const supabase = await createClient();
  const user_id = await supabase.auth.getUser().then(({ data }) => data.user?.id || '');

  return (
    <>
      <Navbar user_id={user_id} />
      <main className="container mx-auto py-6 px-4 md:px-6 flex flex-col md:flex-row gap-6">
        <div className="flex flex-col w-full">
          <EditClientProfile />
        </div>
      </main>
    </>
  );
}
