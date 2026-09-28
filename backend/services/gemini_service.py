import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from models.api import AdvisoryResponse


load_dotenv()


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.1-flash-lite",
)


if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured.")


client = genai.Client(api_key=GEMINI_API_KEY)


async def generate_advisory(
    farm_context: dict,
) -> AdvisoryResponse:

    prompt = f"""
You are the agricultural intelligence engine for KrishiSetu Nexus.

KrishiSetu combines real agricultural observations such as:
- weather
- satellite indicators
- soil information
- crop information
- identified risks

Your job is to generate a structured agricultural advisory.

IMPORTANT RULES:

1. Use ONLY the supplied farm data.
2. Never invent missing measurements.
3. NDVI and NDMI are environmental indicators.
4. Do NOT claim satellite data alone proves a crop disease.
5. Clearly distinguish observations from recommendations.
6. If data is unavailable, acknowledge it.
7. Give practical recommendations suitable for small farmers in India.
8. Prefer regenerative practices that improve soil structure,
   water retention, biodiversity and long-term resilience.
9. Do not recommend specific pesticide doses.
10. Keep recommendations practical and understandable.
11. Evidence must refer only to the supplied farm information.
12. Do not invent external studies or sources.

FARM DATA:

{farm_context}

Return the advisory using EXACTLY this structure:

{{
  "current_condition": "string",

  "risk_explanation": "string",

  "sections": {{
    "immediate_action": [
      {{
        "recommendation": "string",
        "why": "string",
        "evidence": ["string"],
        "expected_effect": "string",
        "monitor": "string"
      }}
    ],

    "regenerative_action": [
      {{
        "recommendation": "string",
        "why": "string",
        "evidence": ["string"],
        "expected_effect": "string",
        "monitor": "string"
      }}
    ],

    "water_management": [
      {{
        "recommendation": "string",
        "why": "string",
        "evidence": ["string"],
        "expected_effect": "string",
        "monitor": "string"
      }}
    ],

    "soil_management": [
      {{
        "recommendation": "string",
        "why": "string",
        "evidence": ["string"],
        "expected_effect": "string",
        "monitor": "string"
      }}
    ],

    "pest_disease_management": [
      {{
        "recommendation": "string",
        "why": "string",
        "evidence": ["string"],
        "expected_effect": "string",
        "monitor": "string"
      }}
    ],

    "monitoring_plan": [
      {{
        "recommendation": "string",
        "why": "string",
        "evidence": ["string"],
        "expected_effect": "string",
        "monitor": "string"
      }}
    ]
  }},

  "expected_indicators": [
    "string"
  ],

  "evidence": [
    {{
      "source": "string",
      "data_used": "string",
      "last_updated": "string"
    }}
  ]
}}

Generate the complete structured advisory now.
"""

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=AdvisoryResponse,
        ),
    )

    if response.parsed:
        return response.parsed

    return AdvisoryResponse.model_validate_json(response.text)