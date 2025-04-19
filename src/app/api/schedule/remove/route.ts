import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(request: Request) {
    const supabase = await createClient();
    try {
        const { schedule_id } = await request.json();
        console.log(schedule_id);

        if (!schedule_id) throw new Error('Missing schedule_id');
      
        const { error } = await supabase
          .from('Scheduled Time').delete()
          .eq('timeslot_id', schedule_id);

        if (error) throw new Error(error.message);
        return NextResponse.json({ message: 'Schedule removed successfully' });
    } catch (error) {
        console.error('Error removing schedule:', error);
        return NextResponse.json({ error: 'Failed to remove schedule' }, { status: 500 });
    }
}
