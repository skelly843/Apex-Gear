import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { bookingRequestSchema } from '@/lib/schemas';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  console.log('Received request to /api/booking-request');
  try {
    const json = await request.json();
    const requestData = bookingRequestSchema.parse(json);

    console.log('Inserting booking request...');
    const { data, error } = await supabaseAdmin
      .from('booking_requests')
      .insert(requestData)
      .select()
      .single();

    if (error) {
      console.error('Error inserting booking request.', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Successfully created booking request: ${data.id}`);
    return NextResponse.json(data);

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Internal server error.', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
