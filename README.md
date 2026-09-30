# 🌱 KrishiSetu

## Interoperable Agricultural Intelligence Network for Climate-Resilient Farming

**KrishiSetu** is a working agricultural intelligence prototype that connects **satellite data, weather, soil indicators, crop-image analysis, Gemini AI reasoning, regenerative advisory, agricultural knowledge exchange, and local adaptation** into one workflow.

The system is designed around a simple pipeline:

```text
DATA
  ↓
FIELD INTELLIGENCE
  ↓
RISK UNDERSTANDING
  ↓
AI REASONING
  ↓
REGENERATIVE ACTION
  ↓
KNOWLEDGE EXCHANGE
  ↓
LOCAL ADAPTATION
  ↓
MONITORING

🚜 The Problem

Agricultural information is available from many different sources, but these sources are often disconnected.

A farmer may have:

Satellite observations
Weather forecasts
Soil information
Crop images
Agricultural practices

But the real challenge is converting these different signals into one localized and actionable decision.

For example:

Satellite Data
      +
Weather
      +
Soil
      +
Crop Image
      ↓
What does this mean for THIS farm?
      ↓
What should the farmer do?
      ↓
How should the recommendation be adapted locally?

KrishiSetu was built to solve this gap.

🎯 Our Solution

KrishiSetu combines multiple agricultural intelligence layers into a single application.

For our working prototype, we use an India-first farm context:

Country        : India
State          : Maharashtra
District       : Nashik
Crop           : Cotton
Growth Stage   : Flowering

The system then combines environmental and crop information to generate field intelligence and actionable recommendations.

⚡ Working Prototype

KrishiSetu is not only a conceptual architecture.

We implemented and deployed a working prototype containing:

Field Intelligence Dashboard
Satellite-based NDVI / NDMI analysis
Weather integration
Soil intelligence
Deterministic environmental risk analysis
Gemini-powered crop diagnosis
Gemini-powered regenerative advisory
Agricultural Knowledge Exchange
AI-based local practice adaptation
BRICS interoperability prototype
Ask KrishiSetu agricultural assistant
REST API backend
Live web deployment
📊 Real Prototype Output

For our Nashik cotton demonstration farm, the live system produced values such as:

Field Intelligence
Indicator	Prototype Value
Crop	Cotton
Growth Stage	Flowering
Field Health Score	50 / 100
Field Status	Watch
NDVI	-0.15
NDMI	-0.1011
Soil Type	Clay Loam
Soil pH	7.23
Organic Carbon	9.19 g/kg
Current Weather Example
Parameter	Value
Temperature	32°C
Humidity	40%
Rainfall	0 mm
Wind Speed	4.2 km/h

The application also consumes forecast information to identify environmental conditions that may affect the field.

Values shown above are from the prototype demonstration and can change when live data sources are queried again.

🛰️ Satellite Intelligence

KrishiSetu uses Google Earth Engine with Sentinel-2 imagery.

The backend retrieves a recent usable Sentinel-2 observation and calculates:

NDVI

Normalized Difference Vegetation Index:

NDVI = (NIR - Red) / (NIR + Red)
NDMI

Normalized Difference Moisture Index:

NDMI = (NIR - SWIR) / (NIR + SWIR)

The prototype calculates these indicators from Sentinel-2 imagery rather than generating them using Gemini.

Example backend output:

{
  "ndvi": -0.15,
  "ndmi": -0.1011,
  "observation_date": "2026-09-20",
  "source": "Sentinel-2",
  "data_quality": "good",
  "image_count": 2
}

This separation is important:

Earth Observation
       ↓
Measured Indicators
       ↓
Risk / Field Analysis
       ↓
Gemini Reasoning

Gemini is not used as the source of satellite measurements.

🌍 Soil Intelligence

The prototype uses Google Earth Engine with OpenLandMap soil datasets.

Currently implemented soil indicators include:

Soil texture
Soil pH
Organic carbon

Example demonstration result:

Soil Type       : Clay Loam
pH              : 7.23
Organic Carbon  : 9.19 g/kg

When a particular soil parameter is not available from the selected data source, KrishiSetu displays it as unavailable instead of inventing a value.

🌦️ Weather Intelligence

Weather data is obtained through Open-Meteo.

The system uses:

Current temperature
Humidity
Rainfall
Wind speed
Forecast temperature
Rain probability
Forecast rainfall

The backend also handles external weather-service failures gracefully so that a temporary weather API limitation does not completely break the farm analysis workflow.

⚠️ Deterministic Risk Analysis

KrishiSetu does not ask Gemini to invent environmental risk values.

A deterministic risk engine evaluates available forecast information.

Examples include:

Temperature
    ↓
Heat Stress

Rainfall Probability
    ↓
Rainfall Risk

Forecast Rainfall
    ↓
Water Stress

Humidity
    ↓
Disease Environment Risk

Example rule structure:

Temperature >= 35°C
        → High Heat Stress

Temperature >= 32°C
        → Moderate Heat Stress

Rain Probability >= 70%
        → High Rainfall Risk

Rain Probability >= 40%
        → Moderate Rainfall Risk

Humidity >= 85%
        → High Disease Environment Risk

Humidity >= 75%
        → Moderate Disease Environment Risk

These rules provide a deterministic analytical layer before AI reasoning is applied.

🤖 Gemini AI Integration

Google Gemini is a core component of KrishiSetu.

We use Gemini for tasks where language and multimodal reasoning are useful:

1. Crop Diagnosis
Crop Image
    +
Crop Type
    +
Growth Stage
    +
Farmer Observation
    ↓
Gemini Multimodal Analysis
    ↓
Structured Diagnosis

The response includes:

Image quality
Crop condition
Confidence
Severity
Visual observations
Possible causes
Immediate actions
Regenerative response
Expected benefit
Monitoring period
Evidence/context
Prototype Example

For the cotton image demonstration:

Crop       : Cotton
Condition  : Healthy / Normal Appearance
Confidence : 85%
Severity   : Low

The system then produced visual observations and immediate actions based on the submitted image and context.

🌱 Regenerative Advisory

The advisory engine combines the farm context, environmental signals, risk information and Gemini reasoning.

The resulting action plan contains:

1. Immediate Action
2. Regenerative Action
3. Water Management
4. Soil Management
5. Pest & Disease Management
6. Monitoring Plan

Each recommendation can contain:

Recommendation
Why it matters
Evidence/context
Expected effect
Monitoring instruction

Example prototype recommendation:

Practice:
Organic Mulching

Expected Benefit:
Improved soil moisture retention
and reduced environmental stress

Monitoring:
Observe soil moisture and crop condition
over the following period.
🔄 Knowledge Exchange

One of the main differentiators of KrishiSetu is the Agricultural Knowledge Exchange.

Instead of simply asking:

"What should I do?"

the system can search for practices from other agricultural regions.

The current prototype knowledge base contains 4 agricultural practices.

Example regions include:

India
Maharashtra

Brazil
Paraná

South Africa
Free State

The knowledge workflow is:

Local Farm Problem
       ↓
Knowledge Search
       ↓
Similar Agricultural Practices
       ↓
Select Practice
       ↓
Local Farm Context
       ↓
Gemini Adaptation
       ↓
Localized Recommendation
🧠 Local Practice Adaptation

After selecting a practice, KrishiSetu combines:

Original Practice
       +
Local Farm Context
       +
Current Conditions
       ↓
Gemini
       ↓
Localized Recommendation
Prototype Example

Original practice:

Use organic mulch around the crop root zone
to reduce evaporation and maintain soil moisture.

Local context:

Crop        : Cotton
Location    : Nashik, Maharashtra
Soil        : Black Soil
Climate     : Semi-arid
Problem     : Water Stress

Adapted recommendation:

Apply a 3–5 cm layer of locally available
crop residue such as wheat or maize stalks
around the base of cotton plants, while
maintaining a gap around the main stem.

The adaptation output also includes:

Expected effect
Monitoring guidance
Limitations
Adaptation basis

This demonstrates the difference between retrieving knowledge and adapting knowledge to a local farm.

🌐 BRICS Agricultural Interoperability

KrishiSetu contains a demonstrative interoperability model representing five agricultural nodes:

🇮🇳 India
🇧🇷 Brazil
🇷🇺 Russia
🇨🇳 China
🇿🇦 South Africa

The prototype currently represents:

Agricultural regions
Supported crops
Data capabilities
Knowledge capabilities
Shared practices
Knowledge contributions
Synchronization timestamps

The prototype contains 5 participating nodes.

             KRISHISETU
                  │
        ┌─────────┼─────────┐
        ↓         ↓         ↓
      India     Brazil    Russia
        │         │         │
        └──────┬──┴──┬──────┘
               ↓     ↓
             China  South Africa
                  │
                  ↓
          Knowledge Exchange
                  │
                  ↓
          Local Adaptation

Important: This is a demonstrative interoperability model and is not official BRICS infrastructure.

🎙️ Ask KrishiSetu

The prototype also includes an AI agricultural assistant.

Users can ask questions about:

Crops
Weather
Soil
Farm conditions
Agricultural practices

Example:

Question:
What should I do if my cotton field is getting too much rain?

KrishiSetu generates a context-aware answer using the farm context and Gemini agricultural reasoning.

Example response includes actions such as:

Improving field drainage
Monitoring for waterlogging
Watching for fungal symptoms
Avoiding unnecessary operations during heavy rain

The current prototype implements the text-based agricultural query workflow.

🏗️ System Architecture
                     KRISHISETU
                          │
                          ▼
                  FARM CONTEXT
                          │
                          ▼
        ┌─────────────────────────────────┐
        │          DATA SOURCES           │
        │                                 │
        │  Sentinel-2 / Earth Engine      │
        │  Open-Meteo                     │
        │  OpenLandMap                    │
        │  Crop Images                    │
        └────────────────┬────────────────┘
                         │
                         ▼
                FIELD INTELLIGENCE
                         │
             ┌───────────┼───────────┐
             ↓           ↓           ↓
           NDVI         NDMI       Risks
             │           │           │
             └───────────┼───────────┘
                         ↓
                  AGRICULTURAL AI
                         │
                  Google Gemini
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
      Diagnosis       Advisory      Adaptation
          │              │              │
          └──────────────┼──────────────┘
                         ↓
              KNOWLEDGE EXCHANGE
                         ↓
                LOCAL ADAPTATION
                         ↓
                   FARM ACTION
                         ↓
                    MONITORING
🛠️ Technology Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
React Router
Lucide React
Recharts
Backend
Python
FastAPI
Pydantic
Uvicorn
AI
Google Gemini API
Gemini multimodal analysis
Structured Gemini responses
Earth Observation
Google Earth Engine
Sentinel-2
Agricultural Data
Open-Meteo
OpenLandMap
Deployment
Render
🔌 Backend API

The backend currently exposes the following core endpoints:

GET  /health

POST /api/v1/farm/analyze

POST /api/v1/diagnosis

POST /api/v1/advisory

POST /api/v1/knowledge/search

POST /api/v1/knowledge/adapt

GET  /api/v1/network/nodes

POST /api/v1/voice/query
API Responsibilities
Endpoint	Function
/health	Backend health check
/farm/analyze	Farm + weather + satellite + soil + risk analysis
/diagnosis	Gemini crop-image diagnosis
/advisory	Regenerative advisory generation
/knowledge/search	Agricultural practice search
/knowledge/adapt	Local practice adaptation
/network/nodes	BRICS interoperability nodes
/voice/query	Agricultural assistant query
🔗 End-to-End Data Flow
                  FARMER
                    │
                    ↓
              Farm Context
                    │
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   Satellite      Weather       Soil
       │            │            │
       └────────────┼────────────┘
                    ↓
             Field Intelligence
                    │
                    ↓
              Risk Analysis
                    │
                    ↓
             Gemini Reasoning
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
   Crop Diagnosis       Farm Advisory
          │                   │
          └─────────┬─────────┘
                    ↓
             Knowledge Exchange
                    ↓
             Practice Selection
                    ↓
             Local Adaptation
                    ↓
             Farm Recommendation
                    ↓
                Monitoring
📱 Prototype Modules
Module	What We Implemented
Dashboard	Farm-level field intelligence
Satellite Intelligence	Sentinel-2 NDVI / NDMI
Weather	Current + forecast conditions
Soil Intelligence	Texture, pH, organic carbon
Risk Engine	Deterministic environmental risk analysis
Crop Diagnosis	Gemini multimodal image analysis
Regenerative Advisory	Structured farm action plan
Knowledge Exchange	Searchable agricultural practices
Local Adaptation	Gemini-based practice localization
BRICS Network	5-node interoperability prototype
Ask KrishiSetu	Gemini agricultural Q&A
📈 Example KrishiSetu Workflow

For our demonstration farm:

Nashik, Maharashtra
       ↓
Cotton
       ↓
Flowering Stage
       ↓
Satellite + Weather + Soil
       ↓
NDVI / NDMI + Environmental Signals
       ↓
Field Health
       ↓
Crop Image Diagnosis
       ↓
Regenerative Advisory
       ↓
Knowledge Exchange
       ↓
Organic Mulching Practice
       ↓
Local Adaptation
       ↓
3–5 cm Local Crop-Residue Recommendation
       ↓
Expected Effect + Monitoring + Limitations
🧩 Why KrishiSetu Is Different

A conventional agricultural chatbot can follow:

Question
   ↓
AI Answer

KrishiSetu follows:

Real Farm Context
       ↓
Agricultural Data
       ↓
Field Intelligence
       ↓
Risk Analysis
       ↓
AI Reasoning
       ↓
Regenerative Action
       ↓
Cross-Region Knowledge
       ↓
Local Adaptation
       ↓
Monitoring

The core difference is that KrishiSetu is designed as an agricultural intelligence workflow, not only a conversational interface.

🇮🇳 India-First Implementation

The current demonstration focuses on:

India
  ↓
Maharashtra
  ↓
Nashik
  ↓
Cotton
  ↓
Flowering Stage

The architecture is designed so that additional crops, regions, datasets and agricultural knowledge can be integrated later.

🚀 Scalability

The current prototype can be extended toward:

More Crops
Cotton
Soybean
Maize
Wheat
Rice
...
More Regions
Maharashtra
Madhya Pradesh
Telangana
Other Indian States
        ↓
International Regions
More Data Sources
Satellite
Weather
Soil
Crop Imagery
Agricultural Knowledge
Larger Knowledge Network
Farm
  ↓
Regional Knowledge
  ↓
National Network
  ↓
International Knowledge Exchange
🔐 Responsible AI Architecture

KrishiSetu separates data-driven measurements from AI-generated reasoning.

Data / Analytical Layer

Responsible for:

Satellite indicators
Weather information
Soil indicators
Deterministic risk calculations
Farm context
Gemini AI Layer

Responsible for:

Image interpretation
Agricultural reasoning
Advisory generation
Knowledge adaptation
Natural-language agricultural assistance

This architecture reduces the risk of treating an AI-generated response as if it were a raw measurement.

AI recommendations are intended as decision-support information and should be validated against local agricultural conditions and expert guidance before real-world implementation.

🌐 Live Prototype
Live Application

https://krishisetu-wagb.onrender.com

Backend API

https://krishisetu-api-8008.onrender.com

GitHub

https://github.com/VinayakSomase/KrishiSetu

📂 Project Structure
KrishiSetu/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── models/
│   ├── services/
│   ├── engines/
│   ├── data/
│   ├── tests/
│   └── requirements.txt
│
├── data/
├── docs/
├── tests/
├── README.md
├── .gitignore
└── LICENSE
⚙️ Local Setup
Backend
cd backend

Create a virtual environment:

python -m venv venv

Activate:

.\venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Create .env:

APP_NAME=KrishiSetu API
APP_VERSION=0.1.0
ENVIRONMENT=development

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-3.1-flash-lite

GEE_PROJECT_ID=YOUR_GEE_PROJECT_ID

WEATHER_API_URL=

CORS_ORIGINS=http://localhost:5173

Run:

uvicorn main:app --reload

Backend:

http://127.0.0.1:8000
Frontend
cd frontend

Install:

npm install

Run:

npm run dev

Frontend:

http://localhost:5173

Production build:

npm run build
📦 Backend Dependencies

Main backend dependencies include:

FastAPI
Uvicorn
Pydantic
Pydantic Settings
Python Dotenv
HTTPX
Pillow
NumPy
Google GenAI
Earth Engine API
🧪 Prototype Validation

During development, the following components were tested independently and through the integrated application:

✓ FastAPI backend
✓ Health endpoint
✓ Weather service
✓ Sentinel-2 NDVI
✓ Sentinel-2 NDMI
✓ Soil intelligence
✓ Deterministic risk engine
✓ Field health calculation
✓ Gemini crop diagnosis
✓ Gemini regenerative advisory
✓ Knowledge search
✓ Knowledge adaptation
✓ BRICS network nodes
✓ Agricultural assistant
✓ Frontend API integration
✓ Production CORS
✓ Live frontend deployment
✓ Live backend deployment

The frontend production build is also validated using:

npm run build
🌾 Final Workflow
             KRISHISETU

          FARM CONTEXT
                ↓
       ┌─────────────────┐
       │ Satellite        │
       │ Weather          │
       │ Soil             │
       │ Crop Image       │
       └────────┬────────┘
                ↓
       FIELD INTELLIGENCE
                ↓
          RISK ANALYSIS
                ↓
          GEMINI REASONING
                ↓
      ┌─────────┴─────────┐
      ↓                   ↓
  DIAGNOSIS           ADVISORY
      │                   │
      └─────────┬─────────┘
                ↓
       KNOWLEDGE EXCHANGE
                ↓
        PRACTICE SELECTION
                ↓
        LOCAL ADAPTATION
                ↓
       REGENERATIVE ACTION
                ↓
            MONITOR
🏆 Hackathon Focus

Track: AgriN & Regenerative Agricultural Intelligence

Theme: BRICS — Cooperation

Project: KrishiSetu

Core idea

Connect agricultural data and knowledge across regions, understand local farm conditions, and transform relevant knowledge into localized regenerative action.

👥 Team
Team Zynex

Built for the Build with AI: Code for Communities — Second Edition hackathon.
