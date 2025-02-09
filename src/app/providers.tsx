// app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <HeroUIProvider>
      <NextThemesProvider
        disableTransitionOnChange
        attribute="class"
        defaultTheme="system"
      >
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}