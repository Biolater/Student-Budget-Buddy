import { fetchSpendingTrends } from "@/app/data/dashboard";
import { SpendingTrendTimePeriod } from "@/app/types/dashboard.types";
import SpendingTrendsClient from "./SpendingTrendsClient";

interface SpendingTrendsServerProps {
  currencySymbol: string;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SpendingTrendsServer({ 
  currencySymbol,
  searchParams
}: SpendingTrendsServerProps) {
  // Await searchParams as required by Next.js 15+
  const params = await searchParams || {};
  
  // Get time period from URL searchParams, default to "allTime"
  const timePeriod = (params.trendsPeriod as SpendingTrendTimePeriod) || "allTime";
  
  // Fetch initial data on server
  const initialData = await fetchSpendingTrends({ timePeriod });

  return (
    <SpendingTrendsClient 
      currencySymbol={currencySymbol}
      initialData={initialData.success ? initialData.data || [] : []}
      initialPeriod={timePeriod}
    />
  );
} 