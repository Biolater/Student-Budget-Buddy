"use client";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { theme } = useTheme();
  return (
    <div className="flex py-6 min-h-svh items-center justify-center w-full">
      <SignUp appearance={theme === "dark" ? { baseTheme: dark } : {}} />
    </div>
  );
}
