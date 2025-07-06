import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) return <p className="text-center mt-10">Checking credentials...</p>;

  if (!user) {
    // Dynamically redirect to correct login page depending on URL
    if (location.pathname.startsWith("/technician/")) {
      return <Navigate to="/technician-login" replace />;
    } else {
      return <Navigate to="/admin-login" replace />;
    }
  }

  return children;
};

export default RequireAuth;
