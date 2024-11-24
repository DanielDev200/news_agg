import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from './../supabaseClient'; 
import { fetchUserRole } from './../api/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { role } = await fetchUserRole(user.id);
        
        if (role === 'admin') {
          setIsAuthorized(true);
        }
      }
      setLoading(false);
    };
    checkUserRole();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return isAuthorized ? children : <Navigate to="/" />;
};

export default ProtectedRoute;