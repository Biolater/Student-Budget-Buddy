"use client";

import { createContext, useState, useContext } from "react";
import { useAuth as useClerkAuth } from "@clerk/nextjs";

interface AuthContextProps {
  isSignedIn: boolean | undefined;
  userId: string | undefined | null;
  isLoaded: boolean;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isSignedIn: false,
  userId: null,
  isLoaded: false,
  signOut: () => {},
});
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, userId, isLoaded, signOut } = useClerkAuth();
  return (
    <AuthContext.Provider value={{ isSignedIn, userId, isLoaded, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
