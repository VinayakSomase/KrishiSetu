import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Diagnose from "./pages/Diagnose";
import Advisory from "./pages/Advisory";
import Knowledge from "./pages/Knowledge";
import Network from "./pages/Network";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/diagnose" element={<Diagnose />} />
        <Route path="/advisory" element={<Advisory />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/network" element={<Network />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;