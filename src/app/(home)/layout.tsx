import React from "react";
import { NavbarComponent } from "../components";
import AuthProvider from "@/app/contexts/AuthContext";


export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <NavbarComponent />
      {children}
    </AuthProvider>
  );
}
