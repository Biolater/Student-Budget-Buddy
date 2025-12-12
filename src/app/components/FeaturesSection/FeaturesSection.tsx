"use client";

import { Card } from "@heroui/react";
import { motion } from "framer-motion";
import { 
  ReceiptText, 
  PieChart, 
  Repeat, 
  Globe, 
  BarChart3, 
  Bot 
} from "lucide-react";

const features = [
  {
    icon: ReceiptText,
    title: "Expense Tracking",
    description: "Log and categorize all your expenses with ease. Keep track of every penny to understand your spending habits.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    icon: PieChart,
    title: "Category-Based Budgets",
    description: "Create custom budgets for different spending categories. Set limits and receive alerts when you're approaching them.",
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    icon: Repeat,
    title: "Recurring Transactions",
    description: "Set up recurring expenses and income to automate your budget. Never forget about regular bills or subscriptions.",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    icon: Globe,
    title: "Multi-Currency Support",
    description: "Manage finances across different currencies with real-time conversion. Perfect for international students or travelers.",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    icon: BarChart3,
    title: "Real-Time Dashboard Charts",
    description: "Visualize your financial data with interactive charts and graphs. Get a clear picture of your financial health at a glance.",
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  },
  {
    icon: Bot,
    title: "AI Assistant (OpenAI)",
    description: "Get personalized financial advice and insights powered by AI. Receive suggestions to optimize your spending and saving habits.",
    color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 w-full bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 h-full border-none shadow-md">
                <div className="flex flex-col h-full">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${feature.color} mb-4`}
                  >
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground flex-grow">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}