import Navbar from '@/components/ui/navbar';
import Welcome from './components/welcome';
import UpcomingReservations from './components/upcomingReservations';
import AvailabeRooms from './components/availableRooms';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
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
