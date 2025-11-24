"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import RealTimeStream from "../../components/RealTimeStream";
import CampaignService from "../../services/campaignService";
import {
  Campaign,
  CampaignDetails,
  CampaignInsights,
} from "../../types/campaign";
import { handleApiError } from "../../components/lib/handleApiError";
import PageHeader from "../../components/pageHeader";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
export const metricsConfig: {
  key: keyof CampaignInsights;
  label: string;
  format: "datetime" | "number" | "currency" | "percent";
}[] = [
  { key: "timestamp", label: "Timestamp", format: "datetime" },
  { key: "impressions", label: "Impressions", format: "number" },
  { key: "clicks", label: "Clicks", format: "number" },
  { key: "conversions", label: "Conversions", format: "number" },
  { key: "spend", label: "Spend", format: "currency" },
  { key: "ctr", label: "CTR", format: "percent" },
  { key: "cpc", label: "CPC", format: "currency" },
  { key: "conversion_rate", label: "Conversion Rate", format: "percent" },
];
export const formatMetricValue = (value: any, format: string) => {
  if (value === null || value === undefined) return "-";

  switch (format) {
    case "datetime": {
      const date = new Date(value);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    case "number":
      return value.toLocaleString();

    case "currency":
      return `$${value.toFixed(2)}`;

    case "percent":
      return `${value}%`;

    default:
      return value;
  }
};
export const SkeletonCard = ({ className = "h-20 w-full" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);
export default function CampaignDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [data, setData] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [eventData, setEventData] = useState<CampaignInsights | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      let campaignData: CampaignDetails | null = null;
      let insightsData: CampaignInsights | null = null;

      try {
        const campaignRes = await CampaignService.getCampaignById(id);
        campaignData = campaignRes.campaign;
      } catch (err) {
        handleApiError(err);
        
        campaignData = {
          id,
          name: "-",
          budget: 0,
          daily_budget: 0,
          platforms: ["-"],
          status: "-",
          created_at: "",
          brand_id: "",
        };
      }

      try {
        const insightsRes = await CampaignService.getCampaignInsights(id);
        insightsData = insightsRes.insights;
      } catch (err) {
        handleApiError(err);
        insightsData = {
          timestamp: "",
          impressions: 0,
          clicks: 0,
          conversions: 0,
          spend: 0,
          ctr: 0,
          cpc: 0,
          conversion_rate: 0,
          campaign_id: "-",
        };
      }

      setData(campaignData);
      setEventData(insightsData);
      setLoading(false);
    };

    if (id) loadData();
  }, [id]);

  return (
    <div className="space-y-6 ">
      <PageHeader
        title={
          <div className="flex ">
            <button
              onClick={() => router.push("/")}
              className="px-2 py-1 border mr-4 rounded-lg"
            >
              <LeftOutlined className="h-4 w-4 text-primary" />
            </button>
            <div>
              <h1 className="text-xl font-medium tracking-wider text-primary !mb-0 flex items-center  ">
                {data?.name??"Campaign Details"}{" "}
                <span
                  className={`px-3 py-1 rounded-full !text-xs font-medium ml-2
              ${
                data?.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
                >
                  {data?.status.toUpperCase()}
                </span>
              </h1>
              <p className="text-lighter text-xs mt-1">
                Campaign ID: {data?.id} |{" "}
                <span className="text-xs text-lighter mr-2">
                  (Created on:{" "}
                  {data?.created_at &&
                    new Date(data?.created_at).toLocaleDateString()}
                  )
                </span>
              </p>
            </div>
          </div>
        }
      />
      <section className="px-6 space-y-6">
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Budget */}
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-xs uppercase text-lighterPrimary">
                Budget
              </p>
              {loading ? (
                <SkeletonCard className="h-10 w-24 mt-1" />
              ) : (
                <p className="text-3xl font-semibold mt-1 text-secondary">
                  ${data?.budget.toLocaleString()}
                </p>
              )}
            </div>

            {/* Daily Budget */}
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-xs uppercase text-lighterPrimary">
                Daily Budget
              </p>
              {loading ? (
                <SkeletonCard className="h-10 w-24 mt-1" />
              ) : (
                <p className="text-3xl font-semibold mt-1 text-secondary">
                  ${data?.daily_budget.toLocaleString()}
                </p>
              )}
            </div>

            {/* Platforms */}
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-xs uppercase text-lighterPrimary">
                Platforms
              </p>
              {loading ? (
                <div className="flex gap-2 mt-2">
                  <SkeletonCard className="h-6 w-16" />
                  <SkeletonCard className="h-6 w-16" />
                </div>
              ) : (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {data?.platforms.map((p) => (
                    <span
                      key={p}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs text-secondary font-medium"
                    >
                      {p.toUpperCase()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Latest Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold text-lg mb-4 text-lighterPrimary">
              Latest Metrics
            </h3>
            {loading || !eventData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metricsConfig.map((_, idx) => (
                  <SkeletonCard key={idx} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metricsConfig.map((metric) => (
                  <div
                    key={metric.key}
                    className="p-4 border rounded-xl bg-gradient-to-b from-gray-50 to-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="!text-xs text-lighter tracking-wide uppercase">
                      {metric.label}
                    </p>
                    <p className="!text-md font-semibold text-secondary mt-1">
                      {formatMetricValue(eventData[metric.key], metric.format)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RealTimeStream */}
          <RealTimeStream campaignId={id} />
        </div>
      </section>
    </div>
  );
}
