"use client";

import React, { useEffect, useState, useCallback } from "react";
import CampaignCard from "./CampaignCard";
import InsightsCharts from "./InsightsCharts";
import InsightsCards from "./InsightPanel";
import PageHeader from "./pageHeader";
import { CampaignInsights } from "../types/insights";
import CampaignInsightService from "../services/CampaignInsightService";
import { handleApiError } from "./lib/handleApiError";

export default function DashboardPage() {
  const [state, setState] = useState<{
    data: CampaignInsights | null;
    loading: boolean;
  }>({ data: null, loading: true });

  const loadCampaigns = useCallback(async () => {
    setState({ data: null, loading: true });
    try {
      const res = await CampaignInsightService.getInsights();
      setState({ data: res?.insights || null, loading: false });
    } catch (err) {
      handleApiError(err);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const { data, loading } = state;

  return (
    <div className="w-full overflow-x-hidden">
      <PageHeader title="Welcome!" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full p-6">
        {/* LEFT SIDE */}
        <div className="col-span-3 flex flex-col gap-6">
          <InsightsCards data={data} loading={loading} />
          <CampaignCard />
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-white p-4 rounded-xl shadow w-full overflow-hidden">
            <h1 className="tracking-wider text-lighterPrimary">
              Campaign Status
            </h1>
            <InsightsCharts data={data} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
