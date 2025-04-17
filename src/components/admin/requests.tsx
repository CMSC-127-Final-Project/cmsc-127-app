'use client';

import React from 'react';
import { RxCheckCircled, RxCrossCircled, RxTrash, RxDotsHorizontal } from 'react-icons/rx';
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
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdownId) setOpenDropdownId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdownId]);

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
        <h2 className="text-lg md:text-2xl font-bold font-raleway">Reservation Requests</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden text-sm md:text-base">
          <thead>
            <tr className="bg-[#5D1A0B] text-white">
              <th className="px-2 md:px-4 py-2 w-[20%] min-w-[150px] rounded-tl-lg">Schedule ID</th>
              <th className="px-2 md:px-4 py-2 w-[12%] min-w-[80px]">
                Room
                <br />
                Number
              </th>
              <th className="px-2 md:px-4 py-2 w-[15%] min-w-[110px]">Date</th>
              <th className="px-2 md:px-4 py-2 w-[10%] min-w-[70px]">Capacity</th>
              <th className="px-2 md:px-4 py-2 w-[12%] min-w-[90px]">Start Time</th>
              <th className="px-2 md:px-4 py-2 w-[12%] min-w-[90px]">End Time</th>
              <th className="px-2 md:px-4 py-2 w-[10%] min-w-[80px] rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white text-center">
            {reservations.map((reservation, index) => (
              <tr key={index} className="border-t last:border-b">
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                  {reservation.reservation_id}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 text-center font-roboto">
                  {reservation.room_num}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                  {reservation.date}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 text-center font-roboto">
                  {reservation.capacity}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                  {reservation.start_time}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                  {reservation.end_time}
                </td>
                <td className="px-0 md:px-0 py-5 relative text-center">
                  <button
                    className="text-gray-500 px-2 py-1 rounded-md"
                    onClick={e => {
                      e.stopPropagation();
                      setOpenDropdownId(
                        openDropdownId === reservation.reservation_id
                          ? null
                          : reservation.reservation_id
                      );
                    }}
                  >
                    <RxDotsHorizontal size={20} />
                  </button>

                  {openDropdownId === reservation.reservation_id && (
                    <div
                      className={`absolute right-0 ${
                        index >= reservations.length - 2 ? 'bottom-full mb-2' : 'mt-2'
                      } py-2 bg-white rounded-md shadow-xl z-10 border border-gray-200`}
                    >
                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={e => {
                          e.stopPropagation();
                          acceptReservation(reservation, toast);
                          setOpenDropdownId(null);
                        }}
                      >
                        <RxCheckCircled size={18} className="mr-2 text-green-500" />
                        Accept
                      </button>
                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={e => {
                          e.stopPropagation();
                          rejectReservation(reservation, toast);
                          setOpenDropdownId(null);
                        }}
                      >
                        <RxCrossCircled size={18} className="mr-2 text-red-500" />
                        Reject
                      </button>
                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={e => {
                          e.stopPropagation();
                          removeReservation(reservation, toast);
                          setOpenDropdownId(null);
                        }}
                      >
                        <RxTrash size={18} className="mr-2 text-gray-500" />
                        Remove
                      </button>
                    </div>
                  )}
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
