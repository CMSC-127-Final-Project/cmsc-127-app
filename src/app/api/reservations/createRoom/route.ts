import { NextResponse, NextRequest } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(req: NextRequest) {
  const supabase = await createAdminClient();
  const body = await req.json();
  const { room_number, capacity, room_type } = body;

  if (!room_number || !capacity || !room_type) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const { data, error } = await supabase.from('Room').insert([
    {
      room_number,
      capacity,
      room_type,
      status: 'Available',
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Room added successfully', data });
}
