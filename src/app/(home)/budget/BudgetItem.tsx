import { Progress } from "@nextui-org/react";
import { ClientBudget } from "./AddNewBudget";

const BudgetItem: React.FC<{ budgetItem: ClientBudget }> = ({ budgetItem }) => {
  const currencyName = budgetItem.currency;

  const correctCurrencyIcon = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "TRY":
        return "₺";
      case "AZN":
        return "₼";
      default:
        return "";
    }
  };

  const icon = correctCurrencyIcon(currencyName);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{budgetItem.category}</p>
          <p className="text-sm text-muted-foreground">{budgetItem.period}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">
            {icon}
            {budgetItem.amount}
          </p>
          <p className="text-sm text-muted-foreground">$180 spent</p>
        </div>
      </div>
      <Progress aria-label="Loading..." size="md" value={40} />
    </div>
  );
};

export default BudgetItem;
