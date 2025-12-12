import { fetchFinancialOverview } from "@/app/data/dashboard";
import { TimePeriod } from "@/app/types/dashboard.types";
import FinancialOverviewClient from "./FinancialOverviewClient";

interface FinancialOverviewServerProps {
  currencySymbol: string;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FinancialOverviewServer({ 
  currencySymbol,
  searchParams
}: FinancialOverviewServerProps) {
  // Await searchParams as required by Next.js 15+
  const params = await searchParams || {};
  
  // Get time period from URL searchParams, default to "currentMonth"
  const timePeriod = (params.financialPeriod as TimePeriod) || "currentMonth";
  
  // Fetch initial data on server with period from URL
  const initialData = await fetchFinancialOverview({ timePeriod });

  return (
    <FinancialOverviewClient 
      currencySymbol={currencySymbol}
      initialData={initialData.success ? initialData.data : null}
      initialPeriod={timePeriod}
    />
  );
} 