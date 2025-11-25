"use client";

import React, { useMemo, memo } from "react";
import dynamic from "next/dynamic";
import {
  CheckCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { CampaignInsights } from "../types/insights";

const Pie = dynamic(() => import("@ant-design/plots").then((mod) => mod.Pie), {
  ssr: false,
});

type StatusType = "Active" | "Paused" | "Completed";

type Props = {
  data: CampaignInsights | null;
  loading: boolean;
};

// Skeleton for loading state
const ChartSkeleton = memo(() => (
  <div className="w-full h-full flex flex-col items-center bg-white rounded-lg py-4">
    <div className="h-[260px] w-full flex items-center justify-center">
      <div className="h-[180px] w-[180px] rounded-full bg-gray-200 animate-pulse" />
    </div>
    <div className="grid grid-cols-1 gap-4 w-full pb-4 px-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="px-4 py-2 flex items-center rounded-lg gap-2 border shadow-xs"
        >
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-12 bg-gray-200 rounded animate-pulse ml-auto" />
        </div>
      ))}
    </div>
  </div>
));

// Individual status row
const StatusRow = memo(({ type, value, color }: { type: StatusType; value: number; color: string }) => {
  const Icon = useMemo(() => {
    switch (type) {
      case "Active":
        return PlayCircleOutlined;
      case "Paused":
        return PauseCircleOutlined;
      case "Completed":
      default:
        return CheckCircleOutlined;
    }
  }, [type]);

  return (
    <div className="px-4 py-2 flex items-center rounded-lg gap-1 border shadow-xs">
      <Icon style={{ fontSize: 32, color }} />
      <p className="text-sm text-secondary tracking-wide ml-2">{type}</p>
      <p className="text-xl font-medium ml-auto text-secondary tracking-wider">{value}</p>
    </div>
  );
});

const InsightsCharts = ({ data, loading }: Props) => {
  const statusData = useMemo(() => [
    { type: "Active" as StatusType, value: data?.active_campaigns ?? 0, color: "#52c41a" },
    { type: "Paused" as StatusType, value: data?.paused_campaigns ?? 0, color: "#faad14" },
    { type: "Completed" as StatusType, value: data?.completed_campaigns ?? 0, color: "#1890ff" },
  ], [data]);

  const pieConfig = useMemo(() => ({
    data: statusData,
    angleField: "value",
    colorField: "type",
    scale: {
      color: {
        domain: ["Active", "Paused", "Completed"],
        range: statusData.map((s) => s.color),
      },
    },
    innerRadius: 0.6,
    label: false,
    legend: false,
  }), [statusData]);

  if (loading) return <ChartSkeleton />;

  return (
    <div className="w-full h-full flex flex-col items-center bg-white rounded-lg py-4">
      {/* PIE CHART */}
      <Pie {...pieConfig} height={260} />
      {/* COLORED METRIC CARDS */}
      <div className="grid grid-cols-1 gap-4 w-full pb-4">
        {statusData.map((item) => (
          <StatusRow key={item.type} type={item.type} value={item.value} color={item.color} />
        ))}
      </div>
    </div>
  );
};

export default memo(InsightsCharts);
