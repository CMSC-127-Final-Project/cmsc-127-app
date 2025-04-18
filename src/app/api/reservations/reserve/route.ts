import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  try {
    const formData = await request.json();
    const { error } = await supabase.from('Reservation').insert({
      user_id: formData.userId,
      reservation_id: formData.reservationId,
      date: formData.date,
      start_time: formData.startTime,
      end_time: formData.endTime,
      room_num: formData.roomNum,
      reason: formData.reason,
      user_msg: formData.message,
    });

    if (error) throw new Error();

    return NextResponse.json({ status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Please try again later.', status: 500, name: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('Reservation')
      .select('*')
      .eq('status', 'Pending')
      .order('created_at', { ascending: false }); // Order by created_at

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
 