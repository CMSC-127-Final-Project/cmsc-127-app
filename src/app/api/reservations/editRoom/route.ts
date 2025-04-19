import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function PATCH(req: NextRequest) {
  const supabase = await createAdminClient();
  const body = await req.json();
  const { old_room_number, room_number, capacity, room_type } = body;

  if (!old_room_number || !room_number || !capacity || !room_type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('Room')
    .update({
      room_number,
      capacity,
      room_type,
    })
    .eq('room_number', old_room_number);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Room updated successfully', data }, { status: 200 });
}
