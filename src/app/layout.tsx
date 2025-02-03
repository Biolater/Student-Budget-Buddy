import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "react-hot-toast";
import type { Viewport } from "next";
import TanstackProvider from "./components/TanstackProvider";

export const metadata: Metadata = {
  title: "Student Budget Buddy - Your Personal Finance Assistant",
  description:
    "Take control of your finances with Student Budget Buddy. Track expenses, set budgets, and achieve your financial goals.",
  openGraph: {
    title: "Student Budget Buddy - Your Personal Finance Assistant",
    description:
      "Take control of your finances with Student Budget Buddy. Track expenses, set budgets, and achieve your financial goals.",
    siteName: "Student Budget Buddy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Budget Buddy - Your Personal Finance Assistant",
    description:
      "Take control of your finances with Student Budget Buddy. Track expenses, set budgets, and achieve your financial goals.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${GeistSans.className} antialiased`}
        >
          <Providers>
            <TanstackProvider>{children}</TanstackProvider>
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
