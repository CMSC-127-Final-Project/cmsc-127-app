import Navbar from '@/components/ui/adminNavbar';
import Users from '@/components/admin/users';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Manage Users',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Manage users here. You may create, read, update, and delete users as needed.',
};

export default async function UserManagementPage() {
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
      <div className="pt-16 md:pt-24">
        <div className="p-4 md:p-6 md:ml-16">
          <h1 className="text-2xl md:text-5xl font-bold font-raleway flex flex-wrap items-center gap-2">
            Manage Users
          </h1>
          <p className="text-gray-900 mt-1 text-[10px] md:text-sm font-raleway ml-1 md:ml-2">
            Manage users here. You may create, read, update, and delete users as needed.
          </p>
        </div>
        <Users />
      </div>
    </>
  );
}
