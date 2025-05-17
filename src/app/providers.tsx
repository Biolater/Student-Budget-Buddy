// app/providers.tsx
"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent flash by rendering children with same DOM structure while hidden
  // This is better than returning null which causes layout shifts
  return (
    <HeroUIProvider>
      <NextThemesProvider
        disableTransitionOnChange
        attribute="class"
        defaultTheme="system"
        enableSystem
        enableColorScheme
        storageKey="budget-buddy-theme" // Use a consistent key for persistence
      >
        <ToastProvider
          toastProps={{
            timeout: 2500,
          }}
        />
        <div style={!mounted ? { visibility: "hidden" } : undefined}>
          {children}
        </div>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
