import { getConversionRate } from "../actions/currency.actions";
import { ExtendedBudget } from "../types/budget.types";

const fetchBudgetStats = async (budget: ExtendedBudget) => {
  let total = 0;
  // Convert each expense to budget currency if needed
  for (const expense of budget.expenses) {
    const convertedAmount = await convertToBudgetCurrency(
      expense.amount,
      expense.currency.code,
      budget.currency.code
    );
    total += convertedAmount;
  }

  const status = getBudgetStatus(budget.amount, total);

  return {
    expensesTotal: total,
    budgetStatus: status,
  };
};

const getBudgetStatus = (
  totalBudget: number,
  totalExpenses: number
): "success" | "warning" | "danger" => {
  const warningThreshold = totalBudget * 0.7;
  const dangerThreshold = totalBudget * 0.9;

  if (totalExpenses <= warningThreshold) {
    return "success";
  } else if (totalExpenses <= dangerThreshold) {
    return "warning";
  } else {
    return "danger";
  }
};

const convertToBudgetCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
) => {
  console.log("CONVERTING", amount, fromCurrency, toCurrency);
  if (fromCurrency === toCurrency) return amount;

  const conversion_rate = await getConversionRate(fromCurrency, toCurrency);
  return amount * conversion_rate;
};

export { getBudgetStatus, convertToBudgetCurrency, fetchBudgetStats };
