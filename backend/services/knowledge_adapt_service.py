import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from models.api import KnowledgeAdaptResponse
from data.knowledge_base import KNOWLEDGE_BASE

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured.")

client = genai.Client(api_key=GEMINI_API_KEY)


def get_practice_by_id(practice_id: str) -> dict:
    for item in KNOWLEDGE_BASE:
        if item["practice_id"] == practice_id:
            return item

    raise ValueError(f"Knowledge practice not found: {practice_id}")


async def adapt_knowledge(
    practice: str,
    farm_context: dict,
    current_conditions: dict,
) -> KnowledgeAdaptResponse:

    # Resolve practice ID to the authoritative knowledge-base record.
    practice_record = get_practice_by_id(practice)

    prompt = f"""
You are the agricultural knowledge adaptation engine for KrishiSetu.

Your task is to adapt an agricultural practice from the knowledge network
to the farmer's local conditions.

IMPORTANT:
- Preserve the original practice exactly as supplied.
- Do not rename, replace, or rewrite the original practice.
- Preserve the original country, region, target problem, and practice intent.
- Adapt only the recommendation for the local farm.
- Consider local crop, soil, climate, location and current conditions.
- Explain why the adapted recommendation fits the local context.
- Do not invent scientific studies or citations.
- Do not provide pesticide doses or unsafe chemical instructions.
- If important information is missing, explicitly mention the limitation.
- Evidence must refer only to the supplied practice and farm data.
- The recommendation should be practical for a small or marginal farmer.
- This is an AI-generated adaptation, not a guaranteed agronomic outcome.

AUTHORITATIVE ORIGINAL PRACTICE:
{practice_record}

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
        result = response.parsed
    else:
        result = KnowledgeAdaptResponse.model_validate_json(response.text)

    # Keep provenance deterministic.
    # Gemini must not be allowed to rewrite the original knowledge record.
    result.original_practice.country = practice_record.get("country", "")
    result.original_practice.region = practice_record.get("region", "")
    result.original_practice.practice = practice_record.get("practice", "")
    result.original_practice.target_problem = practice_record.get(
        "problem", [""]
    )[0]

    return result