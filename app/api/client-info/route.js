export async function GET(request) {
  // For Vercel/serverless deployments, client IP detection is unreliable
  // Return a flag to trigger client-side detection
  return Response.json({
    status: 'client_side_required',
    reason: 'Using client-side detection for accurate results'
  });
}
