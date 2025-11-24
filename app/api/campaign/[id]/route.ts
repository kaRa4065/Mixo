import { NextResponse } from 'next/server'

const sampleSingle = {
  "campaign": {
    "id": "camp_001",
    "name": "Summer Sale - Meta",
    "brand_id": "brand_001",
    "status": "active",
    "budget": 10000,
    "daily_budget": 500,
    "platforms": ["meta"],
    "created_at": "2025-11-01T10:00:00Z"
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  // In a real app you'd fetch from a DB here.
  return NextResponse.json(sampleSingle)
}
