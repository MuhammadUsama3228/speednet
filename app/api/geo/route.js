export async function GET() {
  return Response.json({
    ip: '127.0.0.1',
    city: 'Local Database',
    country: 'Available',
    country_code: 'DB',
    region: 'GeoLite2-City'
  });
}
