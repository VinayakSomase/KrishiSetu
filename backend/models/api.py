from typing import Any, Literal

from pydantic import BaseModel, Field


# ============================================================
# Common Types
# ============================================================

DataQuality = Literal["good", "fair", "poor", "unavailable"]

FieldHealthStatus = Literal[
    "healthy",
    "watch",
    "moderate_risk",
    "high_risk",
]

StressLevel = Literal["low", "moderate", "high"]

RiskLevel = Literal["low", "moderate", "high"]

DiseaseSeverity = Literal[
    "low",
    "moderate",
    "high",
    "unknown",
]


# ============================================================
# Health
# ============================================================

class HealthResponse(BaseModel):
    status: Literal["ok"]
    service: str
    version: str


# ============================================================
# Farm Analysis
# ============================================================

class FarmLocationRequest(BaseModel):
    country: str
    state: str
    district: str
    latitude: float
    longitude: float


class CropRequest(BaseModel):
    name: str
    growth_stage: str


class FarmAnalyzeRequest(BaseModel):
    location: FarmLocationRequest
    crop: CropRequest


class FarmLocation(BaseModel):
    latitude: float
    longitude: float


class FarmInfo(BaseModel):
    country: str
    state: str
    district: str
    location: FarmLocation
    crop: str
    growth_stage: str
    last_analysis: str


class DataValue(BaseModel):
    value: float | None
    unit: str
    source: str | None
    last_updated: str | None
    data_quality: DataQuality


class FieldHealth(BaseModel):
    status: FieldHealthStatus
    health_score: float
    ndvi: DataValue
    ndmi: DataValue
    soil_moisture: DataValue
    climate_stress: StressLevel
    disease_risk: RiskLevel


class CurrentWeather(BaseModel):
    temperature: float | None
    humidity: float | None
    rainfall: float | None
    wind_speed: float | None


class WeatherForecastDay(BaseModel):
    date: str
    temperature: float | None
    rainfall_probability: float | None
    rainfall: float | None


class WeatherData(BaseModel):
    current: CurrentWeather
    forecast: list[WeatherForecastDay]
    source: str | None
    last_updated: str | None
    data_quality: DataQuality


class SoilData(BaseModel):
    soil_type: str | None
    ph: DataValue
    nitrogen: DataValue
    phosphorus: DataValue
    potassium: DataValue
    organic_carbon: DataValue
    soil_moisture: DataValue
    health_status: StressLevel


RiskType = Literal[
    "water_stress",
    "heat_stress",
    "disease_environment",
    "rainfall",
    "soil",
]


class FarmRisk(BaseModel):
    type: RiskType
    level: RiskLevel
    reason: str


class AdvisoryPreview(BaseModel):
    why: str
    do_now: str
    regenerative_action: str
    monitor: str


class FarmAnalyzeResponse(BaseModel):
    farm: FarmInfo
    field_health: FieldHealth
    weather: WeatherData
    soil: SoilData
    risks: list[FarmRisk]
    advisory_preview: AdvisoryPreview


# ============================================================
# Crop Diagnosis
# ============================================================

ImageQualityStatus = Literal["valid", "invalid"]


class ImageQuality(BaseModel):
    status: ImageQualityStatus
    reason: str | None


class DiagnosisAssessment(BaseModel):
    crop: str
    condition: str
    confidence: float
    severity: DiseaseSeverity
    visual_observations: list[str]
    possible_causes: list[str]


class RegenerativeResponse(BaseModel):
    practice: str
    why: str
    expected_benefit: str
    monitoring_period: str


class EvidenceItem(BaseModel):
    source: str
    data_used: str
    last_updated: str | None


class DiagnosisResponse(BaseModel):
    image_quality: ImageQuality
    assessment: DiagnosisAssessment | None
    immediate_actions: list[str]
    regenerative_response: RegenerativeResponse | None
    evidence: list[EvidenceItem]


# ============================================================
# Regenerative Advisory
# ============================================================

class AdvisoryFarmContext(BaseModel):
    country: str
    state: str
    district: str
    crop: str
    growth_stage: str


class AdvisoryRequest(BaseModel):
    farm_context: AdvisoryFarmContext


class Recommendation(BaseModel):
    recommendation: str
    why: str
    evidence: list[str]
    expected_effect: str
    monitor: str


class AdvisorySections(BaseModel):
    immediate_action: list[Recommendation]
    regenerative_action: list[Recommendation]
    water_management: list[Recommendation]
    soil_management: list[Recommendation]
    pest_disease_management: list[Recommendation]
    monitoring_plan: list[Recommendation]


class AdvisoryResponse(BaseModel):
    current_condition: str
    risk_explanation: str
    sections: AdvisorySections
    expected_indicators: list[str]
    evidence: list[EvidenceItem]


# ============================================================
# Knowledge Exchange
# ============================================================

class KnowledgeSearchRequest(BaseModel):
    crop: str
    soil: str
    climate: str
    problem: str
    country: str | None
    region: str | None


class KnowledgeQuery(BaseModel):
    crop: str
    soil: str
    climate: str
    problem: str


class KnowledgeEvidence(BaseModel):
    source: str
    reference: str


class KnowledgeResult(BaseModel):
    id: str
    country: str
    region: str
    crop: str
    practice: str
    target_problem: str
    suitable_conditions: list[str]
    evidence: KnowledgeEvidence
    applicability_score: float


class KnowledgeSearchResponse(BaseModel):
    query: KnowledgeQuery
    results: list[KnowledgeResult]


# ============================================================
# Knowledge Adaptation
# ============================================================

class AdaptFarmContext(BaseModel):
    country: str
    state: str
    district: str
    crop: str
    soil: str
    climate: str


class CurrentConditions(BaseModel):
    weather: dict[str, Any]
    soil: dict[str, Any]
    satellite: dict[str, Any]


class KnowledgeAdaptRequest(BaseModel):
    practice_id: str
    farm_context: AdaptFarmContext
    current_conditions: CurrentConditions


class OriginalPractice(BaseModel):
    country: str
    region: str
    practice: str
    target_problem: str


class LocalFarmContext(BaseModel):
    country: str
    state: str
    district: str
    crop: str
    soil: str
    climate: str


class AdaptedRecommendation(BaseModel):
    recommendation: str
    why: str
    evidence: list[str]
    expected_effect: str
    limitations: list[str]
    monitoring: str


class KnowledgeAdaptResponse(BaseModel):
    original_practice: OriginalPractice
    local_farm_context: LocalFarmContext
    adapted_recommendation: AdaptedRecommendation


# ============================================================
# BRICS / Agricultural Network
# ============================================================

class NetworkNode(BaseModel):
    country: str
    regions: list[str]
    supported_crops: list[str]
    knowledge_contributions: int
    data_capabilities: list[str]
    last_synchronization: str
    shared_practices: int


class NetworkNodesResponse(BaseModel):
    nodes: list[NetworkNode]


# ============================================================
# Voice
# ============================================================

class VoiceFarmContext(BaseModel):
    country: str
    state: str
    district: str
    crop: str


class VoiceQueryRequest(BaseModel):
    language: str
    query: str
    farm_context: VoiceFarmContext


class VoiceResponseContent(BaseModel):
    text: str
    source: list[str]


class VoiceAudio(BaseModel):
    available: bool
    url: str | None


class VoiceQueryResponse(BaseModel):
    language: str
    transcript: str
    response: VoiceResponseContent
    audio: VoiceAudio