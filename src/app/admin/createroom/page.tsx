import { RoomForm } from '@/components/createroom/roomform';
import { RoomList } from '@/components/createroom/roomlist';
import Navbar from '@/components/ui/adminNavbar';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Room',
  description: 'Create and manage rooms',
  icons: {
    icon: 'upfavicon.ico',
  },
};

export default async function CreateRoom() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user_id = data.user?.id || '';

  return (
    <div className="bg-white min-h-screen">
      <Navbar user_id={user_id} />

      <div className="px-6 md:px-10">
        <div className="max-w-7xl mx-auto pt-4">
          {' '}
          {/* optional: extra top padding */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
              <span className="text-3xl">👋</span>
            </div>
            <p className="text-gray-700">
              Add new rooms to the system or view existing rooms below.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 items-start">
            <RoomForm />
            <RoomList />
          </div>
        </div>
      </div>
    </div>
  );
}
