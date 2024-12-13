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
import { ArrowRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const monthlySpendingData = [
  { month: "Jan", amount: 1000 },
  { month: "Feb", amount: 1200 },
  { month: "Mar", amount: 900 },
  { month: "Apr", amount: 1100 },
  { month: "May", amount: 1300 },
  { month: "Jun", amount: 1000 },
];

const spendingData = [
  { category: "Food", amount: 250 },
  { category: "Rent", amount: 500 },
  { category: "Books", amount: 150 },
  { category: "Entertainment", amount: 100 },
  { category: "Transport", amount: 80 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const SpendingData: React.FC<{ spendings: number }> = ({ spendings }) => {
  const barChartData = {
    labels: monthlySpendingData.map((data) => data.month),
    datasets: [
      {
        label: "Monthly Spending",
        data: monthlySpendingData.map((data) => data.amount),
        backgroundColor: "#8884d8",
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
  };
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-5 lg:grid-cols-7 mb-8">
      <Card className="md:col-span-3 lg:col-span-4">
        <CardHeader className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl self-start font-semibold leading-none tracking-tight">
            Monthly Spending Trend
          </h3>
        </CardHeader>
        <CardBody className="w-full overflow-x-auto p-6 pt-0">
          {spendings > 0 ? (
            <div className="h-[18.75rem]">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="space-y-4 h-[18.75rem] flex flex-col justify-center items-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <p className="text-muted-foreground" data-id="11">
                  No spending data available yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Start tracking your expenses to see monthly trends
                </p>
              </div>
              <Button
                as={Link}
                href="/expenses"
                startContent={<PlusCircle className="size-4" />}
              >
                Add Your First Expense
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl self-start font-semibold leading-none tracking-tight">
            Spending by Category
          </h3>
        </CardHeader>
        <CardBody className="w-full overflow-x-auto p-6 pt-0">
          {spendings > 0 ? (
            <div className="h-[18.75rem]">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="space-y-4 h-[18.75rem] flex flex-col justify-center items-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <p className="text-muted-foreground" data-id="11">
                  No category data available
                </p>
                <p className="text-sm text-muted-foreground">
                  Add expenses with categories to see your spending distribution
                </p>
              </div>
              <Button
                variant="light"
                as={Link}
                href="/expenses"
                endContent={<ArrowRight className="size-4" />}
              >
                View Expenses
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default SpendingData;
