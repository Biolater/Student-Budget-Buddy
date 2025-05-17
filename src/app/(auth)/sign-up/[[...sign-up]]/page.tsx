"use client";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Page() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Use the initial theme to prevent flashing
  const initialTheme = resolvedTheme || theme || "light";
  
  useEffect(() => {
    // Mark as mounted after hydration
    setMounted(true);
  }, []);

  // Use proper initial theme and update it only when necessary
  const currentTheme = mounted ? (resolvedTheme || theme) : initialTheme;
  
  return (
    <div style={{ opacity: mounted ? 1 : 0.98, transition: 'opacity 0.2s ease-in' }}>
      <SignUp
        signInUrl="/sign-in"
        appearance={currentTheme === "dark" ? { baseTheme: dark } : {}}
      />
    </div>
  );
}
