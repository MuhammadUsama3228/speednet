// API route to trigger IndexNow ping
// Usage: POST to /api/indexnow with { url: 'https://scanpings.net/your-updated-page' }

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid URL' }, { status: 400 });
    }
    // Replace with your IndexNow key
    const INDEXNOW_KEY = 'YOUR_INDEXNOW_KEY';
    const endpoint = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${INDEXNOW_KEY}`;
    const res = await fetch(endpoint, { method: 'GET' });
    const data = await res.text();
    return NextResponse.json({ success: true, response: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
