import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const isp = searchParams.get('isp') === 'true';
    const distance = searchParams.get('distance') || 'km';

    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';

    const response = {
        processedString: clientIp + (isp ? " - Local Development Server" : ""),
        rawIspInfo: isp ? {
            isp: "Localhost Developer Network",
            country: "Local",
            city: "Localhost",
            dist: distance === 'km' ? "0" : "0"
        } : null
    };

    return NextResponse.json(response, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
    });
}
