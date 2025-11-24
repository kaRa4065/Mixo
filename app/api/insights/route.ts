import { NextResponse } from 'next/server'

const insights = {
  "insights": {
    "timestamp": "2025-11-22T14:00:00Z",
    "total_campaigns": 14,
    "active_campaigns": 8,
    "paused_campaigns": 4,
    "completed_campaigns": 2,
    "total_impressions": 350000,
    "total_clicks": 15000,
    "total_conversions": 750,
    "total_spend": 28500.5,
    "avg_ctr": 4.29,
    "avg_cpc": 1.9,
    "avg_conversion_rate": 5
  }
}

export async function GET() {
  return NextResponse.json(insights)
}
