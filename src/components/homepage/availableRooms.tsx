'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Search, List } from 'lucide-react';
import { RxPlus } from 'react-icons/rx';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
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
import { useToast } from '@/hooks/use-toast'; // Import toast hook
import { Room } from '@/utils/types'; // Import the Room type

export default function RoomReservation() {
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [reason, setReason] = useState('');
  const { toast } = useToast(); // Initialize toast
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    if (!date) {
      setIsLoading(false);
      setShowEmptyState(true);
      setHasSearched(true);
      return;
    }

    if (startTime && endTime && startTime >= endTime) {
      toast({
        title: 'Error',
        description: 'Start time must be earlier than end time.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/rooms/available/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: date.toLocaleDateString('en-CA') }),
      });

      if (!response.ok) throw new Error('Failed to fetch available rooms');

      const data = await response.json();

      const mappedData = data.map(
        (room: {
          id: string;
          room_number: string;
          capacity: number;
          notes?: string;
          freeSlots: { start: string; end: string }[];
        }) => ({
          ...room,
          number: room.room_number,
        })
      );

      const filteredRooms =
        startTime && endTime
          ? mappedData.filter((room: Room) =>
              room.freeSlots.some(
                (slot: { start: string; end: string }) =>
                  startTime >= slot.start && endTime <= slot.end
              )
            )
          : mappedData;

      setAvailableRooms(filteredRooms);
      setHasSearched(true);
      setShowEmptyState(filteredRooms.length === 0);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch available rooms. Please try again later.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleReserveClick = (room: Room) => {
    setSelectedRoom(room);
    setShowDialog(true);
  };

  const confirmReservation = async () => {
    setIsLoading(true);
    if (!selectedRoom || !date || !reason.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const reservationStart = selectedSlot ? selectedSlot.start : startTime;
    const reservationEnd = selectedSlot ? selectedSlot.end : endTime;
    console.log('Reservation Start:', reservationStart);
    console.log('Reservation End:', reservationEnd);

    if (!reservationStart || !reservationEnd) {
      toast({
        title: 'Error',
        description: 'Please select or specify a valid time range.',
        variant: 'destructive',
      });
      return;
    }

    // Validate custom time against available slots
    if (!selectedSlot) {
      const isValid = selectedRoom.freeSlots.some(
        slot =>
          reservationStart >= slot.start &&
          reservationEnd <= slot.end &&
          reservationStart < reservationEnd
      );

      if (!isValid) {
        toast({
          title: 'Error',
          description: 'Specified time does not fit within available slots.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/reservations/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_number: selectedRoom.number,
          date: format(date, 'yyyy-MM-dd'),
          start_time: reservationStart,
          end_time: reservationEnd,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reserve room');
      }

      toast({
        title: 'Success',
        description: `Room ${selectedRoom.number} reserved successfully!`,
        variant: 'default',
      });

      setShowDialog(false);
      setSelectedRoom(null);
      setReason('');
      setSelectedSlot(null);
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error('Error reserving room:', error);
      toast({
        title: 'Error',
        description: 'Failed to reserve room. Please try again later.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-md mx-4 md:mx-20 mt-1 mb-10 font-roboto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-lg md:text-2xl font-bold font-raleway text-gray-900">
          Find Available Rooms
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
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
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" side="bottom" align="start">
              <Calendar selected={date} onChange={setDate} />
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
              onChange={e => setStartTime(`${e.target.value}:00`)}
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
        <Button
          onClick={handleSearch}
          className="bg-[#5D1A0B] hover:bg-[#731f10] text-white"
          disabled={isLoading}
        >
          <Search className="mr-2" size={20} />
          <span className="hidden md:inline">Search</span>
        </Button>
      </div>

      {hasSearched && showEmptyState && (
        <div className="flex flex-col items-center justify-center text-center mt-16 text-gray-500">
          <List className="w-12 h-12 mb-4" />
          <p className="font-medium text-base text-gray-700">No rooms searched yet</p>
          <p className="text-sm mt-1">
            Select a date and time range, then click Search Rooms to find available rooms.
          </p>
        </div>
      )}

      {hasSearched && !showEmptyState && (
        <>
          <h3 className="text-xl font-semibold font-raleway mb-4 mt-10">Available Rooms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRooms
              .filter(room => room.freeSlots.length > 0) // Exclude rooms with no available slots
              .map((room, roomIndex) => (
                <div
                  key={room.id || roomIndex}
                  className="border rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out p-4 flex flex-col h-full"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-[#5D1A0B]">{room.number}</h4>
                    <span className="text-sm bg-[#5D1A0B]/10 text-[#5D1A0B] px-2 py-1 rounded-full">
                      Capacity: {room.capacity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-medium text-gray-700">Available Slots:</span>
                    {room.freeSlots.slice(0, 3).map((slot, slotIndex) => (
                      <span key={`${room.id || roomIndex}-${slotIndex}`} className="block">
                        {new Date(`1970-01-01T${slot.start}`).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}{' '}
                        -{' '}
                        {new Date(`1970-01-01T${slot.end}`).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    ))}
                    {room.freeSlots.length > 3 && (
                      <span className="text-gray-400">
                        +{room.freeSlots.length - 3} more slots available
                      </span>
                    )}
                  </p>
                  <div className="mt-auto flex justify-end">
                    <Button
                      onClick={() => handleReserveClick(room)}
                      className="bg-[#5D1A0B] hover:bg-[#731f10] text-white"
                    >
                      <RxPlus size={20} className="mr-2" />
                      <span className="hidden md:inline">Reserve Room</span>
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="rounded-xl space-y-2 w-full max-w-[95%] sm:max-w-md p-4 sm:p-6 text-sm sm:text-base">
          <DialogHeader>
            <DialogTitle>Reserve {selectedRoom?.number}</DialogTitle>
            <DialogDescription>
              Please confirm the details below and provide a reason for the reservation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p>
              <strong>Date:</strong> {date ? format(date, 'MMMM d, yyyy') : '&ndash;'}
            </p>
            <div>
              <Label>Select a Time Slot</Label>
              <div className="flex flex-col gap-2 mt-2">
                {selectedRoom?.freeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={selectedSlot === slot ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setStartTime('');
                      setEndTime('');
                    }}
                  >
                    {new Date(`1970-01-01T${slot.start}`).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}{' '}
                    -{' '}
                    {new Date(`1970-01-01T${slot.end}`).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-time">Or Specify a Custom Time</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="custom-start-time"
                  type="time"
                  value={startTime}
                  onChange={e => {
                    const timeValue = `${e.target.value}:00`;
                    setStartTime(timeValue);
                    setSelectedSlot(null);
                  }}
                  className="w-full"
                />
                <span>-</span>
                <Input
                  id="custom-end-time"
                  type="time"
                  value={endTime}
                  onChange={e => {
                    setEndTime(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="w-full"
                />
              </div>
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
          </div>

          <DialogFooter className="mt-4 flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="text-red-900 hover:bg-red-50 hover:text-red-900"
            >
              Cancel
            </Button>
            <Button onClick={confirmReservation} disabled={isLoading}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
