import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const campaign_id = url.searchParams.get('campaign_id') ?? 'camp_001'

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    start(controller) {
      // Sample event payload
      const payload = {
        "campaign_id": campaign_id,
        "timestamp": "2025-11-22T14:00:00Z",
        "impressions": 45230,
        "clicks": 1245,
        "conversions": 67,
        "spend": 3421.50,
        "ctr": 2.75,
        "cpc": 2.75,
        "conversion_rate": 5.38
      }

      function send() {
        const data = `data: ${JSON.stringify(payload)}\n\n`
        controller.enqueue(encoder.encode(data))
        // For demo, send every 10 seconds; in production you'd stream true real-time updates
        // Here we stop after one send to keep behavior predictable for local dev.
        controller.close()
      }

      send()
    }
  })

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
