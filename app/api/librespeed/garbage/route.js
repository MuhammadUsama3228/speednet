export const runtime = 'edge';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let chunks = parseInt(searchParams.get('ckSize') || '4');
    if (chunks > 1024) chunks = 1024;
    if (chunks <= 0) chunks = 4;

    const chunkSize = 1048576; // 1MB
    const totalSize = chunks * chunkSize;

    // We can generate a single 1MB buffer and repeat it
    const buffer = new Uint8Array(chunkSize);
    crypto.getRandomValues(buffer);

    const stream = new ReadableStream({
        async start(controller) {
            for (let i = 0; i < chunks; i++) {
                controller.enqueue(buffer);
            }
            controller.close();
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Description': 'File Transfer',
            'Content-Disposition': 'attachment; filename=random.dat',
            'Content-Transfer-Encoding': 'binary',
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Access-Control-Allow-Origin': '*',
        }
    });
}
