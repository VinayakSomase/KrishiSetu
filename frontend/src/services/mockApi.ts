import type {
  AdvisoryRequest,
  AdvisoryResponse,
  FarmAnalyzeRequest,
  FarmAnalyzeResponse,
  DiagnosisRequest,
  DiagnosisResponse,
  KnowledgeSearchRequest,
  KnowledgeSearchResponse,
  KnowledgeAdaptRequest,
  KnowledgeAdaptResponse,
  NetworkNodesResponse,
} from "../types/api";

// ------------------------------------------
// Mock Farm Analysis
// ------------------------------------------

export async function mockFarmAnalyze(
  request: FarmAnalyzeRequest
): Promise<FarmAnalyzeResponse> {
  console.log("Mock Farm Analyze Request:", request);

  return {
    farm: {
      country: "India",
      state: "Maharashtra",
      district: "Nashik",
      location: {
        latitude: 20.0059,
        longitude: 73.7933,
      },
      crop: "Cotton",
      growth_stage: "Flowering",
      last_analysis: "Today",
    },

    field_health: {
      status: "healthy",
      health_score: 82,

      ndvi: {
        value: 0.72,
        unit: "",
        source: "Mock Satellite Data",
        last_updated: "Today",
        data_quality: "fair",
      },

      ndmi: {
        value: 0.48,
        unit: "",
        source: "Mock Satellite Data",
        last_updated: "Today",
        data_quality: "fair",
      },

      soil_moisture: {
        value: 31,
        unit: "%",
        source: "Mock Soil Data",
        last_updated: "Today",
        data_quality: "fair",
      },

      climate_stress: "moderate",
      disease_risk: "moderate",
    },

    weather: {
      current: {
        temperature: 28,
        humidity: 64,
        rainfall: 12,
        wind_speed: 14,
      },

      forecast: [
        {
          date: "Today",
          temperature: 28,
          rainfall_probability: 40,
          rainfall: 12,
        },
        {
          date: "Tomorrow",
          temperature: 29,
          rainfall_probability: 35,
          rainfall: 8,
        },
        {
          date: "Day 3",
          temperature: 30,
          rainfall_probability: 30,
          rainfall: 5,
        },
        {
          date: "Day 4",
          temperature: 29,
          rainfall_probability: 45,
          rainfall: 10,
        },
        {
          date: "Day 5",
          temperature: 28,
          rainfall_probability: 50,
          rainfall: 14,
        },
        {
          date: "Day 6",
          temperature: 27,
          rainfall_probability: 55,
          rainfall: 16,
        },
        {
          date: "Day 7",
          temperature: 28,
          rainfall_probability: 40,
          rainfall: 9,
        },
      ],

      source: "Mock Weather Data",
      last_updated: "Today",
      data_quality: "fair",
    },

    soil: {
      soil_type: "Black Soil",

      ph: {
        value: 6.8,
        unit: "",
        source: "Mock Soil Data",
        last_updated: "Today",
        data_quality: "fair",
      },

      nitrogen: {
        value: 72,
        unit: "",
        source: "Mock Soil Data",
        last_updated: "Today",
        data_quality: "fair",
      },

      phosphorus: {
        value: 48,
        unit: "",
        source: "Mock Soil Data",
        last_updated: "Today",
        data_quality: "fair",
      },

      potassium: {
        value: 68,
        unit: "",
        source: "Mock Soil Data",
        last_updated: "Today",
        data_quality: "fair",
      },

      organic_carbon: {
        value: 0.72,
        unit: "%",
        source: "Mock Soil Data",
        last_updated: "Today",
        data_quality: "fair",
      },

      soil_moisture: {
        value: 31,
        unit: "%",
        source: "Mock Soil Data",
        last_updated: "Today",
        data_quality: "fair",
      },

      health_status: "moderate",
    },

    risks: [
      {
        type: "water_stress",
        level: "low",
        reason: "Soil moisture is currently within an acceptable range.",
      },
      {
        type: "heat_stress",
        level: "moderate",
        reason: "Current temperature may increase crop water demand.",
      },
      {
        type: "disease_environment",
        level: "moderate",
        reason: "Weather conditions may support disease development.",
      },
    ],

    advisory_preview: {
      why: "Current weather and soil conditions may increase water demand and create a moderate disease environment.",

      do_now:
        "Monitor soil moisture and crop condition regularly.",

      regenerative_action:
        "Use organic matter and suitable mulching practices to improve soil moisture retention.",

      monitor:
        "Monitor soil moisture and crop response over the following days.",
    },
  };
}

// ------------------------------------------
// Mock Crop Diagnosis
// ------------------------------------------

