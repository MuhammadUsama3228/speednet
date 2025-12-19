
export const runtime = 'edge';

export async function GET(request) {
    // Prevent caching deeply
    const headers = {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Timing-Allow-Origin': '*',
    };

    try {
        const cfUrl = `https://speed.cloudflare.com/__down?bytes=0&r=${Math.random()}`;

        // We only care about the time to first byte/header here effectively
        const response = await fetch(cfUrl, {
            cache: 'no-store',
            headers: {
                'Accept': '*/*',
            }
        });

        if (!response.ok) {
            throw new Error('Upstream ping failed');
        }

        return new Response('pong', {
            status: 200,
            headers
        });

    } catch (e) {
        // Fallback if offline
        return new Response('pong', {
            status: 200,
            headers
        });
    }
}

export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
