import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const cookieStore = await cookies();
  try {
    const formData = await request.json();
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) throw { message: error.message, status: error.status, name: error.name };

    cookieStore.set('access_token', data.session?.access_token || '', { path: '/' });
    cookieStore.set('refresh_token', data.session?.refresh_token || '', { path: '/' });
    cookieStore.set('user', data.user?.id || '', { path: '/' });

    const { error: insertError } = await supabase.from('User').insert({
      auth_id: data.user?.id,
      last_name: formData.lname,
      first_name: formData.fname,
      nickname: formData.nickname,
      email: formData.email,
      role: formData.role,
      dept: formData.department,
    });

    if (formData.role === 'Instructor') {
      const { error: updateError } = await supabase
        .from('User')
        .update({ instructor_id: formData.instructorID })
        .eq('email', formData.email);

      if (updateError) throw { message: updateError.message, name: updateError.name };

      const { error: instructorError } = await supabase
        .from('Instructor')
        .insert({
          instructor_id: formData.instructorID,
          office: formData.instructorOffice,
          faculty_rank: formData.facultyRank,
        })
        .select('instructor_id')
        .single();
      
      console.log(instructorError)
      if (instructorError) throw { message: "Please try again later." };
    } else {
      const { error: studentError } = await supabase
        .from('User')
        .update({ student_num: formData.studentNumber })
        .eq('email', formData.email);
      if (studentError) throw { message: studentError.message, name: studentError.name };
    }

    if (insertError) throw { message: insertError.message, name: insertError.name };
    return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
  } catch (error) {
    const { message, status, name } = error as { message: string; status?: number; name?: string };
    const userResponse = await supabase.auth.admin.getUserById(cookieStore.get('user')?.value || '');
    if (userResponse.data) {
      const { error: supabaseError } = await supabase.auth.admin.deleteUser(cookieStore.get('user')?.value || '');
      if (supabaseError) console.log(supabaseError.message);
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');
      cookieStore.delete('user');
    }
    return NextResponse.json({ error: message, status: status || 500, name: name || "Internal Server Error"}, { status: status || 500 });
  }
}