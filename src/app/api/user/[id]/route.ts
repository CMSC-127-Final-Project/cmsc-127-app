import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from('User')
      .select('nickname')
      .eq('auth_id', id)
      .single();
    if (error) {
      throw new Error(error.details);
    }

    return NextResponse.json({ nickname: data.nickname }, { status: 200 });
  } catch (error) {
    console.error('Error fetching nickname:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
