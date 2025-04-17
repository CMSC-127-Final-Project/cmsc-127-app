import { RoomForm } from '@/components/createroom/roomform';
import { RoomList } from '@/components/createroom/roomlist';
import Navbar from '@/components/ui/adminNavbar';
import { cookies } from 'next/headers';

export default async function CreateRoom() {
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
    <div className="bg-gray-50 min-h-screen">
      <Navbar user_id={nickname} />

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
