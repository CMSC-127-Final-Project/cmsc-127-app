import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { date } = await req.json();
  const supabase = await createClient();

  try {
    // Fetch all rooms
    const { data: rooms, error: roomError } = await supabase
      .from('Room')
      .select('room_number, room_type, capacity');
    if (roomError) throw new Error('Error fetching rooms');

    // Fetch schedules for the given date
    const { data: schedules, error: scheduleError } = await supabase
      .from('Scheduled Time')
      .select('room_num, start_time, end_time, regular, date, days');
    if (scheduleError) throw new Error('Error fetching schedules');

    const standardHours = { start: '07:00', end: '21:00' };

    // Calculate available time slots for each room
    const availableRooms = rooms.map(room => {
      const roomSchedules = schedules.filter(schedule => {
        if (schedule.room_num !== room.room_number) return false;
        if (schedule.regular) return true; // Weekly recurring schedules
        return schedule.date === date; // Specific date schedules
      });

      // Subtract scheduled times from standard hours
      const freeSlots = [];
      let currentStart = standardHours.start;

      roomSchedules
        .sort((a, b) => a.start_time.localeCompare(b.start_time))
        .forEach(schedule => {
          if (currentStart < schedule.start_time) {
            freeSlots.push({ start: currentStart, end: schedule.start_time });
          }
          currentStart = schedule.end_time > currentStart ? schedule.end_time : currentStart;
        });

      if (currentStart < standardHours.end) {
        freeSlots.push({ start: currentStart, end: standardHours.end });
      }

      // Filter slots longer than 30 minutes
      const validSlots = freeSlots.filter(
        slot =>
          new Date(`1970-01-01T${slot.end}`).getTime() -
            new Date(`1970-01-01T${slot.start}`).getTime() >=
          30 * 60 * 1000
      );

      return { ...room, freeSlots: validSlots };
    });

    return NextResponse.json(availableRooms, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Could not process request.' }, { status: 500 });
  }
}
