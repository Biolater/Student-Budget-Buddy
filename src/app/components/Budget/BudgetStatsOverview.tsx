import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Currency } from "@prisma/client";
import { DollarSign, HeartPulse, PiggyBank, Activity } from "lucide-react";

interface BudgetStatsOverviewProps {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  defaultCurrency: string;
}

const BudgetStatsOverview: React.FC<BudgetStatsOverviewProps> = ({
  totalBudget,
  totalSpent,
  totalRemaining,
  defaultCurrency,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardBody className="flex-row gap-4 p-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <DollarSign className="text-blue-600" size={24} />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-2xl font-bold">${totalBudget}</p>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="flex-row gap-4 p-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <PiggyBank className="text-purple-600" size={24} />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold">${totalSpent}</p>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="flex-row gap-4 p-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <Activity className="text-emerald-600" size={24} />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-2xl font-bold">${totalRemaining}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BudgetStatsOverview;
