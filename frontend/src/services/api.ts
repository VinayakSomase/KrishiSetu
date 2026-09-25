import {
  mockFarmAnalyze,
  mockDiagnosis,
  mockAdvisory,
  mockKnowledgeSearch,
  mockAdaptKnowledge,
  mockNetworkNodes,
} from "./mockApi";

export const api = {
  analyzeFarm: mockFarmAnalyze,
  diagnoseCrop: mockDiagnosis,
  getAdvisory: mockAdvisory,
  searchKnowledge: mockKnowledgeSearch,
  adaptKnowledge: mockAdaptKnowledge,
  getNetworkNodes: mockNetworkNodes,
};