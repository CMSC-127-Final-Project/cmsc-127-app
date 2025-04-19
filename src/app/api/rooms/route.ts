import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from('Room').select('*');
    if (error) throw new Error(error.message);
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Could not proccess request.' }, { status: 500 });
  }
}
