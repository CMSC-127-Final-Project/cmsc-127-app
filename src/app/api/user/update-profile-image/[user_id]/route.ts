import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(req: NextRequest, { params }: { params: { user_id: string } }) {
  const { user_id } = params; 
  const { profile_image } = await req.json(); 

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('User')
      .update({ profile_image })
      .eq('auth_id', user_id);

    if (error) throw error;

    return NextResponse.json({ message: 'Profile image updated successfully', data });
  } catch (err) {
    console.error('Error updating profile image:', err);
    return NextResponse.json({ error: 'Failed to update profile image in the database' }, { status: 500 });
  }
}
