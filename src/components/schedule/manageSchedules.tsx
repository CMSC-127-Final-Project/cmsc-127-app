'use client';

import { useState, useEffect } from 'react';
import { Trash2, CalendarDays, Repeat, Clock } from 'lucide-react';
import { RxClipboard } from 'react-icons/rx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import { RoomSchedules } from '@/utils/types';

export default function RoomReservation() {
  const [availableRooms, setAvailableRooms] = useState<RoomSchedules[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomSchedules[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomSchedules | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [scheduleUpdated, setScheduleUpdated] = useState(false);
  const { toast } = useToast();

  const formatRoomType = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const addSchedule = async (schedule: {
    room_number?: string;
    regular: boolean;
    start_time: string | null;
    end_time: string | null;
    days?: string[];
    date?: string | null;
  }) => {
    try {
      const response = await fetch('/api/schedule/add', {
        method: 'POST',
        body: JSON.stringify(schedule),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to add schedule');

      toast({
        title: 'Success',
        description: 'Schedule added successfully!',
        variant: 'default',
      });
      setShowAddScheduleDialog(false);
      setScheduleUpdated(prev => !prev); // Trigger reload
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to add schedule',
        variant: 'destructive',
      });
    }
  };

  const removeSchedule = async (scheduleId: string) => {
    try {
      const response = await fetch('/api/schedule/remove', {
        method: 'PATCH',
        body: JSON.stringify({ schedule_id: scheduleId }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to remove schedule');

      toast({
        title: 'Success',
        description: 'Schedule removed successfully!',
        variant: 'default',
      });
      setSelectedRoom(prevRoom => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          schedules: prevRoom.schedules.filter(schedule => schedule.timeslot_id !== scheduleId),
        };
      });
      setScheduleUpdated(prev => !prev); // Trigger reload
    } catch (error) {
      console.error('Error removing schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove schedule',
        variant: 'destructive',
      });
    }
  };

  const handleReserveClick = (room: RoomSchedules) => {
    setSelectedRoom(room);
    setShowDialog(true);
  };

  const handleDeleteSchedule = async (scheduleIndex: number) => {
    if (selectedRoom) {
      const scheduleId = selectedRoom.schedules[scheduleIndex]?.timeslot_id;
      if (scheduleId) {
        await removeSchedule(scheduleId);
      }
    }
  };

  const handleAddSchedule = () => {
    setShowAddScheduleDialog(true);
  };

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const response = await fetch(`/api/schedule/rooms`);
        if (!response.ok) {
          throw new Error('Failed to fetch schedules');
        }
        const data = await response.json();
        setAvailableRooms(data);
      } catch (err) {
        console.error('Error loading reservations:', err);
      }
    };
    loadReservations();
  }, [scheduleUpdated]);

  useEffect(() => {
    setFilteredRooms(availableRooms); // Initialize filteredRooms with all availableRooms
  }, [availableRooms]);

  function setRoomNumber(value: string): void {
    const filtered = availableRooms.filter(room =>
      room.room_number.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRooms(filtered);
  }

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-md mx-4 md:mx-20 mt-1 mb-10 font-roboto">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-lg md:text-4xl font-bold font-raleway text-gray-900">
          Schedule Management 📝
        </h2>
        <p className="text-gray-700 text-sm md:text-base">
          View and manage the schedules for each room.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8 items-center">
        <div className="col-span-2"></div>
        <div className="space-y-2">
          <Input
            id="roomNumber"
            type="text"
            placeholder="Search for room..."
            onChange={e => setRoomNumber(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map(room => (
          <div
            key={room.room_number}
            className="border rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out p-4 flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-[#5D1A0B]">{room.room_number}</h4>
              <span className="text-sm bg-[#5D1A0B]/10 text-[#5D1A0B] px-2 py-1 rounded-full">
                {formatRoomType(room.room_type)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium text-gray-700">Schedules:</span>
              {room.schedules.length > 0 ? (
                room.schedules.slice(0, 3).map((schedule, index) => (
                  <span key={index} className="block">
                    {schedule.time_range}
                  </span>
                ))
              ) : (
                <span className="block">&ndash;</span>
              )}
              {room.schedules.length > 3 && <span className="block text-gray-400">...more</span>}
            </p>
            <div className="mt-auto flex justify-end gap-2">
              <Button
                onClick={() => handleReserveClick(room)}
                className="bg-[#5D1A0B] hover:bg-[#731f10] text-white"
              >
                <RxClipboard size={20} className="mr-2" />
                <span className="hidden md:inline">Manage Schedules</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="rounded-xl space-y-4 w-full max-w-3xl">
          <DialogHeader>
            <DialogTitle>Schedules for {selectedRoom?.room_number}</DialogTitle>
            <DialogDescription>Manage the schedules for this room.</DialogDescription>
          </DialogHeader>

          <div className="overflow-x-auto font-roboto max-h-60 overflow-y-auto">
            <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden text-sm md:text-base">
              <thead>
                <tr className="bg-[#5D1A0B] text-white text-left h-12">
                  <th className="px-2 md:px-3 py-2">Recurring</th>
                  <th className="px-2 md:px-3 py-2">Start Time</th>
                  <th className="px-2 md:px-3 py-2">End Time</th>
                  <th className="px-2 md:px-3 py-2">Date/Days</th>
                  <th className="px-2 md:px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {selectedRoom?.schedules?.length ? (
                  selectedRoom?.schedules.map((schedule, index) => (
                    <tr key={index} className="border-t last:border-b">
                      <td className="px-2 md:px-3 py-2 hover:bg-gray-100">
                        {schedule.regular ? 'Yes' : 'No'}
                      </td>
                      <td className="px-2 md:px-3 py-2 hover:bg-gray-100">
                        {schedule.start_time || '-'}
                      </td>
                      <td className="px-2 md:px-3 py-2 hover:bg-gray-100">
                        {schedule.end_time || '-'}
                      </td>
                      <td className="px-2 md:px-3 py-2 hover:bg-gray-100">
                        {Array.isArray(schedule.days)
                          ? schedule.days.join(', ')
                          : schedule.date || '-'}
                      </td>
                      <td className="px-2 md:px-3 py-2">
                        <Trash2
                          className="w-5 h-5 cursor-pointer mx-auto hover:scale-110 transition text-red-500"
                          onClick={() => handleDeleteSchedule(index)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center px-2 md:px-3 py-2 text-gray-400">
                      No Schedules Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <DialogFooter className="mt-4">
            <Button
              onClick={handleAddSchedule}
              className="bg-[#5D1A0B] hover:bg-[#731f10] text-white"
            >
              Add Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddScheduleDialog} onOpenChange={setShowAddScheduleDialog}>
        <DialogContent className="rounded-xl space-y-4 w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Add Schedule</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Label htmlFor="recurring">Recurring</Label>
            <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
          </div>
          {isRecurring ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-gray-600" />
                <Label>Days</Label>
              </div>
              <ToggleGroup type="multiple" className="flex gap-2">
                {['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'].map(day => (
                  <ToggleGroupItem
                    key={day}
                    value={day}
                    className="data-[state=on]:bg-[#5D1A0B] data-[state=on]:text-white"
                  >
                    {day}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <div className="space-y-2">
                <Label>Time Range</Label>
                <div className="flex items-center gap-2">
                  <Clock className="mr-1 h-10 w-10 text-gray-500" />
                  <Input
                    type="time"
                    value={startTime || ''}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full"
                  />
                  <span>-</span>
                  <Clock className="mr-1 h-10 w-10 text-gray-500" />
                  <Input
                    type="time"
                    value={endTime || ''}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-gray-600" />
                <Label>Date</Label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {selectedDate ? selectedDate.toDateString() : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar selected={selectedDate} onChange={setSelectedDate} />
                </PopoverContent>
              </Popover>
              <div className="space-y-2">
                <Label>Time Range</Label>
                <div className="flex items-center gap-2">
                  <Clock className="mr-1 h-10 w-10 text-gray-500" />
                  <Input
                    type="time"
                    value={startTime || ''}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full"
                  />
                  <span>-</span>
                  <Clock className="mr-1 h-10 w-10 text-gray-500" />
                  <Input
                    type="time"
                    value={endTime || ''}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddScheduleDialog(false)}
              className="text-red-900 hover:bg-red-50 hover:text-red-900"
            >
              Close
            </Button>
            <Button
              className="bg-[#5D1A0B] hover:bg-[#731f10] text-white"
              onClick={() => {
                const selectedDays = Array.from(
                  new Set(
                    Array.from(document.querySelectorAll('[data-state="on"]')).map(
                      el => el.textContent
                    )
                  )
                ).filter((day): day is string => day !== null);

                const newSchedule = {
                  room_num: selectedRoom?.room_number,
                  regular: isRecurring,
                  start_time: startTime,
                  end_time: endTime,
                  ...(isRecurring
                    ? { days: selectedDays }
                    : { date: selectedDate ? selectedDate.toLocaleDateString('en-CA') : null }),
                };
                addSchedule(newSchedule);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
