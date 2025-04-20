import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  try {
    const { data, error } = await supabase.from('Scheduled Time').select('*').eq('room_num', id);

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Could not process request.' }, { status: 500 });
  }
}
