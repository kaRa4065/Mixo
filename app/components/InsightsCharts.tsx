"use client";
import React, { useEffect, useState } from "react";
// import { Pie } from "@ant-design/plots";
import {
  CheckCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import { CampaignInsights } from "../types/insights";
const Pie = dynamic(() => import("@ant-design/plots").then((mod) => mod.Pie), {
  ssr: false,
  // loading: () => (
  //   <div className="h-[260px] flex items-center justify-center">
  //     Loading chart...
  //   </div>
  // ),
});
type StatusType = "Active" | "Paused" | "Completed";
type Props = {
  data: CampaignInsights | null;
  loading: boolean;
};
const ChartSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col items-center bg-white rounded-lg py-4">
      {/* Chart placeholder */}
      <div className="h-[260px] w-full flex items-center justify-center">
        <div className="h-[180px] w-[180px] rounded-full bg-gray-200 animate-pulse" />
      </div>

      {/* Skeleton metric rows */}
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
  );
};
export default function InsightsCharts({ data, loading }: Props) {
  const colors = ["#52c41a", "#faad14", "#1890ff"]; // Active, Paused, Completed in order

  const statusData: {
    type: StatusType;
    value: number | undefined;
    color: string;
  }[] = [
    {
      type: "Active",
      value: data?.active_campaigns ?? 0,
      color: "#52c41a",
    },
    {
      type: "Paused",
      value: data?.paused_campaigns ?? 0,
      color: "#faad14",
    },
    {
      type: "Completed",
      value: data?.completed_campaigns ?? 0,
      color: "#1890ff ",
    },
  ];

  /** PIE CHART CONFIG */
  const pieConfig = {
    data: statusData,
    angleField: "value",
    colorField: "type",
    scale: {
      color: {
        domain: ["Active", "Paused", "Completed"], // category order
        range: colors, // exact colors
      },
    },
    innerRadius: 0.6,
    label: false,
    legend: false,
  };

  const StatusIcon = ({ icon: Icon, color }: { icon: any; color: string }) => {
    return <Icon style={{ fontSize: 32, color }} className="mr-2" />;
  };
  if (loading) return <ChartSkeleton />;

  return (
    <div className="w-full h-full flex flex-col items-center bg-white  rounded-lg py-4">
      {/* PIE CHART */}
      <Pie {...pieConfig} height={260} />
      {/* COLORED METRIC CARDS */}
      <div className="grid grid-cols-1 gap-4 w-full pb-4">
        {statusData.map((item) => {
          const Icon =
            item.type === "Active"
              ? PlayCircleOutlined
              : item.type === "Paused"
              ? PauseCircleOutlined
              : CheckCircleOutlined;
          return (
            <div
              key={item.type}
              className="px-4 py-2 flex items-center rounded-lg gap-1 border shadow-xs"
            >
              <Icon style={{ fontSize: 32, color: item.color }} />
              <p className="text-sm text-secondary tracking-wide ml-2">
                {item.type}
              </p>
              <p className="text-xl font-medium ml-auto text-secondary tracking-wider">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
