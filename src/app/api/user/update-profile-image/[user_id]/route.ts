import { createClient } from '@/utils/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  try {
    const body = await request.json();
    const { profile_image } = body;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('User')
      .update({ profile_image })
      .eq('auth_id', params.user_id); // assuming you switched to `auth_id`

    if (error) {
      console.error('Supabase update error:', error);
      return new Response(JSON.stringify({ error: 'Failed to update profile image' }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: 'Profile image updated successfully', data }), {
      status: 200,
    });
  } catch (err) {
    console.error('Handler error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    });
  }
}
