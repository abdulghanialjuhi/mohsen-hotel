import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Context } from "../../context/GlobalState";

export const ProtectedRoute = ({ children }) => {

    const { isAuth } = useContext(Context)
    const locations = useLocation()
    
    if (!isAuth && locations.pathname.includes('secure')) {
        console.log('not auth');
      return <Navigate to="/auth-login" replace />;
    }
  
    return children;
  };