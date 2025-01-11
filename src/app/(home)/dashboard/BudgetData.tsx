import { Card, CardHeader, CardBody, Progress } from "@nextui-org/react";
import {
  ArrowRight,
  BarChart3,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";

type BudgetDataProps = {
  totalBudget?: number | null;
  spent?: number | null;
  savingsGoal?: number | null;
  savedAmount?: number | null;
};

const BudgetData: React.FC<BudgetDataProps> = ({
  totalBudget,
  spent,
  savingsGoal,
  savedAmount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-card border-border">
        <CardHeader className="justify-between p-6 pb-2 items-center">
          <h3 className="tracking-tight text-sm font-medium text-foreground">
            Total Budget
          </h3>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardBody className="p-6 pt-0 space-y-2">
          {totalBudget ? (
            <>
              <div className="text-2xl font-bold text-foreground">$2000.00</div>
              <p className="text-xs text-muted-foreground">For this semester</p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">No budget set</p>
              <Link
                href="/budget"
                className="inline-flex self-start items-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 underline-offset-4 hover:underline p-0 h-auto font-normal text-primary"
              >
                Add Budget
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </>
          )}
        </CardBody>
      </Card>
      <Card className="bg-card border-border">
        <CardHeader className="justify-between p-6 pb-2 items-center">
          <h3 className="tracking-tight text-sm font-medium text-foreground">
            Spent
          </h3>
          <Wallet className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardBody className="p-6 pt-0 space-y-2">
          {spent ? (
            <>
              <div className="text-2xl font-bold text-foreground">$1080.00</div>
              <p className="text-xs text-muted-foreground">
                54.0% of total budget
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                No expenses recorded
              </p>
              <Link
                href="/expenses"
                className="inline-flex self-start items-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 underline-offset-4 hover:underline p-0 h-auto font-normal text-primary"
              >
                Add expenses
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </>
          )}
        </CardBody>
      </Card>
      <Card className="bg-card border-border">
        <CardHeader className="justify-between p-6 pb-2 items-center">
          <h3 className="tracking-tight text-sm font-medium text-foreground">
            Remaining
          </h3>
          <BarChart3 className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardBody className="p-6 pt-0 space-y-2">
          {totalBudget ? (
            <>
              <div className="text-2xl font-bold text-foreground">$920.00</div>
              <Progress
                className="mt-2"
                aria-label="progress"
                color="success"
                value={54}
              />
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Set a budget to track remaining funds
              </p>
              <Link
                href="/budget"
                className="inline-flex self-start items-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 underline-offset-4 hover:underline p-0 h-auto font-normal text-primary"
              >
                Set budget
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </>
          )}
        </CardBody>
      </Card>
      <Card className="bg-card border-border">
        <CardHeader className="justify-between p-6 pb-2 items-center">
          <h3 className="tracking-tight text-sm font-medium text-foreground">
            Savings Goal
          </h3>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardBody className="p-6 pt-0 space-y-2">
          {savingsGoal ? (
            <>
              <div className="text-2xl font-bold text-foreground">$500.00</div>
              <p className="text-xs text-muted-foreground">
                $350.00 saved so far
              </p>
              <Progress
                className="mt-2"
                aria-label="progress"
                color="success"
                value={65}
              />
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                No savings goal set
              </p>
              <Link
                href="/goals"
                className="inline-flex self-start items-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 underline-offset-4 hover:underline p-0 h-auto font-normal text-primary"
              >
                Set a goal
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default BudgetData;
