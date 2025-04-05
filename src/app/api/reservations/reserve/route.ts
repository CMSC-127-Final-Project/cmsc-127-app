import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.json();
        const { error } = await supabase.from("Reservation").insert({
            user_id: formData.userId,
            date: formData.date,
            start_time: formData.startTime,
            end_time: formData.endTime,
            room_num: formData.roomNum,
            reason: formData.reason,
            user_msg: formData.message
        });
    
        if (error) throw { message: error.message, status: error.details, name: error.name };
    
        return NextResponse.json({ status: 200 })
    } catch(error) {
        const { message, status, name } = error as { message: string; status?: number; name?: string };
        return NextResponse.json({ error: message, status, name }, { status: status || 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase.from("Reservation").select("*").eq('status', 'Pending');
        if (error) throw new Error(error.message);

        return NextResponse.json(data, { status: 200 });
    } catch(error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }
}