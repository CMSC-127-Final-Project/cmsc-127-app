import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  try {
    const formData = await request.json();

    // Validate user_id
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('id')
      .eq('id', formData.userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid user_id. User does not exist.', status: 400 },
        { status: 400 }
      );
    }

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
    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from('Reservation')
      .select(
        `
        reservation_id,
        created_at,
        room_num,
        date,
        start_time,
        end_time,
        status,
        user_id,
        User:user_id (
          first_name,
          last_name
        )
      `
      )
      .eq('status', 'Pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const formattedData = (
      data as Array<{
        reservation_id: string;
        created_at: string;
        room_num: string;
        date: string;
        start_time: string;
        end_time: string;
        status: string;
        user_id: string;
        User?: {
          first_name?: string;
          last_name?: string;
        };
      }>
    ).map(item => {
      const fullName = item.User
        ? `${item.User.first_name ?? ''} ${item.User.last_name ?? ''}`.trim()
        : `Unknown Requestor (user_id: ${item.user_id})`;

      return {
        ...item,
        name: fullName,
      };
    });

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('API error:', error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    console.error('API error: An unknown error occurred');
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}
