// TO EDIT: input fields are not the same heights

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Room {
  room_number: string;
}

export default function ReservationForm({ user_id }: { user_id: string }) {
  const [allDay, setAllDay] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState({
    roomNum: '',
    date: '',
    startTime: '',
    endTime: '',
    reason: '',
    message: '',
    userId: user_id,
  });
  const { toast } = useToast();

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value.slice(0, 250);
    setFormData(prev => ({ ...prev, message: newMessage }));
  };

  const handleAllDayChange = (checked: boolean) => {
    setAllDay(checked as boolean);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        startTime: '08:00',
        endTime: '17:00',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        startTime: '',
        endTime: '',
      }));
    }
  };

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetch('/api/reservations/rooms', {
          method: 'GET',
        });
        if (!response.ok) throw new Error();

        const data = await response.json();
        const sortedRooms = data.sort((a: Room, b: Room) =>
          a.room_number.localeCompare(b.room_number)
        );
        setRooms(sortedRooms);
      } catch {
        console.error('Could not load rooms.');
      }
    };

    loadRooms();
  }, []);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    try {
      const response = await fetch('/api/reservations/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit reservation');
      }

      toast({
        title: 'Success!',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error!',
        description: 'Something went wrong! Please try again later.',
      });
    }
  }

  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label htmlFor="room-number" className="font-bold">
            Room Number
          </label>
          <Select
            value={formData.roomNum}
            onValueChange={value => setFormData(prev => ({ ...prev, roomNum: value }))}
          >
            <SelectTrigger className="focus:ring-[#6b2323]">
              <SelectValue placeholder="Select a room" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map(room => (
                <SelectItem key={room.room_number} value={room.room_number}>
                  {room.room_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="font-bold">
            Date
          </label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="focus-visible:ring-[#6b2323]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="font-bold">Time</label>
          <div className="flex items-center gap-2">
            <Input
              type="time"
              value={formData.startTime}
              onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              className="focus-visible:ring-[#6b2323]"
              disabled={allDay}
            />
            <span className="px-2">—</span>
            <Input
              type="time"
              value={formData.endTime}
              onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="focus-visible:ring-[#6b2323]"
              disabled={allDay}
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="all-day"
              checked={allDay}
              onCheckedChange={handleAllDayChange}
              className="data-[state=checked]:bg-[#6b2323] data-[state=checked]:border-[#6b2323]"
            />
            <label htmlFor="all-day" className="text-sm cursor-pointer">
              All day
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="reason" className="font-bold">
            Reason
          </label>
          <Select
            value={formData.reason}
            onValueChange={value => setFormData(prev => ({ ...prev, reason: value }))}
          >
            <SelectTrigger className="focus:ring-[#6b2323]">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="class">Class</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="study">Study Group</SelectItem>
              <SelectItem value="other">Other (specify in Message)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="font-medium">
          Message
        </label>
        <div className="relative">
          <Textarea
            id="message"
            rows={8}
            value={formData.message}
            onChange={handleMessageChange}
            className="focus-visible:ring-[#6b2323]"
          />
          <div className="absolute bottom-2 right-2 text-sm text-gray-500">
            {formData.message.length}/250
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-[#6b2323] hover:bg-[#5a1e1e] px-8">
          Submit
        </Button>
      </div>
    </form>
  );
}
