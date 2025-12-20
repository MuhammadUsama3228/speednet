export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // Prevent static generation attempts

const CHUNK_SIZE = 1048576; // 1MB
let garbageBuffer = null;

function getGarbageBuffer() {
    if (!garbageBuffer) {
        garbageBuffer = new Uint8Array(CHUNK_SIZE);
        if (typeof crypto !== 'undefined') {
            crypto.getRandomValues(garbageBuffer);
        } else {
            for (let i = 0; i < CHUNK_SIZE; i++) garbageBuffer[i] = Math.floor(Math.random() * 256);
        }
    }
    return garbageBuffer;
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
                controller.enqueue(new Uint8Array(getGarbageBuffer()));
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
