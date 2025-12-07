import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/Login/AdminLogin";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import CreateTest from "./pages/CreateTest/CreateTest";
import CreateQuestion from "./pages/CreateQuestion/CreateQuestion";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewTests from "./pages/ViewTests/ViewTests";
import ViewAttempts from "./pages/ViewAttempts/ViewAttempts";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-test"
          element={
            <ProtectedRoute>
              <CreateTest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-question/:testId"
          element={
            <ProtectedRoute>
              <CreateQuestion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-tests"
          element={
            <ProtectedRoute>
              <ViewTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-attempts"
          element={
            <ProtectedRoute>
              <ViewAttempts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
