import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { signupSchema } from '@/utils/schemas';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const cookieStore = await cookies();

  try {
    const formData = await request.json();
    const parsedData = signupSchema.safeParse(formData);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsedData.error.errors },
        { status: 400 }
      );
    }

    const validatedData = parsedData.data;

    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) throw { message: error.message, status: error.status, name: error.name };

    cookieStore.set('access_token', data.session?.access_token || '', { path: '/' });
    cookieStore.set('refresh_token', data.session?.refresh_token || '', { path: '/' });
    cookieStore.set('user', data.user?.id || '', { path: '/' });

    const { error: insertError } = await supabase.from('User').insert({
      auth_id: data.user?.id,
      last_name: validatedData.lname,
      first_name: validatedData.fname,
      nickname: validatedData.nickname,
      email: validatedData.email,
      role: validatedData.role,
      dept: validatedData.department,
    });

    if (validatedData.role === 'Instructor') {
      const { error: updateError } = await supabase
        .from('User')
        .update({ instructor_id: validatedData.instructorID })
        .eq('email', validatedData.email);

      if (updateError) throw { message: updateError.message, name: updateError.name };

      const { error: instructorError } = await supabase
        .from('Instructor')
        .insert({
          instructor_id: validatedData.instructorID,
          office: validatedData.instructorOffice,
          faculty_rank: validatedData.facultyRank,
        })
        .select('instructor_id')
        .single();

      console.log(instructorError);
      if (instructorError) throw { message: 'Please try again later.' };
    } else {
      const { error: studentError } = await supabase
        .from('User')
        .update({ student_num: validatedData.studentNumber })
        .eq('email', validatedData.email);
      if (studentError) throw { message: studentError.message, name: studentError.name };
    }

    if (insertError) throw { message: insertError.message, name: insertError.name };
    return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
  } catch (error) {
    const { message, status, name } = error as { message: string; status?: number; name?: string };
    const userResponse = await supabase.auth.admin.getUserById(
      cookieStore.get('user')?.value || ''
    );
    if (userResponse.data) {
      const { error: supabaseError } = await supabase.auth.admin.deleteUser(
        cookieStore.get('user')?.value || ''
      );
      if (supabaseError) console.log(supabaseError.message);
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');
      cookieStore.delete('user');
    }
    return NextResponse.json(
      { error: message, status: status || 500, name: name || 'Internal Server Error' },
      { status: status || 500 }
    );
  }
}
