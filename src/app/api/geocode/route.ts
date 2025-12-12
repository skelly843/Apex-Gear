import { geocodingClient } from '@/lib/mapbox';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  if (!geocodingClient) {
    return NextResponse.json({ error: 'Geocoding service not configured' }, { status: 500 });
  }

  const { address } = await request.json();

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    // 1. Geocode the address
    const geocodeResponse = await geocodingClient
      .forwardGeocode({
        query: address,
        limit: 1,
        countries: ['US'], // Assuming US for now
      })
      .send();

    if (!geocodeResponse.body.features.length) {
      return NextResponse.json({ error: 'Could not geocode address' }, { status: 400 });
    }

    const feature = geocodeResponse.body.features[0];
    const lng = feature.center[0];
    const lat = feature.center[1];
    const postcode = feature.context.find(c => c.id.startsWith('postcode'))?.text;

    // 2. Find a matching zone
    const { data: zones, error } = await supabaseAdmin.from('zones').select('*');

    if (error) {
      console.error('Error fetching zones:', error);
      return NextResponse.json({ error: 'Could not fetch zones' }, { status: 500 });
    }

    let matchedZone = null;

    // Find zone by ZIP code first
    if (postcode) {
      matchedZone = zones.find(zone =>
        zone.type === 'zip_list' && zone.zip_codes.includes(postcode)
      );
    }

    // If no ZIP match, check by radius
    if (!matchedZone) {
      // Haversine formula to calculate distance
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

    if (matchedZone) {
        return NextResponse.json({ zone: matchedZone, lat, lng });
    } else {
        return NextResponse.json({ zone: null, lat, lng });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
