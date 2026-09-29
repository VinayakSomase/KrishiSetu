from datetime import datetime, timezone

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from models.api import (
    AdvisoryPreview,
    AdvisoryRequest,
    AdvisoryResponse,
    DiagnosisResponse,
    DataValue,
    FarmAnalyzeRequest,
    FarmAnalyzeResponse,
    FarmInfo,
    FarmLocation,
    FarmRisk,
    FieldHealth,
    KnowledgeSearchRequest,
    KnowledgeSearchResponse,
    KnowledgeAdaptRequest,
    KnowledgeAdaptResponse,
    NetworkNode,
    VoiceQueryRequest,
    VoiceQueryResponse,
    SoilData,
    
)

from services.weather_service import get_weather
from services.satellite_service import get_satellite_indices
from engines.climate_risk import calculate_climate_risks
from services.soil_service import get_soil_data
from services.gemini_service import generate_advisory
from services.diagnosis_service import generate_diagnosis
from services.knowledge_service import search_knowledge
from services.knowledge_adapt_service import adapt_knowledge
from data.network_nodes import NETWORK_NODES
from services.voice_service import generate_voice_response



app = FastAPI(
    title="KrishiSetu API",
    version="0.1.0",
    description=(
        "Interoperable Agricultural Intelligence Network "
        "for Climate-Resilient Farming."
    ),
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://krishisetu-wagb.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "KrishiSetu API",
        "version": "0.1.0",
        "status": "running",
    }


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "KrishiSetu API",
        "version": "0.1.0",
    }


def calculate_field_health(
    ndvi: float | None,
    ndmi: float | None,
    risks: list[FarmRisk],
):
    """
    Deterministic field-health calculation.

    Satellite values are measurements, but health status is only
    classified when the vegetation signal is sufficiently reliable.
    """

    # No reliable vegetation signal
    if ndvi is None or ndvi < 0.10:
        climate_levels = [
            risk.level
            for risk in risks
            if risk.type in {"heat_stress", "rainfall", "water_stress"}
        ]

        disease_levels = [
            risk.level
            for risk in risks
            if risk.type == "disease_environment"
        ]

        climate_stress = (
            "high" if "high" in climate_levels
            else "moderate" if "moderate" in climate_levels
            else "low"
        )

        disease_risk = (
            "high" if "high" in disease_levels
            else "moderate" if "moderate" in disease_levels
            else "low"
        )

        return (
            "watch",
            50.0,
            climate_stress,
            disease_risk,
        )

    # Start with a neutral score when vegetation is detectable
    score = 50.0

    # NDVI
    if ndvi >= 0.70:
        score += 30
    elif ndvi >= 0.50:
        score += 20
    elif ndvi >= 0.30:
        score += 10
    elif ndvi >= 0.15:
        score -= 5

    # NDMI
    if ndmi is not None:
        if ndmi >= 0.40:
            score += 15
        elif ndmi >= 0.20:
            score += 10
        elif ndmi < 0:
            score -= 10

    # Environmental risks
    for risk in risks:
        if risk.level == "high":
            score -= 10
        elif risk.level == "moderate":
            score -= 5

    score = max(0.0, min(100.0, score))

    if score >= 75:
        status = "healthy"
    elif score >= 55:
        status = "watch"
    elif score >= 35:
        status = "moderate_risk"
    else:
        status = "high_risk"

    climate_levels = [
        risk.level
        for risk in risks
        if risk.type in {"heat_stress", "rainfall", "water_stress"}
    ]

    if "high" in climate_levels:
        climate_stress = "high"
    elif "moderate" in climate_levels:
        climate_stress = "moderate"
    else:
        climate_stress = "low"

    disease_levels = [
        risk.level
        for risk in risks
        if risk.type == "disease_environment"
    ]

    if "high" in disease_levels:
        disease_risk = "high"
    elif "moderate" in disease_levels:
        disease_risk = "moderate"
    else:
        disease_risk = "low"

    return (
        status,
        round(score, 1),
        climate_stress,
        disease_risk,
    )


