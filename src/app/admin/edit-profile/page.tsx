import Navbar from '@/components/ui/adminNavbar';
import { EditClientProfile } from '@/components/admin/editClient'; // Import the client component
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Reset Password',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Reset user password',
};

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userData } = await supabase
    .from('User')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (userData?.role !== 'Admin') {
    redirect('/unauthorized');
  }

  return (
    <>
      <Navbar user_id={user.id} />
      <main className="container mx-auto py-6 px-4 md:px-6 flex flex-col md:flex-row gap-6">
        <div className="flex flex-col w-full">
          <EditClientProfile />
        </div>
      </main>
    </>
  );
}
