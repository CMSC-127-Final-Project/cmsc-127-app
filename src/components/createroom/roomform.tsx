'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export function RoomForm() {
  const { toast } = useToast();
  const [room_number, setRoomName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [room_type, setRoomType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!room_number || !capacity || !room_type) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const newRoom = {
      room_number: room_number,
      capacity: Number.parseInt(capacity),
      room_type: room_type,
    };

    try {
      const response = await fetch('/api/reservations/createRoom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoom),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      toast({
        title: 'Success',
        description: 'Room added successfully',
      });

      setRoomName('');
      setCapacity('');
      setRoomType('');
      window.dispatchEvent(new Event('roomsUpdated'));
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
    
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md w-full font-roboto">
      <div className="mb-6">
        <h2 className="text-lg md:text-2xl font-bold font-raleway text-gray-900">Add New Room</h2>
        <p className="text-sm text-gray-600 font-raleway">Enter the details for a new room</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 font-roboto">
        <div className="space-y-2">
          <Label htmlFor="room-name" className="font-roboto">
            Room Number
          </Label>
          <Input
            id="room-name"
            placeholder="e.g. Room 201"
            value={room_number}
            onChange={e => setRoomName(e.target.value)}
            className="font-roboto"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity" className="font-roboto">
            Capacity
          </Label>
          <Input
            id="capacity"
            type="number"
            placeholder="e.g. 30"
            min="1"
            value={capacity}
            onChange={e => setCapacity(e.target.value)}
            className="font-roboto"
          />
        </div>

        <div className="space-y-2 font-roboto">
          <Label htmlFor="room-type" className="font-roboto">
            Room Type
          </Label>
          <Select value={room_type} onValueChange={setRoomType}>
            <SelectTrigger id="room-type">
              <SelectValue placeholder="Select room type" className="font-roboto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classroom" className="font-roboto">
                Classroom
              </SelectItem>
              <SelectItem value="laboratory" className="font-roboto">
                Laboratory
              </SelectItem>
              <SelectItem value="conference-room" className="font-roboto">
                Conference Room
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5D1A0B] hover:bg-[#731f10] text-white rounded-2xl font-raleway"
        >
          {loading ? 'Adding...' : 'Add Room'}
        </Button>
      </form>
    </div>
  );
}
