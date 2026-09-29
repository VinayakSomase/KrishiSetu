import httpx

from models.api import (
    CurrentWeather,
    WeatherData,
    WeatherForecastDay,
)


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


async def get_weather(
    latitude: float,
    longitude: float,
) -> WeatherData:

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "precipitation,"
            "wind_speed_10m"
        ),
        "daily": (
            "temperature_2m_max,"
            "precipitation_probability_max,"
            "precipitation_sum"
        ),
        "forecast_days": 7,
        "timezone": "auto",
        "temperature_unit": "celsius",
        "wind_speed_unit": "kmh",
        "precipitation_unit": "mm",
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(
                OPEN_METEO_URL,
                params=params,
            )

        response.raise_for_status()

        data = response.json()

        current = data.get("current", {})
        daily = data.get("daily", {})

        current_weather = CurrentWeather(
            temperature=current.get("temperature_2m"),
            humidity=current.get("relative_humidity_2m"),
            rainfall=current.get("precipitation"),
            wind_speed=current.get("wind_speed_10m"),
        )

        forecast = []

        dates = daily.get("time", [])
        temperatures = daily.get("temperature_2m_max", [])
        rainfall_probabilities = daily.get(
            "precipitation_probability_max",
            [],
        )
        rainfall = daily.get("precipitation_sum", [])

        for index, date in enumerate(dates):
            forecast.append(
                WeatherForecastDay(
                    date=date,
                    temperature=(
                        temperatures[index]
                        if index < len(temperatures)
                        else None
                    ),
                    rainfall_probability=(
                        rainfall_probabilities[index]
                        if index < len(rainfall_probabilities)
                        else None
                    ),
                    rainfall=(
                        rainfall[index]
                        if index < len(rainfall)
                        else None
                    ),
                )
            )

        return WeatherData(
            current=current_weather,
            forecast=forecast,
            source="Open-Meteo",
            last_updated=data.get("current", {}).get("time"),
            data_quality="good",
        )

    except httpx.HTTPStatusError as exc:
        print(
            f"Open-Meteo returned HTTP {exc.response.status_code}. "
            "Continuing without live weather data."
        )

    except httpx.RequestError as exc:
        print(
            f"Open-Meteo request failed: {exc}. "
            "Continuing without live weather data."
        )

    return WeatherData(
        current=CurrentWeather(
            temperature=None,
            humidity=None,
            rainfall=None,
            wind_speed=None,
        ),
        forecast=[],
        source="Open-Meteo",
        last_updated=None,
        data_quality="unavailable",
    )