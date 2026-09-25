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

  async function handleDiagnosis() {
    if (!image) {
      setError("Please upload a crop image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.diagnoseCrop({
        image,
        crop,
        growth_stage: growthStage,
        farmer_observation: observation || null,
      });

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

        {/* Page Header */}
        <header className="diagnose-header">
          <div>
            <p className="eyebrow">CROP DIAGNOSTICS</p>

            <h1>Crop Health Assessment</h1>

            <p className="subtitle">
              Combine crop imagery with field observations to assess crop
              condition and identify appropriate actions.
            </p>
          </div>

          <div className="diagnose-status">
            <span className="status-dot"></span>
            Assessment Ready
          </div>
        </header>


        {/* Assessment Workspace */}
        <section className="diagnose-workspace">

          {/* Image Panel */}
          <div className="diagnose-image-panel">

            <div className="panel-heading">
              <div>
                <p className="eyebrow">01 · CROP IMAGE</p>
                <h2>Upload Field Image</h2>
              </div>
            </div>

            <label
              htmlFor="crop-image"
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
                  <div className="upload-icon">↑</div>

                  <strong>Upload crop image</strong>

                  <span>
                    JPG, PNG or WEBP
                  </span>

                  <small>
                    Use a clear image of the affected crop area
                  </small>
                </div>
              )}

              <input
                id="crop-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                hidden
              />
            </label>

            {image && (
              <div className="selected-file">
                <span>{image.name}</span>

                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                    setResult(null);
                  }}
                >
                  Remove
                </button>
              </div>
            )}

          </div>


          {/* Context Panel */}
          <div className="diagnose-context-panel">

            <div className="panel-heading">
              <div>
                <p className="eyebrow">02 · FIELD CONTEXT</p>
                <h2>Crop Information</h2>
              </div>
            </div>


            <div className="diagnose-form">

              <div className="form-field">
                <label htmlFor="crop">
                  Crop
                </label>

                <select
                  id="crop"
                  value={crop}
                  onChange={(event) => setCrop(event.target.value)}
                >
                  <option value="Cotton">Cotton</option>
                  <option value="Rice">Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Maize">Maize</option>
                  <option value="Soybean">Soybean</option>
                </select>
              </div>


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
                  <option value="Germination">Germination</option>
                  <option value="Vegetative">Vegetative</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Fruiting">Fruiting</option>
                  <option value="Maturity">Maturity</option>
                </select>
              </div>


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


              {error && (
                <div className="diagnose-error">
                  {error}
                </div>
              )}


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


        {/* Result */}
        {result && (
          <section className="diagnosis-result">

            <div className="result-header">

              <div>
                <p className="eyebrow">03 · ASSESSMENT RESULT</p>

                <h2>Crop Health Assessment</h2>

                <p>
                  Assessment generated from the submitted crop image
                  and field context.
                </p>
              </div>

              <span className="result-badge">
                Mock Assessment
              </span>

            </div>


            {/* Summary */}
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


            {/* Analysis Details */}
            {result.assessment && (
              <div className="diagnosis-details">

                <div className="detail-block">
                  <p className="eyebrow">OBSERVATIONS</p>

                  <h3>Visual Observations</h3>

                  <ul>
                    {result.assessment.visual_observations.map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>


                <div className="detail-block">
                  <p className="eyebrow">POSSIBLE FACTORS</p>

                  <h3>Possible Causes</h3>

                  <ul>
                    {result.assessment.possible_causes.map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

              </div>
            )}


            {/* Immediate Actions */}
            <div className="action-section">

              <p className="eyebrow">IMMEDIATE ACTION</p>

              <h3>What to do now</h3>

              <div className="action-list">
                {result.immediate_actions.map(
                  (action, index) => (
                    <div className="action-item" key={index}>
                      <span>{index + 1}</span>
                      <p>{action}</p>
                    </div>
                  )
                )}
              </div>

            </div>


            {/* Regenerative Response */}
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
                    <span>Expected Benefit</span>

                    <strong>
                      {result.regenerative_response.expected_benefit}
                    </strong>
                  </div>

                  <div>
                    <span>Monitoring Period</span>

                    <strong>
                      {result.regenerative_response.monitoring_period}
                    </strong>
                  </div>

                </div>

              </div>
            )}


            {/* Evidence */}
            <div className="evidence-section">

              <p className="eyebrow">EVIDENCE</p>

              <h3>Assessment Sources</h3>

              {result.evidence.map((item, index) => (
                <div className="evidence-item" key={index}>

                  <strong>{item.source}</strong>

                  <span>{item.data_used}</span>

                </div>
              ))}

            </div>

          </section>
        )}

      </main>
    </div>
  );
}

export default Diagnose;