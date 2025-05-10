"use client";
import DashboardSkeleton from "@/app/components/Dashboard/DashboardSkeleton";

const DashboardComponent = () => {
  return false ? (
    <DashboardSkeleton />
  ) : (
    <main className="container container-padding">
      <h1>Dashboard</h1>
    </main>
  );
};

export default DashboardComponent;
