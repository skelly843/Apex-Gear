import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  if (request.headers.get('Authorization') !== `Bearer ${CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const { error } = await supabaseAdmin.rpc('expire_old_holds');

  if (error) {
    return NextResponse.json({ error: 'Failed to expire holds' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
