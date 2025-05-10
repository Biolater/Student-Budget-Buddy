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
      borderColor: {
        DEFAULT: "hsl(var(--border))",
        strong: "hsl(var(--border-strong))",
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
            background: "hsl(210 20% 98%)", // Softer off-white with a hint of blue
            foreground: "hsl(240 10% 20%)", // Softer black for better contrast
            content1: "hsl(210 30% 99%)", // Slightly blueish card background
            divider: "hsl(240 5% 84%)", // Softer divider
            primary: {
              DEFAULT: "hsl(150 70% 30%)", // Darker green for buttons and UI elements
              foreground: "hsl(0 0% 100%)", // White text for elements with primary background
              "100": "hsl(150 70% 95%)",
              "200": "hsl(150 70% 85%)",
              "300": "hsl(150 70% 70%)",
              "400": "hsl(150 70% 55%)",
              "500": "hsl(150 70% 45%)",
              "600": "hsl(150 70% 30%)", // Same as DEFAULT
              "700": "hsl(150 70% 25%)",
              "800": "hsl(150 70% 20%)",
              "900": "hsl(150 70% 15%)",
            },
            secondary: "hsl(220 16% 94%)", // Slightly warmer secondary
            content2: "hsl(220 20% 92%)", // Softer content background
            content3: "hsl(220 15% 50%)", // Better contrast for tertiary content
            content4: "hsl(220 25% 88%)", // Additional content layer
            default: {
              DEFAULT: "hsl(220 16% 96%)", // Default buttons/elements
              foreground: "hsl(240 10% 20%)", // Default text on default backgrounds
            },
            focus: "hsl(150 70% 30% / 0.5)", // Focus ring color matching primary
            overlay: "hsl(240 10% 8% / 0.5)", // Overlay for modals/popups
            warning: {
              DEFAULT: "hsl(38 95% 60%)", // Warning color
              foreground: "hsl(38 10% 10%)", // Dark text on warning background
            },
            danger: {
              DEFAULT: "hsl(0 65% 60%)",
              foreground: "hsl(0 72% 95%)",
            },
            success: {
              DEFAULT: "hsl(150 55% 45%)",
              foreground: "hsl(0 0% 100%)",
            },
          },
        },
        dark: {
          colors: {
            background: "hsl(240 10% 10%)", // Lighter dark background (not so harsh)
            foreground: "hsl(0 0% 94%)", // Softer white for text
            content1: "hsl(240 7% 16%)", // Slightly lighter card background
            divider: "hsl(240 4% 24%)", // Slightly lighter divider
            primary: {
              DEFAULT: "hsl(150 70% 30%)", // Same darker green for consistency
              foreground: "hsl(0 0% 100%)", // White text for elements with primary background
              "100": "hsl(150 70% 90%)",
              "200": "hsl(150 70% 80%)",
              "300": "hsl(150 70% 65%)",
              "400": "hsl(150 70% 50%)",
              "500": "hsl(150 70% 40%)",
              "600": "hsl(150 70% 30%)", // Same as DEFAULT
              "700": "hsl(150 70% 25%)",
              "800": "hsl(150 70% 20%)",
              "900": "hsl(150 70% 15%)",
            },
            secondary: "hsl(240 5% 22%)", // Slightly lighter secondary
            content2: "hsl(240 6% 30%)", // Lighter content background
            content3: "hsl(240 5% 70%)", // Lighter tertiary content
            content4: "hsl(240 5% 25%)", // Additional content layer (darker for dark mode)
            default: {
              DEFAULT: "hsl(240 5% 26%)", // Default buttons/elements in dark mode
              foreground: "hsl(0 0% 94%)", // Light text on default backgrounds in dark mode
            },
            focus: "hsl(150 70% 40% / 0.5)", // Focus ring matching primary but slightly brighter for dark mode
            overlay: "hsl(240 10% 5% / 0.7)", // Darker overlay for modals/popups in dark mode
            warning: {
              DEFAULT: "hsl(38 90% 55%)", // Slightly dimmer warning color for dark mode
              foreground: "hsl(0 0% 10%)", // Dark text on warning background
            },
            danger: {
              DEFAULT: "hsl(0 65% 55%)", // Slightly softer red
              foreground: "hsl(0 85% 96%)",
            },
            success: {
              DEFAULT: "hsl(150 55% 45%)", // Same success color for consistency
              foreground: "hsl(0 0% 100%)",
            },
          },
        },
      },
    }),
  ],
};
export default config;
