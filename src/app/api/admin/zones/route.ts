import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
  const { data, error } = await supabaseAdmin
    .from('zones')
    .select('*')
    .order('name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
  const zone = await request.json();

  const { data, error } = await supabaseAdmin
    .from('zones')
    .insert(zone)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
