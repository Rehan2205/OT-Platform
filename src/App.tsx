import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import TestInstructions from "./pages/TestInstructions/TestInstructions";
import TestRunner from "./pages/TestRunner/TestRunner";
import Result from "./pages/Result";
import CreateTest from "./pages/CreateTest/CreateTest";

// Private Route Wrapper
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVATE ROUTES */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-test"
          element={
            <PrivateRoute>
              <CreateTest />
            </PrivateRoute>
          }
        />

        <Route
          path="/tests/:id/instructions"
          element={
            <PrivateRoute>
              <TestInstructions />
            </PrivateRoute>
          }
        />

        <Route
          path="/tests/:id/run"
          element={
            <PrivateRoute>
              <TestRunner />
            </PrivateRoute>
          }
        />

        <Route
          path="/results/:id"
          element={
            <PrivateRoute>
              <Result />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
