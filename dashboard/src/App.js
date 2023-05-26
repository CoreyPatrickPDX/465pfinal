import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import "leaflet/dist/leaflet.css";
import MainView from "./components/MainView/MainView";
import DetailedView from "./components/DetailedView/DetailedView";
import HistoricalView from "./components/HistoricalView/HistoricalView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/detailed" element={<DetailedView />} />
        <Route path="/historical" element={<HistoricalView />} />
        <Route path="/" element={<MainView />} />
      </Routes>
    </Router>
  );
}

export default App;
