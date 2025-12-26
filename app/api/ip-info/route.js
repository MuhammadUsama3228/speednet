// Next.js API route for /api/ip-info
// Uses MaxMind GeoLite2-City.mmdb to detect client location from IP, no third-party API
import { Reader } from '@maxmind/geoip2-node';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET(request) {
  try {
    // Get real IP address from headers (works in production)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');

    // Priority: Cloudflare IP > Forwarded > Real IP
    let ip = cfConnectingIp || (forwarded ? forwarded.split(',')[0].trim() : null) || realIp;

    // For localhost testing, use a public IP
    if (!ip || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.')) {
      ip = '8.8.8.8'; // Fallback for demo
    }

    // Lookup geolocation using MaxMind GeoIP2
    try {
      const dbPath = path.join(process.cwd(), 'GeoLite2-City.mmdb');
      const reader = await Reader.open(dbPath);
      const response = reader.city(ip);

      if (response) {
        return NextResponse.json({
          ip: ip,
          city: response.city?.names?.en || null,
          country: response.country?.isoCode || null,
          country_name: response.country?.names?.en || null,
          region: response.subdivisions?.[0]?.names?.en || null,
          latitude: response.location?.latitude || null,
          longitude: response.location?.longitude || null,
          timezone: response.location?.timeZone || null,
          success: true
        });
      }
    } catch (dbError) {
      // Fall through to fallback return
    }

    // If MaxMind fails or file missing, return basic info
    return NextResponse.json({
      ip: ip,
      city: null,
      country: null,
      country_name: null,
      region: null,
      timezone: null,
      success: true,
      note: 'GeoLite2-City.mmdb likely missing'
    });
  } catch (error) {
    return NextResponse.json({
      ip: 'Unknown',
      city: 'Unknown',
      country: 'Unknown',
      country_name: 'Unknown',
      error: error.message
    }, { status: 500 });
  }
}
