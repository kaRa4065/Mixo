import { NextResponse } from 'next/server'

const sample = {
  "campaigns": [
    {
      "id": "camp_001",
      "name": "Summer Sale - Meta",
      "brand_id": "brand_001",
      "status": "active",
      "budget": 10000,
      "daily_budget": 500,
      "platforms": ["meta"],
      "created_at": "2025-11-01T10:00:00Z"
    }
  ],
  "total": 14
}

export async function GET() {
  return NextResponse.json(sample)
}
