import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { addMinutes, parseISO, format } from 'date-fns';
import { holdSchema } from '@/lib/schemas';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  console.log('Received request to /api/hold');
  try {
    const json = await request.json();
    const { serviceId, startTime, customerDetails } = holdSchema.parse(json);

    const start = parseISO(startTime);
    const date = format(start, 'yyyy-MM-dd');

    console.log(`Validating zone for date: ${date}, zone: ${customerDetails.zone_id}`);

    // 1. Verify zone assignment for the selected date
    const { data: dayAssignment, error: dayError } = await supabaseAdmin
      .from('zone_day_assignments')
      .select('zone_id, allow_mixed')
      .eq('date', date)
      .single();

    if (dayError || !dayAssignment) {
      console.error('No service available for this date.', dayError);
      return NextResponse.json({ error: 'No service available for this date' }, { status: 400 });
    }

    if (!dayAssignment.allow_mixed && dayAssignment.zone_id !== customerDetails.zone_id) {
      console.warn('Zone mismatch');
      return NextResponse.json({ error: 'This service is not available in your zone on this date' }, { status: 400 });
    }

    // 2. Get service duration
    console.log(`Fetching duration for service: ${serviceId}`);
    const { data: service, error: serviceError } = await supabaseAdmin
      .from('service_types')
      .select('duration_minutes')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      console.error('Service not found.', serviceError);
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const end = addMinutes(start, service.duration_minutes);

    // 3. Create a 'HOLD' booking
    console.log('Creating HOLD booking...');
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        service_type_id: serviceId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        status: 'HOLD',
        ...customerDetails,
      })
      .select()
      .single();

    if (bookingError) {
      if (bookingError.code === '23P01') {
        console.warn('Slot conflict.');
        return NextResponse.json({ error: 'Slot is no longer available' }, { status: 409 });
      }
      console.error('Error creating booking.', bookingError);
      throw bookingError;
    }

    console.log(`Successfully created HOLD booking: ${booking.id}`);
    return NextResponse.json({ booking });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Internal server error.', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
