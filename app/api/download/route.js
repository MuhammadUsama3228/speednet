/**
 * Returns a 10MB random buffer for download testing.
 */
export async function GET(){
  const size = 10 * 1024 * 1024 // 10MB
  // Create a Uint8Array filled with deterministic bytes to keep memory reasonable
  const chunk = new Uint8Array(1024)
  for(let i=0;i<chunk.length;i++) chunk[i] = i % 256

  // Stream the content
  const stream = new ReadableStream({
    start(controller){
      let sent = 0
      function push(){
        if(sent >= size){
          controller.close()
          return
        }
        if(controller.desiredSize === null){
          return
        }
        const remaining = Math.min(chunk.length, size - sent)
        try {
          controller.enqueue(chunk.slice(0, remaining))
        } catch (e) {
          return
        }
        sent += remaining
        setTimeout(push, 0)
      }
      push()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(size),
      'Cache-Control': 'no-store'
    }
  })
}
