import { NextRequest, NextResponse } from "next/server";
import API_CONFIG from "../../../components/lib/config/config";

export async function GET(req: NextRequest) {
  // Access campaignId via URL pathname
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  const campaignId = parts[3];

  if (!campaignId) {
    return NextResponse.json({ error: "Missing campaignId" }, { status: 400 });
  }

  const targetUrl = `${API_CONFIG.BASE_URL}/campaigns/${campaignId}/insights/stream`;

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        Accept: "text/event-stream",
      },
    });

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: "Unable to connect to SSE server" },
        { status: upstreamRes.status }
      );
    }

    return new NextResponse(upstreamRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
