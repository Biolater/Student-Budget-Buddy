import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
  // SignInButton,
  // SignedIn,
  // SignedOut,
  // UserButton,
} from "@clerk/nextjs";
import { Providers } from "./providers";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "react-hot-toast";
import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Student Budget Buddy - Your Personal Finance Assistant",
  description:
    "Take control of your finances with Student Budget Buddy. Track expenses, set budgets, and achieve your financial goals.",
  openGraph: {
    title: "Student Budget Buddy - Your Personal Finance Assistant",
    description:
      "Take control of your finances with Student Budget Buddy. Track expenses, set budgets, and achieve your financial goals.",
    // url: "https://your-domain.com", // Replace with your actual domain
    siteName: "Student Budget Buddy",
    // images: [
    //   {
    //     url: "https://your-domain.com/og-image.jpg", // Replace with the URL of your OG image
    //     alt: "Student Budget Buddy Logo",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Budget Buddy - Your Personal Finance Assistant",
    description:
      "Take control of your finances with Student Budget Buddy. Track expenses, set budgets, and achieve your financial goals.",
    // image: "https://your-domain.com/og-image.jpg",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${GeistSans.className} antialiased`}
        >
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