def build_advisory_preview(
    risks: list[FarmRisk],
    field_status: str,
):
    """
    Creates a deterministic advisory preview.

    Gemini advisory generation will be added later.
    """

    if not risks:
        return AdvisoryPreview(
            why="Current weather and satellite indicators do not show a major detected environmental risk.",
            do_now="Continue routine crop monitoring.",
            regenerative_action="Maintain soil cover and avoid unnecessary irrigation or chemical intervention.",
            monitor="Monitor crop condition, soil moisture, rainfall and satellite indicators.",
        )

    highest_risk = None

    for risk in risks:
        if risk.level == "high":
            highest_risk = risk
            break

    if highest_risk is None:
        highest_risk = risks[0]

    if highest_risk.type == "water_stress":
        do_now = (
            "Check field soil moisture and prioritize irrigation based "
            "on actual crop need rather than a fixed schedule."
        )
        regenerative_action = (
            "Use soil-cover and moisture-conservation practices to "
            "reduce evaporation and improve water retention."
        )
        monitor = (
            "Monitor rainfall, soil moisture and NDMI over the next "
            "few observations."
        )

    elif highest_risk.type == "heat_stress":
        do_now = (
            "Monitor crop for heat-related stress and avoid unnecessary "
            "field operations during peak heat."
        )
        regenerative_action = (
            "Maintain soil cover and moisture-conservation practices "
            "to reduce heat and water stress."
        )
        monitor = (
            "Monitor temperature, crop condition and NDMI."
        )

    elif highest_risk.type == "disease_environment":
        do_now = (
            "Inspect the crop canopy for disease symptoms, especially "
            "where humidity remains high."
        )
        regenerative_action = (
            "Improve field aeration and avoid unnecessary irrigation "
            "that keeps the crop canopy wet."
        )
        monitor = (
            "Monitor humidity, crop symptoms and disease indicators."
        )

    elif highest_risk.type == "rainfall":
        do_now = (
            "Review the upcoming rainfall window before irrigation "
            "or field operations."
        )
        regenerative_action = (
            "Use rainfall effectively and maintain soil structure "
            "to improve infiltration and reduce runoff."
        )
        monitor = (
            "Monitor rainfall forecast, soil moisture and field drainage."
        )

    else:
        do_now = "Inspect the field and verify the detected condition."
        regenerative_action = (
            "Maintain soil health practices and avoid unnecessary inputs."
        )
        monitor = "Continue monitoring field indicators."

    return AdvisoryPreview(
        why=highest_risk.reason,
        do_now=do_now,
        regenerative_action=regenerative_action,
        monitor=monitor,
    )


@app.post(
    "/api/v1/farm/analyze",
    response_model=FarmAnalyzeResponse,
)
async def analyze_farm(request: FarmAnalyzeRequest):

    now = datetime.now(timezone.utc).isoformat()

    # -----------------------------------------------------
    # 1. Weather
    # -----------------------------------------------------

    weather = await get_weather(
        request.location.latitude,
        request.location.longitude,
    )

    # -----------------------------------------------------
    # 2. Climate risks
    # -----------------------------------------------------

    risks = calculate_climate_risks(weather)

    soil = get_soil_data(
        request.location.latitude,
        request.location.longitude,
    )

    # -----------------------------------------------------
    # 3. Satellite intelligence
    # -----------------------------------------------------

    satellite = get_satellite_indices(
        request.location.latitude,
        request.location.longitude,
    )

    ndvi_value = satellite["ndvi"]
    ndmi_value = satellite["ndmi"]

    observation_date = satellite["observation_date"]
    satellite_source = satellite["source"]
    satellite_quality = satellite["data_quality"]

    # -----------------------------------------------------
    # 4. Field health
    # -----------------------------------------------------

    (
        field_status,
        health_score,
        climate_stress,
        disease_risk,
    ) = calculate_field_health(
        ndvi_value,
        ndmi_value,
        risks,
    )

    # -----------------------------------------------------
    # 5. Field Health response
    # -----------------------------------------------------

    field_health = FieldHealth(
        status=field_status,
        health_score=health_score,

        ndvi=DataValue(
            value=ndvi_value,
            unit="index",
            source=satellite_source,
            last_updated=observation_date,
            data_quality=satellite_quality,
        ),

        ndmi=DataValue(
            value=ndmi_value,
            unit="index",
            source=satellite_source,
            last_updated=observation_date,
            data_quality=satellite_quality,
        ),

        soil_moisture=DataValue(
            value=None,
            unit="%",
            source=None,
            last_updated=None,
            data_quality="unavailable",
        ),

        climate_stress=climate_stress,
        disease_risk=disease_risk,
    )

    # -----------------------------------------------------
    # 6. Soil
    #
    # Soil data will be connected separately through
    # Earth Engine soil sources.
    # -----------------------------------------------------

    # soil = SoilData(
    #     soil_type=None,

    #     ph=DataValue(
    #         value=None,
    #         unit="pH",
    #         source=None,
    #         last_updated=None,
    #         data_quality="unavailable",
    #     ),

    #     nitrogen=DataValue(
    #         value=None,
    #         unit="mg/kg",
    #         source=None,
    #         last_updated=None,
    #         data_quality="unavailable",
    #     ),

    #     phosphorus=DataValue(
    #         value=None,
    #         unit="mg/kg",
    #         source=None,
    #         last_updated=None,
    #         data_quality="unavailable",
    #     ),

    #     potassium=DataValue(
    #         value=None,
    #         unit="mg/kg",
    #         source=None,
    #         last_updated=None,
    #         data_quality="unavailable",
    #     ),

    #     organic_carbon=DataValue(
    #         value=None,
    #         unit="%",
    #         source=None,
    #         last_updated=None,
    #         data_quality="unavailable",
    #     ),

    #     soil_moisture=DataValue(
    #         value=None,
    #         unit="%",
    #         source=None,
    #         last_updated=None,
    #         data_quality="unavailable",
    #     ),

    #     health_status="low",
    # )

    # -----------------------------------------------------
    # 7. Advisory preview
    #
    # Gemini advisory will replace/enrich this later.
    # -----------------------------------------------------

    advisory_preview = build_advisory_preview(
        risks,
        field_status,
    )

    # -----------------------------------------------------
    # 8. Final farm response
    # -----------------------------------------------------

    return FarmAnalyzeResponse(
        farm=FarmInfo(
            country=request.location.country,
            state=request.location.state,
            district=request.location.district,

            location=FarmLocation(
                latitude=request.location.latitude,
                longitude=request.location.longitude,
            ),

            crop=request.crop.name,
            growth_stage=request.crop.growth_stage,
            last_analysis=now,
        ),

        field_health=field_health,

        weather=weather,

        soil=soil,

        risks=risks,

        advisory_preview=advisory_preview,
    )

