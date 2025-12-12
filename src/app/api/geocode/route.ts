import { geocodingClient } from '@/lib/mapbox';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { geocodeSchema } from '@/lib/schemas';
import { ZodError } from 'zod';

const rateLimitMap = new Map<string, number>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = 10; // 10 requests
  const window = 60 * 1000; // 1 minute

  const userRequests = rateLimitMap.get(ip) || 0;
  if (userRequests >= limit) {
    // Check if the time window has passed
    const lastRequestTime = rateLimitMap.get(`${ip}-time`) || 0;
    if (now - lastRequestTime > window) {
      rateLimitMap.set(ip, 1);
      rateLimitMap.set(`${ip}-time`, now);
      return false;
    }
    return true;
  }

  rateLimitMap.set(ip, userRequests + 1);
  if (!rateLimitMap.has(`${ip}-time`)) {
    rateLimitMap.set(`${ip}-time`, now);
  }
  return false;
}

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  console.log('Received request to /api/geocode');
  try {
    if (!geocodingClient) {
      console.error('Geocoding service not configured');
      return NextResponse.json({ error: 'Geocoding service not configured' }, { status: 500 });
    }

    const json = await request.json();
    const { address } = geocodeSchema.parse(json);

    console.log(`Geocoding address: ${address}`);
    const geocodeResponse = await geocodingClient
      .forwardGeocode({
        query: address,
        limit: 1,
        countries: ['US'],
      })
      .send();

    if (!geocodeResponse.body.features.length) {
      console.warn('Could not geocode address');
      return NextResponse.json({ error: 'Could not geocode address' }, { status: 400 });
    }

    const feature = geocodeResponse.body.features[0];
    const lng = feature.center[0];
    const lat = feature.center[1];
    const postcode = feature.context.find((c: any) => c.id.startsWith('postcode'))?.text;

    console.log(`Fetching zones...`);
    const { data: zones, error } = await supabaseAdmin.from('zones').select('*');

    if (error) {
      console.error('Error fetching zones:', error);
      return NextResponse.json({ error: 'Could not fetch zones' }, { status: 500 });
    }

    let matchedZone = null;

    if (postcode) {
      matchedZone = zones.find(zone =>
        zone.type === 'zip_list' && zone.zip_codes.includes(postcode)
      );
    }

    if (!matchedZone) {
      const toRad = (x: number) => x * Math.PI / 180;
      const R = 3959; // Earth radius in miles

      for (const zone of zones) {
        if (zone.type === 'radius' && zone.center_lat && zone.center_lng) {
          const dLat = toRad(lat - zone.center_lat);
          const dLon = toRad(lng - zone.center_lng);
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(toRad(zone.center_lat)) * Math.cos(toRad(lat)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const d = R * c;
          if (d <= zone.radius_miles) {
            matchedZone = zone;
            break;
          }
        }
      }
    }

    console.log(`Zone match: ${matchedZone ? matchedZone.name : 'None'}`);
    return NextResponse.json({ zone: matchedZone, lat, lng });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Internal server error.', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
