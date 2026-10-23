import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('tamiang_user');
    const token = localStorage.getItem('tamiang_token');

    if (savedUser && token) {
      try {
        // Decode JWT payload to check expiry
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const decodedPayload = JSON.parse(atob(payloadBase64));
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedPayload.exp && decodedPayload.exp < currentTime) {
            // Token has expired! Clear storage
            localStorage.removeItem('tamiang_token');
            localStorage.removeItem('tamiang_user');
            setUser(null);
            setLoading(false);
            return;
          }
        }
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('tamiang_user');
        localStorage.removeItem('tamiang_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password });
    if (res.success && res.data) {
      localStorage.setItem('tamiang_token', res.data.token);
      localStorage.setItem('tamiang_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.message || 'Login gagal');
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    if (res.success && res.data) {
      localStorage.setItem('tamiang_token', res.data.token);
      localStorage.setItem('tamiang_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.message || 'Registrasi gagal');
  };

  const logout = () => {
    localStorage.removeItem('tamiang_token');
    localStorage.removeItem('tamiang_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
