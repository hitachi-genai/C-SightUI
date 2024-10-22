import React from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "../components/Header";  // Adjust the path based on your folder structure
import QuickInsightDashboard from "../components/QuickInsightDashboard/QuickInsightDashboard";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/infrastructure-costs" element={<Header />} />
      <Route path="/quick-insights" element={<QuickInsightDashboard />} />
      <Route path="/" element={<QuickInsightDashboard />} />
      {/* Add more routes for other components here */}
    </Routes>
  );
};

export default AppRoutes;
