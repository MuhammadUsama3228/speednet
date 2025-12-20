import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const isp = searchParams.get('isp') === 'true';
    const distance = searchParams.get('distance') || 'km';

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const isVercel = process.env.VERCEL === '1' || request.headers.get('x-vercel-id');

    const response = {
        processedString: isVercel ? clientIp : (clientIp + (isp ? " - Local Node" : "")),
        rawIspInfo: isp ? {
            isp: isVercel ? "Vercel Edge Network" : "Localhost Developer Network",
            country: request.headers.get('x-vercel-ip-country') || "Local",
            city: request.headers.get('x-vercel-ip-city') || "Localhost",
            dist: "0"
        } : null
    };

    return NextResponse.json(response, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
    });
}
