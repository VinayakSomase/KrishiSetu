import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { api } from "../services/api";
import type { NetworkNode } from "../types/api";

function Network() {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNetwork() {
      try {
        const response = await api.getNetworkNodes();
        setNodes(response.nodes);
      } catch (err) {
        console.error("Network loading failed:", err);
        setError("Unable to load network information.");
      } finally {
        setLoading(false);
      }
    }

    loadNetwork();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="dashboard">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">BRICS AGRICULTURAL NETWORK</p>

            <h1>Interoperability Network</h1>

            <p className="subtitle">
              Connect agricultural knowledge, regional expertise and data
              capabilities across participating countries.
            </p>
          </div>

          <div className="farm-selector">
            <span>PARTICIPATING NODES</span>
            <strong>
              {loading ? "Loading..." : `${nodes.length} Countries`}
            </strong>
          </div>
          <a href="/knowledge" className="network-back-button">
  ← Back to Knowledge Exchange
</a>
        </header>

        {/* Network Overview */}
        <section className="dashboard-card network-overview-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">NETWORK OVERVIEW</p>
              <h2>A Connected Agricultural Knowledge System</h2>
            </div>

            <span className="data-source">Network Data</span>
          </div>

          <p className="network-overview-text">
            KrishiSetu enables agricultural practices and regional capabilities
            to be exchanged through a common structure, allowing knowledge from
            different agricultural systems to be evaluated and adapted for
            local farm conditions.
          </p>

          <div className="network-summary-grid">
            <div className="network-summary-item">
              <span>PARTICIPATING COUNTRIES</span>
              <strong>{loading ? "—" : nodes.length}</strong>
            </div>

            <div className="network-summary-item">
              <span>KNOWLEDGE EXCHANGE</span>
              <strong>Active</strong>
            </div>

            <div className="network-summary-item">
              <span>LOCAL ADAPTATION</span>
              <strong>Enabled</strong>
            </div>
          </div>
        </section>

        {/* Network Nodes */}
        <section className="network-nodes-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NETWORK NODES</p>
              <h2>Participating Agricultural Systems</h2>
            </div>

            {!loading && !error && (
              <span className="section-count">
                {nodes.length} nodes connected
              </span>
            )}
          </div>

          {loading && (
            <div className="dashboard-card network-message">
              <span className="network-loading-dot" />
              Loading agricultural network nodes...
            </div>
          )}

          {error && (
            <div className="dashboard-card network-message network-error">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="network-nodes-grid">
              {nodes.map((node) => (
                <article className="network-node-card" key={node.country}>
                  {/* Node Header */}
                  <div className="network-node-header">
                    <div>
                      <p className="eyebrow">AGRICULTURAL NODE</p>
                      <h3>{node.country}</h3>
                    </div>

                    <span className="node-status">
                      <i />
                      Active
                    </span>
                  </div>

                  {/* Regions */}
                  <div className="network-info-block">
                    <span className="network-label">
                      AGRICULTURAL REGIONS
                    </span>

                    <div className="network-tags">
                      {node.regions.map((region) => (
                        <span key={region}>{region}</span>
                      ))}
                    </div>
                  </div>

                  {/* Supported Crops */}
                  <div className="network-info-block">
                    <span className="network-label">
                      SUPPORTED CROPS
                    </span>

                    <p className="network-crops">
                      {node.supported_crops.join(" • ")}
                    </p>
                  </div>

                  {/* Capabilities */}
                  <div className="network-info-block">
                    <span className="network-label">
                      DATA & KNOWLEDGE CAPABILITIES
                    </span>

                    <ul className="network-capabilities">
                      {node.data_capabilities.map((capability) => (
                        <li key={capability}>{capability}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Statistics */}
                  <div className="network-stat-grid">
                    <div className="network-stat">
                      <span>SHARED PRACTICES</span>
                      <strong>{node.shared_practices}</strong>
                    </div>

                    <div className="network-stat">
                      <span>KNOWLEDGE CONTRIBUTIONS</span>
                      <strong>{node.knowledge_contributions}</strong>
                    </div>
                  </div>

                  {/* Synchronization */}
                  <div className="network-sync">
                    <i />
                    <span>
                      Last synchronization:{" "}
{node.last_synchronization}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* How It Works */}
        <section className="dashboard-card network-flow-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">INTEROPERABILITY</p>
              <h2>How Agricultural Knowledge Flows</h2>
            </div>
          </div>

          <p className="network-flow-description">
            The network connects local farm conditions with agricultural
            knowledge from participating regions and transforms relevant
            practices into localized recommendations.
          </p>

          <div className="network-flow-grid">
            <div className="network-flow-step">
              <span>01</span>
              <h3>Local Farm</h3>
              <p>
                Farm context, crop, soil and environmental conditions.
              </p>
            </div>

            <div className="network-flow-arrow">→</div>

            <div className="network-flow-step">
              <span>02</span>
              <h3>Agricultural Node</h3>
              <p>
                Regional agricultural data and knowledge capabilities.
              </p>
            </div>

            <div className="network-flow-arrow">→</div>

            <div className="network-flow-step">
              <span>03</span>
              <h3>Knowledge Exchange</h3>
              <p>
                Comparable practices are identified across participating
                regions.
              </p>
            </div>

            <div className="network-flow-arrow">→</div>

            <div className="network-flow-step">
              <span>04</span>
              <h3>Local Adaptation</h3>
              <p>
                Relevant practices are adapted to the local farm context.
              </p>
            </div>
          </div>
        </section>

        {/* Final Workflow */}
        <section className="network-final-card">
          <div>
            <p className="eyebrow">KRISHISETU WORKFLOW</p>

            <h2>From Shared Knowledge to Local Action</h2>

            <p>
              Agricultural knowledge moves through the network, is evaluated
              against local conditions and becomes a practical regenerative
              recommendation for the farm.
            </p>
          </div>

          <a href="/" className="network-return-button">
            Return to Field Intelligence →
          </a>
        </section>
      </main>
    </div>
  );
}

export default Network;