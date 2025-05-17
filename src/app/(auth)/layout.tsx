"use client";

import React from "react";
import Link from "next/link";
import { PiggyBank } from "lucide-react";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Instead of returning null, we pre-render with invisible content
  // This prevents layout shifts and flashing when content becomes visible

  return (
    <main className="flex min-h-svh items-center justify-center w-full py-4">
      {/* Apply visibility only to the button while preserving layout */}
      <div
        className="fixed top-4 left-4 z-10"
        style={{ opacity: isMounted ? 1 : 0, transition: "opacity 0.3s" }}
      >
        <Button
          as={Link}
          href="/"
          variant="light"
          size="sm"
          className="gap-2 text-foreground hover:bg-secondary/40"
          aria-label="Back to home"
        >
          <PiggyBank size={20} aria-hidden="true" />
          <span>Budget Buddy</span>
        </Button>
      </div>
      {/* Children are always rendered to prevent layout shifts */}
      {children}
    </main>
  );
};

export default AuthLayout;
