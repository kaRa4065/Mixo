export interface Campaign {
  id: string;
  name: string;
  brand_id: string;
  status: string;
  budget: number;
  daily_budget: number;
  platforms: string[];
  created_at: string;
}

export interface CampaignListResponse {
  campaigns: Campaign[];
  total: number;
}

export interface CampaignDetails {
  id: string;
  name: string;
  brand_id: string;
  status: string;
  budget: number;
  daily_budget: number;
  platforms: string[];
  created_at: string;
}

export interface CampaignDetailsListResponse {
  campaign: CampaignDetails;
  total: number;
}
export interface CampaignInsights {
  campaign_id: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  conversion_rate: number;
}

export interface CampaignInsightResponse {
  insights: CampaignInsights;
}
export interface CampaignInsightsEvent {
  campaign_id: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  conversion_rate: number;
}

export interface CampaignInsightsEventResponse {
  data: CampaignInsights;
}