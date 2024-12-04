import { Button, DateRangePicker, Select, SelectItem } from "@nextui-org/react";
import { ChangeEvent } from "react";

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
}> = ({ onFilterChange }) => {
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
        <DateRangePicker className="expenses-date-range opacity-0 inset-0" />
      </div>
    </div>
  );
};

export default ExpenseFilterOptions;
