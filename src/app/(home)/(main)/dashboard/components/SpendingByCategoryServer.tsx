import { fetchSpendingByCategory } from "@/app/data/dashboard";
import { TimePeriod } from "@/app/types/dashboard.types";
import SpendingByCategoryClient from "./SpendingByCategoryClient";

interface SpendingByCategoryServerProps {
  currencySymbol: string;
  currencyCode: string;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SpendingByCategoryServer({ 
  currencySymbol,
  currencyCode,
  searchParams
}: SpendingByCategoryServerProps) {
  // Await searchParams as required by Next.js 15+
  const params = await searchParams || {};
  
  // Get time period from URL searchParams, default to "currentMonth"
  const timePeriod = (params.categoryPeriod as TimePeriod) || "currentMonth";
  
  // Fetch initial data on server
  const initialData = await fetchSpendingByCategory({ timePeriod });

  return (
    <SpendingByCategoryClient 
      currencySymbol={currencySymbol}
      currencyCode={currencyCode}
      initialData={initialData.success ? initialData.data || [] : []}
      initialPeriod={timePeriod}
    />
  );
} 