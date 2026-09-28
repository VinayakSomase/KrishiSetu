import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import FieldMap from "../components/maps/FieldMap";
import { api } from "../services/api";
import type { FarmAnalyzeResponse } from "../types/api";

function Dashboard() {
  const [data, setData] = useState<FarmAnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadFarmData() {
      try {
        const response = await api.analyzeFarm({
          location: {
            country: "India",
            state: "Maharashtra",
            district: "Nashik",
            latitude: 20.0059,
            longitude: 73.7897,
          },
          crop: {
            name: "Cotton",
            growth_stage: "Flowering",
          },
        });

        setData(response);
      } catch (err) {
        console.error("Failed to load farm data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadFarmData();
  }, []);

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <main className="dashboard">
          <p>Loading field intelligence...</p>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="app-layout">
        <Sidebar />

        <main className="dashboard">
          <p>Unable to load field intelligence data.</p>
        </main>
      </div>
    );
  }

  const { farm, field_health, weather, soil, risks, advisory_preview } = data;

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="dashboard">

        {/* Header */}
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">FIELD INTELLIGENCE</p>

            <h1>Farm Command Center</h1>

            <p className="subtitle">
              Monitor field conditions, environmental signals, and agricultural risks.
            </p>
          </div>

          <div className="farm-selector">
            <span>Current Farm</span>

            <strong>
              {farm.district}, {farm.state}
            </strong>
          </div>
        </header>


        {/* Farm Context */}
        <section className="farm-context">

          <div>
            <span>Crop</span>
            <strong>{farm.crop}</strong>
          </div>

          <div>
            <span>Growth Stage</span>
            <strong>{farm.growth_stage}</strong>
          </div>

          <div>
            <span>Last Analysis</span>
            <strong>
              {farm.last_analysis}
            </strong>
          </div>

          <div>
            <span>Data Status</span>

            <strong className="status-good">
              Available
            </strong>
          </div>

        </section>


        {/* Field Health */}
        <section>

          <div className="section-heading">

            <div>
              <p className="eyebrow">FIELD CONDITION</p>
              <h2>Field Health</h2>
            </div>

            <span className="health-status">
              ● {field_health.status.replace("_", " ")}
            </span>

          </div>


          <div className="metric-grid">

            <article className="metric-card">
              <span>Health Score</span>

              <strong>
                {field_health.health_score}
              </strong>

              <small>/ 100</small>

              <p>Overall field condition</p>
            </article>


            <article className="metric-card">
              <span>NDVI</span>

              <strong>
                {field_health.ndvi.value ?? "—"}
              </strong>

              <p>Vegetation health</p>
            </article>


            <article className="metric-card">
              <span>NDMI</span>

              <strong>
                {field_health.ndmi.value ?? "—"}
              </strong>

              <p>Vegetation moisture</p>
            </article>


            <article className="metric-card">
              <span>Soil Moisture</span>

              <strong>
                {field_health.soil_moisture.value ?? "—"}
                {field_health.soil_moisture.value !== null ? "%" : ""}
              </strong>

              <p>Current soil condition</p>
            </article>


            <article className="metric-card">
              <span>Climate Stress</span>

              <strong>
                {field_health.climate_stress ?? "—"}
              </strong>

              <p>Environmental stress level</p>
            </article>


            <article className="metric-card">
              <span>Disease Risk</span>

              <strong>
                {field_health.disease_risk ?? "—"}
              </strong>

              <p>Crop disease risk</p>
            </article>

          </div>

        </section>


        {/* Field Map */}
        <FieldMap />


        {/* Weather + Soil */}
        <section className="data-grid">

          {/* Weather */}
<article className="dashboard-card">

  <div className="card-header">

    <div>
      <p className="eyebrow">ENVIRONMENT</p>
      <h2>Weather</h2>
    </div>

    <span className="data-source">
      <span className="data-source">
  Weather Data
</span>
    </span>

  </div>


  {/* Current Weather */}
  <div className="weather-main">

    <strong>
      {weather.current.temperature ?? "—"}°C
    </strong>

    <span>
      Current temperature
    </span>

  </div>


  {/* Current Weather Indicators */}
  <div className="weather-stats">

    <div>
      <span>Humidity</span>

      <strong>
        {weather.current.humidity ?? "—"}%
      </strong>
    </div>


    <div>
      <span>Rainfall</span>

      <strong>
        {weather.current.rainfall ?? "—"} mm
      </strong>
    </div>


    <div>
      <span>Wind</span>

      <strong>
        {weather.current.wind_speed ?? "—"} km/h
      </strong>
    </div>

  </div>


  {/* 7-Day Weather Forecast */}
  <div className="weather-forecast">

    <div className="forecast-title">
      <span>7-DAY FORECAST</span>
      <small>Upcoming environmental conditions</small>
    </div>


    <div className="forecast-header">
      <span>Day</span>
      <span>Temperature</span>
      <span>Rain Probability</span>
    </div>


    {weather.forecast.map((day, index) => (

      <div
        className="forecast-row"
        key={`${day.date}-${index}`}
      >

        {/* Day */}
        <div className="forecast-day">
          <strong>
            {day.date}
          </strong>
        </div>


        {/* Temperature */}
        <div className="forecast-temperature">

          <strong>
            {day.temperature ?? "—"}°C
          </strong>

        </div>


        {/* Rain */}
        <div className="forecast-rain">

          <strong>
            {day.rainfall_probability ?? "—"}%
          </strong>

          <span>
            {day.rainfall ?? "—"} mm
          </span>

        </div>

      </div>

    ))}

  </div>

