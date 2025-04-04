import type { Metadata } from 'next';
import Navbar from '@/components/ui/navbar';
import ReservationForm from '@/components/reservation/reservationForm';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Make a Reservation',
  description: 'Enter the room reservation details below.',
};

export default function ReservationPage() {
  return (
    <>
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="flex w-full flex-col justify-center sm:w-[45rem] sm:bg-background sm:rounded-lg sm:shadow-lg sm:p-10">
            <div className="sm:mx-auto sm:w-[500px] space-y-8">
            <div className="flex flex-col text-left">
                <h1 className="text-xl font-semibold tracking-tight">Make a Reservation</h1>
                <p className="text-sm text-muted-foreground font-raleway">
                Enter the room reservation details below.
                </p>
            </div>
            <ReservationForm />
            </div>
        </div>
        </div>
        </>
  );
}
