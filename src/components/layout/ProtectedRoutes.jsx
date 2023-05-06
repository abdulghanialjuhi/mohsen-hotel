import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Context } from "../../context/GlobalState";

export const ProtectedRoute = ({ children }) => {

    const { isAuth, isAdmin } = useContext(Context)
    const locations = useLocation()

    if (isAuth && (locations.pathname.includes('login') || locations.pathname.includes('signup'))) {
      	return <Navigate to="/" replace />;
    }

	if (!isAdmin && locations.pathname.includes('secure')) {
		return <Navigate to="/" replace />;
  	}

    if (!isAuth && locations.pathname.includes('auth')) {
    	return <Navigate to="/login" replace />;
    }
  
    return children;
  };