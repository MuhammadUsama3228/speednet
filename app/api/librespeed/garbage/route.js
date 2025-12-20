export const runtime = 'edge';

// Pre-allocate a 1MB chunk of random data to reuse across requests
// This reduces CPU overhead and avoids crypto limits in the Edge runtime.
const CHUNK_SIZE = 1048576; // 1MB
const garbageBuffer = new Uint8Array(CHUNK_SIZE);
if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(garbageBuffer);
} else {
    for (let i = 0; i < CHUNK_SIZE; i++) garbageBuffer[i] = Math.floor(Math.random() * 256);
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let chunks = parseInt(searchParams.get('ckSize') || '4');

    // Vercel Hobby plan has a 10MB response limit. 
    // We cap at 8 chunks (8MB) to stay safe and prevent connection termination.
    if (chunks > 8) chunks = 8;
    if (chunks <= 0) chunks = 4;

    const stream = new ReadableStream({
        start(controller) {
            for (let i = 0; i < chunks; i++) {
                controller.enqueue(new Uint8Array(garbageBuffer));
            }
            controller.close();
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename=random.dat',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Access-Control-Allow-Origin': '*',
        }
    });
}
