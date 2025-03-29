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
      email: formData.email,
      role: formData.role,
      dept: formData.department,
    });

    if (insertError)
      throw { message: insertError.message, name: insertError.name, status: insertError.code };
    return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
  } catch (error) {
    const { message, status, name } = error as { message: string; status?: number; name?: string };
    return NextResponse.json({ error: message, status, name }, { status: status || 500 });
  }
}
