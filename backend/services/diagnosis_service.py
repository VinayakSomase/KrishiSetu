import os

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel


load_dotenv()


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.1-flash-lite",
)


if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured.")


client = genai.Client(api_key=GEMINI_API_KEY)


class ImageQuality(BaseModel):
    status: str
    reason: str | None


class Assessment(BaseModel):
    crop: str
    condition: str
    confidence: float
    severity: str
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


class DiagnosisResult(BaseModel):
    image_quality: ImageQuality
    assessment: Assessment
    immediate_actions: list[str]
    regenerative_response: RegenerativeResponse
    evidence: list[EvidenceItem]


async def generate_diagnosis(
    image_bytes: bytes,
    mime_type: str,
    crop: str,
    growth_stage: str,
    farmer_observation: str | None,
) -> DiagnosisResult:

    observation = farmer_observation or "No farmer observation provided."

    prompt = f"""
You are the crop diagnostics engine for KrishiSetu Nexus.

Analyze the supplied crop image together with the farmer's context.

CROP:
{crop}

GROWTH STAGE:
{growth_stage}

FARMER OBSERVATION:
{observation}

IMPORTANT RULES:

1. Analyze only what is visible in the image and supplied context.
2. Do not claim certainty.
3. Use wording such as "AI assessment" or "possible".
4. Do not invent symptoms that are not visible.
5. If the image is blurry, too dark, irrelevant, or insufficient,
   mark image_quality.status as "invalid".
6. If the image is insufficient, explain why in image_quality.reason.
7. Do not prescribe pesticide doses.
8. Give practical immediate actions.
9. Include at least one regenerative practice when appropriate.
10. Evidence must describe the image and farmer-provided context.
11. Do not invent external studies or scientific sources.
12. Confidence must represent AI assessment confidence, not scientific certainty.

Return EXACTLY this JSON structure:

{{
  "image_quality": {{
    "status": "valid",
    "reason": null
  }},

  "assessment": {{
    "crop": "{crop}",
    "condition": "string",
    "confidence": 0.0,
    "severity": "low",
    "visual_observations": [
      "string"
    ],
    "possible_causes": [
      "string"
    ]
  }},

  "immediate_actions": [
    "string"
  ],

  "regenerative_response": {{
    "practice": "string",
    "why": "string",
    "expected_benefit": "string",
    "monitoring_period": "string"
  }},

  "evidence": [
    {{
      "source": "Crop image",
      "data_used": "string",
      "last_updated": "Today"
    }}
  ]
}}

Severity must be one of:
low, moderate, high, unknown.

If image quality is invalid, still return the complete structure,
but clearly explain the image limitation.
"""

    image_part = types.Part.from_bytes(
        data=image_bytes,
        mime_type=mime_type,
    )

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[
            image_part,
            prompt,
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=DiagnosisResult,
        ),
    )

    if response.parsed:
        return response.parsed

    return DiagnosisResult.model_validate_json(response.text)