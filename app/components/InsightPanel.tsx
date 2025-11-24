"use client";

import { Card, Row, Col, Skeleton } from "antd";
import {
  BarChartOutlined,
  DollarOutlined,
  RiseOutlined,
  ArrowDownOutlined,
  PercentageOutlined,
  EyeOutlined,
  AimOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import { CampaignInsights } from "../types/insights";
const CardLoading = () => {
  return (
    <Row gutter={[16, 16]} className="w-full max-w-full">
      {[1, 2, 3, 4].map((i) => (
        <Col key={i} xs={24} sm={12} md={12} lg={6}>
          <Card
            style={{ borderRadius: 12 }}
            className="px-6 py-4 shadow-md flex flex-col"
            id="card-dashboard"
          >
            <section className="px-0 flex items-center w-full">
              {/* Icon circle skeleton */}
              <div className="flex items-center gap-4 mr-2">
                <Skeleton.Avatar active size="large" shape="circle" />
              </div>

              {/* Text skeleton */}
              <div className="flex flex-col justify-center items-center w-full">
                {/* Simple single-line skeleton — won't overflow */}
                <Skeleton
                  active
                  title={false}
                  paragraph={{ rows: 1, width: "70%" }}
                />
                <Skeleton
                  active
                  title={false}
                  paragraph={{ rows: 1, width: "70%" }}
                />
              </div>
            </section>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
type Props = {
  data: CampaignInsights | null;
  loading: boolean;
};

export default function InsightsCards({ data, loading }: Props) {
  if (loading) return <CardLoading />;

  const safeData: CampaignInsights = {
    total_campaigns: data?.total_campaigns ?? 0,
    total_impressions: data?.total_impressions ?? 0,
    total_clicks: data?.total_clicks ?? 0,
    total_conversions: data?.total_conversions ?? 0,
    total_spend: data?.total_spend ?? 0,
    avg_ctr: data?.avg_ctr ?? 0,
    avg_cpc: data?.avg_cpc ?? 0,
    avg_conversion_rate: data?.avg_conversion_rate ?? 0,
    active_campaigns: data?.active_campaigns ?? 0,
    paused_campaigns: data?.paused_campaigns ?? 0,
    completed_campaigns: data?.completed_campaigns ?? 0,
    timestamp: data?.timestamp ?? "",
  };
  const insightsList = [
    {
      title: "Total Campaigns",
      value: safeData?.total_campaigns,
      icon: <BarChartOutlined style={{ fontSize: 20, color: "#1890ff" }} />,
    },
    {
      title: "Total Impressions",
      value: safeData?.total_impressions.toLocaleString(),
      icon: <EyeOutlined style={{ fontSize: 28, color: "#13c2c2" }} />,
    },
    {
      title: "Total Clicks",
      value: safeData?.total_clicks.toLocaleString(),
      icon: <AimOutlined style={{ fontSize: 28, color: "#eb2f96" }} />,
    },
    {
      title: "Total Conversions",
      value: safeData?.total_conversions,
      icon: <ShoppingCartOutlined style={{ fontSize: 28, color: "#fa541c" }} />,
    },
    {
      title: "Total Spend",
      value: `$${safeData?.total_spend}`,
      icon: <DollarOutlined style={{ fontSize: 20, color: "#cf1322" }} />,
    },
    {
      title: "Average CTR",
      value: `${safeData?.avg_ctr}%`,
      icon: <RiseOutlined style={{ fontSize: 20, color: "#52c41a" }} />,
    },
    {
      title: "Average CPC",
      value: `$${safeData?.avg_cpc}`,
      icon: <ArrowDownOutlined style={{ fontSize: 20, color: "#2f54eb" }} />,
    },
    {
      title: "Conversion Rate",
      value: `${safeData?.avg_conversion_rate}%`,
      icon: <PercentageOutlined style={{ fontSize: 20, color: "#722ed1" }} />,
    },
  ];

  return (
    <Row gutter={[16, 16]} className="w-full max-w-full">
      {insightsList.map((item, index) => (
        <Col key={index} xs={24} sm={12} md={12} lg={6}>
          <Card
            style={{ borderRadius: 12 }}
            className="px-6 py-4 shadow-md flex flex-col cursor-auto"
            id="card-dashboard"
          >
            <section className="px-0  flex  items-center  w-full">
              <div className="flex items-center gap-4 mr-6 ">{item.icon}</div>
              <div className="flex flex-col justify-center items-center">
                <h3 className="text-xs  tracking-wide text-lighterPrimary font-bold">
                  {item.title}
                </h3>
                <p className="text-lg font-medium text-center tracking-wide text-secondary">
                  {item.value}
                </p>
              </div>
            </section>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
