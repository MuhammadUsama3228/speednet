export async function GET(){
  return new Response(JSON.stringify({ pong: true, ts: Date.now() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  })
}
