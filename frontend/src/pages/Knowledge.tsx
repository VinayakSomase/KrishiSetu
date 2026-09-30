import { Link } from "react-router-dom";
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
      setError(
        "Unable to search the agricultural knowledge base."
      );
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
      setError(
        "Unable to adapt this practice to the local farm."
      );
    } finally {
      setAdapting(false);
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="dashboard knowledge-page">

        {/* ==========================================
            HEADER
            ========================================== */}

        <header className="dashboard-header">
          <div>
            <p className="eyebrow">
              AGRICULTURAL KNOWLEDGE EXCHANGE
            </p>

            <h1>
              Knowledge Exchange
            </h1>

            <p className="subtitle">
              Discover agricultural practices from similar
              regions and adapt them to local farm conditions.
            </p>
          </div>

          <div className="farm-selector">
            <span>Local Farm</span>

            <strong>
              Nashik, Maharashtra
            </strong>
          </div>
          <Link to="/diagnose" className="knowledge-back-button">
  ← Back to Crop Diagnostics
</Link>
        </header>


        {/* ==========================================
            SEARCH CONTEXT
            ========================================== */}

        <section className="knowledge-search-card">

          <div className="card-header">
            <div>
              <p className="eyebrow">
                01 · SEARCH
              </p>

              <h2>
                Find Similar Practices
              </h2>
            </div>

            <span className="data-source">
              Knowledge Network
            </span>
          </div>


          <div className="knowledge-context-grid">

            <div className="knowledge-context-item">
              <span>Crop</span>
              <strong>Cotton</strong>
            </div>

            <div className="knowledge-context-item">
              <span>Soil</span>
              <strong>Black Soil</strong>
            </div>

            <div className="knowledge-context-item">
              <span>Climate</span>
              <strong>Semi-arid</strong>
            </div>

          </div>


          <div className="knowledge-problem">

            <label htmlFor="problem">
              Current Farm Problem
            </label>

            <select
              id="problem"
              value={problem}
              onChange={(event) =>
                setProblem(event.target.value)
              }
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
            className="knowledge-search-button"
            onClick={handleSearch}
            disabled={searching}
          >
            {searching
              ? "Searching..."
              : "Find Agricultural Practices →"}
          </button>

        </section>


        {/* ==========================================
            ERROR
            ========================================== */}

        {error && (
          <div className="knowledge-error">
            {error}
          </div>
        )}


        {/* ==========================================
            KNOWLEDGE MATCHES
            ========================================== */}

        {results.length > 0 && (
          <section className="knowledge-results">

            <div className="section-heading">

              <div>
                <p className="eyebrow">
                  02 · KNOWLEDGE MATCHES
                </p>

                <h2>
                  Practices from Similar Regions
                </h2>
              </div>

              <span className="knowledge-result-count">
                {results.length} practices found
              </span>

            </div>


            <div className="knowledge-result-grid">

              {results.map((practice) => (

                <article
                  className="knowledge-practice-card"
                  key={practice.id}
                >

                  {/* Origin */}

                  <div className="knowledge-practice-header">

                    <div>
                      <p className="knowledge-origin">
                        {practice.country}
                      </p>

                      <h3>
                        {practice.region}
                      </h3>
                    </div>

                    <span className="knowledge-match">
                      {Math.round(
                        practice.applicability_score
                      )}
                      % match
                    </span>

                  </div>


                  {/* Practice */}

                  <div className="knowledge-practice-body">

                    <p className="knowledge-practice-label">
                      AGRICULTURAL PRACTICE
                    </p>

                    <strong>
                      {practice.practice}
                    </strong>

                    <p className="knowledge-target">
                      <span>Target problem</span>
                      {practice.target_problem}
                    </p>

                  </div>


                  {/* Conditions */}

                  <div className="knowledge-conditions">

                    <span className="knowledge-conditions-label">
                      Suitable conditions
                    </span>

                    <div className="knowledge-tags">

                      {practice.suitable_conditions.map(
                        (condition, index) => (
                          <span key={index}>
                            {condition}
                          </span>
                        )
                      )}

                    </div>

                  </div>


                  {/* Use Practice */}

                  <button
                    type="button"
                    className="knowledge-adapt-button"
                    onClick={() =>
                      handleAdapt(practice)
                    }
                    disabled={adapting}
                  >
                    {adapting
                      ? "Adapting Practice..."
                      : "Use This Practice →"}
                  </button>

                </article>

              ))}

            </div>

          </section>
        )}


        {/* ==========================================
            LOCAL ADAPTATION
            ========================================== */}

        {adapted && (
          <section className="knowledge-adaptation">

            <div className="section-heading">

              <div>
                <p className="eyebrow">
                  03 · LOCAL ADAPTATION
                </p>

                <h2>
                  Adapted for Your Farm
                </h2>
              </div>

              <span className="knowledge-adapted-status">
                Localized Recommendation
              </span>

            </div>


            <div className="knowledge-adaptation-grid">

              {/* Original + Localized Recommendation */}

              <div className="knowledge-original">

                <div className="knowledge-adaptation-block">

                  <p className="knowledge-block-label">
                    ORIGINAL PRACTICE
                  </p>

                  <h3>
                    {adapted.original_practice.practice}
                  </h3>

                  <p className="knowledge-origin-text">
                    {adapted.original_practice.region},{" "}
                    {adapted.original_practice.country}
                  </p>

                </div>


                <div className="knowledge-local-divider" />


                <div className="knowledge-adaptation-block">

                  <p className="knowledge-block-label">
                    LOCALIZED RECOMMENDATION
                  </p>

                  <h3>
                    {
                      adapted.adapted_recommendation
                        .recommendation
                    }
                  </h3>

                  <p className="knowledge-why">
                    {
                      adapted.adapted_recommendation
                        .why
                    }
                  </p>

                </div>

              </div>


              {/* Expected effect + Monitoring + Limitations */}

              <div className="knowledge-adaptation-details">

                <div className="knowledge-detail-box">
                  <span>
                    Expected Effect
                  </span>

                  <p>
                    {
                      adapted.adapted_recommendation
                        .expected_effect
                    }
                  </p>
                </div>


                <div className="knowledge-detail-box">
                  <span>
                    Monitoring
                  </span>

                  <p>
                    {
                      adapted.adapted_recommendation
                        .monitoring
                    }
                  </p>
                </div>


                <div className="knowledge-detail-box">
                  <span>
                    Limitations
                  </span>

                  <ul>
                    {
                      adapted.adapted_recommendation
                        .limitations
                        .map((item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        ))
                    }
                  </ul>
                </div>

              </div>

            </div>


            {/* ==========================================
                ADAPTATION BASIS
                ========================================== */}

            <div className="knowledge-adaptation-basis">

              <div>
                <span>
                  ADAPTATION BASIS
                </span>
              </div>

              <div>
                <p>
                  • Original practice from agricultural
                  knowledge exchange
                </p>

                <p>
                  • Local farm context
                </p>
              </div>

            </div>


            {/* ==========================================
                NEXT STAGE
                ========================================== */}

            <div className="knowledge-next-step">

              <div>
                <span>
                  NEXT STAGE
                </span>

                <p>
                  Explore how agricultural knowledge can
                  connect across the BRICS network.
                </p>
              </div>

              <Link to="/network"
                className="knowledge-next-button"
              >
                Continue to BRICS Network →
              </Link>

            </div>

          </section>
        )}

      </main>
    </div>
  );
}

export default Knowledge;