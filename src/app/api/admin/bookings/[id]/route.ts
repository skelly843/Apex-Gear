import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  context: any
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
  const { params } = context;
  const bookingData = await request.json();

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .update(bookingData)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  context: any
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
  const { params } = context;
  const { error } = await supabaseAdmin
    .from('bookings')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
