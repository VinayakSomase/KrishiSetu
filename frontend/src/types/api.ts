// ==========================================
// KrishiSetu API Types
// ==========================================

// ---------- Common Types ----------

export type DataQuality = "good" | "fair" | "poor" | "unavailable";

export type FieldHealthStatus =
  | "healthy"
  | "watch"
  | "moderate_risk"
  | "high_risk";

export type StressLevel = "low" | "moderate" | "high";

export type RiskLevel = "low" | "moderate" | "high";

export type DiseaseSeverity =
  | "low"
  | "moderate"
  | "high"
  | "unknown";


// ---------- Health ----------

export interface HealthResponse {
  status: "ok";
  service: string;
  version: string;
}


// ---------- Farm Analysis ----------

export interface FarmLocationRequest {
  country: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
}

export interface CropRequest {
  name: string;
  growth_stage: string;
}

export interface FarmAnalyzeRequest {
  location: FarmLocationRequest;
  crop: CropRequest;
}

export interface FarmLocation {
  latitude: number;
  longitude: number;
}

export interface FarmInfo {
  country: string;
  state: string;
  district: string;
  location: FarmLocation;
  crop: string;
  growth_stage: string;
  last_analysis: string;
}

export interface DataValue {
  value: number | null;
  unit: string;
  source: string | null;
  last_updated: string | null;
  data_quality: DataQuality;
}

export interface FieldHealth {
  status: FieldHealthStatus;
  health_score: number;
  ndvi: DataValue;
  ndmi: DataValue;
  soil_moisture: DataValue;
  climate_stress: StressLevel;
  disease_risk: RiskLevel;
}

export interface CurrentWeather {
  temperature: number | null;
  humidity: number | null;
  rainfall: number | null;
  wind_speed: number | null;
}

export interface WeatherForecastDay {
  date: string;
  temperature: number | null;
  rainfall_probability: number | null;
  rainfall: number | null;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: WeatherForecastDay[];
  source: string | null;
  last_updated: string | null;
  data_quality: DataQuality;
}

export interface SoilData {
  soil_type: string | null;
  ph: DataValue;
  nitrogen: DataValue;
  phosphorus: DataValue;
  potassium: DataValue;
  organic_carbon: DataValue;
  soil_moisture: DataValue;
  health_status: StressLevel;
}

export type RiskType =
  | "water_stress"
  | "heat_stress"
  | "disease_environment"
  | "rainfall"
  | "soil";

export interface FarmRisk {
  type: RiskType;
  level: RiskLevel;
  reason: string;
}

export interface AdvisoryPreview {
  why: string;
  do_now: string;
  regenerative_action: string;
  monitor: string;
}

export interface FarmAnalyzeResponse {
  farm: FarmInfo;
  field_health: FieldHealth;
  weather: WeatherData;
  soil: SoilData;
  risks: FarmRisk[];
  advisory_preview: AdvisoryPreview;
}


// ---------- Crop Diagnosis ----------

export type ImageQualityStatus = "valid" | "invalid";

export interface DiagnosisRequest {
  image: File;
  crop: string;
  growth_stage: string;
  farmer_observation: string | null;
}

export interface ImageQuality {
  status: ImageQualityStatus;
  reason: string | null;
}

export interface DiagnosisAssessment {
  crop: string;
  condition: string;
  confidence: number;
  severity: DiseaseSeverity;
  visual_observations: string[];
  possible_causes: string[];
}

export interface RegenerativeResponse {
  practice: string;
  why: string;
  expected_benefit: string;
  monitoring_period: string;
}

export interface EvidenceItem {
  source: string;
  data_used: string;
  last_updated: string | null;
}

export interface DiagnosisResponse {
  image_quality: ImageQuality;
  assessment: DiagnosisAssessment | null;
  immediate_actions: string[];
  regenerative_response: RegenerativeResponse | null;
  evidence: EvidenceItem[];
}


// ---------- Regenerative Advisory ----------

export interface AdvisoryFarmContext {
  country: string;
  state: string;
  district: string;
  crop: string;
  growth_stage: string;
}

export interface AdvisoryRequest {
  farm_context: AdvisoryFarmContext;
}

export interface Recommendation {
  recommendation: string;
  why: string;
  evidence: string[];
  expected_effect: string;
  monitor: string;
}

export interface AdvisorySections {
  immediate_action: Recommendation[];
  regenerative_action: Recommendation[];
  water_management: Recommendation[];
  soil_management: Recommendation[];
  pest_disease_management: Recommendation[];
  monitoring_plan: Recommendation[];
}

export interface AdvisoryResponse {
  current_condition: string;
  risk_explanation: string;
  sections: AdvisorySections;
  expected_indicators: string[];
  evidence: EvidenceItem[];
}


// ---------- Knowledge Exchange ----------

export interface KnowledgeSearchRequest {
  crop: string;
  soil: string;
  climate: string;
  problem: string;
  country: string | null;
  region: string | null;
}

export interface KnowledgeQuery {
  crop: string;
  soil: string;
  climate: string;
  problem: string;
}

export interface KnowledgeEvidence {
  source: string;
  reference: string;
}

export interface KnowledgeResult {
  id: string;
  country: string;
  region: string;
  crop: string;
  practice: string;
  target_problem: string;
  suitable_conditions: string[];
  evidence: KnowledgeEvidence;
  applicability_score: number;
}

export interface KnowledgeSearchResponse {
  query: KnowledgeQuery;
  results: KnowledgeResult[];
}


// ---------- Knowledge Adaptation ----------

export interface AdaptFarmContext {
  country: string;
  state: string;
  district: string;
  crop: string;
  soil: string;
  climate: string;
}

export interface CurrentConditions {
  weather: Record<string, unknown>;
  soil: Record<string, unknown>;
  satellite: Record<string, unknown>;
}

export interface KnowledgeAdaptRequest {
  practice_id: string;
  farm_context: AdaptFarmContext;
  current_conditions: CurrentConditions;
}

export interface OriginalPractice {
  country: string;
  region: string;
  practice: string;
  target_problem: string;
}

export interface LocalFarmContext {
  country: string;
  state: string;
  district: string;
  crop: string;
  soil: string;
  climate: string;
}

export interface AdaptedRecommendation {
  recommendation: string;
  why: string;
  evidence: string[];
  expected_effect: string;
  limitations: string[];
  monitoring: string;
}

export interface KnowledgeAdaptResponse {
  original_practice: OriginalPractice;
  local_farm_context: LocalFarmContext;
  adapted_recommendation: AdaptedRecommendation;
}


// ---------- BRICS Network ----------

export interface NetworkNode {
  country: string;
  regions: string[];
  supported_crops: string[];
  knowledge_contributions: number;
  data_capabilities: string[];
  last_synchronization: string;
  shared_practices: number;
}

export interface NetworkNodesResponse {
  nodes: NetworkNode[];
}


// ---------- Voice ----------

export interface VoiceFarmContext {
  country: string;
  state: string;
  district: string;
  crop: string;
}

export interface VoiceQueryRequest {
  language: string;
  query: string;
  farm_context: VoiceFarmContext;
}

export interface VoiceResponseContent {
  text: string;
  source: string[];
}

export interface VoiceAudio {
  available: boolean;
  url: string | null;
}

export interface VoiceQueryResponse {
  language: string;
  transcript: string;
  response: VoiceResponseContent;
  audio: VoiceAudio;
}