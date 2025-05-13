import { Card, CardBody, Autocomplete, AutocompleteItem } from "@heroui/react";
import { ChevronsUpDown, DollarSign, TrendingUp } from "lucide-react";
import { financialOverviewPeriods } from "@/app/constants/dashboard.constants";
import SummaryCard from "./SummaryCard";
import { motion, AnimatePresence } from "framer-motion";
import { financialOverviewData } from "@/app/lib/mock-data/dashboard.mock-data";
import { useState } from "react";
import { TimePeriod } from "@/app/types/dashboard.types";

const FinancialOverview = () => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<TimePeriod>("currentMonth");
  return (
    <Card>
      <CardBody className="flex-col gap-4 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="size-6 text-primary" />
            Financial Overview
          </h2>
          <Autocomplete
            defaultItems={financialOverviewPeriods}
            label="Select a period"
            className="w-full md:w-auto"
            size="sm"
            listboxProps={{
              emptyContent: "No periods available.",
            }}
            variant="faded"
            selectorIcon={
              <ChevronsUpDown className="size-4 text-muted-foreground" />
            }
            defaultSelectedKey={selectedPeriod}
            isClearable={false}
            onSelectionChange={(key) => {
              if (!key) {
                return setSelectedPeriod(
                  financialOverviewPeriods[0].value as TimePeriod
                );
              }
              setSelectedPeriod(key as TimePeriod);
              return key;
            }}
          >
            {(item) => (
              <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
            )}
          </Autocomplete>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <AnimatePresence>
            {financialOverviewData.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: financialOverviewData.indexOf(item) * 0.1,
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
                  currencySymbol={item.currencySymbol}
                  amount={item.amount}
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
