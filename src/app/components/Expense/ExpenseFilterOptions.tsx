import {
  Button,
  DateRangePicker,
  Select,
  SelectItem,
  type RangeValue,
} from "@heroui/react";
import { ChangeEvent, useState } from "react";
import {
  getLocalTimeZone,
  now,
  today,
  type ZonedDateTime,
} from "@internationalized/date";
import { format, parseISO } from "date-fns";
import { XIcon } from "lucide-react";
import { ExpenseCategory } from "@prisma/client";
import { ExpenseCategoryRef } from "@/app/types/category.types";

const ExpenseFilterOptions: React.FC<{
  onFilterChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onDateRangePickerChange: (value: RangeValue<ZonedDateTime> | null) => void;
  onDateRangePickerReset: () => void;
  categories: ExpenseCategoryRef[];
}> = ({
  onFilterChange,
  onDateRangePickerChange,
  onDateRangePickerReset,
  categories,
}) => {
  const [dateRange, setDateRange] = useState<string | null>(null);
  const [dateRangePickerValue, setDateRangePickerValue] =
    useState<RangeValue<ZonedDateTime> | null>(null);
  const handleDateRangePickerChange = (
    value: RangeValue<ZonedDateTime> | null
  ) => {
    setDateRangePickerValue(value);
    const startDate = value?.start.toDate();
    const endDate = value?.end.toDate();
    if (startDate && endDate) {
      const formattedStartDate = format(startDate, "MMM d, yyyy");
      const formattedEndDate = format(endDate, "MMM d, yyyy");
      const formattedString = formattedStartDate + " to " + formattedEndDate;
      setDateRange(formattedString);
    }
    onDateRangePickerChange(value);
  };
  const handleReset = () => {
    setDateRange(null);
    setDateRangePickerValue(null);
    onDateRangePickerReset();
  };
  return (
    <div className="gap-3 w-full grid grid-cols-1 sm:grid-cols-2">
      <Select
        onChange={onFilterChange}
        placeholder="Filter by Category"
        aria-labelledby="filter"
      >
        {categories.map((category) => (
          <SelectItem key={`${category.name}`} aria-label={category.name}>
            {`${category.icon} ${category.name}`}
          </SelectItem>
        ))}
      </Select>
      <div className="relative">
        <div className="relative">
          <Button className="w-full text-sm">
            {dateRange ? dateRange : "Filter by Date Range"}
          </Button>
          {dateRange && (
            <XIcon
              onClick={handleReset}
              className="absolute size-4 sm:size-5 right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
            />
          )}
        </div>
        <DateRangePicker
          onChange={handleDateRangePickerChange}
          defaultValue={{
            start: now(getLocalTimeZone()),
            end: now(getLocalTimeZone()),
          }}
          maxValue={today(getLocalTimeZone())}
          value={dateRangePickerValue}
          className="expenses-date-range opacity-0 inset-0"
        />
      </div>
    </div>
  );
};

export default ExpenseFilterOptions;
