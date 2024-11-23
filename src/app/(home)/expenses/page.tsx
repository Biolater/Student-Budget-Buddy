"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import ClientDatePicker from "./ClientDatePicker";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "TRY", symbol: "₺" },
  { code: "AZN", symbol: "₼" },
];

const categories = [
  { code: "Food", symbol: "🍔" },
  { code: "Entertainment", symbol: "🎉" },
  { code: "Transport", symbol: "🚗" },
  { code: "Health", symbol: "💊" },
  { code: "Education", symbol: "📚" },
  { code: "Clothing", symbol: "👕" },
  { code: "Pets", symbol: "🐶" },
  { code: "Travel", symbol: "🌳" },
  { code: "Other", symbol: "🤷‍♀️" }
];

const ExpenseTracker = () => {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex-col items-start p-6">
          <h3 className="font-semibold tracking-tight text-2xl sm:text-3xl">
            Expense Tracker
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Keep track of your expenses easily.
          </p>
        </CardHeader>
        <CardBody className="p-6">
          <form>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Date
                </label>
                <ClientDatePicker />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Amount
                </label>
                <Input
                  size="sm"
                  type="number"
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Currency
                </label>
                <Select
                  radius="sm"
                  size="lg"
                  placeholder="Select currency"
                >
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code}>
                      {`${currency.symbol} ${currency.code}`}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Category
                </label>
                <Select
                  radius="sm"
                  size="lg"
                  defaultSelectedKeys={["Food"]}
                  placeholder="Select category"
                >
                  {categories.map((category, idx) => (
                    <SelectItem key={`${category}-${idx}`}>
                      {`${category.symbol} ${category.code}`}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
