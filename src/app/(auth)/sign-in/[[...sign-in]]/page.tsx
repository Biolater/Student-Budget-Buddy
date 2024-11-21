"use client";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignInComponent() {
  const { theme } = useTheme();

  return (
    <div className="flex min-h-svh items-center justify-center w-full">
      <SignIn appearance={theme === "dark" ? { baseTheme: dark } : {}} />
    </div>
  );
}
