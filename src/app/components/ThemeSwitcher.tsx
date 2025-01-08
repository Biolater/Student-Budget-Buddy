"use client";

import React from "react";
import { useTheme } from "next-themes";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { SunIcon, MoonIcon, LaptopIcon } from "lucide-react";

const themes = [
  { key: "light", name: "Light", icon: SunIcon },
  { key: "dark", name: "Dark", icon: MoonIcon },
  { key: "system", name: "System", icon: LaptopIcon },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          color="default"
          variant="bordered"
          size="sm"
          className="size-10 h-10 min-w-[unset] px-0"
        >
          {theme === "light" ? (
            <SunIcon className="h-4 w-4" />
          ) : theme === "dark" ? (
            <MoonIcon className="h-4 w-4" />
          ) : (
            <LaptopIcon className="h-4 w-4" />
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme selection"
        variant="flat"
        selectionMode="single"
        selectedKeys={new Set([theme || "system"])}
        onSelectionChange={(keys) => setTheme(Array.from(keys)[0] as string)}
        className="min-w-[120px]"
      >
        {themes.map(({ key, name, icon: Icon }) => (
          <DropdownItem
            key={key}
            startContent={<Icon className="h-4 w-4 mr-2" />}
          >
            {name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
