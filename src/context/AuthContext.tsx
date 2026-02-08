import type { user } from "@/interfaces/user";
import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  currentUser: user | null;
  token: string | null;
  login: (user: user, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<user | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (user: user, authToken: string) => {
    setCurrentUser({ ...user, token: authToken });
    setToken(authToken);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
