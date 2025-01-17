import BudgetData from "./BudgetData";
import SpendingData from "./SpendingData";
import FinancialInsights from "./FinancialInsights";
import { auth } from "@clerk/nextjs/server";

const DashboardComponent = async () => {
  const { userId } = await auth();

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 md:px-10 lg:px-14 xl:px-18 2xl:px-22">
      <h1 className="text-3xl font-bold mb-8">Financial Dashboard</h1>
      <div className="flex flex-col">
        <BudgetData
          savedAmount={600}
          savingsGoal={1000}
          totalBudget={1000}
          spent={400}
        />
        <SpendingData spendings={0} />
        <FinancialInsights />
      </div>
    </main>
  );
};

export default DashboardComponent;
