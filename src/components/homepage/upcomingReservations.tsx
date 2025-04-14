'use client';

import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';

interface Reservation {
  room_num: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  admin_notes?: string;
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'text-green-600 font-medium';
    case 'Pending':
      return 'text-yellow-600 font-medium';
    case 'Rejected':
      return 'text-red-600 font-medium';
    default:
      return 'text-gray-600';
  }
};

const UpcomingReservations = ({ user_id }: { user_id: string }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const response = await fetch(`/api/reservations/${user_id}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }

        const data = await response.json();
        setReservations(data.length > 0 ? data : []);
      } catch (err) {
        console.error('Error loading reservations:', err);
        setError('Failed to load reservations. Please try again later.');
      }
    };

    loadReservations();
  }, [user_id]);

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl drop-shadow-[0_-4px_10px_rgba(0,0,0,0.1)] mx-4 md:mx-20 mt-1 mb-10">
      <div className="flex flex-row justify-between items-center mb-4">
        <h2 className="text-lg md:text-2xl font-bold font-raleway">Your Reservations</h2>
        <div className="flex gap-3 font-roboto">
          <button className="border border-red-600 text-red-600 px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-red-50 transition">
            <RxCross1 className="text-red-600" />
            <span className="hidden md:block">Cancel a Reservation</span>
          </button>
          <button className="bg-[#5D1A0B] text-white px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-[#731f10] transition">
            <FaEdit className="text-white" />
            <span className="hidden md:block">Modify a Request</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto font-roboto">
        {error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden text-sm md:text-base">
            <thead>
              <tr className="bg-[#5D1A0B] text-white text-left">
                <th className="px-2 md:px-4 py-2 w-1/5 rounded-tl-lg">Room Number</th>
                <th className="px-2 md:px-4 py-2 w-1/5">Date</th>
                <th className="px-2 md:px-4 py-2 w-1/5">Time</th>
                <th className="px-2 md:px-4 py-2 w-1/5">Status</th>
                <th className="px-2 md:px-4 py-2 w-1/5 rounded-tr-lg">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {reservations.length > 0 ? (
                reservations.map((reservation, index) => (
                  <tr key={index} className="border-t last:border-b">
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                      {reservation.room_num || '-'}
                    </td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                      {reservation.date || '-'}
                    </td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                      {new Date(`1970-01-01T${reservation.start_time}`).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      }) || '-'}{' '}
                      {'-'}{' '}
                      {new Date(`1970-01-01T${reservation.end_time}`).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      }) || '-'}
                    </td>
                    <td
                      className={`px-3 md:px-5 py-3 ${getStatusClass(reservation.status)} hover:bg-gray-100 font-roboto`}
                    >
                      {reservation.status || '-'}
                    </td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                      {reservation.admin_notes || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center px-3 md:px-5 py-3 text-gray-400">
                    No Reservations Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UpcomingReservations;
