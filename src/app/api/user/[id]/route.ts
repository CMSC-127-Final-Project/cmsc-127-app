import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();

  const { id } = await params;

  try {
    const { data, error } = await (await supabase).from('User').select('*').eq('auth_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('User ID:', user.id);

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

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: userData } = await supabase
      .from('User')
      .select('role')
      .eq('auth_id', user?.id)
      .single();

    console.log('User Data:', userData);

    if (userData?.role !== 'Admin') {
      return NextResponse.json({ error: 'Admin privileges required' }, { status: 403 });
    }

    const { newPassword } = await req.json();
    const userId = new URL(req.url).pathname.split('/').pop();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is missing or invalid.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin().auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: 'Password reset successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin password reset error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
