"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Skeleton } from "@heroui/react";
import { formatCurrency } from "@/app/utils/currency.utils";
import type { CategorySpending } from "@/app/types/dashboard.types";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingByCategoryChartProps {
  data: CategorySpending[];
  currency: string;
  isLoading: boolean;
}

export function SpendingByCategoryChart({
  data,
  currency,
  isLoading,
}: SpendingByCategoryChartProps) {
  const [chartData, setChartData] = useState<ChartData<"doughnut">>({
    labels: [],
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState<ChartOptions<"doughnut">>(
    {}
  );

  // Generate vibrant colors for the chart
  const generateColors = (count: number) => {
    const baseColors = [
      "hsl(150, 70%, 50%)", // Green
      "hsl(200, 70%, 50%)", // Blue
      "hsl(250, 70%, 50%)", // Purple
      "hsl(300, 70%, 50%)", // Pink
      "hsl(350, 70%, 50%)", // Red
      "hsl(30, 70%, 50%)", // Orange
      "hsl(60, 70%, 50%)", // Yellow
    ];

    // If we need more colors than in our base set, we'll generate them
    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }

    // Generate additional colors by varying the hue
    const colors = [...baseColors];
    for (let i = baseColors.length; i < count; i++) {
      const hue = (i * 137.5) % 360; // Golden angle approximation for good distribution
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }

    return colors;
  };

  useEffect(() => {
    if (data.length === 0) return;

    // Calculate total spending for percentages
    const totalSpending = data.reduce((sum, item) => sum + item.totalSpending, 0);

    // Prepare data for the chart
    const labels = data.map((item) => item.category);
    const spendingValues = data.map((item) => item.totalSpending);
    const backgroundColors = generateColors(data.length);

    // Set chart data
    setChartData({
      labels,
      datasets: [
        {
          data: spendingValues,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map((color) =>
            color.replace("50%", "40%")
          ),
          borderWidth: 1,
          hoverOffset: 15,
        },
      ],
    });

    // Set chart options
    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000,
      },
      plugins: {
        legend: {
          position: "right" as const,
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: "circle",
          },
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
            label: (context) => {
              const value = context.raw as number;
              const percentage = ((value / totalSpending) * 100)?.toFixed(1);
              return `${context.label}: ${formatCurrency(
                value,
                currency
              )} (${percentage}%)`;
            },
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
          No category data available for this period.
        </p>
      </div>
    );
  }

  return <Doughnut options={chartOptions} data={chartData} />;
}
