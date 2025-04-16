'use client';

import { useState } from 'react';
import { Calendar, Clock, Search, List } from 'lucide-react';
import { RxPlus } from 'react-icons/rx';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Room {
  id: string;
  number: string;
  capacity: number;
  notes?: string;
}

export default function RoomReservation() {
  const [date, setDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [availableRooms] = useState<Room[]>([
    { id: '1', number: 'Room 227', capacity: 50, notes: 'Chairs Broken' },
    { id: '2', number: 'Room 203', capacity: 25, notes: 'No electricity' },
    { id: '3', number: 'Room 201', capacity: 20 },
    { id: '4', number: 'Room 222', capacity: 30 },
    { id: '5', number: 'Food Laboratory', capacity: 30 },
    { id: '6', number: 'Computer Laboratory', capacity: 10 },
    { id: '7', number: 'Room 226', capacity: 24 },
  ]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleSearch = () => {
    const isInputComplete = date && startTime && endTime;
    setHasSearched(true);
    setShowEmptyState(!isInputComplete);
  };

  const handleReserveClick = (room: Room) => {
    setSelectedRoom(room);
    setShowDialog(true);
  };

  const [reason, setReason] = useState('');

  const confirmReservation = () => {
    if (selectedRoom && date && startTime && endTime && reason.trim()) {
      console.log('Reservation Info:', {
        room: selectedRoom.number,
        date: format(date, 'yyyy-MM-dd'),
        startTime,
        endTime,
        reason,
      });
      alert(`Room ${selectedRoom.number} reserved for: ${reason}`);
      // Reset fields
      setShowDialog(false);
      setSelectedRoom(null);
      setReason('');
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl drop-shadow-[0_-4px_10px_rgba(0,0,0,0.1)] mx-4 md:mx-20 mt-1 mb-10 font-roboto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-lg md:text-2xl font-bold font-raleway text-gray-900">
          Find Available Rooms
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8 font-roboto">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-gray-500" />
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time">End Time</Label>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-gray-500" />
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSearch}
          className="bg-[#5D1A0B] text-white px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-[#731f10] transition"
        >
          <Search className="text-white" size={20} />
          <span className="hidden md:block">Search</span>
        </button>
      </div>

      {hasSearched && showEmptyState && (
        <div className="flex flex-col items-center justify-center text-center mt-16 text-gray-500">
          <List className="w-12 h-12 mb-4" />
          <p className="font-medium text-base text-gray-700">No rooms searched yet</p>
          <p className="text-sm mt-1">
            Select a date and time range, then click &quot;Search Rooms&quot; to find available
            rooms.
          </p>
        </div>
      )}

      {hasSearched && !showEmptyState && (
        <>
          <h3 className="text-xl font-semibold font-raleway mb-4 mt-10">Available Rooms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-roboto">
            {availableRooms.map(room => (
              <div
                key={room.id}
                className="border rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-[#5D1A0B]">{room.number}</h4>
                  <span className="text-sm bg-[#5D1A0B]/10 text-[#5D1A0B] px-2 py-1 rounded-full">
                    Capacity: {room.capacity}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-medium text-gray-700">Date:</span>{' '}
                  {date ? format(date, 'MMMM d, yyyy') : '-'}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium text-gray-700">Time:</span> {startTime} - {endTime}
                </p>
                {room.notes && (
                  <p className="text-sm text-amber-700 mt-1">
                    <span className="font-medium">Notes:</span> {room.notes}
                  </p>
                )}
                <div className="mt-4 justify-end flex gap-2">
                  <button
                    onClick={() => handleReserveClick(room)}
                    className="bg-[#5D1A0B] text-white px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-[#731f10] transition"
                  >
                    <RxPlus className="text-white" size={20} />
                    <span className="hidden md:block">Reserve Room</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Dialog Pop-up */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="rounded-xl space-y-2">
          <DialogHeader>
            <DialogTitle>Reserve {selectedRoom?.number}</DialogTitle>
            <DialogDescription>
              Please confirm the details below and provide a reason for the reservation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p>
              <strong>Date:</strong> {date ? format(date, 'MMMM d, yyyy') : '-'}
            </p>
            <p>
              <strong>Time:</strong> {startTime} – {endTime}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Reservation:</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Enter reason..."
              className="h-32"
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="text-red-900 hover:bg-red-50 hover:text-red-900"
            >
              Cancel
            </Button>
            <Button onClick={confirmReservation}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
