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

  const isUserValid = (u) => !!u && typeof u === 'object' && (!!u.username || !!u.id);

  // Initialize auth state from local storage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = storage.getToken();
      const rawUser = storage.getUser();
      const storedUser = rawUser?.data || rawUser;

      if (storedToken && isUserValid(storedUser)) {
        setToken(storedToken);
        setUser(storedUser);
        try {
          // Verify with backend — refreshes user info (fullName, email, roles)
          const res = await authService.getCurrentUser();
          const currentUser = res?.data || res;
          if (isUserValid(currentUser)) {
            const updatedUser = {
              ...storedUser,
              fullName: currentUser.fullName || storedUser.fullName,
              email: currentUser.email || storedUser.email,
              roles: currentUser.roles || storedUser.roles,
            };
            setUser(updatedUser);
            storage.setUser(updatedUser);
          }
        } catch (err) {
          if (err.status === 401 || err.status === 0) {
            console.warn('Session expired or invalid — clearing auth state', err.message);
            storage.clearAuth();
            setToken(null);
            setUser(null);
          } else {
            console.warn('Session verification failed, using cached session', err.message);
          }
        }
      } else {
        // Clear invalid or corrupt storage
        storage.clearAuth();
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ username, password });
      const loginData = res?.data || res;

      if (!loginData || !loginData.token) {
        throw new Error('Invalid authentication payload received from server');
      }

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
      const res = await authService.login({
        username: demoAccount.username,
        password: demoAccount.password,
      });
      const loginData = res?.data || res;

      if (!loginData || !loginData.token) {
        throw new Error('Invalid authentication payload received from server');
      }

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
    isAuthenticated: !!token && isUserValid(user),
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
