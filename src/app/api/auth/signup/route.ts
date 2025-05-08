import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { signupSchema } from '@/utils/schemas';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const cookieStore = await cookies();

  try {
    const formData = await request.json();
    const parsedData = signupSchema.safeParse(formData);

    if (!parsedData.success) {
      // Extract detailed error messages
      const errorDetails = parsedData.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      return NextResponse.json(
        { error: 'Invalid input', details: errorDetails[0].message, status: 400 },
        { status: 400 }
      );
    }

    const validatedData = parsedData.data;

    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) throw { error: error.message };

    const { error: insertError } = await supabase.from('User').insert({
      auth_id: data.user?.id,
      last_name: validatedData.lname,
      first_name: validatedData.fname,
      nickname: validatedData.nickname,
      email: validatedData.email,
      role: validatedData.role,
      dept: validatedData.department,
    });
    if (insertError) throw { error: insertError.message };

    cookieStore.set('USER.Nickname', validatedData.nickname);

    if (validatedData.role === 'Instructor') {
      const { error: updateError } = await supabase
        .from('User')
        .update({ instructor_id: validatedData.instructorID })
        .eq('email', validatedData.email);

      if (updateError) throw { error: updateError.name };

      const { error: instructorError } = await supabase
        .from('Instructor')
        .insert({
          instructor_id: validatedData.instructorID,
          office: validatedData.instructorOffice,
          faculty_rank: validatedData.facultyRank,
        })
        .select('instructor_id')
        .single();

      if (instructorError) throw { error: instructorError.name };
    } else {
      const { error: studentError } = await supabase
        .from('User')
        .update({ student_num: validatedData.studentNumber })
        .eq('email', validatedData.email);
      if (studentError) throw { message: studentError.message, name: studentError.name };
    }

    return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
  } catch (err) {
    const { error, details, status } = err as { error: string; details?: string; status?: number };
    return NextResponse.json(
      {
        error: error || 'Internal Server Error',
        status: status || 500,
        details: details || 'Try again later',
      },
      { status: status || 500 }
    );
  }
}
