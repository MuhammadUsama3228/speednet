export async function GET() {
  try {
    const response = await fetch('https://ipapi.co/json/', {
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

    return Response.json({
      ip: data.ip || 'Unable to detect',
      version: data.version || 'Unable to detect',
      city: data.city || 'Unable to detect',
      country_name: data.country_name || 'Unable to detect',
      region: data.region || 'Unable to detect',
      isp: data.org || 'Unable to detect',
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
