import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const updateUserSchema = z.object({
  nickname: z.string().optional(),
  phone: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

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
      .select('user_ID, nickname, phone')
      .eq('auth_id', sessionAuthId)
      .single();

    if (userRecordError || !userRecord) {
      console.error('User record error:', userRecordError?.message || 'User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User ID:', userRecord.user_ID);

    const body = await req.json();
    const parsedData = updateUserSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsedData.error.errors },
        { status: 400 }
      );
    }

    const filteredUpdates: Record<string, string> = {};
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
      .eq('user_ID', userRecord.user_ID);

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
