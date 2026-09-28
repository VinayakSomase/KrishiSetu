from models.api import FarmRisk, RiskLevel, WeatherData


def calculate_climate_risks(weather: WeatherData) -> list[FarmRisk]:
    """
    Calculate weather-derived agricultural risks.

    This engine uses observed/forecast weather data.
    It does not use Gemini to calculate the underlying risk.
    """

    risks: list[FarmRisk] = []

    current = weather.current
    forecast = weather.forecast

    # --------------------------------------------------------
    # 1. Heat Stress
    # --------------------------------------------------------

    forecast_temperatures = [
        day.temperature
        for day in forecast
        if day.temperature is not None
    ]

    max_forecast_temperature = (
        max(forecast_temperatures)
        if forecast_temperatures
        else None
    )

    if max_forecast_temperature is not None:
        if max_forecast_temperature >= 35:
            heat_level: RiskLevel = "high"
        elif max_forecast_temperature >= 32:
            heat_level = "moderate"
        else:
            heat_level = "low"

        if heat_level != "low":
            risks.append(
                FarmRisk(
                    type="heat_stress",
                    level=heat_level,
                    reason=(
                        f"Forecast temperature may reach "
                        f"{max_forecast_temperature:.1f}°C."
                    ),
                )
            )

    # --------------------------------------------------------
    # 2. Rainfall Risk
    # --------------------------------------------------------

    rainfall_probabilities = [
        day.rainfall_probability
        for day in forecast
        if day.rainfall_probability is not None
    ]

    max_rainfall_probability = (
        max(rainfall_probabilities)
        if rainfall_probabilities
        else None
    )

    if max_rainfall_probability is not None:
        if max_rainfall_probability >= 70:
            rainfall_level: RiskLevel = "high"
        elif max_rainfall_probability >= 40:
            rainfall_level = "moderate"
        else:
            rainfall_level = "low"

        if rainfall_level != "low":
            risks.append(
                FarmRisk(
                    type="rainfall",
                    level=rainfall_level,
                    reason=(
                        f"Forecast rainfall probability may reach "
                        f"{max_rainfall_probability:.0f}%."
                    ),
                )
            )

    # --------------------------------------------------------
    # 3. Disease Environment
    # --------------------------------------------------------

    humidity = current.humidity

    if humidity is not None:
        if humidity >= 85:
            disease_level: RiskLevel = "high"
        elif humidity >= 75:
            disease_level = "moderate"
        else:
            disease_level = "low"

        if disease_level != "low":
            risks.append(
                FarmRisk(
                    type="disease_environment",
                    level=disease_level,
                    reason=(
                        f"Current relative humidity is "
                        f"{humidity:.0f}%, which can create "
                        "favorable conditions for some crop diseases."
                    ),
                )
            )

    # --------------------------------------------------------
    # 4. Water Stress
    # --------------------------------------------------------

    upcoming_rainfall = [
        day.rainfall
        for day in forecast
        if day.rainfall is not None
    ]

    total_forecast_rainfall = sum(upcoming_rainfall)

    if total_forecast_rainfall < 5:
        water_level: RiskLevel = "moderate"
    else:
        water_level = "low"

    if water_level != "low":
        risks.append(
            FarmRisk(
                type="water_stress",
                level=water_level,
                reason=(
                    f"Forecast rainfall over the available period "
                    f"is approximately {total_forecast_rainfall:.1f} mm."
                ),
            )
        )

    return risks