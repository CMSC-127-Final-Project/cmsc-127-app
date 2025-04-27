import Navbar from '@/components/ui/adminNavbar';
import { SetPassword } from '@/components/admin/editClient';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Reset Password',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Admin page for resetting user passwords.',
};

export default async function EditProfilePage() {
  const supabase = await createClient();
  const user_id = await supabase.auth.getUser().then(({ data }) => data.user?.id || '');

  return (
    <>
      <Navbar user_id={user_id} />
      <main className="container mx-auto py-6 px-4 md:px-6 flex flex-col md:flex-row gap-6">
        <div className="flex flex-col w-full">
          <SetPassword />
        </div>
      </main>
    </>
  );
}
