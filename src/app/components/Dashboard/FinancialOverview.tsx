import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUpDown, TrendingUp } from "lucide-react";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Selection,
  SharedSelection,
  addToast,
} from "@heroui/react";

// App imports
import { useDashboard } from "@/app/hooks/useDashboard";
import { useCurrency } from "@/app/hooks/useCurrency";
import { SummaryData, TimePeriod } from "@/app/types/dashboard.types";
import {
  financialOverviewPeriods,
  financialOverviewItems,
} from "@/app/constants/dashboard.constants";
import SummaryCard from "./SummaryCard";

/**
 * Gets a default period key when selection is empty or invalid
 */
const getDefaultPeriod = (): Selection => new Set(["currentMonth"]);

/**
 * Extracts selected period from SharedSelection
 */
const getSelectedPeriodFromKeys = (keys: SharedSelection): Selection => {
  // Return default if selection is empty/invalid
  if (
    !keys ||
    keys === "all" ||
    (typeof keys === "object" && Array.from(keys as Set<string>).length === 0)
  ) {
    return getDefaultPeriod();
  }

  // Otherwise extract the first selected key
  const selectedKey = Array.from(keys as Set<string>)[0];
  return new Set([selectedKey]);
};

/**
 * Financial Overview component that displays summary cards with financial metrics
 */
const FinancialOverview = () => {
  // State management
  const [selectedPeriod, setSelectedPeriod] = useState<Selection>(
    getDefaultPeriod()
  );
  const selectedPeriodValue = Array.from(selectedPeriod)[0] as TimePeriod;

  // Currency hook for getting user's preferred currency
  const {
    fetchDefaultUserCurrency: {
      data: defaultUserCurrency,
      isLoading: defaultUserCurrencyLoading,
      error: defaultUserCurrencyError,
    },
  } = useCurrency();

  // Dashboard data hook for financial metrics
  const { useFinancialOverviewData } = useDashboard();
  const {
    data: financialOverviewData,
    isLoading: financialOverviewLoading,
    isFetching: financialOverviewFetching,
    error: financialOverviewError,
    refetch: refetchFinancialOverviewData,
  } = useFinancialOverviewData(selectedPeriodValue);

  // Derived state
  const isLoading =
    financialOverviewLoading ||
    financialOverviewFetching ||
    defaultUserCurrencyLoading;

  // Event handlers
  const handlePeriodChange = (keys: SharedSelection) => {
    setSelectedPeriod(getSelectedPeriodFromKeys(keys));
  };

  // Effects
  useEffect(() => {
    // Show error messages if API calls fail
    if (financialOverviewError) {
      addToast({
        title: "Error fetching financial overview data",
        description: financialOverviewError.message,
        color: "danger",
      });
    }

    if (defaultUserCurrencyError) {
      addToast({
        title: "Error fetching default user currency",
        description: defaultUserCurrencyError.message,
        color: "danger",
      });
    }
  }, [financialOverviewError, defaultUserCurrencyError]);

  // Refetch data when selected period changes
  useEffect(() => {
    refetchFinancialOverviewData();
  }, [selectedPeriod, refetchFinancialOverviewData]);

  // Render component
  return (
    <Card>
      <CardBody className="flex-col gap-4 p-4">
        {/* Header section with title and period selector */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="size-6 text-primary" />
            Financial Overview
          </h2>
          <Select
            selectedKeys={selectedPeriod}
            defaultSelectedKeys={getDefaultPeriod()}
            disallowEmptySelection
            onSelectionChange={handlePeriodChange}
            classNames={{
              base: "w-full md:w-60",
            }}
            aria-label="Select time period"
            variant="faded"
            selectorIcon={
              <ChevronsUpDown className="size-4 text-muted-foreground" />
            }
          >
            {financialOverviewPeriods.map((period) => (
              <SelectItem key={period.value}>{period.label}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Cards grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <AnimatePresence>
            {financialOverviewItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.97 }}
              >
                <SummaryCard
                  title={item.title}
                  currencySymbol={defaultUserCurrency?.symbol || "$"}
                  amount={
                    financialOverviewData?.[item.value as keyof SummaryData] ||
                    0
                  }
                  isLoading={isLoading}
                  icon={item.icon}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardBody>
    </Card>
  );
};

export default FinancialOverview;
