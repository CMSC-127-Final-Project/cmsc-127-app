import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) throw { message: error.message, status: error.status, name: error.name };

    const { error: insertError } = await supabase.from('User').insert({
      auth_id: data.user?.id,
      last_name: formData.lname,
      first_name: formData.fname,
      nickname: formData.nickname,
      email: formData.email,
      role: formData.role,
      dept: formData.department,
      student_num: formData.studentNumber,
    });

    if (formData.role === 'Instructor') {
      const { data: instructorData, error: instructorError } = await supabase
        .from('Instructor')
        .insert({
          instructor_id: formData.instructorID,
          office: formData.instructorOffice,
          faculty_rank: formData.facultyRank,
        })
        .select('instructor_id')
        .single();

      if (instructorError) throw { message: instructorError.message, name: instructorError.name };

      const { error: updateError } = await supabase
        .from('User')
        .update({ instructor_id: instructorData.instructor_id })
        .eq('email', formData.email);

      if (updateError) throw { message: updateError.message, name: updateError.name };
    }

    if (insertError) throw { message: insertError.message, name: insertError.name };
    return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
  } catch (error) {
    const { message, status, name } = error as { message: string; status?: number; name?: string };
    return NextResponse.json({ error: message, status, name }, { status: status || 500 });
  }
}
