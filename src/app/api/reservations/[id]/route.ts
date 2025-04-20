import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    const { data, error } = await supabase.from('Reservation').select('*').eq('user_id', id).order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
