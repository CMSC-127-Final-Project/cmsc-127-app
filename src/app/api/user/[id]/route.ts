import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  console.log('GET Request Received for Reservations');
  const { id } = await params;

  try {
    const { data, error } = await supabase.from('User').select('*').eq('auth_id', id);
    console.log('Fetched user data:', data);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
