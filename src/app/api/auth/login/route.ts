'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { email, password } = await req.json();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error('Login error:', err);

    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
