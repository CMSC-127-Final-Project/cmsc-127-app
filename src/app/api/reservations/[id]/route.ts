import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log('Fetching reservations for auth_id:', id);
  try {
    const { data, error } = await supabase.from('Reservation').select('*').eq('user_id', id);
    console.log('Data:', data);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
