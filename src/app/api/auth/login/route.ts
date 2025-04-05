import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {

  try {
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const cookieStore = await cookies();

    if (error) {
      throw new Error(error.message);
    }

    cookieStore.set('user', data.user?.id || '');
    cookieStore.set('access_token', data.session?.access_token || '');
    cookieStore.set('refresh_token', data.session?.refresh_token || '');

    return NextResponse.json({ user: data.user.id, access_token: data.session.access_token, refresh_token: data.session.refresh_token }, { status: 200 });
  } catch (err) {
    console.error('Login error:', err);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
