"use client";

import { Button, Card } from "@heroui/react";
import { ArrowRight, PiggyBank, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthContext";
import "./grid-background.css";

const features = [
  {
    icon: PiggyBank,
    title: "Smart Budgeting",
    description:
      "Set and manage budgets across multiple categories and currencies.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Expense Tracking",
    description:
      "Easily log and categorize your expenses to stay on top of your spending.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Shield,
    title: "Financial Insights",
    description:
      "Gain valuable insights into your spending habits and saving opportunities.",
    color: "bg-purple-100 text-purple-600",
  },
];

export default function HeroSection() {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-dot-pattern">
      {/* Grid background with animated gradient overlay */}
      <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark">
        {/* Gradient spots for visual interest */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black/60 bg-white/60 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <section className="text-foreground overflow-hidden relative">
        <div className="absolute inset-0 z-0"></div>
        <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Master Your Finances with
              <span className="block text-primary mt-2">
                Student Budget Buddy
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl sm:text-2xl text-muted-foreground">
              Take control of your student budget, track expenses, and achieve
              your financial goals with ease.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                as={Link}
                href="/sign-up"
                size="lg"
                color="primary"
                endContent={<ArrowRight className="ml-2" />}
              >
                Get Started
              </Button>
              <Button
                as={Link}
                href="/learn-more"
                size="lg"
                variant="bordered"
                color="primary"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-6 border-none shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full ${feature.color}`}
                    >
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">
                      {feature.title}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
