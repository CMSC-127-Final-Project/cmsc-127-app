import Navbar from '@/components/ui/navbar';
import Welcome from '@/components/homepage/welcome';
import UpcomingReservations from '@/components/homepage/upcomingReservations';
import AvailabeRooms from '@/components/homepage/availableRooms';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  icons: {
    icon: '/upfavicon.ico',
  },
  description: 'Homepage of the application',
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Welcome />
      <UpcomingReservations />
      <AvailabeRooms />
    </>
  );
}
