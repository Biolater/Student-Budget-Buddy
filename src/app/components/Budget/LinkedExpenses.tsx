import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { FC } from "react";

interface LinkedExpensesProps {
  expenses: any;
}

const LinkedExpenses: FC<LinkedExpensesProps> = ({ expenses }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Linked Expenses</h3>
        <Button color="secondary" startContent={<PlusIcon />}>
          Add
        </Button>
      </div>
    </div>
  );
};

export default LinkedExpenses;
