import React from 'react';
import { RxPlus, RxEyeOpen } from 'react-icons/rx';

const reservations = [
  {
    room: 'Room 227',
    date: 'March 29, 2025',
    time: '8:00 AM - 9:00 AM',
    capacity: '50',
    notes: 'Chairs Broken',
  },
  {
    room: 'Room 203',
    date: 'March 30, 2025',
    time: '8:00 AM - 9:00 AM',
    capacity: '50',
    notes: 'No electricity',
  },
  {
    room: 'Room 201',
    date: 'March 30, 2025',
    time: '8:00 AM - 9:00 AM',
    capacity: '50',
    notes: '',
  },
  {
    room: 'Room 222',
    date: 'April 2, 2025',
    time: '10:00 AM - 12:00 PM',
    capacity: '25',
    notes: '',
  },
  {
    room: 'Food Laboratory',
    date: 'May 8, 2025',
    time: '10:00 AM - 12:00 PM',
    capacity: '25',
    notes: '',
  },
  {
    room: 'Computer Laboratory',
    date: 'July 27, 2025',
    time: '10:00 AM - 12:00 PM',
    capacity: '12',
    notes: '',
  },
  {
    room: 'Room 226',
    date: 'September 28, 2025',
    time: '10:00 AM - 12:00 PM',
    capacity: '123',
    notes: '',
  },
];

const AvailabeRooms = () => {
  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl drop-shadow-[0_-4px_10px_rgba(0,0,0,0.1)] mx-4 md:mx-20 mt-1 mb-10">
      <div className="flex flex-row justify-between items-center mb-4">
        <h2 className="text-lg md:text-2xl font-bold font-raleway">Available Rooms</h2>
        <div className="flex gap-3 font-roboto">
          <button className="border border-red-600 text-red-600 px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-red-50 transition">
            <RxPlus className="text-red-600" size={20} />
            <span className="hidden md:block">Make a Reservation</span>
          </button>
          <button className="bg-[#5D1A0B] text-white px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-[#731f10] transition">
            <RxEyeOpen className="text-white" size={20} />
            <span className="hidden md:block">See Request History</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto font-roboto">
        <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden text-sm md:text-base">
          <thead>
            <tr className="bg-[#5D1A0B] text-white text-left h-14">
              <th className="px-2 md:px-4 py-2 w-1/5 rounded-tl-lg">Room Number</th>
              <th className="px-2 md:px-4 py-2 w-1/5">Date</th>
              <th className="px-2 md:px-4 py-2 w-1/5">Time</th>
              <th className="px-2 md:px-4 py-2 w-1/5">Capacity</th>
              <th className="px-2 md:px-4 py-2 w-1/5 rounded-tr-lg">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {reservations.map((reservation, index) => (
              <tr key={index} className="border-t last:border-b">
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                  {reservation.room}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                  {reservation.date}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                  {reservation.time}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                  {reservation.capacity}
                </td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100 font-roboto">
                  {reservation.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailabeRooms;
