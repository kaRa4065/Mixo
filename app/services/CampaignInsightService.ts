import axiosInstance from "../components/lib/axiosInstance";
import {
  CampaignInsightListResponse,
  CampaignInsights,
} from "../types/insights";

const CampaignInsightService = {
  // Get all insights (optionally with query params)
  getInsights: async (
    params?: Record<string, any>
  ): Promise<CampaignInsightListResponse> => {
    return axiosInstance.get("/campaigns/insights", { params });
  },

  // Get single insight by ID
  getInsightById: async (id: string): Promise<CampaignInsightListResponse> => {
    return axiosInstance.get(`/campaigns/insights/${id}`);
  },
};

export default CampaignInsightService;
