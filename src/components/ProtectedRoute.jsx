import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { message } from "antd";
import { getUserRole } from "../utils/auth";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const userRole = getUserRole();

  useEffect(() => {
    console.log("Current user role:", userRole);
    console.log("Allowed roles:", allowedRoles);

    if (!allowedRoles.includes(userRole)) {
      message.error("You do not have permission to access this page.");
      navigate("/");
    }
  }, [allowedRoles, userRole, navigate]);

  if (!allowedRoles.includes(userRole)) {
    return null;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;