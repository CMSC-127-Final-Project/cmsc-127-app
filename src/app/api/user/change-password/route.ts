import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

// Define the schema for validating the request body
const changePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
});

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  try {
    // Authenticate the session
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Authentication error:', userError?.message || 'No active session');
      return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
    }

    const sessionAuthId = user.user.id;
    console.log('Session Auth ID:', sessionAuthId);

    const body = await req.json();
    const parsedData = changePasswordSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsedData.error.errors }, { status: 400 });
    }

    const { currentPassword, newPassword, confirmPassword } = parsedData.data;

    // Ensure the new password matches the confirmation password
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New password and confirmation password do not match' }, { status: 400 });
    }

    // Verify the current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.user.email ?? (() => { throw new Error('User email is undefined'); })(),
      password: currentPassword,
    });

    if (signInError) {
      console.error('Password verification failed:', signInError.message);
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error('Password update error:', updateError.message);
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (err) {
    console.error('Internal Server Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}