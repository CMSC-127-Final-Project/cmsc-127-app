import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();

  const { id } = await params;

  try {
    const { data, error } = await supabase.from('User').select('*').eq('auth_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createAdminClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user:', userError?.message);
    return;
  }

  const { data: adminCheck } = await supabase
    .from('User')
    .select('role')
    .eq('id', user.id)
    .single();

  if (adminCheck?.role !== 'admin') {
    console.error('User is not an admin');
    return;
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'No user ID provided.' }, { status: 400 });
  }

  const { error } = await supabase.from('User').delete().eq('user_ID', id);

  if (error) {
    console.error('Error deleting user:', error.message);
    return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'User deleted successfully.' }, { status: 200 });
}
