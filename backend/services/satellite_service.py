import os
import json
from datetime import datetime, timedelta

import ee
import google.auth
from google.oauth2 import service_account


# ---------------------------------------------------------
# Earth Engine configuration
# ---------------------------------------------------------

GEE_PROJECT_ID = os.getenv("GEE_PROJECT_ID", "krishisetu-506117")

GEE_SERVICE_ACCOUNT_JSON = os.getenv("GEE_SERVICE_ACCOUNT_JSON")

if GEE_SERVICE_ACCOUNT_JSON:
    service_account_info = json.loads(GEE_SERVICE_ACCOUNT_JSON)
    credentials = service_account.Credentials.from_service_account_info(
        service_account_info,
        scopes=[
            "https://www.googleapis.com/auth/earthengine",
            "https://www.googleapis.com/auth/cloud-platform",
        ],
    )
else:
    credentials, _ = google.auth.default()

ee.Initialize(
    credentials=credentials,
    project=GEE_PROJECT_ID,
)


# Sentinel-2 Surface Reflectance Harmonized
S2_COLLECTION = "COPERNICUS/S2_SR_HARMONIZED"


# ---------------------------------------------------------
# Cloud masking
# ---------------------------------------------------------

def mask_sentinel2_clouds(image):
    """
    Mask clouds and cirrus using the Sentinel-2 QA60 band.
    """

    qa = image.select("QA60")

    cloud_bit = 1 << 10
    cirrus_bit = 1 << 11

    mask = (
        qa.bitwiseAnd(cloud_bit).eq(0)
        .And(qa.bitwiseAnd(cirrus_bit).eq(0))
    )

    return image.updateMask(mask)


# ---------------------------------------------------------
# Satellite analysis
# ---------------------------------------------------------

def get_satellite_indices(
    latitude: float,
    longitude: float,
    days_back: int = 30,
):
    """
    Get recent Sentinel-2 NDVI and NDMI values
    around a farm location.

    Returns:
        dict containing:
        - NDVI
        - NDMI
        - observation date
        - satellite source
        - data quality
        - image count
    """

    point = ee.Geometry.Point([longitude, latitude])

    # Use a small area around the farm coordinate instead
    # of relying on a single satellite pixel.
    region = point.buffer(250)

    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=days_back)

    start = start_date.strftime("%Y-%m-%d")
    end = end_date.strftime("%Y-%m-%d")

    # -----------------------------------------------------
    # Find Sentinel-2 imagery
    # -----------------------------------------------------

    collection = (
        ee.ImageCollection(S2_COLLECTION)
        .filterBounds(region)
        .filterDate(start, end)
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 60))
        .map(mask_sentinel2_clouds)
        .sort("system:time_start", False)
    )

    image_count = collection.size().getInfo()

    # -----------------------------------------------------
    # No imagery available
    # -----------------------------------------------------

    if image_count == 0:
        return {
            "ndvi": None,
            "ndmi": None,
            "observation_date": None,
            "source": "Sentinel-2",
            "data_quality": "unavailable",
            "image_count": 0,
        }

    # -----------------------------------------------------
    # Select the most recent usable image
    # -----------------------------------------------------

    image = ee.Image(collection.first())

    # -----------------------------------------------------
    # Calculate NDVI
    #
    # NDVI = (NIR - RED) / (NIR + RED)
    #
    # Sentinel-2:
    # B8 = NIR
    # B4 = Red
    # -----------------------------------------------------

    ndvi = image.normalizedDifference(["B8", "B4"]).rename("NDVI")

    # -----------------------------------------------------
    # Calculate NDMI
    #
    # NDMI = (NIR - SWIR) / (NIR + SWIR)
    #
    # Sentinel-2:
    # B8  = NIR
    # B11 = SWIR
    # -----------------------------------------------------

    ndmi = image.normalizedDifference(["B8", "B11"]).rename("NDMI")

    # -----------------------------------------------------
    # Calculate mean index over farm area
    # -----------------------------------------------------

    indices = ndvi.addBands(ndmi)

    values = indices.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=region,
        scale=10,
        bestEffort=True,
        maxPixels=100000,
    ).getInfo()

    ndvi_value = values.get("NDVI")
    ndmi_value = values.get("NDMI")

    # -----------------------------------------------------
    # Observation date
    # -----------------------------------------------------

    timestamp = image.get("system:time_start").getInfo()

    observation_date = None

    if timestamp:
        observation_date = datetime.fromtimestamp(
            timestamp / 1000,
            tz=timezone.utc,
        ).strftime("%Y-%m-%d")

    # -----------------------------------------------------
    # Determine data quality
    # -----------------------------------------------------

    if ndvi_value is None or ndmi_value is None:
        data_quality = "poor"
    else:
        data_quality = "good"

    return {
        "ndvi": round(float(ndvi_value), 4) if ndvi_value is not None else None,
        "ndmi": round(float(ndmi_value), 4) if ndmi_value is not None else None,
        "observation_date": observation_date,
        "source": "Sentinel-2",
        "data_quality": data_quality,
        "image_count": image_count,
    }