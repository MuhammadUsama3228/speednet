// Upload and ping endpoint - accepts data locally for accurate progress tracking

export const runtime = 'edge';

export async function GET(request) {
    // Ping test - return immediately for fastest response
    return new Response('', {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store, no-cache',
            'Access-Control-Allow-Origin': '*',
            'Timing-Allow-Origin': '*',
        }
    });
}

export async function POST(request) {
    // Upload test - consume the data stream quickly
    // The browser measures upload speed based on upload.onprogress events
    // We just need to accept the data as fast as possible

    try {
        const reader = request.body.getReader();
        let bytes = 0;

        // Read all chunks
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            bytes += value.length;
        }

        return new Response(JSON.stringify({ bytes }), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (e) {
        return new Response('', {
            status: 200,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }
}

export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
