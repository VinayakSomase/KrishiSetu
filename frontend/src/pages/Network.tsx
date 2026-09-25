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
              Explore agricultural knowledge, data capabilities,
              and shared practices across participating regions.
            </p>
          </div>

          <div className="farm-selector">
            <span>Network Status</span>
            <strong>
              {loading ? "Loading..." : "Connected"}
            </strong>
          </div>
        </header>


        {/* Network Overview */}
        <section className="dashboard-card">

          <div className="card-header">
            <div>
              <p className="eyebrow">NETWORK OVERVIEW</p>
              <h2>Knowledge & Data Exchange</h2>
            </div>

            <span className="data-source">
              BRICS Network
            </span>
          </div>

          <p>
            KrishiSetu connects agricultural knowledge and
            regional data capabilities so that practices can
            be discovered and adapted to local farming conditions.
          </p>

        </section>


        {/* Network Nodes */}
        <section style={{ marginTop: "24px" }}>

          <div className="section-heading">
            <div>
              <p className="eyebrow">NETWORK NODES</p>
              <h2>Participating Regions</h2>
            </div>

            {!loading && (
              <span>
                {nodes.length} nodes
              </span>
            )}
          </div>


          {loading && (
            <div className="dashboard-card">
              Loading network nodes...
            </div>
          )}


          {error && (
            <div className="dashboard-card">
              <p>{error}</p>
            </div>
          )}


          {!loading && !error && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "16px",
              }}
            >

              {nodes.map((node) => (
                <article
                  className="dashboard-card"
                  key={node.country}
                >

                  <div className="card-header">

                    <div>
                      <p className="eyebrow">
                        NETWORK NODE
                      </p>

                      <h2>{node.country}</h2>
                    </div>

                    <span className="data-source">
                      Active
                    </span>

                  </div>


                  {/* Regions */}
                  <div style={{ marginBottom: "18px" }}>

                    <span>Regions</span>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "7px",
                        marginTop: "8px",
                      }}
                    >
                      {node.regions.map((region) => (
                        <span
                          key={region}
                          style={{
                            padding: "5px 8px",
                            borderRadius: "5px",
                            background: "#eef4f0",
                            color: "#496d5b",
                            fontSize: "11px",
                          }}
                        >
                          {region}
                        </span>
                      ))}
                    </div>

                  </div>


                  {/* Crops */}
                  <div style={{ marginBottom: "18px" }}>

                    <span>Supported Crops</span>

                    <p style={{ margin: "7px 0 0" }}>
                      {node.supported_crops.join(" • ")}
                    </p>

                  </div>


                  {/* Capabilities */}
                  <div style={{ marginBottom: "18px" }}>

                    <span>Data Capabilities</span>

                    <ul style={{ marginTop: "8px" }}>
                      {node.data_capabilities.map(
                        (capability) => (
                          <li key={capability}>
                            {capability}
                          </li>
                        )
                      )}
                    </ul>

                  </div>


                  {/* Statistics */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, 1fr)",
                      gap: "10px",
                      paddingTop: "16px",
                      borderTop:
                        "1px solid #e4ebe7",
                    }}
                  >

                    <div>
                      <span>Shared Practices</span>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "5px",
                        }}
                      >
                        {node.shared_practices}
                      </strong>
                    </div>


                    <div>
                      <span>Knowledge Contributions</span>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "5px",
                        }}
                      >
                        {node.knowledge_contributions}
                      </strong>
                    </div>

                  </div>


                  {/* Sync */}
                  <div
                    style={{
                      marginTop: "16px",
                      fontSize: "12px",
                      color: "#71847a",
                    }}
                  >
                    Last synchronization:{" "}
                    {new Date(
                      node.last_synchronization
                    ).toLocaleString()}
                  </div>

                </article>
              ))}

            </div>
          )}

        </section>


        {/* How It Works */}
        <section
          className="dashboard-card"
          style={{ marginTop: "24px" }}
        >

          <div className="card-header">
            <div>
              <p className="eyebrow">INTEROPERABILITY</p>
              <h2>How Knowledge Flows</h2>
            </div>
          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "12px",
            }}
          >

            <div>
              <strong>01</strong>
              <p>Regional agricultural data</p>
            </div>

            <div>
              <strong>02</strong>
              <p>Knowledge exchange</p>
            </div>

            <div>
              <strong>03</strong>
              <p>Local adaptation</p>
            </div>

            <div>
              <strong>04</strong>
              <p>Farm-level action</p>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Network;