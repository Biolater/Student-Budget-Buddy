import { getConversionRate } from "../actions/currency.actions";

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
  if (fromCurrency === toCurrency) return amount;

  const conversion_rate = await getConversionRate(fromCurrency, toCurrency);
  return amount * conversion_rate;
};

export { getBudgetStatus, convertToBudgetCurrency };
