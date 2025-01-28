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
  elements,
} from "chart.js";
import { ArrowRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Bar, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// const monthlySpendingData = [
//   { month: "Jan", amount: 1000 },
//   { month: "Feb", amount: 1200 },
//   { month: "Mar", amount: 900 },
//   { month: "Apr", amount: 1100 },
//   { month: "May", amount: 1300 },
//   { month: "Jun", amount: 1000 },
// ];

const spendingData = [
  { category: "Food", amount: 250 },
  { category: "Rent", amount: 500 },
  { category: "Books", amount: 150 },
  { category: "Entertainment", amount: 100 },
  { category: "Transport", amount: 80 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const SpendingData: React.FC<{
  monthlySpendingData: { month: string; amount: number }[];
}> = ({ monthlySpendingData }) => {
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
    labels: spendingData.map((data) => data.category),
    datasets: [
      {
        data: spendingData.map((data) => data.amount),
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
    },
    scales: {
      x: {
        ticks: {
          color: "var(--foreground)",
        },
        // barPercentage: 0.5, // Makes bars as wide as the category allows
        // categoryPercentage: 11, // Reduces space between categories
        barThickness: 50, // Sets a fixed width for the bars (adjust as needed)
      },
      y: {
        ticks: {
          color: "var(--foreground)",
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
            {monthlySpendingData.length > 0 ? (
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
