import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
  Tooltip,
} from "@nextui-org/react";
import Link from "next/link";
import { type ClientBudget } from "./AddNewBudget";
import BudgetItem from "./BudgetItem";
import { Info } from "lucide-react";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "TRY", symbol: "₺" },
  { code: "AZN", symbol: "₼" },
];

const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  TRY: 30.43,
  AZN: 1.7,
};

const CurrentBudgets: React.FC<{
  budgets: ClientBudget[];
  budgetsLoading: boolean;
}> = ({ budgets, budgetsLoading }) => {
  function formatCurrency(amount: number, currencyCode: string) {
    const currency = currencies.find((c) => c.code === currencyCode);
    return `${currency?.symbol}${amount.toFixed(2)}`;
  }

  function convertAmount(
    amount: number,
    fromCurrency: keyof typeof exchangeRates,
    toCurrency: keyof typeof exchangeRates
  ): number {
    return amount * (exchangeRates[toCurrency] / exchangeRates[fromCurrency]);
  }

  function calculateTotalSpent(
    expenses: ClientBudget["expenses"],
    targetCurrency: string
  ): number {
    return expenses.reduce((total, expense) => {
      const convertedAmount = convertAmount(
        expense.amount,
        expense.currency as keyof typeof exchangeRates,
        targetCurrency as keyof typeof exchangeRates
      );
      return total + convertedAmount;
    }, 0);
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between  p-6">
        <div className="flex flex-col space-y-1.5">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Current Budgets
          </h3>
          <p className="text-sm text-muted-foreground">
            View and manage your existing budgets
          </p>
        </div>
        <Tooltip
          content="Hover over spent amounts to see individual expenses in their original currencies"
          color="foreground"
          classNames={{
            content: "rounded-lg max-w-sm sm:max-w-[unset] py-[0.375rem] px-3",
          }}
        >
          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </Tooltip>
      </CardHeader>
      <CardBody className="p-6 pt-0 max-h-96 flex-col gap-4">
        {budgetsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Skeleton className="h-5 rounded-lg w-24" />
                  <Skeleton className="h-4 rounded-lg w-16" />
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-5 rounded-lg w-16" />
                  <Skeleton className="h-4 rounded-lg w-20" />
                </div>
              </div>
              <Skeleton className="h-2 rounded-lg w-full" />
            </div>
          ))
        ) : budgets.length > 0 ? (
          budgets.map((budget) => (
            <BudgetItem key={budget.id} budgetItem={budget} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No budgets found. Create a new budget to get started.
          </p>
        )}
      </CardBody>
      <CardFooter className="flex items-center p-6 pt-0">
        <Button as={Link} className="lg:w-full" href="/expenses">
          View Expenses{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-right ml-2 h-4 w-4"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CurrentBudgets;
