"use client";

import { Button, Card } from "@heroui/react";
import {
  Plus,
  TrendingUp,
  DollarSign,
  PiggyBank,
  Wallet,
  BarChart2,
} from "lucide-react";
import { motion } from "framer-motion";

interface BudgetEmptyStateProps {
  onCreateBudget: () => void;
}

export function BudgetEmptyState({ onCreateBudget }: BudgetEmptyStateProps) {
  return (
    <motion.div
      className="col-span-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] border-2 border-dashed border-border relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        {/* Illustration */}
        <div className="relative mb-8">
          <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-primary/10 animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-primary/20 animate-pulse delay-300" />

          <div className="relative z-10 bg-primary/10 rounded-full p-6 border-2 border-primary/20">
            <PiggyBank className="w-16 h-16 text-primary" />
          </div>

          {/* Floating elements */}
          <motion.div
            className="absolute -top-4 -right-4 bg-background shadow-md rounded-full p-2 border border-border"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <DollarSign className="w-5 h-5 text-primary" />
          </motion.div>

          <motion.div
            className="absolute -bottom-2 -left-6 bg-background shadow-md rounded-full p-2 border border-border"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <TrendingUp className="w-5 h-5 text-success" />
          </motion.div>

          <motion.div
            className="absolute top-1/2 -right-8 bg-background shadow-md rounded-full p-2 border border-border"
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <BarChart2 className="w-5 h-5 text-blue-500" />
          </motion.div>
        </div>

        <h3 className="text-xl font-semibold mb-3">
          No Budgets Yet! Let&apos;s Get Started
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Create a budget to track your spending, set limits on categories, and
          achieve your financial goals. It&apos;s the first step to smart money
          management!
        </p>

        {/* Benefits section */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-md w-full">
          {[
            { icon: Wallet, text: "Track Spending", color: "text-amber-500" },
            { icon: PiggyBank, text: "Save Money", color: "text-primary" },
            { icon: TrendingUp, text: "Reach Goals", color: "text-green-500" },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`rounded-full p-2 ${item.color} bg-muted mb-2`}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        <Button
          onPress={onCreateBudget}
          size="lg"
          className="gap-2 relative overflow-hidden group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:animate-shimmer" />
          <Plus className="h-4 w-4" /> Create Your First Budget
        </Button>
      </Card>
    </motion.div>
  );
}
