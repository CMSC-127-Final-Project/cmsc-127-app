import { NextResponse, NextRequest } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(req: NextRequest) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('Room')
    .select('*') // fetch all columns from the Room table
    .order('created_at', { ascending: false }); // optional: show latest first

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
