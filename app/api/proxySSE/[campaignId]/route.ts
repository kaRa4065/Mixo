import { NextRequest } from "next/server";
import API_CONFIG from "../../../components/lib/config/config";

export async function GET(
  req: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  const { campaignId } = params;

  const targetUrl = `${API_CONFIG.BASE_URL}/campaigns/${campaignId}/insights/stream`;

  const upstreamRes = await fetch(targetUrl, {
    headers: {
      Accept: "text/event-stream",
    },
  });

  if (!upstreamRes.ok) {
    return new Response(
      JSON.stringify({ error: "Unable to connect to SSE server" }),
      {
        status: upstreamRes.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Stream the upstream SSE to the client
  return new Response(upstreamRes.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
