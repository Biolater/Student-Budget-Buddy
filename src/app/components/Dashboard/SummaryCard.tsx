import { FC } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";

interface SummaryCardProps {
  title: string;
  currencySymbol: string;
  amount: number;
  icon: React.ReactNode;
}

const SummaryCard: FC<SummaryCardProps> = ({
  title,
  currencySymbol,
  amount,
  icon,
}) => {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="p-2 rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
        </div>
        <div className="flex items-center text-3xl">
          <span className="text-2xl font-bold">{currencySymbol}</span>
          <span className="text-2xl font-bold">{amount.toFixed(2)}</span>
        </div>
      </CardBody>
    </Card>
  );
};

export default SummaryCard;
