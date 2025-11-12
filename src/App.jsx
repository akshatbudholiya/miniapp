import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Terms from "./pages/Terms";
import Pricelist from "./pages/Pricelist";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/pricelist" element={<Pricelist />} />
      </Routes>
    </Router>
  );
}

export default App;
