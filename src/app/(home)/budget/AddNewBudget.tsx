"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Plus } from "lucide-react";

const categories = [
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

const PERIODS = [
  {
    key: "monthly",
    label: "Monthly",
  },
  {
    key: "Semesterly",
    label: "Semesterly",
  },
  {
    key: "yearly",
    label: "Yearly",
  },
];

const AddNewBudget = () => {
  return (
    <Card>
      <CardHeader className="flex flex-col space-y-1.5 p-6 items-start">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Add New Budget
        </h3>
        <p className="text-sm text-muted-foreground">
          Create a new budget for a specific category
        </p>
      </CardHeader>
      <CardBody className="p-6 pt-0 flex-col gap-4">
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="category"
          >
            Category
          </label>
          <Select
            aria-labelledby="category"
            // selectedKeys={[category ?? ""]}
            // onChange={(e) => {
            //   const selectedCategory = e.target.value;
            //   setCategory(selectedCategory as Category);
            //   setErrors({ ...errors, category: "" });
            // }}
            // errorMessage={errors.category}
            // isInvalid={errors.category !== ""}
            name="category"
            size="md"
            placeholder="Select category"
          >
            {categories.map((category, idx) => (
              <SelectItem key={category.code} value={category.code}>
                {`${category.symbol} ${category.code}`}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="amount"
          >
            Amount
          </label>
          <Input
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-dollar-sign h-4 w-4 text-muted-foreground"
              >
                <line x1="12" x2="12" y1="2" y2="22"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            }
            aria-labelledby="amount"
            size="md"
            type="number"
            placeholder="Enter amount"
            // value={amount ? amount.toString() : ""}
            // onChange={(e) => {
            //   setAmount(parseFloat(e.target.value));
            //   setErrors({ ...errors, amount: "" });
            // }}
            // isInvalid={errors.amount !== ""} // Validation logic to mark the input invalid
            // className={
            //   errors.amount !== "" ? "[&_*_input]:placeholder:text-danger" : ""
            // }
            // errorMessage={errors.amount}
          />{" "}
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="period"
          >
            Period
          </label>
          <Select defaultSelectedKeys={["monthly"]}>
            {PERIODS.map((period) => (
              <SelectItem key={period.key}>{period.label}</SelectItem>
            ))}
          </Select>
        </div>
      </CardBody>
      <CardFooter className="p-6 pt-0">
        <Button
          className="lg:w-full"
          startContent={<Plus className="h-4 w-4" />}
        >
          Add Budget
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddNewBudget;
