import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { userSchema } from '@/utils/schemas';

const UsersListSchema = z.array(userSchema);

export async function POST(request: NextRequest) {
  const supabase = await createAdminClient();

  try {
    const rawBody = await request.text();
    console.log('Raw Request Body:', rawBody);

    const formData = JSON.parse(rawBody);
    console.log('Parsed Form Data:', formData);

    const validatedFormData = UsersListSchema.parse(formData);
    console.log('Validated Form Data:', validatedFormData);

    if (!validatedFormData.length) {
      return NextResponse.json({ error: 'No data provided', status: 400 }, { status: 400 });
    }

    const { error } = await supabase.from('User').insert(
      validatedFormData.map(user => ({
        user_ID: user.user_ID,
        student_num: user.student_num,
        instructor_id: user.instructor_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone,
        department: user.dept,
        role: user.role,
        nickname: user.nickname,
      }))
    );

    if (error) {
      console.error('Error inserting user:', error.message);
      return NextResponse.json(
        { error: 'Failed to insert user. Please try again later.', status: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Invalid request', details: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const supabase = await createAdminClient();

    // Fetch data from the User table
    const { data, error } = await supabase.from('User').select(
      `
        user_ID,
        email,
        first_name,
        last_name,
        student_num,
        instructor_id,
        phone,
        dept,
        role,
        nickname
      `
    );

    // Handle Supabase errors
    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'No users found' }, { status: 404 });
    }

    // Validate data using Zod
    const validatedData = UsersListSchema.parse(data);
    console.log('Validated Data:', validatedData);

    // Return validated data
    return NextResponse.json(validatedData, { status: 200 });
  } catch (error: any) {
    // Handle validation or unknown errors
    if (error instanceof z.ZodError) {
      console.error('Validation Error:', error.errors);
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('API error:', error.message || 'An unknown error occurred');
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
