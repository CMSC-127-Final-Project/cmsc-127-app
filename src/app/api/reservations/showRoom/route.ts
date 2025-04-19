import { NextResponse} from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET() {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('Room')
    .select('*')
    .order('created_at', { ascending: false }); 

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
