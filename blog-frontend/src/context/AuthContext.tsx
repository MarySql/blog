"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { login, register } from "~/lib/api";

interface AuthContextType {
  user: string | null;
  token: string | null;
  loginUser: (username: string, password: string) => Promise<void>;
  registerUser: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
  }, []);

  const loginUser = async (username: string, password: string) => {
    try {
      const response = await login({ username, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", username);
      setToken(token);
      setUser(username);
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const registerUser = async (username: string, email: string, password: string) => {
    try {
      await register({ username, email, password });
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};