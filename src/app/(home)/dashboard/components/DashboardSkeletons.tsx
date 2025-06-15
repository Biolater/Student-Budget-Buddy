"use client";

import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import { TrendingUp, LineChart, PieChart } from "lucide-react";

export function FinancialOverviewSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center pb-0 px-4 pt-4">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="size-6 text-primary" />
          Financial Overview
        </h2>
        <Skeleton className="w-full md:w-60 h-10 rounded-lg" />
      </CardHeader>
      <CardBody className="flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardBody>
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="w-24 h-4 rounded" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                <Skeleton className="w-32 h-8 rounded" />
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export function SpendingTrendsSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-0 px-4 pt-4">
        <div>
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Spending Trends</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Skeleton className="w-24 h-4 rounded" />
            <Skeleton className="w-32 h-4 rounded" />
          </div>
        </div>
        <Skeleton className="w-full md:w-60 h-10 rounded-lg" />
      </CardHeader>
      <CardBody className="relative z-10 pt-0 p-4">
        <Skeleton className="w-full h-[350px] rounded-lg" />
      </CardBody>
    </Card>
  );
}

export function SpendingCategorySkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-0 px-4 pt-4">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Spending by Category</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Skeleton className="w-20 h-4 rounded" />
            <Skeleton className="w-40 h-4 rounded" />
          </div>
        </div>
        <Skeleton className="w-full md:w-60 h-10 rounded-lg" />
      </CardHeader>
      <CardBody className="relative z-10 pt-0 p-4">
        <Skeleton className="w-full h-[350px] rounded-lg" />
      </CardBody>
    </Card>
  );
} 