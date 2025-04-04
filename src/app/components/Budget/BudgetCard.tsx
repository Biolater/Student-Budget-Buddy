import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
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
      <CardHeader className="w-full p-0 m-0 h-1 bg-destructive rounded-t-lg" />
      <CardBody>
        <div className="size-10 bg-destructive/20 rounded-full flex items-center justify-center">
          {budget.category.icon}
        </div>
      </CardBody>
      <CardFooter className="w-full p-0 m-0 h-4 bg-blue-500 rounded-b-lg" />
    </Card>
  );
};

export default BudgetCard;
