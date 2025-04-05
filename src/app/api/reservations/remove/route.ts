import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
    const { reservation_id } = await request.json();
    try {
        const { error } = await supabase.from('Reservation').delete().eq('reservation_id', reservation_id);
        if (error) throw new Error;

        return NextResponse.json({ status: 200 });
    } catch {   
        return NextResponse.json({ status: 500 });
    }
}