import { createClient } from '@/utils/supabase/server';
// import { createAdminClient } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { room_number, date, start_time, end_time, reason } = await req.json();

  try {
    // Check for conflicts
    const { data: conflicts, error: conflictError } = await supabase
      .from('Scheduled Time')
      .select('*')
      .eq('room_num', room_number)
      .eq('date', date)
      .or(`start_time.lt.${end_time},end_time.gt.${start_time}`);

    if (conflictError) {
      throw new Error('Error checking for conflicts');
    }

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: 'The selected time conflicts with an existing schedule.' },
        { status: 409 }
      );
    }

    // Insert reservation
    const { error: insertError } = await supabase.from('Reservation').insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      room_num: room_number,
      date,
      start_time,
      end_time,
      reason,
    });

    console.error('Insert error:', insertError);

    if (insertError) {
      throw new Error('Error inserting reservation');
    }

    return NextResponse.json({ message: 'Reservation successful' }, { status: 200 });
  } catch (error) {
    console.error('Error processing reservation:', error);
    return NextResponse.json({ error: 'Could not process reservation.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('Reservation')
      .select(`
        reservation_id,
        created_at,
        room_num,
        date,
        start_time,
        end_time,
        status,
        user_id
      `)
      .eq('status', 'Pending')
      .order('created_at', { ascending: false });
    
    if (!data) {
      throw new Error('No data returned from Supabase');
    }

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const formattedData = [];
    for (const item of data as Array<{
      reservation_id: string;
      created_at: string;
      room_num: string;
      date: string;
      start_time: string;
      end_time: string;
      status: string;
      user_id: string;
    }>) {
      const { data: userData, error: userError } = await supabase
        .from('User').select('first_name, last_name')
        .eq('auth_id', item.user_id)
        .single();

      if (!userData) {
        console.error('No user data found for user_id:', item.user_id);
        throw new Error(`No user data found for user_id: ${item.user_id}`);
      }

      if (userError) {
        console.error('User fetch error:', userError);
        throw userError;
      }
      const fullName = userData
        ? `${userData.first_name ?? ''} ${userData.last_name ?? ''}`.trim()
        : `Unknown Requestor (user_id: ${item.user_id})`;

      formattedData.push({
        ...item,
        name: fullName,
      });
    }

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
