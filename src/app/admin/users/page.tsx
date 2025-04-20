import Navbar from '@/components/ui/adminNavbar';
import Users from '@/components/admin/users';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Manage Users',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Manage users here. You may create, read, update, and delete users as needed.',
};

export default async function UserManagementPage() {
  const supabase = await createClient();
  const user_id = await supabase.auth.getUser().then(({ data }) => data.user?.id || '');
  return (
    <>
      <Navbar user_id={user_id} />
        <div className="p-4 md:p-6 md:ml-16">
          <h1 className="text-2xl md:text-5xl font-bold font-raleway flex flex-wrap items-center gap-2">
            Manage Users
          </h1>
          <p className="text-gray-900 mt-1 text-[10px] md:text-sm font-raleway ml-1 md:ml-2">
            Manage users here. You may create, read, update, and delete users as needed.
          </p>
        </div>
        <Users />
    </>
  );
}
