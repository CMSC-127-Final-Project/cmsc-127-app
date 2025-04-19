import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  try {
    const body = await request.json();
    const { room_num, regular, start_time, end_time, days, date } = body;
    console.log(days);

    // Validate required fields
    if (!room_num || !start_time || !end_time || (!regular && !date)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase.from('Scheduled Time').insert({
      room_num: room_num,
      regular: regular,
      start_time: start_time,
      end_time: end_time,
      days: days || null,
      date: date || null,
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({ message: 'Schedule added successfully', status: 200 });
  } catch (error) {
    console.error('Error adding schedule:', error);
    return NextResponse.json({ error: 'Failed to add schedule' }, { status: 500 });
  }
}
