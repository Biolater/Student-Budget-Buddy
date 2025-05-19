"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Skeleton } from "@heroui/react";
import { formatCurrency } from "@/app/utils/currency.utils";
import type { SpendingTrend } from "@/app/lib/mock-data/dashboard.mock-data";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SpendingTrendsChartProps {
  data: SpendingTrend[];
  currency: string;
  isLoading: boolean;
}

export function SpendingTrendsChart({
  data,
  currency,
  isLoading,
}: SpendingTrendsChartProps) {
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState<ChartOptions<"line">>({});

  // Format month strings to be more readable
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  };

  useEffect(() => {
    if (data.length === 0) return;

    // Prepare data for the chart
    const labels = data.map((item) => formatMonth(item.month));
    const spendingValues = data.map((item) => item.totalSpending);

    // Set chart data
    setChartData({
      labels,
      datasets: [
        {
          label: "Monthly Spending",
          data: spendingValues,
          borderColor: "hsl(150, 70%, 30%)",
          backgroundColor: "hsla(150, 70%, 30%, 0.1)",
          borderWidth: 2,
          pointBackgroundColor: "hsl(150, 70%, 30%)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "hsl(150, 70%, 30%)",
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
          fill: true,
        },
      ],
    });

    // Set chart options
    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
      },
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          callbacks: {
            label: (context) =>
              `Spending: ${formatCurrency(context.parsed.y, currency)}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            font: {
              size: 11,
            },
            callback: (value) => formatCurrency(value as number, currency),
          },
        },
      },
    });
  }, [data, currency]);

  if (isLoading) {
    return <Skeleton className="w-full h-full rounded-md" />;
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">
          No spending data available for this period.
        </p>
      </div>
    );
  }

  return <Line options={chartOptions} data={chartData} />;
}
