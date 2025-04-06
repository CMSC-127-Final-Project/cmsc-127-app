'use client';

import React from 'react';
import { RxCheckCircled, RxCrossCircled, RxTrash } from 'react-icons/rx';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Reservation {
  reservation_id: string;
  room_num: string;
  date: string;
  capacity: number;
  start_time: string;
  end_time: string;
}

const acceptReservation = async (
  reservation: Reservation,
  toast: (options: { title: string; description: string }) => void
) => {
  console.log(reservation);
  try {
    const response = await fetch('/api/reservations/accept', {
      method: 'PATCH',
      body: JSON.stringify({ reservation_id: reservation.reservation_id }),
    });

    if (!response.ok) throw new Error('Failed to accept reservation');
    toast({
      title: 'Success',
      description: 'Accepted the reservation!',
    });
  } catch (error) {
    console.error(error);
    toast({
      title: 'Error',
      description: 'Failed to accept reservation',
    });
  }
};

const rejectReservation = async (
  reservation: Reservation,
  toast: (options: { title: string; description: string }) => void
) => {
  console.log(reservation);
  try {
    const response = await fetch('/api/reservations/reject', {
      method: 'PATCH',
      body: JSON.stringify({ reservation_id: reservation.reservation_id }),
    });

    if (!response.ok) throw new Error('Failed to reject reservation');
    toast({
      title: 'Success',
      description: 'Rejected the reservation!',
    });
  } catch (error) {
    console.error(error);
    toast({
      title: 'Error',
      description: 'Failed to reject reservation',
    });
  }
};

const removeReservation = async (
  reservation: Reservation,
  toast: (options: { title: string; description: string }) => void
) => {
  console.log(reservation);
  try {
    const response = await fetch('/api/reservations/remove', {
      method: 'DELETE',
      body: JSON.stringify({ reservation_id: reservation.reservation_id }),
    });

    if (!response.ok) throw new Error('Failed to delete reservation');
    toast({
      title: 'Success',
      description: 'Deleted the reservation!',
    });
  } catch (error) {
    console.error(error);
    toast({
      title: 'Error',
      description: 'Failed to delete reservation',
    });
  }
};

const ReservationRequests = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const response = await fetch('/api/reservations/reserve', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }

        const data = await response.json();
        setReservations(data.length > 0 ? data : []);
      } catch {}
    };

    loadReservations();
  }, []);

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl drop-shadow-[0_-4px_10px_rgba(0,0,0,0.1)] mx-4 md:mx-20 mt-1 mb-10">
      <div className="flex flex-row justify-between items-center mb-4">
        <h2 className="text-lg md:text-3xl font-bold font-raleway">Reservation Requests</h2>
      </div>

      <div className="overflow-x-auto font-roboto">
        <table className="w-full table-fixed border-collapse shadow-sm rounded-lg overflow-hidden text-sm md:text-base">
          <thead>
            <tr className="bg-[#5D1A0B] text-white text-left">
              <th className="px-2 md:px-4 py-2 w-1/5 rounded-tl-lg">Schedule ID</th>
              <th className="px-2 md:px-4 py-2 w-1/5">
                Room
                <br />
                Number
              </th>
              <th className="px-2 md:px-4 py-2 w-1/5">Date</th>
              <th className="px-2 md:px-4 py-2 w-1/5">Capacity</th>
              <th className="px-2 md:px-4 py-2 w-1/5">Start Time</th>
              <th className="px-2 md:px-4 py-2 w-1/5">End Time</th>
              <th className="px-2 md:px-4 py-2 w-1/5 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {reservations.map((reservation, index) => (
              <tr key={index} className="border-t last:border-b">
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100">
                  {reservation.reservation_id}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100">{reservation.room_num}</td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100">{reservation.date}</td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100">{reservation.capacity}</td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100">{reservation.start_time}</td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100">{reservation.end_time}</td>
                <td className="px-0 md:px-0 py-5 flex">
                  <button
                    className="text-green-500 px-2 py-1 rounded-md"
                    onClick={() => acceptReservation(reservation, toast)}
                  >
                    <RxCheckCircled size={20} />
                  </button>
                  <button
                    className="text-red-500 px-2 py-1 rounded-md"
                    onClick={() => rejectReservation(reservation, toast)}
                  >
                    <RxCrossCircled size={20} />
                  </button>
                  <button
                    className="text-gray-500 px-2 py-1 rounded-md"
                    onClick={() => removeReservation(reservation, toast)}
                  >
                    <RxTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationRequests;
