import BudgetData from "./BudgetData";
import SpendingData from "./SpendingData";
import FinancialInsights from "./FinancialInsights";

const DashboardComponent = () => {
  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <h1 className="text-3xl font-bold mb-8">Financial Dashboard</h1>
      <div className="flex flex-col">
        <BudgetData />
        <SpendingData spendings={0} />
        <FinancialInsights />
      </div>
    </main>
  );
};

export default DashboardComponent;
