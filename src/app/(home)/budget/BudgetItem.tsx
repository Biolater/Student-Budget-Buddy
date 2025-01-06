import { Progress, Tooltip } from "@nextui-org/react";
import { convertAmount, formatCurrency } from "@/lib/currencyUtils";
import { type ClientBudget } from "./AddNewBudget";
import { currencies } from "./CurrentBudgets";

const BudgetItem: React.FC<{
  budgetItem: ClientBudget;
  totalSpentInBudgetCurrency: number;
  totalSpentPercentage: number;
  exchangeRates: Record<string, number>;
}> = ({
  budgetItem,
  totalSpentInBudgetCurrency,
  totalSpentPercentage,
  exchangeRates,
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium">{budgetItem.category}</p>
        <p className="text-sm text-muted-foreground">{budgetItem.period}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">
          {formatCurrency(budgetItem.amount, budgetItem.currency, currencies)}
        </p>
        <Tooltip
          color="foreground"
          classNames={{
            content: "rounded-lg max-w-sm sm:max-w-[unset] py-[0.375rem] px-3",
          }}
          content={
            <div>
              <p className="font-medium">Individual Expenses:</p>
              {budgetItem.expenses.map((expense, i) => (
                <p key={i}>
                  {formatCurrency(expense.amount, expense.currency, currencies)}
                  {expense.currency !== budgetItem.currency &&
                    ` (≈${formatCurrency(
                      convertAmount(
                        expense.amount,
                        expense.currency,
                        budgetItem.currency,
                        exchangeRates
                      ),
                      budgetItem.currency,
                      currencies
                    )})`}
                </p>
              ))}
            </div>
          }
        >
          <p className="text-sm cursor-pointer text-muted-foreground">
            {formatCurrency(
              totalSpentInBudgetCurrency,
              budgetItem.currency,
              currencies
            )}{" "}
            spent
          </p>
        </Tooltip>
      </div>
    </div>
    <Progress
      color={totalSpentPercentage >= 100 ? "danger" : "primary"}
      aria-label="Loading..."
      size="md"
      value={totalSpentPercentage}
    />
  </div>
);

export default BudgetItem;
