export async function POST(req){
  try{
    const start = Date.now()
    // Read the body fully
    const data = await req.arrayBuffer()
    const duration = Date.now() - start
    const bytes = data.byteLength || 0
    return new Response(JSON.stringify({ bytes, duration }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    })
  }catch(err){
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
