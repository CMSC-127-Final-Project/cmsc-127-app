import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  try {
    // Fetch rooms
    const { data: rooms, error: roomError } = await supabase
      .from('Room')
      .select('room_number, room_type');

    if (roomError) {
      throw new Error('Error fetching rooms');
    }

    // Fetch schedules
    const { data: schedules, error: scheduleError } = await supabase
      .from('Scheduled Time')
      .select('timeslot_id, start_time, end_time, room_num, date, days, regular');

    if (scheduleError) {
      throw new Error('Error fetching schedules');
    }

    // Map schedules to their respective rooms
    const formattedData = rooms.map(room => {
      return {
        ...room,
        schedules: schedules
          .filter(schedule => schedule.room_num === room.room_number)
          .sort((a, b) => Number(b.regular) - Number(a.regular)) // Sort by regular (true first)
          .map(schedule => ({
            ...schedule,
            time_range: schedule.regular
              ? `${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)} ${schedule.days.join(', ')}`
              : `${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)} ${schedule.date}`,
          })),
      };
    });

    return NextResponse.json(formattedData, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Could not process request.' }, { status: 500 });
  }
}
