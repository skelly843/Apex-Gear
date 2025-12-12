import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  if (!supabaseAdmin) {
    console.error('Supabase client is not available. Check environment variables.');
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from('service_types')
    .select('id, name, description, duration_minutes, price_cents')
    .eq('active', true)
    .order('name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
