import Navbar from '@/components/ui/navbar';
import Welcome from '@/components/homepage/welcome';
import UpcomingReservations from '@/components/homepage/upcomingReservations';
import RoomReservation from '@/components/homepage/availableRooms';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Homepage of the application',
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user_id = data.user?.id || '';

  return (
    <>
      <Navbar user_id={user_id}/>
      <div className="lg:mt-0 md:mt-12">
        <Welcome user_id={user_id}/>
        <RoomReservation />
        <UpcomingReservations user_id={user_id} />
      </div>
    </>
  );
}
