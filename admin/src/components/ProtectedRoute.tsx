import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  return token ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
