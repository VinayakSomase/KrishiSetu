import { Link } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { api } from "../services/api";
import type { DiagnosisResponse } from "../types/api";
import "./Diagnose.css";

function Diagnose() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [crop, setCrop] = useState("Cotton");
  const [growthStage, setGrowthStage] = useState("Flowering");
  const [observation, setObservation] = useState("");

  const [result, setResult] = useState<DiagnosisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setImage(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  }

  function removeImage() {
    setImage(null);
    setImagePreview(null);
    setResult(null);
    setError("");
  }

  async function handleDiagnosis() {
    if (!image) {
      setError("Please upload a crop image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.diagnoseCrop(
        image,
        crop,
        growthStage,
        observation || undefined
      );

      setResult(response);
    } catch (err) {
      console.error("Diagnosis failed:", err);
      setError("Unable to process the crop diagnosis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="dashboard diagnose-page">

        {/* ==============================
            PAGE HEADER
            ============================== */}

        <header className="diagnose-header">
          <div>
            <p className="eyebrow">CROP DIAGNOSTICS</p>

            <h1>Crop Health Assessment</h1>

            <p className="subtitle">
              Combine crop imagery with field observations to assess crop
              condition and identify appropriate actions.
            </p>
          </div>
               <Link to="/" className="diagnose-back-button">
  ← Back to Dashboard
</Link>
        </header>
   


        {/* ==============================
            ASSESSMENT WORKSPACE
            ============================== */}

        <section className="diagnose-workspace">

          {/* ---------- IMAGE PANEL ---------- */}

          <div className="diagnose-image-panel">

            <div className="panel-heading">
              <div>
                <p className="eyebrow">01 · CROP IMAGE</p>
                <h2>Upload Field Image</h2>
              </div>
            </div>

            <div
              className={`image-upload-area ${
                imagePreview ? "has-image" : ""
              }`}
            >

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected crop"
                  className="crop-image-preview"
                />
              ) : (
                <div className="upload-placeholder">

                  <div className="upload-icon">
                    📷
                  </div>

                  <strong>
                    Add crop image
                  </strong>

                  <span>
                    Take a photo or upload an image
                  </span>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "18px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >

                    <label
                      htmlFor="crop-camera"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "11px 16px",
                        borderRadius: "8px",
                        background: "#216044",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      📷 Take Photo
                    </label>

                    <label
                      htmlFor="crop-image"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "11px 16px",
                        borderRadius: "8px",
                        border: "1px solid #cbdad2",
                        background: "#ffffff",
                        color: "#315c49",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      ↑ Upload Image
                    </label>

                  </div>

                  <small>
                    Use a clear image of the affected crop area
                  </small>

                </div>
              )}

              <input
                id="crop-camera"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                hidden
              />

              <input
                id="crop-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                hidden
              />

            </div>

            {image && (
              <div className="selected-file">

                <span>
                  {image.name}
                </span>

                <button
                  type="button"
                  onClick={removeImage}
                >
                  Remove
                </button>

              </div>
            )}

          </div>


          {/* ---------- CONTEXT PANEL ---------- */}

          <div className="diagnose-context-panel">

            <div className="panel-heading">
              <div>
                <p className="eyebrow">
                  02 · FIELD CONTEXT
                </p>

                <h2>
                  Crop Information
                </h2>
              </div>
            </div>


            <div className="diagnose-form">

              {/* Crop */}

              <div className="form-field">

                <label htmlFor="crop">
                  Crop
                </label>

                <select
                  id="crop"
                  value={crop}
                  onChange={(event) =>
                    setCrop(event.target.value)
                  }
                >
                  <option value="Cotton">
                    Cotton
                  </option>

                  <option value="Rice">
                    Rice
                  </option>

                  <option value="Wheat">
                    Wheat
                  </option>

                  <option value="Maize">
                    Maize
                  </option>

                  <option value="Soybean">
                    Soybean
                  </option>
                </select>

              </div>


              {/* Growth Stage */}

              <div className="form-field">

                <label htmlFor="growth-stage">
                  Growth Stage
                </label>

                <select
                  id="growth-stage"
                  value={growthStage}
                  onChange={(event) =>
                    setGrowthStage(event.target.value)
                  }
                >
                  <option value="Germination">
                    Germination
                  </option>

                  <option value="Vegetative">
                    Vegetative
                  </option>

                  <option value="Flowering">
                    Flowering
                  </option>

                  <option value="Fruiting">
                    Fruiting
                  </option>

                  <option value="Maturity">
                    Maturity
                  </option>
                </select>

              </div>


              {/* Farmer Observation */}

              <div className="form-field observation-field">

                <label htmlFor="observation">
                  Farmer Observation
                  <span>Optional</span>
                </label>

                <textarea
                  id="observation"
                  value={observation}
                  onChange={(event) =>
                    setObservation(event.target.value)
                  }
                  placeholder="Describe visible symptoms, changes or concerns..."
                  rows={5}
                />

              </div>


              {/* Error */}

              {error && (
                <div className="diagnose-error">
                  {error}
                </div>
              )}


              {/* Analyze */}

              <button
                type="button"
                className="diagnose-button"
                disabled={!image || loading}
                onClick={handleDiagnosis}
              >

                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Analyzing field image...
                  </>
                ) : (
                  "Run Crop Assessment →"
                )}

              </button>

            </div>

          </div>

        </section>


        {/* ==============================
            DIAGNOSIS RESULT
            ============================== */}

        {result && (
          <section className="diagnosis-result">

            {/* Result Header */}

            <div className="result-header">

              <div>

                <p className="eyebrow">
                  03 · ASSESSMENT RESULT
                </p>

                <h2>
                  Crop Health Assessment
                </h2>

                <p>
                  Assessment generated from the submitted crop image
                  and field context.
                </p>

              </div>

              <span className="result-badge">
                Assessment Complete
              </span>

            </div>


            {/* ==============================
                IMAGE QUALITY
                ============================== */}

            <div className="diagnosis-quality">

              <div>
                <span>Image Quality</span>

                <strong>
                  {result.image_quality.status === "valid"
                    ? "Valid"
                    : "Needs Review"}
                </strong>
              </div>

              {result.image_quality.reason && (
                <p>
                  {result.image_quality.reason}
                </p>
              )}

            </div>


            {/* ==============================
                SUMMARY
                ============================== */}

            {result.assessment && (
              <div className="diagnosis-summary">

                <div className="result-metric">
                  <span>Crop</span>

                  <strong>
                    {result.assessment.crop}
                  </strong>
                </div>


                <div className="result-metric">
                  <span>Condition</span>

                  <strong>
                    {result.assessment.condition}
                  </strong>
                </div>


                <div className="result-metric">
                  <span>Confidence</span>

                  <strong>
                    {(result.assessment.confidence * 100).toFixed(0)}%
                  </strong>
                </div>


                <div className="result-metric">
                  <span>Severity</span>

                  <strong>
                    {result.assessment.severity}
                  </strong>
                </div>

              </div>
            )}


            {/* ==============================
                ANALYSIS DETAILS
                ============================== */}

            {result.assessment && (
              <div className="diagnosis-details">

                {/* Visual Observations */}

                <div className="detail-block">

                  <p className="eyebrow">
                    OBSERVATIONS
                  </p>

                  <h3>
                    Visual Observations
                  </h3>

                  <ul>
                    {result.assessment.visual_observations.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                </div>


                {/* Possible Causes */}

                <div className="detail-block">

                  <p className="eyebrow">
                    POSSIBLE FACTORS
                  </p>

                  <h3>
                    Possible Causes
                  </h3>

                  <ul>
                    {result.assessment.possible_causes.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                </div>

              </div>
            )}


            {/* ==============================
                IMMEDIATE ACTIONS
                ============================== */}

            <div className="action-section">

              <p className="eyebrow">
                IMMEDIATE ACTION
              </p>

              <h3>
                What to do now
              </h3>

              <div className="action-list">

                {result.immediate_actions.map(
                  (action, index) => (

                    <div
                      className="action-item"
                      key={index}
                    >

                      <span>
                        {index + 1}
                      </span>

                      <p>
                        {action}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* ==============================
                REGENERATIVE RESPONSE
                ============================== */}

            {result.regenerative_response && (
              <div className="regenerative-result">

                <div>

                  <p className="eyebrow">
                    REGENERATIVE RESPONSE
                  </p>

                  <h3>
                    {result.regenerative_response.practice}
                  </h3>

                  <p>
                    {result.regenerative_response.why}
                  </p>

                </div>


                <div className="regenerative-meta">

                  <div>

                    <span>
                      Expected Benefit
                    </span>

                    <strong>
                      {
                        result.regenerative_response
                          .expected_benefit
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      Monitoring Period
                    </span>

                    <strong>
                      {
                        result.regenerative_response
                          .monitoring_period
                      }
                    </strong>

                  </div>

                </div>

              </div>
            )}
            <Link
              to="/advisory"
              className="diagnose-advisory-button"
            >
              Continue to Regenerative Advisory →
            </Link>

          </section>
        )}

      </main>
    </div>
  );
}

export default Diagnose;