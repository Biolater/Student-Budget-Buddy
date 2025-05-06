import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Currency } from "@prisma/client";
import { DollarSign, HeartPulse, PiggyBank, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@heroui/react";

interface BudgetStatsOverviewProps {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  isLoading: boolean;
  defaultCurrencySymbol: string;
}

const BudgetStatsOverview: React.FC<BudgetStatsOverviewProps> = ({
  totalBudget,
  totalSpent,
  totalRemaining,
  isLoading,
  defaultCurrencySymbol,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
    >
      <Card>
        <CardBody className="flex-row gap-4 p-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <DollarSign className="text-blue-600" size={24} />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <Skeleton className="rounded-lg" isLoaded={!isLoading}>
              <p className="text-2xl font-bold">
                {defaultCurrencySymbol}
                {totalBudget.toFixed(2)}
              </p>
            </Skeleton>
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
            <Skeleton className="rounded-lg" isLoaded={!isLoading}>
              <p className="text-2xl font-bold">
                {defaultCurrencySymbol}
                {totalSpent.toFixed(2)}
              </p>
            </Skeleton>
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
            <Skeleton className="rounded-lg" isLoaded={!isLoading}>
              <p className="text-2xl font-bold">
                {defaultCurrencySymbol}
                {totalRemaining.toFixed(2)}
              </p>
            </Skeleton>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default BudgetStatsOverview;
