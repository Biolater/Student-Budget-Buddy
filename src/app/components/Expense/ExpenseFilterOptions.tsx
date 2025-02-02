import {
  Button,
  DateRangePicker,
  Select,
  SelectItem,
  type RangeValue,
} from "@nextui-org/react";
import { ChangeEvent, useState } from "react";
import {
  getLocalTimeZone,
  now,
  type ZonedDateTime,
} from "@internationalized/date";
import { format, parseISO } from "date-fns";
import { XIcon } from "lucide-react";

const categories2 = [
  { code: "All Categories", symbol: "" },
  { code: "Food", symbol: "🍔" },
  { code: "Entertainment", symbol: "🎉" },
  { code: "Transport", symbol: "🚗" },
  { code: "Health", symbol: "💊" },
  { code: "Education", symbol: "📚" },
  { code: "Clothing", symbol: "👕" },
  { code: "Pets", symbol: "🐶" },
  { code: "Travel", symbol: "🌳" },
  { code: "Other", symbol: "🤷‍♀️" },
];

const ExpenseFilterOptions: React.FC<{
  onFilterChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onDateRangePickerChange: (value: RangeValue<ZonedDateTime> | null) => void;
  onDateRangePickerReset: () => void;
}> = ({ onFilterChange, onDateRangePickerChange, onDateRangePickerReset }) => {
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
        defaultSelectedKeys={["All Categories"]}
        aria-labelledby="filter"
      >
        {categories2.map((category) => (
          <SelectItem key={`${category.code}`} value={category.code}>
            {`${category.symbol} ${category.code}`}
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
          value={dateRangePickerValue}
          className="expenses-date-range opacity-0 inset-0"
        />
      </div>
    </div>
  );
};

export default ExpenseFilterOptions;