export async function mockDiagnosis(
  request: DiagnosisRequest
): Promise<DiagnosisResponse> {
  console.log("Mock Diagnosis Request:", request);

  return {
    image_quality: {
      status: "valid",
      reason: null,
    },

    assessment: {
      crop: request.crop,
      condition: "Healthy crop with minor visible stress indicators.",
      confidence: 0.88,
      severity: "low",

      visual_observations: [
        "Leaves appear generally healthy.",
        "Minor visible stress symptoms detected.",
        "No severe damage pattern identified.",
      ],

      possible_causes: [
        "Environmental stress",
        "Temporary water stress",
      ],
    },

    immediate_actions: [
      "Monitor affected leaves regularly.",
      "Maintain appropriate soil moisture.",
      "Avoid unnecessary chemical intervention.",
    ],

    regenerative_response: {
      practice: "Mulching and organic matter management",
      why: "Improves soil moisture retention and supports soil health.",
      expected_benefit:
        "Better moisture retention and improved soil condition.",
      monitoring_period: "7-14 days",
    },

    evidence: [
      {
        source: "Mock Agricultural Knowledge Base",
        data_used: "Crop image and farmer observation",
        last_updated: "Today",
      },
      {
        source: "Mock Field Intelligence Data",
        data_used: "Weather and soil indicators",
        last_updated: "Today",
      },
    ],
  };
}

// ------------------------------------------
// Mock Advisory
// ------------------------------------------

export async function mockAdvisory(
  request: AdvisoryRequest
): Promise<AdvisoryResponse> {
  console.log("Mock Advisory Request:", request);

  return {
    current_condition:
      "The field is generally healthy, with moderate climate and disease-related risks.",

    risk_explanation:
      "Current weather and soil conditions may increase water demand and create a moderate disease environment.",

    sections: {
      immediate_action: [
        {
          recommendation:
            "Monitor soil moisture and crop condition regularly.",
          why: "Early observation helps identify developing crop stress.",
          evidence: ["Field moisture data", "Crop condition"],
          expected_effect: "Earlier detection of crop stress.",
          monitor: "Check the field every 2-3 days.",
        },
      ],

      regenerative_action: [
        {
          recommendation:
            "Use organic matter and suitable mulching practices to improve soil moisture retention.",
          why: "Improved soil structure can help retain water and support soil health.",
          evidence: ["Soil condition", "Agricultural knowledge"],
          expected_effect:
            "Better soil moisture retention and improved soil condition.",
          monitor:
            "Monitor soil moisture and crop response for 7-14 days.",
        },
      ],

      water_management: [
        {
          recommendation:
            "Maintain irrigation according to crop water requirements and current soil moisture.",
          why:
            "Avoiding excessive irrigation and water stress supports efficient water use.",
          evidence: ["Soil moisture", "Weather conditions"],
          expected_effect: "More efficient water management.",
          monitor: "Monitor soil moisture regularly.",
        },
      ],

      soil_management: [
        {
          recommendation:
            "Increase organic matter through locally suitable organic inputs.",
          why:
            "Organic matter supports soil structure and water-holding capacity.",
          evidence: ["Soil organic carbon", "Soil condition"],
          expected_effect: "Improved soil quality over time.",
          monitor: "Track soil organic carbon during future assessments.",
        },
      ],

      pest_disease_management: [
        {
          recommendation:
            "Inspect leaves regularly for early signs of disease or pest activity.",
          why:
            "Early detection can reduce unnecessary chemical intervention.",
          evidence: ["Crop observation", "Weather conditions"],
          expected_effect:
            "Earlier identification of potential problems.",
          monitor: "Inspect affected areas during field visits.",
        },
      ],

      monitoring_plan: [
        {
          recommendation: "Track crop and soil condition over time.",
          why: "Regular monitoring helps identify changes early.",
          evidence: ["Field intelligence data"],
          expected_effect: "Better understanding of field trends.",
          monitor: "Review field indicators regularly.",
        },
      ],
    },

    expected_indicators: [
      "Stable or improving crop condition",
      "Adequate soil moisture",
      "Reduced visible stress",
      "Improved soil moisture retention over time",
    ],

    evidence: [
      {
        source: "Mock Agricultural Knowledge Base",
        data_used: "Farm context for Cotton",
        last_updated: "Today",
      },
      {
        source: "Mock Field Intelligence Data",
        data_used: "Weather, soil and satellite indicators",
        last_updated: "Today",
      },
    ],
  };
}

// ------------------------------------------
// Mock Knowledge Search
// ------------------------------------------

