import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
  const { bookingId } = await request.json();

  if (!bookingId) {
    return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
  }

  try {
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'CONFIRMED' })
      .eq('id', bookingId)
      .eq('status', 'HOLD') // Make sure we're not confirming an already confirmed/expired booking
      .select()
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: 'Could not confirm booking' }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
