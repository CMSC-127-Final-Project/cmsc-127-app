import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { updateUserSchema } from '@/utils/schemas';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
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

    console.log('Parsed Data:', parsedData);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsedData.error.errors },
        { status: 400 }
      );
    }

    const { data: instructorRecord, error: instructorError } = await supabase
      .from('Instructor')
      .select('*')
      .eq('instructor_id', userRecord.instructor_id)
      .single();

    console.log('Instructor Record:', instructorRecord, 'Instructor Error:', instructorError);

    if (instructorError && parsedData.data.role === 'Instructor') {
      console.error('Instructor record error:', instructorError?.message || 'Instructor not found');
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 });
    }

    const filteredUpdates: Record<string, string> = {};
    const instructorFilteredUpdates: Record<string, string> = {};

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
      } else {
        return NextResponse.json({ error: 'Invalid role for ID number' }, { status: 400 });
      }
    }
    if (parsedData.data.dept && parsedData.data.dept !== userRecord.dept) {
      filteredUpdates.dept = parsedData.data.dept;
    }
    if (parsedData.data.rank && parsedData.data.rank !== instructorRecord.rank) {
      instructorFilteredUpdates.rank = parsedData.data.rank;
    }
    if (parsedData.data.office && parsedData.data.office !== instructorRecord.office) {
      instructorFilteredUpdates.office = parsedData.data.office;
    }
    if (parsedData.data.nickname && parsedData.data.nickname !== userRecord.nickname) {
      filteredUpdates.nickname = parsedData.data.nickname;
    }
    if (parsedData.data.phone && parsedData.data.phone !== userRecord.phone) {
      filteredUpdates.phone = parsedData.data.phone;
    }

    console.log('Filtered Updates:', filteredUpdates);
    console.log('Instructor Filtered Updates:', instructorFilteredUpdates);

    if (
      Object.keys(filteredUpdates).length === 0 &&
      Object.keys(instructorFilteredUpdates).length === 0
    ) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    const { error } = await supabase
      .from('User')
      .update(filteredUpdates)
      .eq('auth_id', userRecord.auth_id);

    const { error: instructorErrorUpdate } = await supabase
      .from('Instructor')
      .update(instructorFilteredUpdates)
      .eq('instructor_id', userRecord.instructor_id);

    if (error) {
      console.error(
        'Database error:',
        error.message || 'Database error:',
        instructorErrorUpdate?.message
      );
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    const { error: updatedUserError, data: updatedUserData } = await supabase
      .from('User')
      .select('*')
      .eq('auth_id', id)
      .single();
    if (updatedUserError) {
      console.error('Error fetching updated user data:', updatedUserError.message);
      return NextResponse.json({ error: 'Failed to fetch updated user data' }, { status: 500 });
    }
    cookieStore.set('USER.Nickname', updatedUserData.nickname);
    if (updatedUserData.role === 'Student') {
      cookieStore.set('USER.ID', updatedUserData.student_num);
    } else if (updatedUserData.role === 'Instructor') {
      cookieStore.set('USER.ID', updatedUserData.instructor_id);
    }
    cookieStore.set('USER.DATA', JSON.stringify(updatedUserData));

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (err) {
    console.error('Internal Server Error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
