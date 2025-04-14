import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/react";
import { BudgetCategory, Currency, Expense } from "@prisma/client";

interface BudgetCardProps {
  budget: {
    id: string;
    userId: string;
    budgetCategoryId: string;
    currencyId: string;
    amount: number;
    periodType: string;
    startDate: Date;
    endDate: Date;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    category: BudgetCategory;
    currency: Currency;
    expenses: (Omit<Expense, "amount"> & { amount: number })[];
  };
}

const BudgetCard = ({ budget }: BudgetCardProps) => {
  return (
    <Card>
      <CardHeader className="w-full p-0 m-0 h-1 bg-danger rounded-t-lg" />
      <CardBody className="items-start flex-row gap-4">
        <div className="size-10 bg-danger/20 rounded-full flex items-center justify-center">
          {budget.category.icon}
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex justify-between items-start flex-1">
            <h3 className="font-semibold truncate">Groceries</h3>
            <span className="font-bold">$300</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>$80 spent</span>
            <span className="font-medium">53%</span>
          </div>
          <Progress value={90} color="danger" />
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span>Mar 1</span>
            <span>Mar 31, 2023</span>
          </div>
        </div>
      </CardBody>
      <CardFooter className="w-full flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-credit-card h-3 w-3"
          >
            <rect width="20" height="14" x="2" y="5" rx="2"></rect>
            <line x1="2" x2="22" y1="10" y2="10"></line>
          </svg>
          <span>2 expenses</span>
        </div>
        <div className="text-xs font-medium text-blue-600 group-hover:text-blue-700 transition-colors flex items-center">
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-chevron-right h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BudgetCard;
