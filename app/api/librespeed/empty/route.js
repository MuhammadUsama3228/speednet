export const runtime = 'edge';

export async function GET() {
    return new Response('', {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Connection': 'keep-alive'
        }
    });
}

export async function POST(request) {
    // Consume the body
    await request.arrayBuffer();

    return new Response('', {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Connection': 'keep-alive'
        }
    });
}

export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Content-Encoding',
        }
    });
}
