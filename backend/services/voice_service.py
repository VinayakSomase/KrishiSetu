import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from models.api import VoiceQueryResponse

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured.")

client = genai.Client(api_key=GEMINI_API_KEY)


async def generate_voice_response(
    language: str,
    query: str,
    farm_context: dict,
) -> VoiceQueryResponse:

    prompt = f"""
You are the voice agricultural assistant for KrishiSetu Nexus.

Answer the farmer's agricultural question using the supplied farm context.

LANGUAGE:
{language}

FARMER QUESTION:
{query}

FARM CONTEXT:
{farm_context}

RULES:
- Answer in the requested language.
- Keep the response practical and easy for a farmer to understand.
- Use the supplied farm context.
- Do not invent measurements or field observations.
- Do not provide pesticide doses.
- Do not claim certainty where information is unavailable.
- This is an AI-generated agricultural response.
- Keep the answer concise enough for voice delivery.
- The source list should describe the information used.

Return EXACTLY this structure:

{{
  "language": "{language}",
  "transcript": "{query}",
  "response": {{
    "text": "string",
    "source": [
      "Farm context",
      "KrishiSetu AI agricultural reasoning"
    ]
  }},
  "audio": {{
    "available": false,
    "url": null
  }}
}}
"""

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=VoiceQueryResponse,
        ),
    )

    if response.parsed:
        result = response.parsed
    else:
        result = VoiceQueryResponse.model_validate_json(response.text)

    # We are implementing text-based voice-query support first.
    # Actual audio generation can be connected later.
    result.audio.available = False
    result.audio.url = None

    return result