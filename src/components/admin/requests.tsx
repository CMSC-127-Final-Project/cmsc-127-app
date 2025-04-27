'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { RxCheckCircled, RxCrossCircled, RxTrash, RxDotsHorizontal } from 'react-icons/rx';
import { useToast } from '@/hooks/use-toast';
import { Reservation } from '@/utils/types';

const DropdownPortal: React.FC<{
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
}> = ({ children, triggerRef, isOpen }) => {
  const [styles, setStyles] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (triggerRef.current && isOpen) {
      const rect = triggerRef.current.getBoundingClientRect();
      setStyles({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        zIndex: 9999,
      });
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(<div style={styles}>{children}</div>, document.body);
};

const handleReservationAction = async (
  endpoint: string,
  reservation_id: string,
  successMessage: string,
  errorMessage: string,
  toast: (options: { title: string; description: string }) => void
) => {
  try {
    const response = await fetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ reservation_id }),
    });

    if (!response.ok) throw new Error(errorMessage);

    toast({ title: 'Success', description: successMessage });
  } catch (error) {
    console.error(error);
    toast({ title: 'Error', description: errorMessage });
  }
};

const ReservationRequests = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLButtonElement | null>>({});
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
        const response = await fetch('/api/reservations/reserve', { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch reservations');
        const data = await response.json();
        setReservations(data.length > 0 ? data : []);
      } catch (error) {
        console.error('Error loading reservations:', error);
      }
    };

    loadReservations();
  }, []);

  useEffect(() => {
    const storedToast = localStorage.getItem('reservation-toast');
    if (storedToast) {
      const { title, description } = JSON.parse(storedToast);
      toast({ title, description });
      localStorage.removeItem('reservation-toast');
    }
  }, [toast]);

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl drop-shadow-[0_-4px_10px_rgba(0,0,0,0.1)] mx-4 md:mx-20 mt-1 mb-10">
      <div className="flex flex-row justify-between items-center mb-4">
        <h2 className="text-lg md:text-2xl font-bold font-raleway">Reservation Requests</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden text-sm md:text-base">
          <thead>
            <tr className="bg-[#5D1A0B] text-white">
              <th className="px-2 md:px-4 py-2 w-[20%] min-w-[150px] rounded-tl-lg">Created at</th>
              <th className="px-2 md:px-4 py-2 w-[10%] min-w-[70px]">Requested by</th>
              <th className="px-2 md:px-4 py-2 w-[12%] min-w-[80px]">
                Room
                <br />
                Number
              </th>
              <th className="px-2 md:px-4 py-2 w-[15%] min-w-[110px]">Date</th>
              <th className="px-2 md:px-4 py-2 w-[12%] min-w-[90px]">Start Time</th>
              <th className="px-2 md:px-4 py-2 w-[12%] min-w-[90px]">End Time</th>
              <th className="px-2 md:px-4 py-2 w-[10%] min-w-[80px] rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white text-center">
            {reservations.length > 0 ? (
              reservations.map(reservation => {
                const ref = (el: HTMLButtonElement | null) => {
                  dropdownRefs.current[reservation.reservation_id] = el;
                };
                return (
                  <tr key={reservation.reservation_id} className="border-t last:border-b">
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                      {new Date(reservation.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 text-center font-roboto">
                      {reservation.name || 'N/A'}
                    </td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                      {reservation.room_num}
                    </td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                      {reservation.date}
                    </td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                      {reservation.start_time}
                    </td>
                    <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                      {reservation.end_time}
                    </td>
                    <td className="px-0 md:px-0 py-5 relative text-center">
                      <button
                        ref={ref}
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
                      <DropdownPortal
                        isOpen={openDropdownId === reservation.reservation_id}
                        triggerRef={{
                          current:
                            dropdownRefs.current[reservation.reservation_id] ?? document.body,
                        }}
                      >
                        <div className="py-2 bg-white rounded-md shadow-xl border border-gray-200 w-40">
                          <button
                            className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={async e => {
                              e.stopPropagation();
                              await handleReservationAction(
                                '/api/reservations/accept',
                                reservation.reservation_id,
                                'Accepted the reservation!',
                                'Failed to accept reservation',
                                toast
                              );
                              setOpenDropdownId(null);
                              localStorage.setItem(
                                'reservation-toast',
                                JSON.stringify({
                                  title: 'Success',
                                  description: 'Accepted the reservation!',
                                })
                              );
                              window.location.reload();
                            }}
                          >
                            <RxCheckCircled size={18} className="mr-2 text-green-500" />
                            Accept
                          </button>
                          <button
                            className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={async e => {
                              e.stopPropagation();
                              await handleReservationAction(
                                '/api/reservations/reject',
                                reservation.reservation_id,
                                'Rejected the reservation!',
                                'Failed to reject reservation',
                                toast
                              );
                              setOpenDropdownId(null);
                              localStorage.setItem(
                                'reservation-toast',
                                JSON.stringify({
                                  title: 'Success',
                                  description: 'Rejected the reservation!',
                                })
                              );
                              window.location.reload();
                            }}
                          >
                            <RxCrossCircled size={18} className="mr-2 text-red-500" />
                            Reject
                          </button>
                          <button
                            className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={async e => {
                              e.stopPropagation();
                              await handleReservationAction(
                                '/api/reservations/remove',
                                reservation.reservation_id,
                                'Removed the reservation!',
                                'Failed to remove reservation',
                                toast
                              );
                              setReservations(prev =>
                                prev.filter(r => r.reservation_id !== reservation.reservation_id)
                              );
                              setOpenDropdownId(null);
                            }}
                          >
                            <RxTrash size={18} className="mr-2 text-gray-500" />
                            Remove
                          </button>
                        </div>
                      </DropdownPortal>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center px-3 md:px-5 py-3 text-gray-400">
                  No Reservations Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationRequests;
