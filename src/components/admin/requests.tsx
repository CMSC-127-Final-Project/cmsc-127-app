import React from 'react';
import { RxCheckCircled, RxCrossCircled, RxTrash } from 'react-icons/rx';
import { PiNoteLight } from 'react-icons/pi';

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

const reservationRequests = () => {
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
              <th className="px-2 md:px-4 py-2 w-1/5">Course</th>
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
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100">{reservation.room}</td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100">{reservation.date}</td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100">{reservation.time}</td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100">{reservation.capacity}</td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100">{reservation.notes || '-'}</td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100">{reservation.date}</td>
                <td className="px-3 md:px-5 py-3 hover:bg-gray-100">{reservation.time}</td>
                <td className="px-0 md:px-0 py-5 flex">
                  <button className="text-green-500 px-2 py-1 rounded-md">
                    <RxCheckCircled size={20} />
                  </button>
                  <button className="text-red-500 px-2 py-1 rounded-md">
                    <RxCrossCircled size={20} />
                  </button>
                  <button className="text-gray-500 px-2 py-1 rounded-md">
                    <RxTrash size={20} />
                  </button>
                  <button className="text-gray-500 px-2 py-1 rounded-md">
                    <PiNoteLight size={20} />
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

export default reservationRequests;
