// Next.js API route for /api/ip-info
// Uses MaxMind GeoLite2-City.mmdb to detect client location from IP, no third-party API
import { open } from 'maxmind';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request) {
  // Get client IP from x-forwarded-for header
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : null;

  let geo = {
    ip: ip || '',
    city: '',
    country: '',
    region: '',
    latitude: null,
    longitude: null
  };

  if (ip) {
    try {
      // Load the MaxMind DB (GeoLite2-City.mmdb)
      const dbPath = path.join(process.cwd(), 'GeoLite2-City.mmdb');
      const dbBuffer = await fs.readFile(dbPath);
      const lookup = await open(dbBuffer);
      const result = lookup.get(ip);
      if (result) {
        geo = {
          ip,
          city: result.city?.names?.en || '',
          country: result.country?.names?.en || '',
          region: result.subdivisions?.[0]?.names?.en || '',
          latitude: result.location?.latitude || null,
          longitude: result.location?.longitude || null
        };
      }
    } catch (e) {
      // fallback: just return IP
    }
  }

  return new Response(
    JSON.stringify(geo),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
