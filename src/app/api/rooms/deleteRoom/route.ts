import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(request: NextRequest) {
  const { room_number } = await request.json();
  const supabase = await createClient();
  try {
    const { error } = await supabase.from('Room').delete().eq('room_number', room_number);
    if (error) throw new Error();

    return NextResponse.json({ status: 200 });
  } catch {
    return NextResponse.json({ status: 500 });
  }
}
