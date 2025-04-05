import Navbar from '@/components/ui/navbar';
import Welcome from '@/components/homepage/welcome';
import UpcomingReservations from '@/components/homepage/upcomingReservations';
import AvailabeRooms from '@/components/homepage/availableRooms';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Homepage of the application',
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const user_id = cookieStore.get('user')?.value;

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
        <Welcome username={nickname} />
        <AvailabeRooms />
        <UpcomingReservations />
      </div>
    </>
  );
}
