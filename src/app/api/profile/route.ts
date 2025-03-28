import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(req: Request) {
  try {
    const { data: session, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.session) {
      console.error('Session error:', sessionError?.message || 'No active session');
      return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
    }

    const sessionAuthId = session.session.user.id;
    const updates = await req.json();

    // TECH DEBT: zod schema validation should be used here
    if (!updates.name || typeof updates.name !== 'string' || updates.name.trim().length === 0) {
      console.error({ error: 'Invalid name provided'});
    }

    const { data, error } = await supabase
      .from('User')
      .update({ name: updates.name })
      .eq('auth_id', sessionAuthId); 

    if (error) {
        console.error('Database error:', error.message);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    // Return the updated profile data
    return NextResponse.json({ profile: data }, { status: 200 });
  } catch (err) {
    console.error('Profile update error:', err);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}