"use client";
import React, { useEffect, useState, useRef, memo } from "react";
import { SkeletonCard } from "./helper";

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
  if (value == null) return "-";
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

// Individual metric card with change highlight
const MetricCard = memo(
  ({
    label,
    value,
    prevValue,
  }: {
    label: string;
    value: number;
    prevValue: number | undefined;
  }) => {
    const [flash, setFlash] = useState<"increase" | "decrease" | null>(null);

    useEffect(() => {
      if (prevValue !== undefined && value !== prevValue) {
        setFlash(value > prevValue ? "increase" : "decrease");
        const timeout = setTimeout(() => setFlash(null), 500);
        return () => clearTimeout(timeout);
      }
    }, [value, prevValue]);

    return (
      <div
        className={`flex items-center gap-4 bg-white p-4 border rounded-xl shadow-sm hover:shadow-md transition
          ${flash === "increase" ? "bg-green-50 animate-pulse" : ""}
          ${flash === "decrease" ? "bg-red-50 animate-pulse" : ""}
        `}
      >
        <div>
          <p className="!text-xs text-lighter tracking-wide uppercase">
            {label}
          </p>
          <p className="!text-md font-semibold text-secondary mt-1">{value}</p>
        </div>
      </div>
    );
  }
);

export default function RealTimeStream({ campaignId }: { campaignId: string }) {
  const [log, setLog] = useState<Record<string, number>>({});
  const prevLogRef = useRef<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      eventSource = new EventSource(`/api/proxySSE/${campaignId}`);

      eventSource.onmessage = (event) => {
        try {
          const parsedData: Record<string, number> = JSON.parse(event.data);
          prevLogRef.current = log;
          setLog(parsedData);
          setLoading(false);
        } catch (err) {
          console.error("Error parsing SSE data:", err);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        eventSource?.close();
        setTimeout(connect, 3000); // Retry connection
      };
    };

    connect();

    return () => {
      eventSource?.close();
    };
  }, [campaignId, log]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-medium mb-2 text-lighterPrimary">Event Stream</h3>
      <div className="text-xs text-gray-500 mb-2">
        Real-time metrics (most recent first)
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? metricsConfig.map((_, idx) => (
              <SkeletonCard key={idx} className="h-20 w-full" />
            ))
          : metricsConfig.map((metric) => (
              <MetricCard
                key={metric.key}
                label={metric.label}
                value={formatMetricValue(log[metric.key], metric.format) as any}
                prevValue={prevLogRef.current[metric.key]}
              />
            ))}
      </div>
    </div>
  );
}
