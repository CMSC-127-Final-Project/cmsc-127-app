'use client';

import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, Search, CalendarIcon, Clock, Trash2, Plus, X, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Room {
  room_number: string;
  room_type: string;
  schedules: {
    timeslot_id: string;
    regular: boolean;
    start_time: string;
    end_time: string;
    time_range: string;
    days?: string;
    date?: string;
  }[];
}

export default function RoomReservation() {
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [scheduleUpdated, setScheduleUpdated] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [uniqueRoomTypes, setUniqueRoomTypes] = useState<string[]>([]);
  const { toast } = useToast();

  const formatRoomType = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getRoomTypeColor = (type: string): { bg: string; text: string; border: string } => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('laboratory') || lowerType.includes('lab')) {
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    } else if (lowerType.includes('lecture') || lowerType.includes('classroom')) {
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    } else if (lowerType.includes('office') || lowerType.includes('admin')) {
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    } else if (lowerType.includes('conference') || lowerType.includes('meeting')) {
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    } else {
      return { bg: 'bg-[#5D1A0B]/10', text: 'text-[#5D1A0B]', border: 'border-[#5D1A0B]/20' };
    }
  };

  const addSchedule = async (schedule: {
    room_num?: string;
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
      resetForm();
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to add schedule',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setStartTime(null);
    setEndTime(null);
    setSelectedDate(null);
    setSelectedDays([]);
    setIsRecurring(false);
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

  const handleReserveClick = (room: Room) => {
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

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));
  };

  const handleRoomTypeToggle = (type: string) => {
    setSelectedRoomTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedRoomTypes([]);
    setSearchQuery('');
    setFilteredRooms(availableRooms);
  };

  // Apply filters whenever search query or selected room types change
  useEffect(() => {
    let filtered = availableRooms;

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(room =>
        room.room_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply room type filter
    if (selectedRoomTypes.length > 0) {
      filtered = filtered.filter(room => selectedRoomTypes.includes(room.room_type));
    }

    setFilteredRooms(filtered);
  }, [searchQuery, selectedRoomTypes, availableRooms]);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const response = await fetch(`/api/schedule/rooms`);
        if (!response.ok) {
          throw new Error('Failed to fetch schedules');
        }
        const data: Room[] = await response.json();
        setAvailableRooms(data);

        const types = Array.from(new Set(data.map(room => room.room_type)));
        setUniqueRoomTypes(types);
      } catch (err) {
        console.error('Error loading reservations:', err);
      }
    };
    loadReservations();
  }, [scheduleUpdated]);

  return (
    <div className="bg-white p-4 sm:p-6 md:p-10 rounded-3xl shadow-lg mx-2 sm:mx-4 md:mx-auto max-w-7xl mb-4 font-roboto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold font-raleway text-black">
          Room Schedule Management
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="relative flex-grow w-full sm:max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            id="roomNumber"
            type="text"
            placeholder="Search for room..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border-[#5D1A0B]/20 focus:border-[#5D1A0B] focus:ring-[#5D1A0B] rounded-full w-full text-black"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-[#5D1A0B]/20 w-full sm:w-auto"
              >
                <Filter size={16} />
                <span className="whitespace-nowrap">Room Type</span>
                {selectedRoomTypes.length > 0 && (
                  <Badge className="ml-1 bg-[#5D1A0B] text-white">{selectedRoomTypes.length}</Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-raleway text-black">
                Filter by Room Type
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {uniqueRoomTypes.map(type => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedRoomTypes.includes(type)}
                  onCheckedChange={() => handleRoomTypeToggle(type)}
                  className="capitalize text-black"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getRoomTypeColor(type).bg} ${getRoomTypeColor(type).border}`}
                    ></div>
                    {formatRoomType(type)}
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
              {uniqueRoomTypes.length === 0 && (
                <div className="px-2 py-1 text-sm text-gray-500">No room types available</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {(selectedRoomTypes.length > 0 || searchQuery) && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-[#5D1A0B] hover:text-[#731f10] hover:bg-[#5D1A0B]/5 w-full sm:w-auto"
            >
              <X size={16} className="mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {selectedRoomTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedRoomTypes.map(type => (
            <Badge
              key={type}
              variant="outline"
              className={`${getRoomTypeColor(type).bg} ${getRoomTypeColor(type).text} ${
                getRoomTypeColor(type).border
              } flex items-center gap-1 text-xs sm:text-sm`}
            >
              {formatRoomType(type)}
              <X
                size={14}
                className="cursor-pointer ml-1"
                onClick={() => handleRoomTypeToggle(type)}
              />
            </Badge>
          ))}
        </div>
      )}

      {filteredRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-gray-500 bg-gray-50 rounded-xl">
          <Search size={36} className="mb-3 text-gray-400" />
          <p className="text-base sm:text-lg text-center px-4">
            No rooms found matching your search criteria
          </p>
          <Button variant="link" onClick={clearFilters} className="mt-2 text-[#5D1A0B]">
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredRooms.map(room => (
            <Card
              key={room.room_number}
              className="overflow-hidden border border-[#5D1A0B]/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
            >
              <CardHeader className="bg-[#5D1A0B]/5 pb-2 px-4 py-3 sm:px-6">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <CardTitle className="text-lg sm:text-xl font-semibold font-raleway text-[#5D1A0B]">
                    {room.room_number}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`${getRoomTypeColor(room.room_type).bg} ${getRoomTypeColor(room.room_type).text} ${
                      getRoomTypeColor(room.room_type).border
                    } text-xs sm:text-sm`}
                  >
                    {formatRoomType(room.room_type)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-3 px-4 sm:px-6">
                <h4 className="text-sm font-medium font-raleway text-gray-700 mb-2 flex items-center">
                  <Clock size={16} className="mr-2 text-[#5D1A0B]/70" />
                  Scheduled Times
                </h4>
                <div className="space-y-1 min-h-[80px] max-h-[120px] overflow-y-auto pr-1">
                  {room.schedules.length > 0 ? (
                    room.schedules.map((schedule, index) => (
                      <div
                        key={index}
                        className="text-xs sm:text-sm py-1 px-2 rounded bg-[#5D1A0B]/5 flex justify-between"
                      >
                        <span className="truncate mr-2">{schedule.time_range}</span>
                        <span className="text-[#5D1A0B]/70 text-xs whitespace-nowrap">
                          {schedule.regular ? 'Recurring' : 'One-time'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-400 italic">
                      No schedules available
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-3 sm:pb-4 px-4 sm:px-6 flex justify-end">
                <Button
                  onClick={() => handleReserveClick(room)}
                  className="bg-[#5D1A0B] hover:bg-[#731f10] text-white transition-colors duration-200 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <ClipboardList size={16} className="mr-2" />
                  <span>Manage Schedules</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="rounded-xl w-[95vw] max-w-3xl p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl sm:text-2xl text-[#5D1A0B] font-raleway flex items-center">
              <ClipboardList size={20} className="mr-2" />
              Room {selectedRoom?.room_number} Schedules
            </DialogTitle>
            <DialogDescription className="text-sm">
              View and manage all schedules for this room
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-2" />

          <div className="overflow-x-auto font-roboto max-h-[60vh] sm:max-h-[350px] overflow-y-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#5D1A0B] text-white text-left">
                  <th className="px-2 sm:px-4 py-2 sm:py-3 font-medium">Type</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 font-medium">Start</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 font-medium">End</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 font-medium">Date/Days</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {selectedRoom?.schedules?.length ? (
                  selectedRoom?.schedules.map((schedule, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <Badge
                          variant={schedule.regular ? 'outline' : 'secondary'}
                          className={`text-xs ${
                            schedule.regular
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {schedule.regular ? 'Recurring' : 'One-time'}
                        </Badge>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">{schedule.start_time || '-'}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">{schedule.end_time || '-'}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 truncate max-w-[120px] sm:max-w-none">
                        {Array.isArray(schedule.days)
                          ? schedule.days.join(', ')
                          : schedule.date || '-'}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSchedule(index)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash2 size={16} />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center px-4 py-8 text-gray-400">
                      No schedules found for this room
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-gray-300 w-full sm:w-auto"
            >
              <X size={16} className="mr-2" />
              Close
            </Button>
            <Button
              onClick={handleAddSchedule}
              className="bg-[#5D1A0B] hover:bg-[#731f10] text-white w-full sm:w-auto"
            >
              <Plus size={16} className="mr-2" />
              Add Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddScheduleDialog} onOpenChange={setShowAddScheduleDialog}>
        <DialogContent className="rounded-xl max-w-md p-4 sm:p-6 w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl text-[#5D1A0B] font-raleway">
              Add New Schedule
            </DialogTitle>
            <DialogDescription className="text-sm">
              Create a new schedule for Room {selectedRoom?.room_number}
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-2" />

          <div className="space-y-4 sm:space-y-5 py-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="recurring" className="text-sm sm:text-base font-medium">
                  Schedule Type
                </Label>
                <Badge
                  variant={isRecurring ? 'outline' : 'secondary'}
                  className={`text-xs ${
                    isRecurring
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {isRecurring ? 'Recurring' : 'One-time'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                  className="data-[state=checked]:bg-[#5D1A0B]"
                />
              </div>
            </div>

            {isRecurring ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'].map(day => (
                      <Button
                        key={day}
                        type="button"
                        variant={selectedDays.includes(day) ? 'default' : 'outline'}
                        onClick={() => handleDayToggle(day)}
                        className={`h-8 sm:h-9 w-8 sm:w-9 p-0 text-xs sm:text-sm ${
                          selectedDays.includes(day)
                            ? 'bg-[#5D1A0B] text-white hover:bg-[#731f10]'
                            : 'border-gray-300 hover:bg-[#5D1A0B]/10'
                        }`}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left border-black font-normal text-sm ${
                        !selectedDate ? 'text-gray-400' : 'text-black'
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar selected={selectedDate} onChange={setSelectedDate} />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium">Time Range</Label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Start Time</Label>
                  <Input
                    type="time"
                    value={startTime || ''}
                    onChange={e => setStartTime(e.target.value)}
                    className="border-gray-300 text-black text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">End Time</Label>
                  <Input
                    type="time"
                    value={endTime || ''}
                    onChange={e => setEndTime(e.target.value)}
                    className="border-gray-300 text-black text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddScheduleDialog(false);
                resetForm();
              }}
              className="border-gray-300 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              className="bg-[#5D1A0B] hover:bg-[#731f10] text-white w-full sm:w-auto"
              onClick={() => {
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
              disabled={
                !startTime || !endTime || (isRecurring ? selectedDays.length === 0 : !selectedDate)
              }
            >
              Save Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
