"use client";

import DashboardSkeleton from "@/app/components/Dashboard/DashboardSkeleton";
import FinancialOverview from "@/app/components/Dashboard/FinancialOverview";

const DashboardComponent = () => {
  return false ? (
    <DashboardSkeleton />
  ) : (
    <main className="container container-padding flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <FinancialOverview />
    </main>
  );
};

export default DashboardComponent;
