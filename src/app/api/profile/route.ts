import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(req: Request) {
  try {
    const { userId, ...updates } = await req.json();

    if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('User') 
      .update(updates) 
      .eq('auth_id', userId) as { data: any[] | null, error: any };

    if (error) {
    console.error('Database error:', error.message);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    // If no rows were updated, return a 404 error
    if (!data || data.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: data }, { status: 200 });
  } catch (err) {
    console.error('Profile update error:', err);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}