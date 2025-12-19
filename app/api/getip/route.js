// Get client IP, location, and ISP information

export const runtime = 'edge';

export async function GET(request) {
    // Get IP from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');

    let clientIp = cfConnectingIp || (forwarded ? forwarded.split(',')[0].trim() : null) || realIp;

    // Try to get detailed info from ip-api.com (free, no API key needed)
    try {
        const response = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query', {
            cache: 'no-store',
            signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
            const data = await response.json();

            if (data.status === 'success') {
                return new Response(JSON.stringify({
                    ip: data.query,
                    city: data.city || 'Unknown',
                    region: data.regionName || data.region || '',
                    country: data.country || 'Unknown',
                    countryCode: data.countryCode || '',
                    zip: data.zip || '',
                    lat: data.lat,
                    lon: data.lon,
                    timezone: data.timezone || '',
                    isp: data.isp || 'Unknown ISP',
                    org: data.org || '',
                    asn: data.as || '',
                    // Formatted strings for display
                    location: `${data.city || 'Unknown'}, ${data.regionName || ''} ${data.country || ''}`.trim().replace(/\s+/g, ' '),
                    ispInfo: data.isp || data.org || 'Unknown ISP',
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store',
                        'Access-Control-Allow-Origin': '*',
                    }
                });
            }
        }
    } catch (e) {
        console.error('IP lookup error:', e);
    }

    // Fallback: Try ipwho.is
    try {
        const response = await fetch('https://ipwho.is/', {
            cache: 'no-store',
            signal: AbortSignal.timeout(3000)
        });

        if (response.ok) {
            const data = await response.json();
            return new Response(JSON.stringify({
                ip: data.ip || clientIp || 'Unknown',
                city: data.city || 'Unknown',
                region: data.region || '',
                country: data.country || 'Unknown',
                countryCode: data.country_code || '',
                lat: data.latitude,
                lon: data.longitude,
                timezone: data.timezone?.id || '',
                isp: data.connection?.isp || 'Unknown ISP',
                org: data.connection?.org || '',
                asn: data.connection?.asn_org || '',
                location: `${data.city || 'Unknown'}, ${data.region || ''} ${data.country || ''}`.trim().replace(/\s+/g, ' '),
                ispInfo: data.connection?.isp || 'Unknown ISP',
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }
    } catch (e) {
        console.error('Fallback IP lookup error:', e);
    }

    // Final fallback
    return new Response(JSON.stringify({
        ip: clientIp || 'Unknown',
        city: 'Unknown',
        country: 'Unknown',
        isp: 'Unknown ISP',
        location: 'Unknown Location',
        ispInfo: 'Unknown ISP',
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Access-Control-Allow-Origin': '*',
        }
    });
}
