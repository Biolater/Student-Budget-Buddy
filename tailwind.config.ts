import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Keep general theme extensions here (fonts, spacing, etc.)
      // Colors are now handled by heroui below
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
        },
      },
      // Add custom colors that use CSS variables
      colors: {
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",
        success: "hsl(var(--success))",
        "success-foreground": "hsl(var(--success-foreground))",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "hsl(0 0% 100%)",
            foreground: "hsl(240 10% 4%)",
            content1: "hsl(0 0% 100%)",
            divider: "hsl(240 5% 90%)",
            primary: "hsl(134 60% 53%)",
            secondary: "hsl(240 5% 96%)",
            content2: "hsl(220 14% 96%)",
            content3: "hsl(220 9% 46%)",
            danger: "hsl(0 84% 60%)",
          },
        },
        dark: {
          colors: {
            background: "hsl(240 10% 4%)",
            foreground: "hsl(0 0% 98%)",
            content1: "hsl(240 4% 12%)",
            divider: "hsl(240 4% 20%)",
            primary: "hsl(134 60% 53%)",
            secondary: "hsl(240 4% 16%)",
            content2: "hsl(240 3% 26%)",
            content3: "hsl(240 5% 65%)",
            danger: "hsl(0 72% 51%)",
          },
        },
      },
    }),
  ],
};
export default config;
