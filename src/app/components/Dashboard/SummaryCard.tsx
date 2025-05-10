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
      <CardHeader>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{currencySymbol}</span>
          <span className="text-2xl font-bold">{amount}</span>
        </div>
      </CardBody>
    </Card>
  );
};

export default SummaryCard;
