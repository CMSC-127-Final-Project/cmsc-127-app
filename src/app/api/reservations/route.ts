import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjorxzmwqbcvaofmujke.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqb3J4em13cWJjdmFvZm11amtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzU2MTIsImV4cCI6MjA1ODA1MTYxMn0.2Ud66oA6kkpYhugnCW_IT8wTPWYruV628-DRf29EQXg';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Reservation')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
