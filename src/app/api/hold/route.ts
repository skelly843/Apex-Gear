import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { addMinutes, parseISO } from 'date-fns';

export async function POST(request: Request) {
  const { serviceId, startTime, customerDetails } = await request.json();

  if (!serviceId || !startTime || !customerDetails) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    // 1. Get service duration
    const { data: service, error: serviceError } = await supabaseAdmin
      .from('service_types')
      .select('duration_minutes')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const start = parseISO(startTime);
    const end = addMinutes(start, service.duration_minutes);

    // 2. Create a 'HOLD' booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        service_type_id: serviceId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        status: 'HOLD',
        ...customerDetails, // e.g., name, email, phone, address, zone_id, lat, lng
      })
      .select()
      .single();

    if (bookingError) {
      // Postgres error 23P01 is exclusion_violation
      if (bookingError.code === '23P01') {
        return NextResponse.json({ error: 'Slot is no longer available' }, { status: 409 });
      }
      throw bookingError;
    }

    return NextResponse.json({ booking });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
