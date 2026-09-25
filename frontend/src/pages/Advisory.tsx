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
      title: "Immediate Action",
      items: data.sections.immediate_action,
    },
    {
      title: "Regenerative Action",
      items: data.sections.regenerative_action,
    },
    {
      title: "Water Management",
      items: data.sections.water_management,
    },
    {
      title: "Soil Management",
      items: data.sections.soil_management,
    },
    {
      title: "Pest & Disease Management",
      items: data.sections.pest_disease_management,
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="dashboard">

        {/* Header */}
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">REGENERATIVE ADVISORY</p>

            <h1>Farm Action Plan</h1>

            <p className="subtitle">
              Localized recommendations based on the current farm context
              and field conditions.
            </p>
          </div>

          <div className="farm-selector">
            <span>Current Farm</span>
            <strong>Nashik, Maharashtra</strong>
          </div>
        </header>


        {/* Current Condition */}
        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">CURRENT CONDITION</p>
              <h2>What is happening?</h2>
            </div>

            <span className="data-source">
              Field Intelligence
            </span>
          </div>

          <p style={{ marginBottom: "12px" }}>
            {data.current_condition}
          </p>

          <p style={{ margin: 0 }}>
            <strong>Risk context:</strong>{" "}
            {data.risk_explanation}
          </p>
        </section>


        {/* Recommendations */}
        <section style={{ marginTop: "24px" }}>

          <div className="section-heading">
            <div>
              <p className="eyebrow">RECOMMENDATIONS</p>
              <h2>What should you do?</h2>
            </div>
          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "16px",
            }}
          >

            {sections.map((section) => (
              <article
                className="dashboard-card"
                key={section.title}
              >
                <div className="card-header">
                  <h3 style={{ margin: 0 }}>
                    {section.title}
                  </h3>

                  <span className="data-source">
                    {section.items.length} action
                    {section.items.length !== 1 ? "s" : ""}
                  </span>
                </div>


                {section.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      paddingTop: index === 0 ? "4px" : "18px",
                      marginTop: index === 0 ? "0" : "18px",
                      borderTop:
                        index === 0
                          ? "none"
                          : "1px solid #e4ebe7",
                    }}
                  >
                    <strong>{item.recommendation}</strong>

                    <p style={{ margin: "8px 0" }}>
                      {item.why}
                    </p>

                    <small>
                      <strong>Expected effect:</strong>{" "}
                      {item.expected_effect}
                    </small>

                    <p style={{ margin: "8px 0 0" }}>
                      <strong>Monitor:</strong>{" "}
                      {item.monitor}
                    </p>
                  </div>
                ))}
              </article>
            ))}

          </div>
        </section>


        {/* Monitoring */}
        <section
          className="dashboard-card"
          style={{ marginTop: "24px" }}
        >
          <div className="card-header">
            <div>
              <p className="eyebrow">MONITORING PLAN</p>
              <h2>Expected Indicators</h2>
            </div>

            <span className="data-source">
              Track over time
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "12px",
            }}
          >
            {data.expected_indicators.map((indicator, index) => (
              <div
                key={index}
                style={{
                  padding: "14px",
                  border: "1px solid #e2e9e5",
                  borderRadius: "8px",
                  background: "#fafcfb",
                }}
              >
                {indicator}
              </div>
            ))}
          </div>
        </section>


        {/* Evidence */}
        <section
          className="dashboard-card"
          style={{ marginTop: "24px" }}
        >
          <div className="card-header">
            <div>
              <p className="eyebrow">EVIDENCE</p>
              <h2>Information Used</h2>
            </div>
          </div>

          {data.evidence.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "12px 0",
                borderBottom:
                  index === data.evidence.length - 1
                    ? "none"
                    : "1px solid #e4ebe7",
              }}
            >
              <strong>{item.source}</strong>

              <p style={{ margin: "5px 0 0" }}>
                {item.data_used}
              </p>
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}

export default Advisory;