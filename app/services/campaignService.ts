import axiosInstance from "../components/lib/axiosInstance";
import {
  Campaign,
  CampaignDetailsListResponse,
  CampaignInsightResponse,
  CampaignInsightsEventResponse,
  CampaignListResponse,
} from "../types/campaign";

const CampaignService = {
  getCampaigns: async (
    params?: Record<string, any>
  ): Promise<CampaignListResponse> => {
    return axiosInstance.get("/campaigns", { params });
  },

  getCampaignById: async (id: string): Promise<CampaignDetailsListResponse> => {
    return axiosInstance.get(`/campaigns/${id}`);
  },
  getCampaignInsights: async (id: string): Promise<CampaignInsightResponse> => {
    return axiosInstance.get(`/campaigns/${id}/insights`);
  },
  getCampaignInsightsStream: async (
    id: string
  ): Promise<CampaignInsightsEventResponse> => {
    return axiosInstance.get(`/campaigns/${id}/insights/stream`);
  },
};

export default CampaignService;
