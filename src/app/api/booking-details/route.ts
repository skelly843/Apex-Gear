import { supabaseAdmin } from '@/lib/supabase'; // Using the admin client
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select(`
      start_time,
      address,
      service_types (
        name,
        duration_minutes,
        price_cents
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
