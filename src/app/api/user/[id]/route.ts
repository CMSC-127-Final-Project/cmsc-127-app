import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log ('User ID:', user.id); // Log the user ID for debugging

  // Check if the logged in user is an admin
  const { data: adminCheck, error: roleError } = await supabase
    .from('User')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  console.log('Admin Check:', adminCheck, 'Role Error:', roleError);

  if (roleError || !adminCheck || adminCheck.role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'No user ID provided.' }, { status: 400 });
  }

  const { error } = await supabase.from('User').delete().eq('auth_id', id);

  if (error) {
    console.error('Error deleting user:', error.message);
    return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'User deleted successfully.' }, { status: 200 });
}

export async function PUT(request: Request, { params }: { params: { user_ID: string } }) {
  const userId = Number(params.user_ID);
  const body = await request.json();

  const supabase = await createClient();

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

    const supabase = await createClient();
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
