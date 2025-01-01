import AddNewBudget from "./AddNewBudget";
import BudgetOverview from "./BudgetOverview";
import CurrentBudgets from "./CurrentBudgets";

const Budget = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Budget Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrentBudgets />
        <AddNewBudget />
        <BudgetOverview />
      </div>
    </main>
  );
};

export default Budget;
