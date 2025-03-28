import { NextResponse } from 'next/server'; 
import { supabase } from '@/lib/supabase'; 

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (err) {
    console.error('Login error:', err);

    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}