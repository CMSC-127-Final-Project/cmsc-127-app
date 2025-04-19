import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function PATCH(request: NextRequest) {
    const { room_number } = await request.json();
    const supabase = await createAdminClient();
    try {
      const { error } = await supabase
        .from('Room')
        .delete()
        .eq('room_number', room_number);
      if (error) throw new Error();
  
      return NextResponse.json({ status: 200 });
    } catch {
      return NextResponse.json({ status: 500 });
    }
  }
  