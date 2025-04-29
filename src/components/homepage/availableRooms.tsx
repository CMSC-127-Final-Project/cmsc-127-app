'use client';

import { useState } from 'react';
import { CalendarIcon, Clock, Search, List } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface APIRoom {
  id: string;
  room_number: string;
  capacity: number;
  notes?: string;
  freeSlots: { start: string; end: string }[];
}

interface Room {
  id: string;
  number: string;
  capacity: number;
  notes?: string;
  freeSlots: { start: string; end: string }[];
}

export default function RoomReservation() {
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [searchStartTime, setSearchStartTime] = useState('');
  const [searchEndTime, setSearchEndTime] = useState('');
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);

  const handleSearch = async () => {
    if (!date) {
      setHasSearched(true);
      setShowEmptyState(true);
      setIsLoading(false);
      return;
    }

    if (searchStartTime && searchEndTime && searchStartTime >= searchEndTime) {
      toast({
        title: 'Error',
        description: 'Start time must be earlier than end time.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true); // <-- ONLY set loading after validations are successful

    try {
      const response = await fetch('/api/rooms/available/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: date.toLocaleDateString('en-CA') }),
      });

      if (!response.ok) throw new Error('Failed to fetch available rooms');

      const data = await response.json();

      const mappedData = (data as APIRoom[]).map(room => ({
        id: room.id,
        number: room.room_number,
        capacity: room.capacity,
        notes: room.notes,
        freeSlots: room.freeSlots,
      }));
      const filteredRooms =
        searchStartTime && searchEndTime
          ? mappedData.filter((room: Room) =>
              room.freeSlots.some(
                (slot: { start: string; end: string }) =>
                  searchStartTime >= slot.start && searchEndTime <= slot.end
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
    } finally {
      setIsLoading(false); // Always stop loading, success or error
    }
  };

  const handleReserveClick = (room: Room) => {
    setSelectedRoom(room);
    setShowDialog(true);
  };

  const confirmReservation = async () => {
    setIsLoading(true);

    try {
      if (!selectedRoom || !date || !reason.trim()) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }

      const reservationStart = selectedSlot ? selectedSlot.start : startTime;
      const reservationEnd = selectedSlot ? selectedSlot.end : endTime;

      if (!reservationStart || !reservationEnd) {
        toast({
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
            description: 'Specified time does not fit within available slots.',
            variant: 'destructive',
          });
          return;
        }
      }

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
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeSlot = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl drop-shadow-[0_-4px_10px_rgba(0,0,0,0.1)] mx-4 md:mx-20 mt-1 mb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl md:text-2xl font-bold font-raleway text-black">
          Find Available Rooms
        </h2>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mb-6 sm:mb-8">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal border-black',
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
              value={searchStartTime}
              onChange={e => setSearchStartTime(`${e.target.value}:00`)}
              className="flex-1 text-black border-black"
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
              value={searchEndTime}
              onChange={e => setSearchEndTime(e.target.value)}
              className="flex-1 text-black border-black"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-8">
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-[#5D1A0B] hover:bg-[#731f10] text-white"
        >
          {isLoading ? (
            'Searching...'
          ) : (
            <>
              <Search className="mr-2" size={18} />
              <span className="hidden sm:inline">Search</span>
            </>
          )}
        </Button>
      </div>

      {hasSearched && showEmptyState && (
        <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-gray-500 bg-gray-50 rounded-xl">
          <List className="w-10 h-10 mb-3 text-gray-400" />
          <p className="text-base sm:text-lg text-center px-4">
            No rooms found matching your search criteria
          </p>
          <p className="text-sm mt-1 text-center px-4">
            Try adjusting your search parameters or select a different date.
          </p>
        </div>
      )}

      {hasSearched && !showEmptyState && (
        <>
          <h3 className="text-lg sm:text-xl font-semibold font-raleway mb-4 mt-6 text-black">
            Available Rooms
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {availableRooms
              .filter(room => room.freeSlots.length > 0) // Exclude rooms with no available slots
              .map((room, roomIndex) => (
                <Card
                  key={room.id || roomIndex}
                  className="overflow-hidden border border-[#5D1A0B]/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
                >
                  <CardHeader className="bg-[#5D1A0B]/5 pb-2 px-4 py-3 sm:px-6">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg sm:text-xl font-semibold font-raleway text-[#5D1A0B]">
                        {room.number}
                      </CardTitle>
                      <Badge className="bg-[#5D1A0B]/10 text-[#5D1A0B] border-[#5D1A0B]/20 text-xs sm:text-sm">
                        Capacity: {room.capacity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 px-4 sm:px-6">
                    <h4 className="text-sm font-medium font-raleway text-gray-700 mb-2 flex items-center">
                      <Clock size={16} className="mr-2 text-[#5D1A0B]/70" />
                      Available Slots
                    </h4>
                    <div className="space-y-1 min-h-[80px] max-h-[120px] overflow-y-auto pr-1">
                      {room.freeSlots.map((slot, slotIndex) => (
                        <div
                          key={`${room.id || roomIndex}-${slotIndex}`}
                          className="text-xs sm:text-sm py-1 px-2 rounded bg-[#5D1A0B]/5 flex justify-between"
                        >
                          <span className="truncate mr-2">
                            {formatTimeSlot(slot.start)} - {formatTimeSlot(slot.end)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 pb-3 sm:pb-4 px-4 sm:px-6 flex justify-end">
                    <Button
                      onClick={() => handleReserveClick(room)}
                      className="bg-[#5D1A0B] hover:bg-[#731f10] text-white transition-colors duration-200 text-xs sm:text-sm w-full sm:w-auto"
                    >
                      <Clock size={16} className="mr-2" />
                      <span>Reserve Room</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="rounded-xl w-[95vw] max-w-md p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl text-[#5D1A0B] font-raleway">
              Reserve {selectedRoom?.number}
            </DialogTitle>
            <DialogDescription className="text-sm">
              Please confirm the details below and provide a reason for the reservation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-sm">
              <strong>Date:</strong> {date ? format(date, 'MMMM d, yyyy') : '–'}
            </p>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select a Time Slot</Label>
              <div className="flex flex-col gap-2 mt-1">
                {selectedRoom?.freeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={selectedSlot === slot ? 'default' : 'outline'}
                    onClick={() => {
                      if (selectedSlot === slot) {
                        setSelectedSlot(null); // Deselect if already selected
                      } else {
                        setSelectedSlot(slot);
                        setStartTime(''); // Clear custom start time when slot is selected
                        setEndTime(''); // Clear custom end time when slot is selected
                      }
                    }}
                    className={`text-xs sm:text-sm border-black ${
                      selectedSlot === slot ? 'bg-[#5D1A0B] hover:bg-[#731f10]' : ''
                    }`}
                  >
                    {formatTimeSlot(slot.start)} - {formatTimeSlot(slot.end)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-time" className="text-sm font-medium">
                Or Specify a Custom Time
              </Label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <Label className="text-xs sm:text-sm" htmlFor="start-time">
                    Start Time
                  </Label>
                  <Input
                    type="time"
                    id="start-time"
                    value={startTime}
                    onChange={e => setStartTime(`${e.target.value}:00`)}
                    disabled={!!selectedSlot}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs sm:text-sm" htmlFor="end-time">
                    End Time
                  </Label>
                  <Input
                    type="time"
                    id="end-time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    disabled={!!selectedSlot}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium" htmlFor="reason">
                Reason
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="mt-2 text-sm sm:text-base"
                placeholder="Enter reason for reservation"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              disabled={isLoading}
              onClick={confirmReservation}
              className="bg-[#5D1A0B] hover:bg-[#731f10] text-white"
            >
              {isLoading ? 'Reserving...' : 'Confirm Reservation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
