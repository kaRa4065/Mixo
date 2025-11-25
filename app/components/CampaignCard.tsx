"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card, Skeleton } from "antd";
import { useRouter } from "next/navigation";
import { LeftOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import { handleApiError } from "./lib/handleApiError";
import CampaignService from "../services/campaignService";
import { Campaign } from "../types/campaign";

const SkeletonCard = () => (
  <Card className="shadow-md bg-white !rounded-lg p-4" id="card-dashboard">
    <Skeleton active paragraph={{ rows: 2 }} />
  </Card>
);

export default function CampaignCard() {
  const router = useRouter();
  const [state, setState] = useState<{
    campaigns: Campaign[];
    loading: boolean;
  }>({
    campaigns: [],
    loading: false,
  });

  const [page, setPage] = useState<number>(1);
  const pageSize = 4;

  useEffect(() => {
    const loadCampaigns = async () => {
      setState({ campaigns: [], loading: true });
      try {
        const res = await CampaignService.getCampaigns();
        setState({ campaigns: res.campaigns, loading: false });
      } catch (err) {
        handleApiError(err);
        setState({ campaigns: [], loading: false });
      }
    };

    loadCampaigns();
  }, []);

  const totalPages = useMemo(
    () => Math.ceil(state?.campaigns?.length / pageSize),
    [state?.campaigns?.length]
  );

  const displayedCampaigns = useMemo(
    () => state?.campaigns?.slice((page - 1) * pageSize, page * pageSize),
    [state?.campaigns, page]
  );

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center pr-4 mb-1">
        <h2 className="text-lg font-medium tracking-wider text-lighterPrimary">
          Recent Campaigns
        </h2>
        {state.campaigns.length > pageSize && (
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 ${
                page === 1 ? "cursor-not-allowed" : "cursor-pointer"
              } border-2`}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              <LeftOutlined className="text-lighterPrimary h-3 w-3 font-bold" />
            </button>
            <button
              className={`px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 ${
                page === totalPages ? "cursor-not-allowed" : "cursor-pointer"
              } border-2`}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              <RightOutlined className="text-lighterPrimary h-3 w-3 font-bold" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {state.loading ? (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : displayedCampaigns.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {displayedCampaigns.map((campaign) => (
            <Card
              hoverable
              key={campaign.id}
              className="shadow-md bg-white !rounded-lg px-4 py-4 "
              onClick={() => router.push(`/campaign/${campaign.id}`)}
              id="card-dashboard"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/campaign/${campaign.id}`}>
                    <h3 className="text-md font-semibold hover:underline tracking-wider text-lighterPrimary !mb-0">
                      {campaign.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-lighter tracking-wide">
                    Created: {new Date(campaign.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    campaign.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {campaign.status}
                </span>
              </div>

              <div className="mt-3 text-sm space-y-1 text-secondary tracking-wide">
                <div>
                  Budget:{" "}
                  <span className="font-medium text-secondary tracking-wider ml-2">
                    ${campaign.budget?.toLocaleString() ?? 0}
                  </span>
                </div>
                <div>
                  Daily Budget:{" "}
                  <span className="font-medium text-secondary tracking-wider ml-2">
                    ${campaign.daily_budget?.toLocaleString() ?? 0}
                  </span>
                </div>
                <div>
                  Platforms:{" "}
                  <span className="font-medium text-secondary tracking-wider ml-2 capitalize">
                    {campaign.platforms?.join(", ") ?? "-"}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white col-span-2 shadow-md text-sm w-[98%] min-h-[200px] flex justify-center items-center text-lighter tracking-wide rounded-md">
          <SearchOutlined className="w-8 h-8" />
          No campaigns available.
        </div>
      )}
    </section>
  );
}
