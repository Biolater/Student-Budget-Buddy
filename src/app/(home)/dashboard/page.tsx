import FinancialOverview from "@/app/components/Dashboard/FinancialOverview";
import { SpendingTrends } from "@/app/components/Dashboard/SpendingTrends";

const DashboardComponent = () => (
  <main className="container container-padding flex flex-col gap-4">
    <h1 className="text-3xl font-bold">Dashboard</h1>
    <FinancialOverview />
    <SpendingTrends />
  </main>
);

export default DashboardComponent;
