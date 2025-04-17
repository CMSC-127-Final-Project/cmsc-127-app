import Navbar from '@/components/ui/adminNavbar';
import WelcomeBanner from '@/components/admin/welcome';
import Requests from '@/components/admin/requests';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Admin',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Admin page of the application',
};

export default async function AdminPage() {
  const supabase = await createClient();
  const user_id = await supabase.auth.getUser().then(({ data }) => data.user?.id || '');

  return (
    <>
      <Navbar user_id={user_id} />
      <div className="pt-16 md:pt-24">
        <WelcomeBanner user_id={user_id} />
        <Requests />
      </div>
    </>
  );
}
