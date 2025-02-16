import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tooltip,
} from "@heroui/react";
import Link from "next/link";
import BudgetItem from "./BudgetItem";
import BudgetSkeleton from "./BudgetSkeleton";;
import { ClientBudget } from "./AddNewBudget";

export const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "TRY", symbol: "₺" },
  { code: "AZN", symbol: "₼" },
];

const CurrentBudgets: React.FC<{
  budgets: ClientBudget[];
  budgetsLoading: boolean;
  userId: string | undefined | null;
}> = ({ budgets, budgetsLoading, userId }) => {
  return (
    <Card className="bg-card">
      <CardHeader className="flex items-center justify-between  p-6">
        <div className="flex flex-col space-y-1.5">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Current Budgets
          </h3>
          <p className="text-sm text-muted-foreground">
            View and manage your existing budgets
          </p>
        </div>
        {/* <Tooltip
            content="Hover over spent amounts to see individual expenses in their original currencies"
            color="foreground"
            classNames={{
              content: "rounded-lg max-w-sm sm:max-w-[unset] py-[0.375rem] px-3",
            }}
          >
            <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
          </Tooltip> */}
      </CardHeader>
      <CardBody className="p-6 pt-0 max-h-96 flex-col gap-4 overflow-y-auto">
        {budgetsLoading ? (
          <BudgetSkeleton />
        ) : budgets.length > 0 ? (
          budgets.map((budget) => {
            return (
              <BudgetItem key={budget.id} budgetItem={budget} userId={userId} />
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">
            No budgets found. Create a new budget to get started.
          </p>
        )}
      </CardBody>
      <CardFooter className="flex items-center justify-end p-6 pt-0">
        <Button
          as={Link}
          color="primary"
          className="lg:w-full"
          href="/expenses"
        >
          View Expenses
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CurrentBudgets;