export async function mockKnowledgeSearch(
  request: KnowledgeSearchRequest
): Promise<KnowledgeSearchResponse> {
  console.log("Mock Knowledge Search Request:", request);

  return {
    query: {
      crop: request.crop,
      soil: request.soil,
      climate: request.climate,
      problem: request.problem,
    },

    results: [
      {
        id: "practice-india-001",
        country: "India",
        region: "Maharashtra",
        crop: "Cotton",
        practice:
          "Mulching and organic matter management for improved soil moisture retention.",
        target_problem: "Water stress",

        suitable_conditions: [
          "Black Soil",
          "Semi-arid",
          "Water-stressed agricultural systems",
        ],

        evidence: {
          source: "Mock Agricultural Knowledge Base",
          reference: "Regional soil and water management practice",
        },

        applicability_score: 86,
      },

      {
        id: "practice-brazil-001",
        country: "Brazil",
        region: "Mato Grosso",
        crop: "Cotton",
        practice:
          "Cover cropping and residue retention to improve soil structure and moisture management.",
        target_problem: "Water stress",

        suitable_conditions: [
          "Tropical agricultural climate",
          "Low organic matter soils",
          "Rain-fed farming systems",
        ],

        evidence: {
          source: "Mock International Agricultural Knowledge Base",
          reference: "Conservation agriculture practice",
        },

        applicability_score: 78,
      },

      {
        id: "practice-southafrica-001",
        country: "South Africa",
        region: "Free State",
        crop: "Cotton",
        practice:
          "Water-conserving soil management combined with crop residue protection.",
        target_problem: "Water stress",

        suitable_conditions: [
          "Semi-arid conditions",
          "Water-limited farming",
          "Conservation agriculture",
        ],

        evidence: {
          source: "Mock International Agricultural Knowledge Base",
          reference: "Water conservation practice",
        },

        applicability_score: 74,
      },
    ],
  };
}

// ------------------------------------------
// Mock Knowledge Adaptation
// ------------------------------------------

export async function mockKnowledgeAdapt(
  request: KnowledgeAdaptRequest
): Promise<KnowledgeAdaptResponse> {
  console.log("Mock Knowledge Adapt Request:", request);

  return {
    original_practice: {
      country: "Brazil",
      region: "Mato Grosso",
      practice:
        "Cover cropping and residue retention to improve soil structure and moisture management.",
      target_problem: "Water stress",
    },

    local_farm_context: {
      country: "India",
      state: "Maharashtra",
      district: "Nashik",
      crop: "Cotton",
      soil: "Black Soil",
      climate: "Semi-arid",
    },

    adapted_recommendation: {
      recommendation:
        "Adapt cover cropping and residue retention using locally suitable species and available farm residues.",

      why:
        "The practice can be adapted to improve soil cover, reduce evaporation and support soil organic matter under local conditions.",

      evidence: [
        "Original practice from agricultural knowledge exchange",
        "Local farm context",
        "Mock soil and weather conditions",
      ],

      expected_effect:
        "Improved soil moisture retention, reduced erosion and gradual improvement in soil condition.",

      limitations: [
        "Suitable cover crop species depend on local climate and crop rotation.",
        "Water availability should be considered before establishing additional vegetation.",
      ],

      monitoring:
        "Monitor soil moisture, crop growth and soil condition over the following weeks.",
    },
  };
}

// ------------------------------------------
// Mock BRICS Network
// ------------------------------------------

export async function mockNetworkNodes(): Promise<NetworkNodesResponse> {
  return {
    nodes: [
      {
        country: "India",
        regions: ["Maharashtra", "Punjab", "Karnataka"],
        supported_crops: ["Cotton", "Rice", "Wheat", "Sugarcane"],
        knowledge_contributions: 128,
        data_capabilities: [
          "Satellite Agriculture Data",
          "Soil Intelligence",
          "Weather Data",
          "Agricultural Practices",
        ],
        last_synchronization: "Today",
        shared_practices: 84,
      },

      {
        country: "Brazil",
        regions: ["Mato Grosso", "Parana"],
        supported_crops: ["Soybean", "Cotton", "Maize"],
        knowledge_contributions: 96,
        data_capabilities: [
          "Crop Monitoring",
          "Conservation Agriculture",
          "Soil Management",
        ],
        last_synchronization: "Today",
        shared_practices: 61,
      },

      {
        country: "South Africa",
        regions: ["Free State", "Western Cape"],
        supported_crops: ["Maize", "Wheat", "Grapes"],
        knowledge_contributions: 72,
        data_capabilities: [
          "Water Management",
          "Climate Intelligence",
          "Conservation Agriculture",
        ],
        last_synchronization: "Today",
        shared_practices: 48,
      },

      {
        country: "China",
        regions: ["Henan", "Sichuan", "Yunnan"],
        supported_crops: ["Rice", "Wheat", "Maize", "Tea"],
        knowledge_contributions: 110,
        data_capabilities: [
          "Precision Agriculture",
          "Crop Monitoring",
          "Soil Intelligence",
        ],
        last_synchronization: "Today",
        shared_practices: 76,
      },

      {
        country: "Russia",
        regions: ["Krasnodar", "Rostov"],
        supported_crops: ["Wheat", "Barley", "Sunflower"],
        knowledge_contributions: 64,
        data_capabilities: [
          "Climate Data",
          "Crop Monitoring",
          "Agricultural Research",
        ],
        last_synchronization: "Today",
        shared_practices: 42,
      },
    ],
  };
}

// ------------------------------------------
// Backward-compatible Knowledge Adaptation
// ------------------------------------------
//
// The frontend currently expects the name
// "mockAdaptKnowledge", while the original
// function above is named "mockKnowledgeAdapt".
// Keep both names so existing imports continue
// to work.

export async function mockAdaptKnowledge(
  request: KnowledgeAdaptRequest
): Promise<KnowledgeAdaptResponse> {
  return mockKnowledgeAdapt(request);
}