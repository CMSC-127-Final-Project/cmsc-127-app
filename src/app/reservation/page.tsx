import type { Metadata } from 'next';
import Navbar from '@/components/ui/navbar';
import ReservationForm from '@/components/reservation/reservationForm';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Make a Reservation',
  description: 'Enter the room reservation details below.',
};

export default async function ReservationPage() {
  const supabase = await createClient();
  const user_id = await supabase.auth.getUser().then(({ data }) => data.user?.id || '');
  return (
    <>
      <Navbar user_id={user_id} />
      <div className=" flex min-h-screen flex-col items-center justify-center px-4">
        <div className="flex-1 container mx-auto px-4 py-8 sm:mt-20">
          <div className="max-w-5xl bg-white rounded-lg p-8 shadow-sm">
            <h1 className="text-4xl font-bold mb-2">Make a reservation</h1>
            <p className="text-lg mb-8">Enter the room reservation details below:</p>
          </div>
          <div className="flex w-full flex-col justify-center sm:bg-background sm:rounded-lg sm:shadow-lg sm:p-10">
            <div className="sm:mx-20 space-y-8">
              <ReservationForm user_id={user_id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
