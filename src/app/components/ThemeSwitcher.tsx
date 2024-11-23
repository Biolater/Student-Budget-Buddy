"use client";

import { Button } from "@nextui-org/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleButtonClick = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <Button
      onClick={handleButtonClick}
      isIconOnly
      className="bg-transparent p-0 w-[unset] h-[unset] min-w-[unset] min-h-[unset]"
      aria-label={theme}
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}
