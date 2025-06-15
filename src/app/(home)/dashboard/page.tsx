import { Suspense } from "react";
import { fetchDefaultUserCurrency } from "@/app/data/currency";
import SectionHeader from "@/app/components/ui/SectionHeader";
import FinancialOverviewServer from "./components/FinancialOverviewServer";
import SpendingTrendsServer from "./components/SpendingTrendsServer";
import SpendingByCategoryServer from "./components/SpendingByCategoryServer";
import { FinancialOverviewSkeleton, SpendingTrendsSkeleton, SpendingCategorySkeleton } from "./components/DashboardSkeletons";

interface DashboardPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Fetch currency once on server-side
  const defaultUserCurrency = await fetchDefaultUserCurrency();
  const currencySymbol = defaultUserCurrency?.symbol || "$";
  const currencyCode = defaultUserCurrency?.code || "USD";

  return (
    <main className="container container-padding flex flex-col gap-4">
      <SectionHeader
        title="Dashboard"
        description="Overview of your financial health"
      />
      
      {/* Each section loads independently with Suspense */}
      <Suspense fallback={<FinancialOverviewSkeleton />}>
        <FinancialOverviewServer 
          currencySymbol={currencySymbol}
          searchParams={searchParams}
        />
      </Suspense>
      
      <Suspense fallback={<SpendingTrendsSkeleton />}>
        <SpendingTrendsServer 
          currencySymbol={currencySymbol}
          searchParams={searchParams}
        />
      </Suspense>
      
      <Suspense fallback={<SpendingCategorySkeleton />}>
        <SpendingByCategoryServer 
          currencySymbol={currencySymbol} 
          currencyCode={currencyCode}
          searchParams={searchParams}
        />
      </Suspense>
    </main>
  );
}
