import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { NavbarComponent } from "../components";

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <NavbarComponent />
      {children}
    </>
  );
}
