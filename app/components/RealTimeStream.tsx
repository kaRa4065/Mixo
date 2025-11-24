"use client";
import React, { useEffect, useState } from "react";
import { handleApiError } from "./lib/handleApiError";
import { CampaignInsightsEvent } from "../types/campaign";
import API_CONFIG from "./lib/config/config";
import { SkeletonCard } from "../campaign/[id]/page";

interface MetricConfig {
  key:
    | "impressions"
    | "clicks"
    | "conversions"
    | "spend"
    | "ctr"
    | "cpc"
    | "conversion_rate";
  label: string;
  format: "number" | "currency" | "percentage";
}

const metricsConfig: MetricConfig[] = [
  { key: "impressions", label: "Impressions", format: "number" },
  { key: "clicks", label: "Clicks", format: "number" },
  { key: "conversions", label: "Conversions", format: "number" },
  { key: "spend", label: "Spend", format: "currency" },
  { key: "ctr", label: "CTR", format: "percentage" },
  { key: "cpc", label: "CPC", format: "currency" },
  { key: "conversion_rate", label: "Conversion Rate", format: "percentage" },
];

const formatMetricValue = (
  value: number | undefined,
  format: MetricConfig["format"]
) => {
  if (value === undefined || value === null) return "-";
  switch (format) {
    case "number":
      return value.toLocaleString();
    case "currency":
      return `$${value.toFixed(2)}`;
    case "percentage":
      return `${value.toFixed(2)}%`;
    default:
      return value;
  }
};

export default function RealTimeStream({ campaignId }: { campaignId: string }) {
  const [log, setLog] = useState<CampaignInsightsEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      eventSource = new EventSource(`/api/proxySSE/${campaignId}`);

      eventSource.onmessage = (event) => {
        try {
          const parsedData: CampaignInsightsEvent = JSON.parse(event.data);
          setLog(parsedData);
          setLoading(false);
        } catch (err) {
          console.error("Error parsing SSE data:", err);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE connection error:", err);
        eventSource?.close();

        // Retry after 3 seconds
        setTimeout(() => {
          console.log("Reconnecting SSE...");
          connect();
        }, 3000);
      };
    };

    connect();

    return () => {
      eventSource?.close();
    };
  }, [campaignId]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-medium mb-2 text-lighterPrimary">Event Stream</h3>
      <div className="text-xs text-gray-500 mb-2">
        Real-time events (most recent first)
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? metricsConfig.map((_, idx) => (
              <SkeletonCard key={idx} className="h-20 w-full" />
            ))
          : metricsConfig.map((metric) => (
              <div
                key={metric.key}
                className="flex items-center gap-4 bg-white p-4 border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div>
                  <p className="!text-xs text-lighter tracking-wide uppercase">
                    {metric.label}
                  </p>
                  <p className="!text-md font-semibold text-secondary mt-1">
                    {log
                      ? formatMetricValue(log[metric.key], metric.format)
                      : formatMetricValue(0, metric.format)}{" "}
                    {/* default 0 */}{" "}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
