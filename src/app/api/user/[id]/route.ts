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
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

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

export async function PUT(request: Request, { params }: { params: { user_ID: string } }) {
  const userId = Number(params.user_ID);
  const body = await request.json();

  const supabase = await createAdminClient();

  const { error } = await supabase.from('User').update(body).eq('user_ID', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'User updated successfully' });
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { error } = await supabase
      .from('User')
      .update({ password: newPassword }) // Assuming `password` is the column name
      .eq('auth_id', userId);

    if (error) {
      console.error('Error resetting password:', error.message);
      return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Password reset successfully!' }, { status: 200 });
  } catch (err: any) {
    console.error('Error in password reset API:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
