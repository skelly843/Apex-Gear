import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*, service_types(name)')
    .order('start_time', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
