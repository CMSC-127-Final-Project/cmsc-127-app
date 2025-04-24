import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { updateUserSchema } from '@/utils/schemas';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();

  const { id } = await params;

  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Authentication error:', userError?.message || 'No active session');
      return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
    }

    const sessionAuthId = user.user.id;
    console.log('Session Auth ID:', sessionAuthId);

    const { data: userRecord, error: userRecordError } = await supabase
      .from('User')
      .select('*')
      .eq('auth_id', id)
      .single();

    if (userRecordError || !userRecord) {
      console.error('User record error:', userRecordError?.message || 'User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const parsedData = updateUserSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsedData.error.errors },
        { status: 400 }
      );
    }

    const filteredUpdates: Record<string, string> = {};

    if (parsedData.data.email && parsedData.data.email !== userRecord.email) {
      filteredUpdates.email = parsedData.data.email;
    }
    if (parsedData.data.first_name && parsedData.data.first_name !== userRecord.first_name) {
      filteredUpdates.first_name = parsedData.data.first_name;
    }
    if (parsedData.data.last_name && parsedData.data.last_name !== userRecord.last_name) {
      filteredUpdates.last_name = parsedData.data.last_name;
    }
    if (parsedData.data.id_number && parsedData.data.id_number !== userRecord.student_num) {
      if (parsedData.data.role === 'Instructor') {
        filteredUpdates.instructor_id = parsedData.data.id_number;
      } else if (parsedData.data.role === 'Student') {
        filteredUpdates.student_num = parsedData.data.id_number;
      }
      else { 
        return NextResponse.json({ error: 'Invalid role for ID number' }, { status: 400 });
      }
    }
    if (parsedData.data.dept && parsedData.data.dept !== userRecord.dept) {
      filteredUpdates.dept = parsedData.data.dept;
    }
    if (parsedData.data.rank && parsedData.data.rank !== userRecord.rank) {
      filteredUpdates.rank = parsedData.data.rank;
    }
    if (parsedData.data.instructor_office && parsedData.data.instructor_office !== userRecord.instructor_office) {
      filteredUpdates.instructor_office = String(parsedData.data.instructor_office);
    }
    if (parsedData.data.nickname && parsedData.data.nickname !== userRecord.nickname) {
      filteredUpdates.nickname = parsedData.data.nickname;
    }
    if (parsedData.data.phone && parsedData.data.phone !== userRecord.phone) {
      filteredUpdates.phone = parsedData.data.phone;
    }

    console.log('Filtered Updates:', filteredUpdates);

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    const { error } = await supabase
      .from('User')
      .update(filteredUpdates)
      .eq('auth_id', userRecord.auth_id);

    if (error) {
      console.error('Database error:', error.message);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (err) {
    console.error('Internal Server Error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
