import { AIAssistantDrawer } from "@/app/components/ai/AiAssistantDrawer";
import React from "react";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <AIAssistantDrawer />
    </>
  );
}
