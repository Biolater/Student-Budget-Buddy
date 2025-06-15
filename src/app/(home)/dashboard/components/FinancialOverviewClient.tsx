"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUpDown, TrendingUp } from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Selection,
  SharedSelection,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchFinancialOverview } from "@/app/data/dashboard";
import { SummaryData, TimePeriod } from "@/app/types/dashboard.types";
import {
  financialOverviewPeriods,
  financialOverviewItems,
} from "@/app/constants/dashboard.constants";
import SummaryCard from "@/app/components/Dashboard/SummaryCard";

interface FinancialOverviewClientProps {
  currencySymbol: string;
  initialData: SummaryData | null;
  initialPeriod: TimePeriod;
}

export default function FinancialOverviewClient({
  currencySymbol,
  initialData,
  initialPeriod,
}: FinancialOverviewClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedPeriod, setSelectedPeriod] = useState<Selection>(
    new Set([initialPeriod])
  );
  const selectedPeriodValue = Array.from(selectedPeriod)[0] as TimePeriod;

  // Only fetch when period changes (not on initial load)
  const { data: financialData, isLoading } = useQuery({
    queryKey: ["financialOverview", selectedPeriodValue],
    queryFn: async () => {
      const response = await fetchFinancialOverview({ 
        timePeriod: selectedPeriodValue 
      });
      return response.success ? response.data : null;
    },
    initialData: selectedPeriodValue === initialPeriod ? initialData : undefined,
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });

  const handlePeriodChange = (keys: SharedSelection) => {
    const selectedKey = Array.from(keys as Set<string>)[0];
    setSelectedPeriod(new Set([selectedKey]));
    
    // Update URL with new period
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('financialPeriod', selectedKey);
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center pb-0 px-4 pt-4">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="size-6 text-primary" />
          Financial Overview
        </h2>
        <Select
          selectedKeys={selectedPeriod}
          onSelectionChange={handlePeriodChange}
          classNames={{ base: "w-full md:w-60" }}
          aria-label="Select time period"
          variant="faded"
          selectorIcon={<ChevronsUpDown className="size-4 text-muted-foreground" />}
        >
          {financialOverviewPeriods.map((period) => (
            <SelectItem key={period.value}>{period.label}</SelectItem>
          ))}
        </Select>
      </CardHeader>
      <CardBody className="flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <AnimatePresence>
            {financialOverviewItems.map((item, index) => (
              <motion.div
                className="rounded-xl"
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.97 }}
              >
                <SummaryCard
                  title={item.title}
                  currencySymbol={currencySymbol}
                  amount={financialData?.[item.value as keyof SummaryData] || 0}
                  isLoading={isLoading || isPending}
                  icon={item.icon}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardBody>
    </Card>
  );
} 