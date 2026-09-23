import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, authStorage } from "../services/api";
import { useToast } from "./ToastContext";
const AuthContext = createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const refreshUser = useCallback(async () => {
    const token = authStorage.getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch {
      authStorage.removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);
  const login = async (collegeRegistrationNo, password) => {
    try {
      setIsLoading(true);
      const res = await api.login(collegeRegistrationNo, password);
      authStorage.setToken(res.token);
      setUser(res.user);
      toast.success(res.message || "Login successful");
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid registration number or password";
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const register = async (collegeRegistrationNo, password, confirmPassword) => {
    try {
      setIsLoading(true);
      const res = await api.register(collegeRegistrationNo, password, confirmPassword);
      authStorage.setToken(res.token);
      setUser(res.user);
      toast.success(res.message || "Account created successfully");
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to complete registration";
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    authStorage.removeToken();
    setUser(null);
    toast.info("You have logged out.");
  };
  return <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>;
};
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
export {
  AuthProvider,
  useAuth
};
