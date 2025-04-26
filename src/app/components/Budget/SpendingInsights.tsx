import { Card, CardBody, CardHeader } from "@heroui/react";
import { Info } from "lucide-react";
import { FC } from "react";

interface SpendingInsightsProps {
  dailyAverage: number;
  targetAverage: number;
  spendingTip: string;
}

const SpendingInsights: FC<SpendingInsightsProps> = ({
  dailyAverage,
  targetAverage,
  spendingTip,
}) => {
  return (
    <Card
      classNames={{
        base: "overflow-visible",
      }}
    >
      <CardHeader>
        <h3 className="font-semibold">Spending Insights</h3>
      </CardHeader>
      <CardBody className="flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-3 bg-primary rounded-full block"></span>
            <p className="text-sm text-muted-foreground">Daily Average</p>
          </div>
          <div>
            <p className="text-sm font-medium">$5.33/day</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-3 bg-blue-500 rounded-full block"></span>
            <p className="text-sm text-muted-foreground">Target Average</p>
          </div>
          <div>
            <p className="text-sm font-medium">$5.00/day</p>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
          <div className="flex items-start gap-2">
            <Info className="size-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-700">Spending Tip</p>
              <p className="text-xs text-blue-600 mt-1">
                You're currently on track with your transport budget. Keep it
                up!
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default SpendingInsights;
