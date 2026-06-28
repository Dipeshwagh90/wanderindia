import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('wanderindia-user', null);
  const [token, setToken] = useLocalStorage('wanderindia-token', null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verify token on app load
      axiosInstance.get('/auth/verify')
      .then(res => {
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
          setToken(null);
        }
      })
      .catch(() => {
        setUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, setUser, setToken]);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Unable to reach backend. Please start the server and try again.' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axiosInstance.post('/auth/register', { name, email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
