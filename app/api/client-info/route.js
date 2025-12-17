export async function GET(request) {
  // Get client IP from request headers (for Vercel)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const clientIp = forwarded ? forwarded.split(',')[0] : realIp || request.ip || 'Unknown'

  console.log('Server-side detected IP:', clientIp)

  // For Vercel/serverless deployments, client IP detection is unreliable
  // Return server-detected IP along with client-side flag
  return Response.json({
    status: 'client_side_required',
    server_ip: clientIp,
    reason: 'Using client-side detection for accurate results'
  });
}