@app.post(
    "/api/v1/advisory",
    response_model=AdvisoryResponse,
)
async def generate_farm_advisory(
    request: AdvisoryRequest,
):
    """
    Generate a Gemini-powered agricultural advisory
    using the supplied farm intelligence.
    """

    result = await generate_advisory(
        request.farm_context
    )

    return result


@app.post(
    "/api/v1/diagnosis",
    response_model=DiagnosisResponse,
)
async def diagnose_crop(
    image: UploadFile = File(...),
    crop: str = Form(...),
    growth_stage: str = Form(...),
    farmer_observation: str | None = Form(None),
):
    image_bytes = await image.read()

    result = await generate_diagnosis(
        image_bytes=image_bytes,
        mime_type=image.content_type or "image/jpeg",
        crop=crop,
        growth_stage=growth_stage,
        farmer_observation=farmer_observation,
    )

    return result


@app.post(
    "/api/v1/knowledge/search",
    response_model=KnowledgeSearchResponse,
)
async def knowledge_search(
    request: KnowledgeSearchRequest,
):
    results = search_knowledge(
        crop=request.crop,
        soil=request.soil,
        climate=request.climate,
        problem=request.problem,
        country=request.country,
        region=request.region,
    )

    return {
        "query": {
            "crop": request.crop,
            "soil": request.soil,
            "climate": request.climate,
            "problem": request.problem,
            "country": request.country,
            "region": request.region,
        },
        "results": results,
    }



@app.post(
    "/api/v1/knowledge/adapt",
    response_model=KnowledgeAdaptResponse,
)
async def knowledge_adapt(
    request: KnowledgeAdaptRequest,
):
    result = await adapt_knowledge(
        practice=request.practice_id,
        farm_context=request.farm_context.model_dump(),
        current_conditions=request.current_conditions.model_dump(),
    )

    return result



@app.get(
    "/api/v1/network/nodes",
    response_model=list[NetworkNode],
)
async def get_network_nodes():
    return NETWORK_NODES



@app.post(
    "/api/v1/voice/query",
    response_model=VoiceQueryResponse,
)
async def voice_query(
    request: VoiceQueryRequest,
):
    result = await generate_voice_response(
        language=request.language,
        query=request.query,
        farm_context=request.farm_context.model_dump(),
    )

    return result