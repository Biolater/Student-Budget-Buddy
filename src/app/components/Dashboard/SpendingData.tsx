"use client";

import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
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
import { ArrowRight, PlusCircle } from 'lucide-react';
import Link from "next/link";
import { Bar, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type Expense = {
  amount: string;
  category: string;
  currency: string;
  date: Date;
  id: string;
};

type SpendingDataProps = {
  expenses: Expense[];
  baseCurrency?: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const SpendingData: React.FC<SpendingDataProps> = ({ expenses, baseCurrency = "USD" }) => {
  const [monthlySpendingData, setMonthlySpendingData] = useState<{ month: string; amount: number }[]>([]);
  const [categorySpendingData, setCategorySpendingData] = useState<{ category: string; amount: number }[]>([]);

  useEffect(() => {
    const processExpenses = async () => {
      // Fetch exchange rates (you'll need to implement this function)
      const exchangeRates = await fetchExchangeRates(baseCurrency);

      const monthlyData: { [key: string]: number } = {};
      const categoryData: { [key: string]: number } = {};

      expenses.forEach((expense) => {
        const date = new Date(expense.date);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const monthKey = `${month} ${year}`;
        const amount = convertCurrency(parseFloat(expense.amount), expense.currency, baseCurrency, exchangeRates);

        // Aggregate monthly spending
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + amount;

        // Aggregate category spending
        categoryData[expense.category] = (categoryData[expense.category] || 0) + amount;
      });

      setMonthlySpendingData(
        Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }))
      );

      setCategorySpendingData(
        Object.entries(categoryData).map(([category, amount]) => ({ category, amount }))
      );
    };

    processExpenses();
  }, [expenses, baseCurrency]);

  const barChartData = {
    labels: monthlySpendingData.map((data) => data.month),
    datasets: [
      {
        label: "Monthly Spending",
        data: monthlySpendingData.map((data) => data.amount),
        backgroundColor: "hsl(var(--primary))",
      },
    ],
  };

  const pieChartData = {
    labels: categorySpendingData.map((data) => data.category),
    datasets: [
      {
        data: categorySpendingData.map((data) => data.amount),
        backgroundColor: COLORS,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "var(--foreground)",
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: baseCurrency }).format(context.parsed);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "var(--foreground)",
        },
      },
      y: {
        ticks: {
          color: "var(--foreground)",
          callback: (value: string | number, index: number, ticks: any[]) => {
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: baseCurrency }).format(numValue);
          }
        },
      },
    },
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
            {expenses?.length > 0 ? (
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
            {expenses?.length > 0 ? (
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

// Helper function to convert currency (you'll need to implement this)
function convertCurrency(amount: number, fromCurrency: string, toCurrency: string, exchangeRates: { [key: string]: number }): number {
  if (fromCurrency === toCurrency) return amount;
  const rate = exchangeRates[fromCurrency];
  return amount / rate;
}

// Helper function to fetch exchange rates (you'll need to implement this)
async function fetchExchangeRates(baseCurrency: string): Promise<{ [key: string]: number }> {
  // Implement API call to get exchange rates
  // For now, we'll return a mock object
  return {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    // Add more currencies as needed
  };
}

export default SpendingData;