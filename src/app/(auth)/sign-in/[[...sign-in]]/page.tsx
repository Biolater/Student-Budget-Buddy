"use client";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function SignInComponent() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Use a ref to store the initial theme to prevent flashing
  const initialTheme = resolvedTheme || theme || "light";
  
  useEffect(() => {
    // Mark as mounted after hydration
    setMounted(true);
  }, []);

  // Use proper initial theme and update it only when necessary
  const currentTheme = mounted ? (resolvedTheme || theme) : initialTheme;
  
  return (
    <div style={{ opacity: mounted ? 1 : 0.98, transition: 'opacity 0.2s ease-in' }}>
      <SignIn 
        signUpUrl="/sign-up" 
        appearance={currentTheme === "dark" ? { baseTheme: dark } : {}} 
      />
    </div>
  );
}
