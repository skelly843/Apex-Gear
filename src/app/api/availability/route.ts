import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { addMinutes, format, isBefore, isEqual, parseISO } from 'date-fns';

const APPOINTMENT_GAP_MINUTES = 45;

export async function GET(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const serviceId = searchParams.get('serviceId');
  const zoneId = searchParams.get('zoneId');

  if (!date || !serviceId || !zoneId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const selectedDate = parseISO(date);

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
    const { duration_minutes: duration } = service;

    // 2. Get working hours for the day
    const { data: dayAssignment, error: dayError } = await supabaseAdmin
      .from('zone_day_assignments')
      .select('working_start_time, working_end_time, is_closed')
      .eq('date', date)
      .eq('zone_id', zoneId)
      .single();

    if (dayError || !dayAssignment || dayAssignment.is_closed) {
      return NextResponse.json({ slots: [] }); // No slots if day is closed or not assigned
    }

    const { working_start_time, working_end_time } = dayAssignment;
    const [startHour, startMinute] = working_start_time.split(':').map(Number);
    const [endHour, endMinute] = working_end_time.split(':').map(Number);

    let dayStart = new Date(selectedDate);
    dayStart.setUTCHours(startHour, startMinute, 0, 0);

    let dayEnd = new Date(selectedDate);
    dayEnd.setUTCHours(endHour, endMinute, 0, 0);

    // 3. Get existing bookings and blocks
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select('start_time, end_time')
      .in('status', ['CONFIRMED', 'HOLD'])
      .gte('start_time', dayStart.toISOString())
      .lt('end_time', dayEnd.toISOString());

    if (bookingsError) throw bookingsError;

    const { data: blocks, error: blocksError } = await supabaseAdmin
      .from('blocks')
      .select('start_time, end_time')
      .gte('start_time', dayStart.toISOString())
      .lt('end_time', dayEnd.toISOString());

    if (blocksError) throw blocksError;

    const bookedTimes = [
      ...bookings.map(b => ({
        start: parseISO(b.start_time),
        end: addMinutes(parseISO(b.end_time), APPOINTMENT_GAP_MINUTES) // Add gap
      })),
      ...blocks.map(b => ({ start: parseISO(b.start_time), end: parseISO(b.end_time) }))
    ];

    // 4. Generate available slots
    const availableSlots = [];
    const slotIncrement = 15;
    let currentSlot = dayStart;

    while (isBefore(currentSlot, dayEnd)) {
      const slotEnd = addMinutes(currentSlot, duration);
      if (isBefore(slotEnd, dayEnd) || isEqual(slotEnd, dayEnd)) {

        const isOverlapping = bookedTimes.some(booked =>
          (isBefore(currentSlot, booked.end) && isBefore(booked.start, slotEnd))
        );

        if (!isOverlapping) {
          availableSlots.push(format(currentSlot, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"));
        }
      }
      currentSlot = addMinutes(currentSlot, slotIncrement);
    }

    return NextResponse.json({ slots: availableSlots });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
