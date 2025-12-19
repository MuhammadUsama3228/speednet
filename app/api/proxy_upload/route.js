
export const runtime = 'edge';

export async function POST(request) {
    try {
        const cfUrl = `https://speed.cloudflare.com/__up?r=${Math.random()}`;

        // Pass the request body directly to Cloudflare
        // This proxies the upload stream
        const response = await fetch(cfUrl, {
            method: 'POST',
            body: request.body,
            duplex: 'half', // Required for streaming uploads in some envs
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        });

        // We don't really care about the response content, just that it finished
        const text = await response.text();

        return new Response(text, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-store',
            }
        });

    } catch (e) {
        console.error('Upload proxy error:', e);
        return new Response('Error', { status: 500 });
    }
}

export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
