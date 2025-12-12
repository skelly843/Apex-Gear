import MapboxClient from '@mapbox/mapbox-sdk/services/geocoding';

const mapboxToken = process.env.MAPBOX_PUBLICKEY;

export const geocodingClient = mapboxToken
  ? MapboxClient({ accessToken: mapboxToken })
  : null;
