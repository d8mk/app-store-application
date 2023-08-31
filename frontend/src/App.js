import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Filter from "./Components/filter";
import AppDetail from "./Components/appDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Filter />} />
        <Route path="/details/:appId" element={<AppDetail />} />
      </Routes>
    </Router>
  );
}
