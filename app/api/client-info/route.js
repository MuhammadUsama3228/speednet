export async function GET(request) {
  try {
    // Get the real client IP from Vercel headers
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     request.headers.get('x-real-ip') ||
                     request.headers.get('cf-connecting-ip') ||
                     'Unknown';

    // If we can't get the client IP, try to get it from the external service
    let ipToQuery = clientIP;
    if (clientIP === 'Unknown' || !clientIP) {
      // Fallback: let the service detect the IP
      ipToQuery = '';
    }

    const apiUrl = ipToQuery ? `https://ipapi.co/${ipToQuery}/json/` : 'https://ipapi.co/json/';

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'SpeedNet-App/1.0'
      },
      // Add timeout
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Override with the actual client IP if we got it from headers
    const finalIP = clientIP !== 'Unknown' ? clientIP : data.ip;

    return Response.json({
      ip: finalIP || 'Unable to detect',
      version: data.version || 'Unable to detect',
      city: data.city || 'Unable to detect',
      country_name: data.country_name || 'Unable to detect',
      region: data.region || 'Unable to detect',
      isp: data.org || data.isp || 'Unable to detect',
      status: 'success'
    });
  } catch (error) {
    console.error('Error fetching client info:', error.message);

    // Provide more specific error messages
    let errorReason = 'Network error';
    if (error.name === 'AbortError') {
      errorReason = 'Request timeout';
    } else if (error.message.includes('CORS')) {
      errorReason = 'CORS policy blocked request';
    } else if (error.message.includes('status')) {
      errorReason = 'External API unavailable';
    }

    return Response.json({
      ip: 'Unknown',
      version: 'Unknown',
      city: 'Unknown',
      country_name: 'Unknown',
      region: 'Unknown',
      isp: 'Unknown',
      status: 'error',
      reason: errorReason
    });
  }
}
