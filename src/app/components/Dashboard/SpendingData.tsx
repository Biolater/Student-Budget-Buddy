"use client";

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { ArrowRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Bar, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import type {
  SpendingDataByCategory,
  SpendingDataByMonth,
} from "@/app/actions/expense.actions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CHART_COLORS = [
  "hsl(134, 60%, 53%)", // primary green
  "hsl(0, 80%, 60%)", // destructive red
  "hsl(43, 100%, 58%)", // warning yellow
  "hsl(207, 90%, 54%)", // info blue
  "hsl(271, 91%, 65%)", // purple
];

const SpendingData: React.FC<{
  monthlySpendingData: SpendingDataByMonth;
  spendingDataByCategory: SpendingDataByCategory;
}> = ({ monthlySpendingData, spendingDataByCategory }) => {
  const { theme, systemTheme } = useTheme();
  const [chartOptions, setChartOptions] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDarkMode = currentTheme === "dark";
    const textColor = isDarkMode ? "#ffffff" : "#000000";
    const borderColor = isDarkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)";

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: isDarkMode
            ? "rgba(0, 0, 0, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: {
            color: borderColor,
          },
          ticks: {
            color: textColor,
          },
        },
        y: {
          grid: {
            color: borderColor,
          },
          ticks: {
            color: textColor,
          },
        },
      },
      barThickness: 20,
      maxBarThickness: 20,
    });
  }, [theme, systemTheme, mounted]);

  const barChartData = {
    labels: monthlySpendingData.map((data) => data.month),
    datasets: [
      {
        label: "Monthly Spending",
        data: monthlySpendingData.map((data) => data.amount),
        backgroundColor: "hsla(134, 60%, 53%, 0.7)", // primary green with opacity
        borderColor: "hsl(134, 60%, 53%)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: spendingDataByCategory.map((data) => data.category),
    datasets: [
      {
        data: spendingDataByCategory.map((data) => data.amount),
        backgroundColor: CHART_COLORS,
        borderColor:
          theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (!mounted) return null;

  return (
    <motion.div
      className="grid gap-4 grid-cols-1 lg:grid-cols-5 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="lg:col-span-3" variants={cardVariants}>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl self-start font-semibold leading-none tracking-tight text-foreground">
              Monthly Spending Trend
            </h3>
          </CardHeader>
          <CardBody className="w-full overflow-x-auto p-6 pt-0">
            {monthlySpendingData.length > 0 ? (
              <motion.div
                className="h-[18.75rem]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Bar data={barChartData} options={chartOptions} />
              </motion.div>
            ) : (
              <motion.div
                className="space-y-4 flex flex-col justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="text-muted-foreground" data-id="11">
                    No spending data available yet
                  </p>
                  <p className="text-sm text-muted-foreground text-center">
                    Start tracking your expenses to see monthly trends
                  </p>
                </div>
                <Button
                  as={Link}
                  href="/expenses"
                  startContent={<PlusCircle className="size-4" />}
                  className="bg-primary text-primary-foreground"
                >
                  Add Your First Expense
                </Button>
              </motion.div>
            )}
          </CardBody>
        </Card>
      </motion.div>
      <motion.div className="lg:col-span-2" variants={cardVariants}>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl self-start font-semibold leading-none tracking-tight text-foreground">
              Spending by Category
            </h3>
          </CardHeader>
          <CardBody className="w-full overflow-x-auto p-6 pt-0">
            {spendingDataByCategory.length > 0 ? (
              <motion.div
                className="h-[18.75rem]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Pie data={pieChartData} options={chartOptions} />
              </motion.div>
            ) : (
              <motion.div
                className="space-y-4 flex flex-col justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="text-muted-foreground" data-id="11">
                    No category data available
                  </p>
                  <p className="text-sm text-muted-foreground text-center">
                    Add expenses with categories to see your spending
                    distribution
                  </p>
                </div>
                <Button
                  as={Link}
                  href="/expenses"
                  endContent={<ArrowRight className="size-4" />}
                  className="bg-primary text-primary-foreground"
                >
                  View Expenses
                </Button>
              </motion.div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SpendingData;
