import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { api } from "../services/api";
import type {
  KnowledgeResult,
  KnowledgeAdaptResponse,
} from "../types/api";

function Knowledge() {
  const [problem, setProblem] = useState("Water stress");
  const [results, setResults] = useState<KnowledgeResult[]>([]);
  const [adapted, setAdapted] =
    useState<KnowledgeAdaptResponse | null>(null);

  const [searching, setSearching] = useState(false);
  const [adapting, setAdapting] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    setSearching(true);
    setError("");
    setAdapted(null);

    try {
      const response = await api.searchKnowledge({
        crop: "Cotton",
        soil: "Black Soil",
        climate: "Semi-arid",
        problem,
        country: "India",
        region: "Maharashtra",
      });

      setResults(response.results);
    } catch (err) {
      console.error("Knowledge search failed:", err);
      setError("Unable to search the agricultural knowledge base.");
    } finally {
      setSearching(false);
    }
  }

  async function handleAdapt(practice: KnowledgeResult) {
    setAdapting(true);
    setError("");

    try {
      const response = await api.adaptKnowledge({
        practice_id: practice.id,

        farm_context: {
          country: "India",
          state: "Maharashtra",
          district: "Nashik",
          crop: "Cotton",
          soil: "Black Soil",
          climate: "Semi-arid",
        },

        current_conditions: {
          weather: {
            temperature: 28,
            humidity: 64,
            rainfall: 12,
          },

          soil: {
            soil_type: "Black Soil",
            moisture: 31,
            ph: 6.8,
          },

          satellite: {
            ndvi: 0.72,
            ndmi: 0.48,
          },
        },
      });

      setAdapted(response);
    } catch (err) {
      console.error("Knowledge adaptation failed:", err);
      setError("Unable to adapt this practice to the local farm.");
    } finally {
      setAdapting(false);
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="dashboard">

        {/* Header */}
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">AGRICULTURAL KNOWLEDGE EXCHANGE</p>

            <h1>Knowledge Exchange</h1>

            <p className="subtitle">
              Discover agricultural practices from other regions and
              adapt them to local farm conditions.
            </p>
          </div>

          <div className="farm-selector">
            <span>Local Farm</span>
            <strong>Nashik, Maharashtra</strong>
          </div>
        </header>


        {/* Search Context */}
        <section className="dashboard-card">

          <div className="card-header">
            <div>
              <p className="eyebrow">01 · SEARCH</p>
              <h2>Find Similar Practices</h2>
            </div>

            <span className="data-source">
              BRICS Knowledge Base
            </span>
          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >

            <div>
              <span>Crop</span>
              <strong style={{ display: "block", marginTop: "6px" }}>
                Cotton
              </strong>
            </div>

            <div>
              <span>Soil</span>
              <strong style={{ display: "block", marginTop: "6px" }}>
                Black Soil
              </strong>
            </div>

            <div>
              <span>Climate</span>
              <strong style={{ display: "block", marginTop: "6px" }}>
                Semi-arid
              </strong>
            </div>

          </div>


          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="problem"
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: 600,
              }}
            >
              Current Farm Problem
            </label>

            <select
              id="problem"
              value={problem}
              onChange={(event) => setProblem(event.target.value)}
              style={{
                width: "100%",
                maxWidth: "500px",
                padding: "11px 12px",
                border: "1px solid #d5e0da",
                borderRadius: "8px",
                background: "#fff",
              }}
            >
              <option value="Water stress">
                Water stress
              </option>

              <option value="Soil degradation">
                Soil degradation
              </option>

              <option value="Disease environment">
                Disease environment
              </option>

              <option value="Heat stress">
                Heat stress
              </option>
            </select>
          </div>


          <button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            style={{
              padding: "11px 18px",
              border: "none",
              borderRadius: "8px",
              background: searching ? "#9fb3a8" : "#216044",
              color: "#fff",
              fontWeight: 600,
              cursor: searching ? "not-allowed" : "pointer",
            }}
          >
            {searching
              ? "Searching..."
              : "Find Agricultural Practices →"}
          </button>

        </section>


        {/* Error */}
        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px 14px",
              border: "1px solid #ecd4d4",
              borderRadius: "8px",
              background: "#fbf3f3",
              color: "#914848",
            }}
          >
            {error}
          </div>
        )}


        {/* Search Results */}
        {results.length > 0 && (
          <section style={{ marginTop: "28px" }}>

            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  02 · KNOWLEDGE MATCHES
                </p>

                <h2>
                  Practices from Similar Regions
                </h2>
              </div>

              <span>
                {results.length} practices found
              </span>
            </div>


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "16px",
              }}
            >

              {results.map((practice) => (
                <article
                  className="dashboard-card"
                  key={practice.id}
                >

                  <div className="card-header">

                    <div>
                      <p className="eyebrow">
                        {practice.country}
                      </p>

                      <h3 style={{ margin: 0 }}>
                        {practice.region}
                      </h3>
                    </div>

                    <span className="data-source">
                      {Math.round(
                        practice.applicability_score * 100
                      )}
                      % match
                    </span>

                  </div>


                  <div style={{ marginBottom: "15px" }}>

                    <strong>
                      {practice.practice}
                    </strong>

                    <p style={{ margin: "8px 0" }}>
                      <strong>Target problem:</strong>{" "}
                      {practice.target_problem}
                    </p>

                  </div>


                  <div style={{ marginBottom: "16px" }}>

                    <span
                      style={{
                        display: "block",
                        marginBottom: "7px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      Suitable conditions
                    </span>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "7px",
                      }}
                    >
                      {practice.suitable_conditions.map(
                        (condition, index) => (
                          <span
                            key={index}
                            style={{
                              padding: "5px 8px",
                              borderRadius: "5px",
                              background: "#eef4f0",
                              color: "#496d5b",
                              fontSize: "11px",
                            }}
                          >
                            {condition}
                          </span>
                        )
                      )}
                    </div>

                  </div>


                  <div
                    style={{
                      paddingTop: "12px",
                      borderTop: "1px solid #e4ebe7",
                      marginBottom: "15px",
                    }}
                  >
                    <small>
                      <strong>Evidence:</strong>{" "}
                      {practice.evidence.source}
                    </small>
                  </div>


                  <button
                    type="button"
                    onClick={() => handleAdapt(practice)}
                    disabled={adapting}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #2d654d",
                      borderRadius: "7px",
                      background: "#fff",
                      color: "#2d654d",
                      fontWeight: 600,
                      cursor: adapting
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    {adapting
                      ? "Adapting Practice..."
                      : "Adapt to My Farm →"}
                  </button>

                </article>
              ))}

            </div>

          </section>
        )}


        {/* Adapted Recommendation */}
        {adapted && (
          <section
            className="dashboard-card"
            style={{
              marginTop: "28px",
              background: "#f2f8f4",
              borderColor: "#cfe1d7",
            }}
          >

            <div className="card-header">

              <div>
                <p className="eyebrow">
                  03 · LOCAL ADAPTATION
                </p>

                <h2>
                  Adapted for Your Farm
                </h2>
              </div>

              <span className="data-source">
                Localized Recommendation
              </span>

            </div>


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1.2fr 0.8fr",
                gap: "28px",
              }}
            >

              <div>

                <p
                  style={{
                    marginBottom: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#71847a",
                  }}
                >
                  ORIGINAL PRACTICE
                </p>

                <strong>
                  {adapted.original_practice.practice}
                </strong>

                <p style={{ marginTop: "8px" }}>
                  Source:{" "}
                  {adapted.original_practice.region},{" "}
                  {adapted.original_practice.country}
                </p>


                <p
                  style={{
                    marginTop: "22px",
                    marginBottom: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#71847a",
                  }}
                >
                  LOCALIZED RECOMMENDATION
                </p>

                <h3 style={{ marginTop: 0 }}>
                  {adapted.adapted_recommendation.recommendation}
                </h3>

                <p>
                  {adapted.adapted_recommendation.why}
                </p>

              </div>


              <div>

                <div style={{ marginBottom: "18px" }}>
                  <span>Expected Effect</span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "6px",
                    }}
                  >
                    {adapted.adapted_recommendation.expected_effect}
                  </strong>
                </div>


                <div style={{ marginBottom: "18px" }}>
                  <span>Monitoring</span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "6px",
                    }}
                  >
                    {adapted.adapted_recommendation.monitoring}
                  </strong>
                </div>


                <div>
                  <span>Limitations</span>

                  <ul>
                    {adapted.adapted_recommendation.limitations.map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

              </div>

            </div>


            <div
              style={{
                marginTop: "22px",
                paddingTop: "18px",
                borderTop: "1px solid #d6e5dc",
              }}
            >
              <span
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Evidence Used
              </span>

              {adapted.adapted_recommendation.evidence.map(
                (item, index) => (
                  <span
                    key={index}
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "12px",
                      color: "#60776b",
                    }}
                  >
                    • {item}
                  </span>
                )
              )}
            </div>

          </section>
        )}

      </main>
    </div>
  );
}

export default Knowledge;