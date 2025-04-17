import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  try {
    const authHeader = request.headers.get('Authorization');
    console.log('Authorization Header:', authHeader);

    const { data: session } = await supabase.auth.getSession();
    console.log('Session:', session);

    const { data, error } = await supabase.from('Room').select('*');
    if (error) throw new Error(error.message);
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Could not proccess request.' }, { status: 500 });
  }
}
