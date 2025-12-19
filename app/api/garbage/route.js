// Proxy to Cloudflare's speed test for accurate internet speed measurement

export const runtime = 'edge';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const bytes = parseInt(searchParams.get('bytes') || '10000000', 10);

    try {
        // Proxy to Cloudflare's speed test endpoint
        const cfUrl = `https://speed.cloudflare.com/__down?bytes=${bytes}`;

        const response = await fetch(cfUrl, {
            cache: 'no-store',
            headers: {
                'Accept': '*/*',
            }
        });

        if (!response.ok) {
            throw new Error('Cloudflare request failed');
        }

        // Stream the response through our proxy
        return new Response(response.body, {
            status: 200,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Cache-Control': 'no-store, no-cache',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (error) {
        console.error('Download proxy error:', error);

        // Fallback: generate local data (less accurate but works)
        const size = Math.min(bytes, 50 * 1024 * 1024);
        const chunk = new Uint8Array(size);
        crypto.getRandomValues(chunk);

        return new Response(chunk, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Cache-Control': 'no-store',
            }
        });
    }
}

export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
        }
    });
}
