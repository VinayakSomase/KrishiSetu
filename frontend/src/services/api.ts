import type {
  FarmAnalyzeRequest,
  FarmAnalyzeResponse,
  DiagnosisResponse,
  AdvisoryRequest,
  AdvisoryResponse,
  KnowledgeSearchRequest,
  KnowledgeSearchResponse,
  KnowledgeAdaptRequest,
  KnowledgeAdaptResponse,
  NetworkNode,
  VoiceQueryRequest,
  VoiceQueryResponse,
} from "../types/api";

const API_BASE_URL = "https://krishisetu-api-8008.onrender.com";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API error ${response.status}: ${errorText || response.statusText}`
    );
  }

  return response.json();
}

export const api = {
  analyzeFarm: (
    data: FarmAnalyzeRequest
  ): Promise<FarmAnalyzeResponse> =>
    request<FarmAnalyzeResponse>("/api/v1/farm/analyze", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  diagnoseCrop: async (
    image: File,
    crop: string,
    growthStage: string,
    farmerObservation?: string 
  ): Promise<DiagnosisResponse> => {
    const formData = new FormData();

    formData.append("image", image);
    formData.append("crop", crop);
    formData.append("growth_stage", growthStage);

    if (farmerObservation) {
      formData.append("farmer_observation", farmerObservation);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/diagnosis`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API error ${response.status}: ${
          errorText || response.statusText
        }`
      );
    }

    return response.json();
  },

  getAdvisory: (
    data: AdvisoryRequest
  ): Promise<AdvisoryResponse> =>
    request<AdvisoryResponse>("/api/v1/advisory", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  searchKnowledge: (
    data: KnowledgeSearchRequest
  ): Promise<KnowledgeSearchResponse> =>
    request<KnowledgeSearchResponse>("/api/v1/knowledge/search", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  adaptKnowledge: (
    data: KnowledgeAdaptRequest
  ): Promise<KnowledgeAdaptResponse> =>
    request<KnowledgeAdaptResponse>("/api/v1/knowledge/adapt", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getNetworkNodes: (): Promise<NetworkNode[]> =>
    request<NetworkNode[]>("/api/v1/network/nodes"),

  voiceQuery: (
    data: VoiceQueryRequest
  ): Promise<VoiceQueryResponse> =>
    request<VoiceQueryResponse>("/api/v1/voice/query", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  };