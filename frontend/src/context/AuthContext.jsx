import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';
import { ROLES, DEMO_ACCOUNTS } from '../constants/roles';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  // Initialize auth state from local storage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = storage.getToken();
      const storedUser = storage.getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        try {
          // Verify with backend
          const currentUser = await authService.getCurrentUser();
          setUser({
            ...storedUser,
            fullName: currentUser.fullName,
            email: currentUser.email,
            roles: currentUser.roles,
          });
          storage.setUser({
            ...storedUser,
            fullName: currentUser.fullName,
            email: currentUser.email,
            roles: currentUser.roles,
          });
        } catch (err) {
          console.warn('Session verification failed, using cached session or clearing', err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const loginData = await authService.login({ username, password });
      // loginData: { token, type, id, username, email, fullName, roles }
      storage.setToken(loginData.token);
      storage.setUser(loginData);
      setToken(loginData.token);
      setUser(loginData);
      success(`Welcome back, ${loginData.fullName || loginData.username}!`);
      return loginData;
    } catch (err) {
      error(err.message || 'Login failed. Please check credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, error]);

  const logout = useCallback(() => {
    storage.clearAuth();
    setUser(null);
    setToken(null);
    success('Logged out successfully.');
  }, [success]);

  const quickSwitchRole = useCallback(async (demoAccount) => {
    setLoading(true);
    try {
      const loginData = await authService.login({
        username: demoAccount.username,
        password: demoAccount.password,
      });
      storage.setToken(loginData.token);
      storage.setUser(loginData);
      setToken(loginData.token);
      setUser(loginData);
      success(`Switched role to ${demoAccount.label}`);
      return loginData;
    } catch (err) {
      error(`Quick role switch failed: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, error]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    roles: user?.roles || [],
    login,
    logout,
    quickSwitchRole,
    demoAccounts: DEMO_ACCOUNTS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
