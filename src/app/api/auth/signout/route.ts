import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const { error } = await supabase.auth.signOut();
  if(cookieStore.get('USER.Nickname')) {
    cookieStore.delete('USER.Nickname');
    cookieStore.delete('USER.ID');
    cookieStore.delete('USER.DATA');
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Sign out successful' }, { status: 200 });
}
