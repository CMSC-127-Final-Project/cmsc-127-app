import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
  const { reservation_id } = await request.json();
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from('Reservation')
      .update({ status: 'Confirmed' })
      .eq('reservation_id', reservation_id);
    if (error) throw new Error();

    return NextResponse.json({ status: 200 });
  } catch {
    return NextResponse.json({ status: 500 });
  }
}
