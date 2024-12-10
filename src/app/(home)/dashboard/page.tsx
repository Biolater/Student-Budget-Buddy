import BudgetData from "./BudgetData";
import SpendingData from "./SpendingData";
import FinancialInsights from "./FinancialInsights";

const DashboardComponent = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Financial Dashboard</h1>
      <div className="flex flex-col">
        <BudgetData />
        <SpendingData />
        <FinancialInsights />
      </div>
    </main>
  );
};

export default DashboardComponent;
