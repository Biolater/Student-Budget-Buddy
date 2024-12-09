import {
  Button,
  DateRangePicker,
  Select,
  SelectItem,
  type RangeValue,
} from "@nextui-org/react";
import { ChangeEvent } from "react";
import {
  getLocalTimeZone,
  now,
  type ZonedDateTime,
} from "@internationalized/date";
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
}> = ({ onFilterChange, onDateRangePickerChange }) => {
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
        <Button className="relative w-full">Filter by Date Range</Button>
        <DateRangePicker
          onChange={onDateRangePickerChange}
          defaultValue={{
            start: now(getLocalTimeZone()),
            end: now(getLocalTimeZone()),
          }}
          className="expenses-date-range opacity-0 inset-0"
        />
      </div>
    </div>
  );
};

export default ExpenseFilterOptions;
