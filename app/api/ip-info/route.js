// Simple Next.js API route for /api/ip-info
// Returns a dummy IP/location object for development

export async function GET() {
  return new Response(
    JSON.stringify({
      ip: "127.0.0.1",
      city: "Localhost",
      country: "Developmentland",
      region: "DevRegion",
      latitude: 0,
      longitude: 0
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
