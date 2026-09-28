import ee

from models.api import DataValue, SoilData


GEE_PROJECT_ID = "krishisetu-506117"

ee.Initialize(project=GEE_PROJECT_ID)

TEXTURE_DATASET = (
    "OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02"
)

PH_DATASET = (
    "OpenLandMap/SOL/SOL_PH-H2O_USDA-4C1A2A_M/v02"
)

SOC_DATASET = (
    "OpenLandMap/SOL/SOL_ORGANIC-CARBON_USDA-6A1C_M/v02"
)


TEXTURE_CLASSES = {
    1: "Clay",
    2: "Silty Clay",
    3: "Sandy Clay",
    4: "Clay Loam",
    5: "Silty Clay Loam",
    6: "Sandy Clay Loam",
    7: "Loam",
    8: "Silty Loam",
    9: "Sandy Loam",
    10: "Silt",
    11: "Loamy Sand",
    12: "Sand",
}


def get_soil_data(latitude: float, longitude: float) -> SoilData:
    """
    Retrieve modeled soil properties around a farm coordinate.

    Sources:
    - OpenLandMap soil texture
    - OpenLandMap soil pH
    - OpenLandMap soil organic carbon

    Nutrient values are left unavailable because we do not
    have a suitable India-wide source in the current pipeline.
    """

    point = ee.Geometry.Point([longitude, latitude])
    region = point.buffer(250)

    texture = ee.Image(TEXTURE_DATASET).select("b0")
    ph = ee.Image(PH_DATASET).select("b0")
    organic_carbon = ee.Image(SOC_DATASET).select("b0")

    combined = ee.Image.cat(
        texture.rename("texture"),
        ph.rename("ph"),
        organic_carbon.rename("organic_carbon"),
    )

    values = combined.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=region,
        scale=250,
        bestEffort=True,
        maxPixels=10000,
    ).getInfo()

    texture_value = values.get("texture")
    ph_value = values.get("ph")
    organic_carbon_value = values.get("organic_carbon")

    # -----------------------------------------------------
    # Texture
    # -----------------------------------------------------

    soil_type = None

    if texture_value is not None:
        texture_class = int(round(float(texture_value)))
        soil_type = TEXTURE_CLASSES.get(
            texture_class,
            "Unknown",
        )

    # -----------------------------------------------------
    # pH
    #
    # OpenLandMap stores pH using scale 10.
    # Example: 72 -> pH 7.2
    # -----------------------------------------------------

    ph_result = None

    if ph_value is not None:
        ph_result = round(float(ph_value) / 10.0, 2)

    # -----------------------------------------------------
    # Organic carbon
    #
    # OpenLandMap SOC uses scale 5 g/kg.
    # -----------------------------------------------------

    organic_carbon_result = None

    if organic_carbon_value is not None:
        organic_carbon_result = round(
            float(organic_carbon_value) * 5.0,
            2,
        )

    return SoilData(
        soil_type=soil_type,

        ph=DataValue(
            value=ph_result,
            unit="pH",
            source="OpenLandMap",
            last_updated="2018",
            data_quality="fair",
        ),

        nitrogen=DataValue(
            value=None,
            unit="mg/kg",
            source=None,
            last_updated=None,
            data_quality="unavailable",
        ),

        phosphorus=DataValue(
            value=None,
            unit="mg/kg",
            source=None,
            last_updated=None,
            data_quality="unavailable",
        ),

        potassium=DataValue(
            value=None,
            unit="mg/kg",
            source=None,
            last_updated=None,
            data_quality="unavailable",
        ),

        organic_carbon=DataValue(
            value=organic_carbon_result,
            unit="g/kg",
            source="OpenLandMap",
            last_updated="2018",
            data_quality="fair",
        ),

        soil_moisture=DataValue(
            value=None,
            unit="%",
            source=None,
            last_updated=None,
            data_quality="unavailable",
        ),

        health_status="moderate",
    )