</article>


          {/* Soil */}
<article className="dashboard-card">

  <div className="card-header">

    <div>
      <p className="eyebrow">SOIL CONDITION</p>
      <h2>Soil Intelligence</h2>
    </div>

    <span className="data-source">
      Soil Data
    </span>

  </div>


  {/* Basic Soil Profile */}
  <div className="soil-summary">

    <div>
      <span>Soil Type</span>

      <strong>
        {soil.soil_type ?? "Unavailable"}
      </strong>
    </div>


    <div>
      <span>pH</span>

      <strong>
        {soil.ph.value ?? "—"}
      </strong>
    </div>


    <div>
      <span>Organic Carbon</span>

      <strong>
        {soil.organic_carbon.value ?? "—"}
        {soil.organic_carbon.value !== null ? "%" : ""}
      </strong>
    </div>

  </div>


  {/* Soil Nutrients */}
  <div className="soil-nutrients">

    <div>
      <span>Nitrogen</span>

      <strong>
        {soil.nitrogen.value ?? "—"}
      </strong>
    </div>


    <div>
      <span>Phosphorus</span>

      <strong>
        {soil.phosphorus.value ?? "—"}
      </strong>
    </div>


    <div>
      <span>Potassium</span>

      <strong>
        {soil.potassium.value ?? "—"}
      </strong>
    </div>

  </div>


  {/* Soil Moisture */}
  <div className="soil-health-panel">

  <div className="soil-health-header">

    <div>
      <span>Soil Moisture</span>

      <strong>
        {field_health.soil_moisture.value ?? "—"}
        {field_health.soil_moisture.value !== null ? "%" : ""}
      </strong>
    </div>

    <div className="soil-health-status">
      <span>Soil Health</span>

      <strong>
        {soil.health_status}
      </strong>
    </div>

  </div>


  <div className="soil-health-divider"></div>


  <div className="soil-assessment">

    <div>
      <span>Moisture</span>
      <strong>
        {field_health.soil_moisture.value ?? "—"}%
      </strong>
    </div>

    <div>
      <span>Organic Carbon</span>
      <strong>
        {soil.organic_carbon.value ?? "—"}%
      </strong>
    </div>

    <div>
      <span>pH Level</span>
      <strong>
        {soil.ph.value ?? "—"}
      </strong>
    </div>

  </div>


  <div className="soil-health-divider"></div>


  <p>
    Soil health is assessed using available moisture,
    nutrient, pH, and organic carbon indicators.
  </p>

</div>

</article>
        </section>




      {/* Advisory Preview */}
<section className="advisory-preview">

  <div className="advisory-preview-header">

    <div>
      <p className="eyebrow">
        REGENERATIVE ADVISORY
      </p>

      <h2>
        What should you do now?
      </h2>
    </div>

  
  </div>


  <div className="advisory-preview-grid">

    {/* Why */}
    <div className="advisory-preview-item">

      <span>Why this is happening</span>

      <p>
        {advisory_preview.why || "Data unavailable"}
      </p>

    </div>


    {/* Do Now */}
    <div className="advisory-preview-item">

      <span>Do this now</span>

      <p>
        {advisory_preview.do_now || "Data unavailable"}
      </p>

    </div>


    {/* Regenerative Action */}
    <div className="advisory-preview-item">

      <span>Regenerative action</span>

      <p>
        {advisory_preview.regenerative_action || "Data unavailable"}
      </p>

    </div>


    {/* Monitor */}
    <div className="advisory-preview-item">

      <span>Monitor</span>

      <p>
        {advisory_preview.monitor || "Data unavailable"}
      </p>

    </div>

  </div>

<div className="advisory-preview-footer">
  <a href="/diagnose" className="advisory-diagnosis-button">
    Run Crop Diagnosis →
  </a>

  <a href="/advisory">
    View Full Advisory →
  </a>
</div>

</section>

      </main>
    </div>
  );
}

export default Dashboard;