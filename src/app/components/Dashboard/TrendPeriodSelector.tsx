import { spendingTrendPeriods } from "@/app/constants/dashboard.constants";
import { Select, SelectItem, SharedSelection } from "@heroui/react";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

interface TrendPeriodSelectorProps {
  onPeriodChange: (period: string) => void;
  value: string[];
}

const TrendPeriodSelector = ({
  onPeriodChange,
  value,
}: TrendPeriodSelectorProps) => {
  const handlePeriodChange = (keys: SharedSelection) => {
    onPeriodChange(Array.from(keys as Set<string>)[0]);
  };

  return (
    <Select
      selectedKeys={value}
      defaultSelectedKeys={value}
      disallowEmptySelection
      onSelectionChange={handlePeriodChange}
      classNames={{
        base: "w-full md:w-60",
      }}
      aria-label="Select time period"
      variant="faded"
      selectorIcon={<ChevronsUpDown className="size-4 text-muted-foreground" />}
    >
      {spendingTrendPeriods.map((period) => (
        <SelectItem key={period.value}>{period.label}</SelectItem>
      ))}
    </Select>
  );
};

export default TrendPeriodSelector;
