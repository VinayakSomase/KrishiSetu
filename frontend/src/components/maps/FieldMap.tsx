import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Rectangle,
  LayersControl,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapResizeFix() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

function FieldMap() {
  // Temporary prototype coordinates.
  // These will come from the backend later.
  const farmLocation: [number, number] = [20.011, 73.79];

  const farmBoundary: [[number, number], [number, number]] = [
    [20.014, 73.786],
    [20.008, 73.795],
  ];

  return (
    <section className="dashboard-card field-map-card">

      {/* Header */}
      <div className="card-header">

        <div>
          <p className="eyebrow">FIELD INTELLIGENCE</p>

          <h2>Field Map</h2>
        </div>

        <span className="data-source">
          Location Data
        </span>

      </div>


      {/* Map */}
      <div className="field-map-wrapper">

        <MapContainer
          center={farmLocation}
          zoom={14}
          scrollWheelZoom={false}
          className="field-map"
        >

          <MapResizeFix />

          <LayersControl position="topright">

            {/* Standard Map */}
            <LayersControl.BaseLayer
              checked
              name="Standard Map"
            >
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>


            {/* Satellite */}
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                attribution="Tiles © Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>


            {/* Farm Boundary */}
            <LayersControl.Overlay
              checked
              name="Farm Boundary"
            >
              <Rectangle
                bounds={farmBoundary}
                pathOptions={{
                  color: "#1f6b4f",
                  weight: 2,
                  fillColor: "#2e8b67",
                  fillOpacity: 0.12,
                }}
              />
            </LayersControl.Overlay>

          </LayersControl>


          {/* Farm Location */}
          <Marker position={farmLocation}>

            <Popup>

              <div>
                <strong>Selected Farm</strong>

                <br />

                <span>
                  Nashik, Maharashtra
                </span>

              </div>

            </Popup>

          </Marker>

        </MapContainer>


        {/* Selected Farm Information */}
        <div className="map-location-card">

          <span>Selected Farm</span>

          <strong>
            Nashik, Maharashtra
          </strong>

          <small>
            Cotton · Flowering stage
          </small>

        </div>

      </div>


      {/* Map Status */}
      <div className="map-status">

        <span>
          <i className="status-dot" />

          Field location available
        </span>

        <span>
          Farm boundary displayed
        </span>

      </div>

    </section>
  );
}

export default FieldMap;