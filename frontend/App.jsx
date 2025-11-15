import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Terms from "./pages/Terms.jsx";
import Pricelist from "./pages/Pricelist.jsx";
import PricelistPage from "./pages/Pricelist.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/pricelist" element={<Pricelist />} />
        <Route path="/pricelist" element={<PricelistPage />} />
      </Routes>
    </Router>
  );
}

export default App;
