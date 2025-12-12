import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month'); // e.g., '2024-08'

  if (!month) {
    return NextResponse.json({ error: 'Month parameter is required' }, { status: 400 });
  }

  const start = format(startOfMonth(new Date(month)), 'yyyy-MM-dd');
  const end = format(endOfMonth(new Date(month)), 'yyyy-MM-dd');

  const { data, error } = await supabaseAdmin
    .from('zone_day_assignments')
    .select('*, zones(name)')
    .gte('date', start)
    .lte('date', end);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const assignment = await request.json();

  // Use upsert to create or update the assignment for a specific date
  const { data, error } = await supabaseAdmin
    .from('zone_day_assignments')
    .upsert(assignment, { onConflict: 'date' })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
