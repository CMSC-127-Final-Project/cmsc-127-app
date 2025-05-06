import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(req: NextRequest, { params }: { params: { user_id: string } }) {
  const { user_id } = params;
  const { profile_image } = await req.json();

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('User')
      .update({ profile_image })
      .eq('auth_id', user_id);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Failed to update profile image in the database' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Profile image updated successfully', data }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}