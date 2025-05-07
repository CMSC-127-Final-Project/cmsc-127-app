import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const { user_id } = await params;
  const { profile_image } = await req.json();

  if (!profile_image || typeof profile_image !== 'string') {
    return NextResponse.json({ error: 'Invalid profile image' }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('User')
      .update({ profile_image })
      .eq('auth_id', user_id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No user found with that ID' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Profile image updated successfully', data },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating profile image:', err);
    return NextResponse.json(
      { error: 'Failed to update profile image in the database' },
      { status: 500 }
    );
  }
}
