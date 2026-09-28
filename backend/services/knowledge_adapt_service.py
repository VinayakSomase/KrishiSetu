import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from models.api import KnowledgeAdaptResponse

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured.")

client = genai.Client(api_key=GEMINI_API_KEY)


async def adapt_knowledge(
    practice: dict,
    farm_context: dict,
    current_conditions: dict,
) -> KnowledgeAdaptResponse:

    prompt = f"""
You are the agricultural knowledge adaptation engine for KrishiSetu Nexus.

Your task is to adapt an agricultural practice from another region
to the farmer's local conditions.

IMPORTANT:
- Do not blindly copy the original practice.
- Consider the local crop, soil, climate, location and current conditions.
- Explain why the adapted recommendation fits the local context.
- Preserve the original practice intent.
- Do not invent scientific studies or citations.
- Do not provide pesticide doses or unsafe chemical instructions.
- If important information is missing, explicitly mention the limitation.
- Evidence must refer only to the supplied practice and farm data.
- The recommendation should be practical for a small or marginal farmer.
- This is an AI-generated adaptation, not a guaranteed agronomic outcome.

ORIGINAL PRACTICE:
{practice}

LOCAL FARM CONTEXT:
{farm_context}

CURRENT CONDITIONS:
{current_conditions}

Return EXACTLY this structure:

{{
  "original_practice": {{
    "country": "string",
    "region": "string",
    "practice": "string",
    "target_problem": "string"
  }},
  "local_farm_context": {{
    "country": "string",
    "state": "string",
    "district": "string",
    "crop": "string",
    "soil": "string",
    "climate": "string"
  }},
  "adapted_recommendation": {{
    "recommendation": "string",
    "why": "string",
    "evidence": [
      "string"
    ],
    "expected_effect": "string",
    "limitations": [
      "string"
    ],
    "monitoring": "string"
  }}
}}
"""

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=KnowledgeAdaptResponse,
        ),
    )

    if response.parsed:
        return response.parsed

    return KnowledgeAdaptResponse.model_validate_json(response.text)