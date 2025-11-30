"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/auth";
import type { User } from "@shinka/shared";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const data = await authApi.signIn(email, password);
    setUser(data.user);
  };

  const signUp = async (name: string, email: string, password: string) => {
    await authApi.signUp(name, email, password);
  };

  const signOut = async () => {
    await authApi.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
