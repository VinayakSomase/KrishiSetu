import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { api } from "../services/api";
import type { AdvisoryResponse } from "../types/api";

function Advisory() {
  const [data, setData] = useState<AdvisoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdvisory() {
      try {
        const response = await api.getAdvisory({
          farm_context: {
            country: "India",
            state: "Maharashtra",
            district: "Nashik",
            crop: "Cotton",
            growth_stage: "Flowering",
          },
        });

        setData(response);
      } catch (err) {
        console.error("Advisory failed:", err);
        setError("Unable to load advisory.");
      } finally {
        setLoading(false);
      }
    }

    loadAdvisory();
  }, []);

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <main className="dashboard">
          <p>Loading regenerative advisory...</p>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="app-layout">
        <Sidebar />

        <main className="dashboard">
          <p>{error || "No advisory available."}</p>
        </main>
      </div>
    );
  }

  const sections = [
    {
      number: "01",
      title: "Immediate Action",
      description: "Actions to address the current field condition.",
      items: data.sections.immediate_action,
    },
    {
      number: "02",
      title: "Regenerative Action",
      description: "Practices that improve long-term field resilience.",
      items: data.sections.regenerative_action,
    },
    {
      number: "03",
      title: "Water Management",
      description: "Actions for efficient soil moisture and water use.",
      items: data.sections.water_management,
    },
    {
      number: "04",
      title: "Soil Management",
      description: "Practices for maintaining soil quality and fertility.",
      items: data.sections.soil_management,
    },
    {
      number: "05",
      title: "Pest & Disease Management",
      description: "Preventive actions based on current risk conditions.",
      items: data.sections.pest_disease_management,
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="dashboard advisory-page">

        {/* ==========================================
            HEADER
            ========================================== */}

        <header className="dashboard-header">
          <div>
            <p className="eyebrow">REGENERATIVE ADVISORY</p>

            <h1>Farm Action Plan</h1>

            <p className="subtitle">
              Localized recommendations based on field conditions,
              environmental signals, and crop context.
            </p>
          </div>

          <div className="farm-selector">
            <span>Current Farm</span>

            <strong>
              Nashik, Maharashtra
            </strong>
          </div>
          <Link to="/diagnose" className="advisory-back-button">
  ← Back to Crop Diagnostics
</Link>
        </header>


        {/* ==========================================
            CURRENT CONDITION
            ========================================== */}

        <section className="advisory-condition">

          <div className="advisory-condition-main">

            <p className="eyebrow">
              CURRENT FIELD CONDITION
            </p>

            <h2>
              What is happening?
            </h2>

            <p>
              {data.current_condition}
            </p>

          </div>


          <div className="advisory-risk">

            <span>
              Risk Context
            </span>

            <p>
              {data.risk_explanation}
            </p>

          </div>

        </section>


        {/* ==========================================
            ACTION PLAN
            ========================================== */}

        <section className="advisory-actions">

          <div className="section-heading">

            <div>
              <p className="eyebrow">
                FARM ACTION PLAN
              </p>

              <h2>
                Recommended Actions
              </h2>
            </div>

            <span className="advisory-action-count">
              {sections.reduce(
                (total, section) =>
                  total + section.items.length,
                0
              )}{" "}
              recommendations
            </span>

          </div>


          <div className="advisory-section-grid">

            {sections.map((section) => (

              <article
                className="advisory-section-card"
                key={section.title}
              >

                <div className="advisory-section-header">

                  <div className="advisory-section-number">
                    {section.number}
                  </div>

                  <div>
                    <h3>
                      {section.title}
                    </h3>

                    <p>
                      {section.description}
                    </p>
                  </div>

                </div>


                <div className="advisory-recommendations">

                  {section.items.map((item, index) => (

                    <div
                      className="advisory-recommendation"
                      key={index}
                    >

                      <div className="recommendation-title">
                        <span>
                          {index + 1}
                        </span>

                        <strong>
                          {item.recommendation}
                        </strong>
                      </div>


                      <p className="recommendation-why">
                        {item.why}
                      </p>


                      <div className="recommendation-meta">

                        <div>
                          <span>
                            Expected Effect
                          </span>

                          <p>
                            {item.expected_effect}
                          </p>
                        </div>


                        <div>
                          <span>
                            Monitor
                          </span>

                          <p>
                            {item.monitor}
                          </p>
                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </article>

            ))}

          </div>

        </section>


        {/* ==========================================
            MONITORING PLAN
            ========================================== */}

        <section className="advisory-monitoring">

          <div className="section-heading">

            <div>
              <p className="eyebrow">
                MONITORING PLAN
              </p>

              <h2>
                Expected Indicators
              </h2>
            </div>

            <span className="data-source">
              Track over time
            </span>

          </div>


          <div className="indicator-grid">

            {data.expected_indicators.map(
              (indicator, index) => (

                <div
                  className="indicator-card"
                  key={index}
                >

                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p>
                    {indicator}
                  </p>

                </div>

              )
            )}

          </div>

        </section>


        {/* ==========================================
            CONTINUE
            ========================================== */}

        <div className="advisory-footer">

          <Link to="/knowledge"
            className="advisory-next-button"
          >
            Explore Agricultural Knowledge →
          </Link>

        </div>

      </main>
    </div>
  );
}

export default Advisory;