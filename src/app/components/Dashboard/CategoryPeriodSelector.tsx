import { categoryPeriods } from "@/app/constants/dashboard.constants";
import { Select, SelectItem, SharedSelection } from "@heroui/react";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

interface CategoryPeriodSelectorProps {
  onPeriodChange: (period: string) => void;
  value: string[];
}

const CategoryPeriodSelector = ({
  onPeriodChange,
  value,
}: CategoryPeriodSelectorProps) => {
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
      {categoryPeriods.map((period) => (
        <SelectItem key={period.value}>{period.label}</SelectItem>
      ))}
    </Select>
  );
};

export default CategoryPeriodSelector;
